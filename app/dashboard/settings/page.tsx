'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Building2, Clock, Bell, CreditCard, Users, Loader2, XCircle, Globe, AlertCircle, ExternalLink, CheckCircle2, Lock } from "lucide-react"
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface BusinessSettings {
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  primaryColor: string;
  accentColor: string;
  workingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
}

const initialWorkingHours = {
  monday: { open: "09:00", close: "18:00", closed: false },
  tuesday: { open: "09:00", close: "18:00", closed: false },
  wednesday: { open: "09:00", close: "18:00", closed: false },
  thursday: { open: "09:00", close: "18:00", closed: false },
  friday: { open: "09:00", close: "18:00", closed: false },
  saturday: { open: "10:00", close: "16:00", closed: false },
  sunday: { open: "", close: "", closed: true },
};

export default function SettingsPage() {
  const { toast } = useToast();

  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Subscription status
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      // API will get businessId from session on server
      const res = await fetch('/api/settings');
      if (!res.ok) {
        throw new Error('Failed to fetch business settings');
      }
      const data = await res.json();
      setSettings({
        ...data,
        workingHours: data.workingHours || initialWorkingHours,
      });
      setBusinessId(data.id); // Save businessId for later use
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      toast({
        variant: "destructive",
        title: "Eroare la încărcarea setărilor",
        description: err.message || "Nu s-au putut încărca setările business-ului.",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!businessId) return;
    setCheckingSubscription(true);
    try {
      const res = await fetch(`/api/subscription-status?businessId=${businessId}`);
      const result = await res.json();
      if (result.success) {
        setHasActiveSubscription(result.data.hasActiveSubscription);
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
    } finally {
      setCheckingSubscription(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (businessId) {
      checkSubscription();
    }
  }, [businessId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSettings(prev => prev ? { ...prev, [id.replace('business-', '')]: value } : null);
  };

  const handleColorChange = (id: string, value: string) => {
    setSettings(prev => prev ? { ...prev, [id]: value } : null);
  };

  const handleWorkingHoursChange = (day: keyof typeof initialWorkingHours, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setSettings(prev => {
      if (!prev) return null;
      const updatedWorkingHours = {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value,
        },
      };
      return { ...prev, workingHours: updatedWorkingHours };
    });
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update settings');
      }
      toast({
        title: "Setări salvate!",
        description: "Setările business-ului au fost actualizate cu succes.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Eroare la salvarea setărilor",
        description: err.message || "Nu s-au putut salva setările.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen text-red-500">
        <XCircle className="h-16 w-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Eroare la încărcarea setărilor</h2>
        <p className="text-lg">{error || "Nu s-au putut încărca setările business-ului."}</p>
        <Button onClick={fetchSettings} className="mt-6">Reîncearcă</Button>
      </div>
    );
  }

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  const publicPageUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/book/${settings.slug}`;

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500/10 via-blue-500/10 to-slate-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-blue-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-blue-600 flex items-center justify-center text-white shadow-xl">
                  <Building2 className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  Setări Business
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Configurează detaliile și preferințele business-ului tău
                </p>
              </div>
            </div>
            <Button
              onClick={handleSaveSettings}
              className="gap-2 bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 shadow-lg shadow-slate-500/30 h-12 px-8"
              disabled={saving}
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Se salvează...' : 'Salvează Setările'}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-lg">
          <TabsTrigger value="business" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-slate-500/30 rounded-xl h-12">
            <Building2 className="mr-2 h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="public-page" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-emerald-500/30 rounded-xl h-12">
            <Globe className="mr-2 h-4 w-4" />
            Pagină Publică
          </TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-slate-500/30 rounded-xl h-12">
            <Clock className="mr-2 h-4 w-4" />
            Program
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-slate-500/30 rounded-xl h-12">
            <Bell className="mr-2 h-4 w-4" />
            Notificări
          </TabsTrigger>
          <TabsTrigger value="booking" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-slate-500/30 rounded-xl h-12">
            <Users className="mr-2 h-4 w-4" />
            Programări
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-slate-500/30 rounded-xl h-12">
            <CreditCard className="mr-2 h-4 w-4" />
            Plăți
          </TabsTrigger>
        </TabsList>

        {/* Business Settings Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">Informații Generale</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Actualizează detaliile de bază ale business-ului tău.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Numele Business-ului</Label>
                <Input id="name" value={settings.name} onChange={handleInputChange} className="h-12 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug URL (pentru pagina publică)</Label>
                <Input id="slug" value={settings.slug} onChange={handleInputChange} className="h-12 rounded-xl" disabled />
                <p className="text-sm text-muted-foreground">URL-ul public va fi: <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">/book/{settings.slug}</code></p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tagline">Slogan / Industrie</Label>
                <Input id="tagline" value={settings.tagline || ''} onChange={handleInputChange} className="h-12 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descriere</Label>
                <Textarea id="description" value={settings.description || ''} onChange={handleInputChange} className="rounded-xl" rows={4} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Contact</Label>
                  <Input id="email" type="email" value={settings.email || ''} onChange={handleInputChange} className="h-12 rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefon Contact</Label>
                  <Input id="phone" value={settings.phone || ''} onChange={handleInputChange} className="h-12 rounded-xl" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Adresă</Label>
                <Input id="address" value={settings.address || ''} onChange={handleInputChange} className="h-12 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={settings.website || ''} onChange={handleInputChange} className="h-12 rounded-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">Branding & Culori</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Personalizează aspectul paginii tale publice de programări.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="primaryColor">Culoare Primară</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="h-12 w-12 p-1 rounded-xl border-none"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="h-12 rounded-xl flex-1"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="accentColor">Culoare Accent</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="h-12 w-12 p-1 rounded-xl border-none"
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="h-12 rounded-xl flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Public Page Tab */}
        <TabsContent value="public-page" className="space-y-6">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Globe className="w-8 h-8" />
                Pagina Ta Publică de Booking
              </CardTitle>
              <CardDescription>
                Gestionează accesul clienților la pagina ta de programări online
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {checkingSubscription ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : !hasActiveSubscription ? (
                <>
                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-500">
                    <Lock className="h-5 w-5 text-red-600" />
                    <AlertDescription className="text-red-700 dark:text-red-400 text-base">
                      <strong className="font-bold">Pachet Activ Necesar!</strong>
                      <p className="mt-2">
                        Pentru a putea crea și activa pagina ta publică de booking, trebuie să ai un pachet activ de subscripție.
                      </p>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="text-center py-8">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-pink-600 rounded-full blur-2xl opacity-30" />
                      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center mx-auto shadow-2xl">
                        <Lock className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">Pagina Publică Blocată</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                      Pentru a activa pagina ta de booking și a primi programări online de la clienți, selectează un pachet de subscripție.
                    </p>
                    
                    <Button asChild className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg h-12 px-8">
                      <Link href="/dashboard/billing">
                        <CreditCard className="w-5 h-5" />
                        Vezi Pachetele Disponibile
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Alert className="bg-green-50 dark:bg-green-900/20 border-green-500">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertDescription className="text-green-700 dark:text-green-400 text-base">
                      <strong className="font-bold">Pagina Ta Este Activă! 🎉</strong>
                      <p className="mt-2">
                        Clienții pot accesa pagina ta de booking și pot face programări online.
                      </p>
                    </AlertDescription>
                  </Alert>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Globe className="w-6 h-6 text-blue-600" />
                      URL-ul Paginii Tale Publice
                    </h3>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <Input
                        value={publicPageUrl}
                        readOnly
                        className="h-12 rounded-xl font-mono text-sm bg-white dark:bg-slate-900"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(publicPageUrl);
                          toast({
                            title: "URL Copiat!",
                            description: "URL-ul paginii a fost copiat în clipboard.",
                          });
                        }}
                        className="h-12 px-6"
                      >
                        Copiază
                      </Button>
                    </div>

                    <div className="flex gap-3">
                      <Button asChild className="flex-1 h-12 bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 shadow-lg">
                        <Link href={`/book/${settings.slug}`} target="_blank">
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Vezi Pagina Live
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="h-12 px-6 border-slate-300 dark:border-slate-700">
                        <Link href="/dashboard/billing">
                          Gestionează Abonamentul
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/30 dark:to-blue-950/30 border-slate-200 dark:border-slate-800">
                      <CardContent className="pt-6 text-center">
                        <Globe className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Accesibilă Public</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">24/7 disponibilă</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800">
                      <CardContent className="pt-6 text-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                        <p className="font-semibold text-emerald-900 dark:text-emerald-100">Booking Activ</p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">Primește rezervări</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/30 border-slate-200 dark:border-slate-800">
                      <CardContent className="pt-6 text-center">
                        <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Branding Custom</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Culori personalizate</p>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Settings */}
        <TabsContent value="schedule" className="space-y-6">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">Program de Lucru</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Setează orele de funcționare pentru business-ul tău.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {daysOfWeek.map(day => (
                <div key={day} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-4">
                    <Switch
                      id={`${day}-closed`}
                      checked={!settings.workingHours[day]?.closed}
                      onCheckedChange={(checked) => handleWorkingHoursChange(day, 'closed', !checked)}
                    />
                    <Label htmlFor={`${day}-closed`} className="capitalize font-semibold">
                      {day === 'monday' && 'Luni'}
                      {day === 'tuesday' && 'Marți'}
                      {day === 'wednesday' && 'Miercuri'}
                      {day === 'thursday' && 'Joi'}
                      {day === 'friday' && 'Vineri'}
                      {day === 'saturday' && 'Sâmbătă'}
                      {day === 'sunday' && 'Duminică'}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={settings.workingHours[day]?.open || ''}
                      onChange={(e) => handleWorkingHoursChange(day, 'open', e.target.value)}
                      className="h-10 rounded-lg w-28"
                      disabled={settings.workingHours[day]?.closed}
                    />
                    <span>-</span>
                    <Input
                      type="time"
                      value={settings.workingHours[day]?.close || ''}
                      onChange={(e) => handleWorkingHoursChange(day, 'close', e.target.value)}
                      className="h-10 rounded-lg w-28"
                      disabled={settings.workingHours[day]?.closed}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Placeholder for other tabs */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">Setări Notificări</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Configurează cum primești notificări despre programări.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-500 dark:text-slate-400">Funcționalitate în dezvoltare...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="booking" className="space-y-4">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">Reguli Programări</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Setează reguli specifice pentru programările online.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-500 dark:text-slate-400">Funcționalitate în dezvoltare...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="space-y-4">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">Setări Plăți</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Configurează metodele de plată și integrarea cu procesatori.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-500 dark:text-slate-400">Funcționalitate în dezvoltare...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
