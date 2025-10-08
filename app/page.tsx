"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Building2,
  Clock,
  Bell,
  BarChart3,
  Settings,
  Zap,
  Check,
  ArrowRight,
  Star,
  Shield,
  Smartphone,
  TrendingUp,
  PlayCircle,
  Sparkles,
  Lock,
  ChevronRight,
  Globe,
  Rocket,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButtons, HeroAuthButtons } from "@/components/auth-buttons";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Ultra-Modern Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg shadow-slate-900/5 dark:shadow-black/20" />
        
        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Premium Design */}
            <Link href="/" className="flex items-center gap-3 group relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  BZ
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-black font-parkinsans bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  BIZNIZZ.EU
                </span>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 -mt-1">
                  Booking Platform
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <Link 
                href="#features" 
                className="group relative px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span className="relative z-10">Funcționalități</span>
                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link 
                href="#pricing" 
                className="group relative px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span className="relative z-10">Prețuri</span>
                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link 
                href="#testimonials" 
                className="group relative px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span className="relative z-10">Testimoniale</span>
                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              {/* Separator */}
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-2" />
              
              {/* Theme Toggle with Premium Design */}
              <div className="px-2">
                <ThemeToggle />
              </div>
              
              {/* Auth Buttons */}
              <div className="flex items-center gap-3 ml-2">
                <Link href="/sign-in">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button 
                    size="sm"
                    className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Start Free
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Modern Slide-in Design */}
        <div 
          className={`lg:hidden absolute top-full left-0 right-0 transition-all duration-300 ${
            mobileMenuOpen 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="relative mx-4 mt-2 mb-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/10 dark:shadow-black/30 overflow-hidden">
            {/* Gradient Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
            
            <div className="p-6 space-y-1">
              <Link 
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold">Funcționalități</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Vezi ce oferim</div>
                </div>
              </Link>
              
              <Link 
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-semibold">Prețuri</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Planuri flexibile</div>
                </div>
              </Link>
              
              <Link 
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-600 dark:hover:text-pink-400 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <div className="font-semibold">Testimoniale</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Păreri clienți</div>
                </div>
              </Link>

              {/* Divider */}
              <div className="h-px bg-slate-200 dark:bg-slate-800 my-4" />

              {/* Mobile Auth Buttons */}
              <div className="space-y-2 pt-2">
                <Link href="/sign-in" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center font-semibold"
                    size="lg"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    className="w-full justify-center font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30"
                    size="lg"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-20" />

      {/* Epic Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Advanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full opacity-10 dark:opacity-5 blur-3xl" />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto py-20">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/30 mb-8 shadow-lg shadow-blue-500/5 hover:shadow-blue-500/20 transition-all duration-300 group cursor-default">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse" />
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Platformă SaaS #1 pentru Programări Online
            </span>
            <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
        </div>

          {/* Epic Main Heading */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-parkinsans bg-[length:200%_auto] animate-gradient">
              BIZNIZZ.EU
            </span>
          </h1>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-slate-800 dark:text-slate-200 max-w-4xl mx-auto px-4 mb-6 font-bold leading-tight">
            Transformă-ți business-ul cu programări online inteligente
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto px-4 mb-12 leading-relaxed">
            Gestionare automată, notificări smart și rapoarte în timp real pentru clinici medicale, saloane de înfrumusețare, barbershop-uri și multe altele
          </p>

          {/* Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 border-0 font-semibold group">
                <Rocket className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Începe Gratuit - 14 Zile Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300 hover:scale-105 hover:border-blue-600 dark:hover:border-blue-500 font-semibold group">
              <PlayCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Vizionează Demo
            </Button>
          </div>

          {/* Premium Stats Grid with Glassmorphism */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mb-16">
            <div className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-default overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">10K+</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">Programări/Lună</div>
                <div className="mt-3 h-1.5 w-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
            <div className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-default overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">500+</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">Business-uri Active</div>
                <div className="mt-3 h-1.5 w-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
            <div className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-xl shadow-green-500/5 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-default overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-2">98%</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">Satisfacție Clienți</div>
                <div className="mt-3 h-1.5 w-full bg-gradient-to-r from-green-600 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
            <div className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-xl shadow-orange-500/5 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-default overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent mb-2">24/7</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">Suport Tehnic</div>
                <div className="mt-3 h-1.5 w-full bg-gradient-to-r from-orange-600 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
      </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-medium">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <Lock className="h-4 w-4 text-green-600" />
              <span className="font-medium">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <Check className="h-4 w-4 text-purple-600" />
              <span className="font-medium">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards */}
      <section id="features" className="py-24 px-4 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Tot ce ai nevoie pentru succes
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Funcționalități puternice create special pentru business-uri de servicii moderne
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200/50 dark:border-blue-800/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Programări Online</h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Calendar Interactiv</strong> - Vizualizare simplă</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Acceptare Auto</strong> - Aprobare manuală</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Slot-uri Flexibile</strong> - Configurare custom</span>
                  </li>
            </ul>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200/50 dark:border-purple-800/30 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Multi-Tenant SaaS</h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Multe Locații</strong> - O singură platformă</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Date Izolate</strong> - Securitate maximă</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Branding Custom</strong> - Logo și culori</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/50 dark:border-green-800/30 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Gestionare Personal</h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Angajați & Servicii</strong> - Asignare auto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Orar Flexibil</strong> - Program custom</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Performanță</strong> - Rapoarte live</span>
                  </li>
            </ul>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200/50 dark:border-orange-800/30 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Bell className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Notificări Smart</h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Reminder-uri Auto</strong> - Zero no-show</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Email & SMS</strong> - Multi-canal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Template-uri</strong> - Personalizabile</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-200/50 dark:border-indigo-800/30 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Rapoarte & Analize</h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Dashboard Live</strong> - Metrici realtime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Statistici</strong> - Venituri & ocupare</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Export</strong> - CSV, PDF, Excel</span>
                  </li>
            </ul>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-rose-200/50 dark:border-rose-800/30 hover:shadow-2xl hover:shadow-rose-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Settings className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Configurare Flexibilă</h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Servicii Custom</strong> - Durată & preț</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Reguli Business</strong> - Logică adaptabilă</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">API Access</strong> - Integrări complete</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Premium Design */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
              <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Pricing</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Planuri simple și transparente
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Alege planul perfect pentru business-ul tău. Fără costuri ascunse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Starter</h3>
                <p className="text-slate-600 dark:text-slate-400">Perfect pentru început</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">49</span>
                  <span className="text-2xl font-semibold text-slate-600 dark:text-slate-400">RON</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">/lună, facturat lunar</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">Până la 100 programări/lună</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">1 utilizator</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">Calendar online</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">Notificări email</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">Suport email</span>
                </li>
            </ul>
              <Button className="w-full py-6 text-base font-semibold" variant="outline">
                Începe Gratuit
              </Button>
            </div>

            {/* Professional Plan - POPULAR */}
            <div className="relative">
              {/* Popular Badge */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                <div className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold shadow-xl shadow-blue-500/30">
                  ⭐ Cel mai Popular
                </div>
              </div>
              
              <div className="group relative p-8 pt-12 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-blue-500 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-500 hover:scale-105 text-white overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2">Professional</h3>
                    <p className="text-blue-100">Pentru business-uri în creștere</p>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black">149</span>
                      <span className="text-2xl font-semibold">RON</span>
                    </div>
                    <p className="text-sm text-blue-100 mt-1">/lună, facturat lunar</p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white font-medium">Programări nelimitate</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white font-medium">Până la 5 utilizatori</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white font-medium">Toate funcționalitățile</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white font-medium">Notificări SMS</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white font-medium">Rapoarte avansate</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white font-medium">Suport prioritar</span>
                    </li>
                  </ul>
                  <Button className="w-full py-6 text-base font-semibold bg-white text-blue-600 hover:bg-blue-50 shadow-xl">
                    Începe Acum
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Enterprise</h3>
                <p className="text-slate-600 dark:text-slate-400">Pentru companii mari</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">Custom</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Contactează-ne pentru ofertă</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">Tot din Pro +</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">Utilizatori nelimitați</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">API Access complet</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">Suport 24/7 dedicat</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">Training personalizat</span>
                </li>
            </ul>
              <Button className="w-full py-6 text-base font-semibold" variant="outline">
                Contactează-ne
              </Button>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Garanție de returnare a banilor 30 de zile</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Modern Cards */}
      <section id="testimonials" className="py-24 px-4 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 mb-4">
              <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">Testimonials</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Ce spun clienții noștri
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Peste 500 de business-uri își gestionează programările cu BIZNIZZ.EU
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-800 dark:to-blue-950/20 border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                "BIZNIZZ.EU ne-a transformat complet modul în care gestionăm programările. Clienții adoră cât de ușor este să facă rezervări online!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  AM
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Ana Maria Popescu</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Salon Premium, București</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-800 dark:to-purple-950/20 border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                "Sistemul de notificări automate a redus dramatic numărul de no-show-uri. ROI-ul a fost incredibil de rapid!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  IP
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Dr. Ion Popescu</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Clinica Dental Pro, Cluj</div>
                </div>
              </div>
        </div>

            {/* Testimonial 3 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white to-pink-50/30 dark:from-slate-800 dark:to-pink-950/20 border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-2">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                "Interfața este intuitivă și ușor de folosit. Echipa s-a adaptat imediat, iar rapoartele ne ajută enorm!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  MG
                </div>
            <div>
                  <div className="font-bold text-slate-900 dark:text-white">Maria Georgescu</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Barbershop Elite, Timișoara</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bold & Modern */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        {/* Animated Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
            <Rocket className="h-4 w-4 text-white" />
            <span className="text-sm font-semibold text-white">Începe astăzi</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-white leading-tight">
            Gata să îți transformi business-ul?
          </h2>
          
          <p className="text-xl sm:text-2xl mb-12 text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Alătură-te celor peste 500 de business-uri care folosesc BIZNIZZ.EU pentru programări perfecte
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-10 py-7 bg-white text-blue-600 hover:bg-blue-50 shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all duration-300 hover:scale-105 font-semibold group">
                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Începe Gratuit
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 font-semibold">
              Contactează-ne
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Modern & Clean */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-16 px-4 bg-white dark:bg-slate-950">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                  BZ
                </div>
                <span className="text-2xl font-black font-parkinsans bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">BIZNIZZ.EU</span>
              </Link>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                Platforma SaaS pentru programări online care transformă modul în care business-urile de servicii își gestionează clienții.
              </p>
              <div className="flex gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                  <Globe className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                  <Smartphone className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
            </div>
            
            {/* Produs */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">Produs</h3>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Funcționalități</Link></li>
                <li><Link href="#pricing" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Prețuri</Link></li>
                <li><Link href="#testimonials" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Testimoniale</Link></li>
                <li><Link href="/sign-up" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Încearcă Gratuit</Link></li>
              </ul>
            </div>
            
            {/* Companie */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">Companie</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Despre Noi</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cariere</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Termeni</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Confidențialitate</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">GDPR</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2025 BIZNIZZ.EU. Toate drepturile rezervate.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Toate sistemele funcționează</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
