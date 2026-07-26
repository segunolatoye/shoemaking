const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleDesigns = [
  {
    name: "The Oxford Executive",
    price: 450.00,
    category: "Oxford",
    description: "A timeless classic for the modern executive. Crafted from full-grain Italian calfskin with exquisite hand-stitching.",
    sizes: ["40", "41", "42", "43", "44", "45"],
    image_urls: [
      "https://images.unsplash.com/photo-1614252209825-925086eecc45?w=800&q=80",
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80"
    ],
    video_url: null,
    model_3d_url: "/shoe.glb"
  },
  {
    name: "The Chelsea Boot",
    price: 520.00,
    category: "Boots",
    description: "Sleek and versatile. Features premium suede and elastic side panels for a comfortable, snug fit.",
    sizes: ["41", "42", "43", "44"],
    image_urls: [
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80"
    ],
    video_url: null,
    model_3d_url: null
  },
  {
    name: "Monk Strap Elite",
    price: 480.00,
    category: "Monk Strap",
    description: "Double monk strap design offering a bold statement piece. Finished with a deep, rich patina.",
    sizes: ["39", "40", "41", "42", "43"],
    image_urls: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?w=800&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80"
    ],
    video_url: null,
    model_3d_url: null
  },
  {
    name: "Derby Casual",
    price: 390.00,
    category: "Derby",
    description: "Perfect for smart-casual occasions. Lightweight sole with beautifully textured pebble-grain leather.",
    sizes: ["40", "41", "42", "43", "44"],
    image_urls: [
      "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"
    ],
    video_url: null,
    model_3d_url: "/shoe.glb"
  }
];

async function seed() {
  console.log("Seeding sample designs...");
  const { data, error } = await supabase
    .from('designs')
    .insert(sampleDesigns)
    .select();

  if (error) {
    console.error("Error seeding data:", error);
  } else {
    console.log(`Successfully seeded ${data.length} designs!`);
  }
}

seed();
