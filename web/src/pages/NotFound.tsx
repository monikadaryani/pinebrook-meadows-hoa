import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="font-playfair text-4xl font-bold text-gray-900 mb-4">Page not found</h1>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
      <Button asChild><Link to="/">Go home</Link></Button>
    </div>
  )
}
