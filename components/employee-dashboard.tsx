'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, CheckCircle2, XCircle, Loader2, Building2, Briefcase } from "lucide-react"
import { format } from 'date-fns'

interface EmployeeDashboardProps {
  businessId: string;
  userId: string;
}

interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  status: string;
  clientName: string;
  serviceName: string;
  notes: string | null;
}

interface Business {
  name: string;
  tagline: string | null;
  primaryColor: string;
  accentColor: string;
}

export function EmployeeDashboard({ businessId, userId }: EmployeeDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [businessId, userId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch business info
      const businessResponse = await fetch('/api/settings');
      const businessResult = await businessResponse.json();
      if (businessResult.success) {
        setBusiness(businessResult.data);
      }

      // Fetch employee's own bookings
      // TODO: Create endpoint /api/bookings/my-bookings that filters by staffId
      const bookingsResponse = await fetch(`/api/bookings?staffUserId=${userId}`);
      const bookingsResult = await bookingsResponse.json();
      if (bookingsResult.success) {
        setBookings(bookingsResult.data);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const todayBookings = bookings.filter(b => {
    const bookingDate = new Date(b.startTime);
    const today = new Date();
    return bookingDate.toDateString() === today.toDateString();
  });

  const upcomingBookings = bookings.filter(b => {
    const bookingDate = new Date(b.startTime);
    const today = new Date();
    return bookingDate > today;
  });

  const completedBookings = bookings.filter(b => b.status === 'completed');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-950 dark:via-purple-950/20 dark:to-pink-950/20 min-h-screen">
      {/* Welcome Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-orange-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl blur-xl opacity-50" style={{ background: `linear-gradient(135deg, ${business?.primaryColor || '#a855f7'}, ${business?.accentColor || '#ec4899'})` }} />
              <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${business?.primaryColor || '#a855f7'}, ${business?.accentColor || '#ec4899'})` }}>
                <Briefcase className="w-8 h-8" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Angajat Dashboard
                </h1>
                <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-0">
                  Employee
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {business?.name && (
                  <span className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {business.name} {business.tagline && `• ${business.tagline}`}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-10 h-10 text-blue-600" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Astăzi</p>
          <p className="text-3xl font-black mt-2 text-blue-600">{todayBookings.length}</p>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-10 h-10 text-purple-600" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Viitoare</p>
          <p className="text-3xl font-black mt-2 text-purple-600">{upcomingBookings.length}</p>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Completate</p>
          <p className="text-3xl font-black mt-2 text-green-600">{completedBookings.length}</p>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            Programul Meu de Astăzi
          </CardTitle>
          <CardDescription>
            {todayBookings.length > 0 ? `${todayBookings.length} programări pentru astăzi` : 'Nicio programare pentru astăzi'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-semibold">Zi liberă! 🎉</p>
              <p className="text-sm">Nu ai programări astăzi.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayBookings.map((booking) => (
                <div key={booking.id} className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                        {format(new Date(booking.startTime), 'HH:mm')}
                      </div>
                      <div>
                        <p className="font-bold">{booking.clientName}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{booking.serviceName}</p>
                      </div>
                    </div>
                    <Badge className={
                      booking.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0' :
                      booking.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-0' :
                      booking.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-0' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0'
                    }>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>{format(new Date(booking.startTime), 'HH:mm')} - {format(new Date(booking.endTime), 'HH:mm')}</span>
                  </div>
                  {booking.notes && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 italic">
                      Note: {booking.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Bookings */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Programări Viitoare
          </CardTitle>
          <CardDescription>
            Următoarele tale programări
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Clock className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-semibold">Nicio programare viitoare</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-black">{format(new Date(booking.startTime), 'dd')}</span>
                        <span className="text-xs text-slate-500 uppercase">{format(new Date(booking.startTime), 'MMM')}</span>
                      </div>
                      <div>
                        <p className="font-bold">{booking.clientName}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{booking.serviceName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{format(new Date(booking.startTime), 'HH:mm')}</p>
                      <Badge variant="outline">{booking.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800 shadow-xl rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Acces Angajat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold">Vezi propriile programări</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Gestionează-ți programul personal</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold">Creează programări</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Adaugă clienți și programări noi</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-500">Setări business (read-only)</p>
                <p className="text-sm text-slate-400">Doar owner-ul poate modifica setările</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


