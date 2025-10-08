'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'
import { Loader2, Building2, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const industries = [
  "Veterinary Clinic",
  "Dental Clinic",
  "Barbershop",
  "Beauty Salon",
  "Spa & Wellness",
  "Fitness Center",
  "Medical Clinic",
  "Law Office",
  "Consulting",
  "Other",
]

export default function OnboardingPage() {
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          industry,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "🎉 Business created!",
          description: "Your business has been set up successfully.",
        })
        router.push('/dashboard')
      } else {
        throw new Error(result.error || 'Failed to create business')
      }
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (err as Error).message || "Failed to create business",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50/50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-50" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-2xl">
                <Building2 className="w-10 h-10" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Welcome to BIZNIZZ.EU!
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Let&apos;s set up your business in just a few seconds
          </p>
        </div>

        {/* Main Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20" />
          
          <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-8 md:p-12 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Business Name */}
              <div className="space-y-3">
                <Label htmlFor="businessName" className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  What&apos;s your business name?
                </Label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="businessName"
                    placeholder="e.g. Sunset Veterinary Clinic"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-14 h-14 text-lg rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Industry */}
              <div className="space-y-3">
                <Label htmlFor="industry" className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  What industry are you in?
                </Label>
                <Select value={industry} onValueChange={setIndustry} required disabled={isLoading}>
                  <SelectTrigger className="h-14 text-lg rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind} className="text-lg py-3 rounded-xl">
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Features Preview */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-900">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  What you&apos;ll get:
                </h3>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Your own booking page at <span className="font-mono font-bold">biznizz.eu/book/your-business</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Powerful dashboard to manage appointments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Staff management and scheduling tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">14-day free trial to explore all features</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] rounded-2xl"
                disabled={isLoading || !businessName || !industry}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Creating your business...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-6 w-6" />
                    Create My Business
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span>Setup in 30 seconds</span>
          </div>
        </div>
      </div>
    </div>
  )
}



