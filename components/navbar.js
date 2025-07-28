"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Wallet } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/"
  }

  return (
    <nav className="fixed w-full z-50 bg-gray-950/90 backdrop-blur-md border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold neon-text">CryptoVault</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
              Contact
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === "admin" ? (
                  <Link href="/admin">
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                    >
                      Admin Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                    >
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button onClick={handleLogout} variant="ghost" className="text-gray-300">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-300">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 glow">Register</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 text-gray-300 hover:text-blue-400">
              Home
            </Link>
            <Link href="/about" className="block px-3 py-2 text-gray-300 hover:text-blue-400">
              About
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-gray-300 hover:text-blue-400">
              Contact
            </Link>
            {user ? (
              <>
                <Link href={user.role === "admin" ? "/admin" : "/dashboard"} className="block px-3 py-2 text-blue-400">
                  {user.role === "admin" ? "Admin Dashboard" : "Dashboard"}
                </Link>
                <button onClick={handleLogout} className="block px-3 py-2 text-gray-300 w-full text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-gray-300">
                  Login
                </Link>
                <Link href="/register" className="block px-3 py-2 text-blue-400">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
