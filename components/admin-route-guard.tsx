'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { Loader2, ShieldAlert } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

interface AdminRouteGuardProps {
  children: React.ReactNode
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuthorization = async () => {
      if (isPending) return
      
      if (!session?.user) {
        router.push('/sign-in')
        return
      }

      try {
        const response = await fetch('/api/auth/role')
        const result = await response.json()

        if (result.success && result.data.isSuperAdmin) {
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
        }
      } catch (error) {
        console.error('Error checking authorization:', error)
        setIsAuthorized(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuthorization()
  }, [session, isPending, router])

  if (isPending || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-orange-50/30 to-yellow-50/30 dark:from-slate-950 dark:via-red-950/20 dark:to-orange-950/20">
        <div className="text-center max-w-md p-8">
          <div className="mb-6">
            <ShieldAlert className="w-24 h-24 mx-auto text-red-600 mb-4" />
            <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Access Denied
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              You don&apos;t have permission to access the Super Admin Panel. This area is restricted to platform administrators only.
            </p>
          </div>
          <div className="space-y-3">
            <Link href="/dashboard">
              <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full h-12">
                Go to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}



