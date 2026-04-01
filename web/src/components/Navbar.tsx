import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

const publicLinks = [
  { to: '/about', label: 'About' },
  { to: '/announcements', label: 'Announcements' },
]

const memberLinks = [
  { to: '/documents', label: 'Documents' },
  { to: '/directory', label: 'Directory' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { session, signOut } = useAuth()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm tracking-wide transition-colors hover:text-primary-700 ${isActive ? 'text-primary-700 font-semibold' : 'text-gray-500 font-medium'}`

  return (
    <nav className="sticky top-0 z-50 border-b shadow-sm" style={{ backgroundColor: '#fdfbf8', borderColor: '#e8e0d5' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex flex-col">
            <span className="font-playfair font-bold text-lg text-gray-900 leading-none">Pine Brook Meadows</span>
            <p className="text-[10px] tracking-widest text-primary-600 uppercase font-medium leading-none mt-0.5">Sammamish, WA</p>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {publicLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
            ))}
            {!!session && memberLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
            ))}
            {!!session ? (
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <Button asChild size="sm" className="bg-primary-700 hover:bg-primary-800 text-white">
                <Link to="/login">Member Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-3 border-t space-y-0.5" style={{ borderColor: '#e8e0d5' }}>
            {publicLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            {!!session && memberLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-gray-100 mt-2">
              {!!session ? (
                <button
                  onClick={() => { signOut(); setOpen(false) }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-md w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-sm font-medium text-primary-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setOpen(false)}
                >
                  Member Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
