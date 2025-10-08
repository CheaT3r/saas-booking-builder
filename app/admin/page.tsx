'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to businesses page by default
    router.push('/admin/businesses')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-16 h-16 animate-spin text-purple-600" />
    </div>
  )
}
