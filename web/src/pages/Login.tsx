import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isLoggedIn, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname ?? '/documents'

  if (isLoggedIn) return <Navigate to={from} replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // Simulate network delay for realism
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
  }

  const handleContinue = () => {
    login(email)
    navigate(from, { replace: true })
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="h-8 w-8 text-primary-700" />
        </div>
        <h2 className="font-playfair font-bold text-3xl text-gray-900 mb-3">
          Check your email
        </h2>
        <p className="text-gray-600 mb-2">
          We sent a login link to <strong>{email}</strong>.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          In production, you'd click the link in your email. For this demo:
        </p>
        <Button
          onClick={handleContinue}
          className="bg-primary-700 hover:bg-primary-800 text-white w-full"
          size="lg"
        >
          Continue to member portal →
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <h1 className="font-playfair font-bold text-3xl text-gray-900 mb-2">Member Login</h1>
      <p className="text-gray-500 mb-8">
        Enter your email and we'll send you a secure login link.
        This section is for Pine Brook Meadows residents only.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoFocus
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-700 hover:bg-primary-800 text-white"
          size="lg"
        >
          {loading ? 'Sending...' : 'Send login link'}
        </Button>
      </form>
    </div>
  )
}
