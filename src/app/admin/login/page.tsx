import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[var(--background)]">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl shadow-stone-200">
        <h1 className="text-3xl font-serif text-center mb-8 text-[var(--foreground)]">Admin Login</h1>
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-stone-600">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="p-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 transition-shadow"
              placeholder="shoemaker@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-stone-600">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="p-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 transition-shadow"
            />
          </div>
          <button 
            formAction={login}
            className="mt-2 w-full bg-foreground text-background p-4 rounded-xl font-medium hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}

