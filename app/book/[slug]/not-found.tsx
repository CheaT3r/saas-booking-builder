import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-pink-600 rounded-full blur-2xl opacity-30 animate-pulse" />
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center mx-auto shadow-2xl">
            <XCircle className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          404
        </h1>
        
        <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-200">
          Business Not Found
        </h2>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          The business you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        
        <div className="space-y-3">
          <Button asChild className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
            <Link href="/">
              Go to Homepage
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full h-12">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}



