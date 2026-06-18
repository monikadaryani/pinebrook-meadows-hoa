import { useState } from 'react'
import { useLocation, Navigate, Link } from 'react-router-dom'
import { Mail, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

type State = 'idle' | 'checking' | 'sending' | 'sent' | 'not_registered' | 'error'

export default function Login() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const { session } = useAuth()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname ?? '/documents'

  if (session) return <Navigate to={from} replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    // Step 1: Check if email is a registered homeowner
    setState('checking')
    const { data: isRegistered, error: rpcError } = await supabase
      .rpc('is_registered_homeowner', { input_email: email })

    if (rpcError) {
      console.error('RPC error:', rpcError)
      setState('error')
      return
    }

    if (!isRegistered) {
      setState('not_registered')
      return
    }

    // Step 2: Send magic link
    setState('sending')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) {
      console.error('OTP error:', error)
      setState('error')
      return
    }

    setState('sent')
  }

  if (state === 'sent') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="h-8 w-8 text-primary-700" />
        </div>
        <h2 className="font-playfair font-bold text-3xl text-gray-900 mb-3">
          Check your email
        </h2>
        <p className="text-gray-600">
          We sent a login link to <strong>{email}</strong>.
          Click the link in the email to access the member portal.
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Didn't receive it? Check your spam folder.
        </p>
      </div>
    )
  }

  const isLoading = state === 'checking' || state === 'sending'

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <h1 className="font-playfair font-bold text-3xl text-gray-900 mb-2">Member Login</h1>
      <p className="text-gray-500 mb-8">
        Enter your email address and we'll send you a secure login link.
        This section is for Pine Brook Meadows residents only.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (state === 'not_registered' || state === 'error') setState('idle')
            }}
            placeholder="your@email.com"
            required
            autoFocus
            disabled={isLoading}
          />
        </div>

        {state === 'not_registered' && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              This email isn't registered with Pine Brook Meadows HOA. Please{' '}
              <Link to="/contact" className="underline font-medium">
                reach out through our Contact form
              </Link>{' '}
              to get access.
            </span>
          </div>
        )}

        {state === 'error' && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Something went wrong. Please try again.</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-700 hover:bg-primary-800 text-white"
          size="lg"
        >
          {state === 'checking' ? 'Checking...' : state === 'sending' ? 'Sending...' : 'Send login link'}
        </Button>
      </form>
    </div>
  )
}
