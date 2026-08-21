'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Braces, Eye, EyeOff, Lock, Mail } from 'lucide-react'

import { loginAction } from '../../actions/auth'

type LoginForm = { email: string; password: string }

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string>()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setSubmitError(undefined)
    try {
      const result = await loginAction({}, data)
      if (result?.error) setSubmitError(result.error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-neutral-950 lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-neutral-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="flex items-center gap-3 text-sm font-semibold tracking-[0.2em] uppercase">
          <span className="grid size-9 place-items-center border border-white/40"><Braces className="size-5" /></span>
          DevDocs
        </div>
        <div className="relative z-10 max-w-md">
          <p className="mb-5 text-xs font-medium tracking-[0.24em] text-neutral-400 uppercase">Your developer knowledge base</p>
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight xl:text-6xl">Keep every solution within reach.</h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-neutral-300">A quiet, focused place to document what you learn and find it when it matters.</p>
        </div>
        <div className="pointer-events-none absolute -bottom-24 -right-24 size-[30rem] rounded-full border border-white/20" />
        <div className="pointer-events-none absolute bottom-20 right-20 size-56 rounded-full border border-white/15" />
        <div className="relative z-10 font-mono text-xs leading-6 text-neutral-400">// build knowledge, not clutter</div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-14 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.14em] uppercase lg:hidden">
            <span className="grid size-8 place-items-center bg-black text-white"><Braces className="size-4" /></span> DevDocs
          </Link>
          <p className="text-sm font-medium tracking-[0.18em] text-neutral-500 uppercase">Welcome back</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">Sign in to DevDocs.</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">Enter your details to continue to your workspace.</p>

          <form className="mt-10 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {submitError && <div className="border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm text-neutral-800">{submitError}</div>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email address</label>
              <div className="relative mt-2"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" /><input {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })} id="email" type="email" placeholder="you@example.com" className="block w-full border border-neutral-300 bg-white py-3 pr-3 pl-10 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black" /></div>
              {errors.email && <p className="mt-2 text-sm text-neutral-700">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <div className="relative mt-2"><Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" /><input {...register('password', { required: 'Password is required' })} id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="block w-full border border-neutral-300 bg-white py-3 pr-10 pl-10 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>
              {errors.password && <p className="mt-2 text-sm text-neutral-700">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50">{isLoading ? 'Signing in…' : 'Sign in'}</button>
            <p className="text-center text-sm text-neutral-600">Don&apos;t have an account? <Link href="/signup" className="font-semibold text-black underline underline-offset-4">Create one</Link></p>
          </form>
        </div>
      </section>
    </main>
  )
}
