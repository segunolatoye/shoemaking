const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const imagesToMigrate = [
  // Hero3D.tsx
  { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800', filename: 'craftsmanship.jpg' },
  { url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800', filename: 'elegance.jpg' },
  { url: 'https://images.unsplash.com/photo-1616406432452-07bc5938759d?q=80&w=800', filename: 'leather.jpg' },
  { url: 'https://images.unsplash.com/photo-1542280281-11532074e5bd?q=80&w=800', filename: 'modern.jpg' },
  { url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800', filename: 'bespoke.jpg' },
  { url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800', filename: 'style.jpg' },
  // seed.js
  { url: 'https://images.unsplash.com/photo-1614252209825-925086eecc45?w=800&q=80', filename: 'oxford_1.jpg' },
  { url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80', filename: 'oxford_2.jpg' },
  { url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80', filename: 'chelsea_1.jpg' },
  { url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80', filename: 'chelsea_2.jpg' },
  { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?w=800&q=80', filename: 'monk_1.jpg' },
  { url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80', filename: 'monk_2.jpg' },
  { url: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80', filename: 'derby_1.jpg' },
  { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80', filename: 'derby_2.jpg' }
];

async function run() {
  const BUCKET_NAME = 'images';
  const storageApi = `${supabaseUrl}/storage/v1`;
  
  const headers = {
    'Authorization': `Bearer ${supabaseKey}`,
    'apikey': supabaseKey
  };

  // 1. Ensure bucket exists
  const bucketsRes = await fetch(`${storageApi}/bucket`, { headers });
  const buckets = await bucketsRes.json();
  const bucketExists = Array.isArray(buckets) && buckets.some(b => b.name === BUCKET_NAME);
  
  if (!bucketExists) {
    console.log(`Creating bucket '${BUCKET_NAME}'...`);
    const createRes = await fetch(`${storageApi}/bucket`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: BUCKET_NAME, name: BUCKET_NAME, public: true })
    });
    if (!createRes.ok) {
      console.error("Error creating bucket:", await createRes.text());
      return;
    }
  }

  // 2. Download and upload images
  let urlMap = {}; // Maps old URL to new Supabase URL
  
  for (const img of imagesToMigrate) {
    if (urlMap[img.url]) continue; // Already processed

    console.log(`Fetching ${img.filename}...`);
    try {
      const response = await fetch(img.url);
      const arrayBuffer = await response.arrayBuffer();
      
      console.log(`Uploading ${img.filename}...`);
      const uploadRes = await fetch(`${storageApi}/object/${BUCKET_NAME}/${img.filename}`, {
        method: 'POST',
        headers: { 
          ...headers, 
          'Content-Type': 'image/jpeg',
          'x-upsert': 'true'
        },
        body: Buffer.from(arrayBuffer)
      });

      if (!uploadRes.ok) {
        console.error(`Failed to upload ${img.filename}:`, await uploadRes.text());
        continue;
      }
      
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${img.filename}`;
      urlMap[img.url] = publicUrl;
      console.log(`Success: ${publicUrl}`);
    } catch (e) {
      console.error(`Error processing ${img.url}:`, e);
    }
  }

  // 3. Update files
  const filesToUpdate = [
    path.join(__dirname, '../src/app/components/Hero3D.tsx'),
    path.join(__dirname, '../seed.js')
  ];

  for (const filePath of filesToUpdate) {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      
      for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
        if (content.includes(oldUrl)) {
          // Use split/join to replace all occurrences globally
          content = content.split(oldUrl).join(newUrl);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${path.basename(filePath)} with new Supabase URLs`);
      }
    }
  }

  console.log('Migration complete!');
}

run();
