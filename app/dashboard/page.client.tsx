'use client'

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  DollarSign,
  Users,
  CheckCircle,
  Plus,
  Clock,
  Phone,
  Mail,
  Sparkles,
  ChevronRight,
  Calendar as CalendarIcon,
  Settings,
  Briefcase,
  Loader2,
} from "lucide-react"
import { format } from 'date-fns'
import { ro } from 'date-fns/locale'
import { useRole } from '@/hooks/use-role'
import { EmployeeDashboard } from '@/components/employee-dashboard'

interface DashboardData {
  todayBookingsCount: number;
  todayRevenue: number;
  totalClients: number;
  confirmationRate: number;
  todaySchedule: Array<{
    id: string;
    time: string;
    client: string;
    service: string;
    staff: string;
    price: number;
    status: string;
  }>;
  weeklyOverview: {
    totalBookings: number;
    totalRevenue: number;
    avgBookingValue: number;
    activeStaff: number;
  };
  upcomingBookings: Array<{
    id: string;
    client: string;
    service: string;
    date: string;
    time: string;
    status: string;
  }>;
  weeklyPerformance: Array<{
    day: string;
    bookings: number;
    revenue: number;
  }>;
}

export default function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const { isBusinessEmployee, roleData, isLoading: roleLoading } = useRole();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch business info to get businessId
        const settingsResponse = await fetch('/api/settings');
        const settingsResult = await settingsResponse.json();
        
        if (settingsResult.success) {
          setBusinessId(settingsResult.data.id);
        }

        const response = await fetch('/api/dashboard/stats');
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to load dashboard data');
        }
      } catch (err) {
        setError('Failed to connect to server');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-600 text-white shadow-md">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-slate-500 text-white shadow-md">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-slate-400 text-white shadow-md">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (isLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // If user is a business employee, show employee dashboard
  if (isBusinessEmployee && roleData?.businessId && roleData?.userId) {
    return <EmployeeDashboard businessId={roleData.businessId} userId={roleData.userId} />;
  }

  const today = new Date();

  // Otherwise, show owner dashboard
  return (
    <div className="relative min-h-screen p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 overflow-hidden">
      {/* Floating Blur Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-70" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 opacity-70" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 opacity-70" />
      </div>

      <div className="relative z-10 @container/main flex flex-1 flex-col gap-6">
        {/* Header */}
        <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <CalendarDays className="w-8 h-8" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Bine ai revenit!
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Iată o privire de ansamblu pentru {format(today, 'EEEE, d MMMM yyyy', { locale: ro })}.
              </p>
            </div>
          </div>
          <Button className="h-12 px-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
            <Plus className="w-5 h-5 mr-2" />
            Programare Nouă
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Programări Astăzi */}
          <Card className="relative p-6 rounded-3xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20 shadow-xl hover:shadow-slate-500/20 dark:hover:shadow-slate-900/30 transition-all duration-300 group">
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-xl" />
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <CalendarDays className="w-7 h-7" />
              </div>
            </div>
            <p className="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1 tracking-wide">Programări Astăzi</p>
            <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200">
              {data.todayBookingsCount}
            </h2>
          </Card>

          {/* Card 2: Venit Astăzi */}
          <Card className="relative p-6 rounded-3xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20 shadow-xl hover:shadow-slate-500/20 dark:hover:shadow-slate-900/30 transition-all duration-300 group">
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-xl" />
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7" />
              </div>
            </div>
            <p className="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1 tracking-wide">Venit Astăzi</p>
            <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200">
              {data.todayRevenue} RON
            </h2>
          </Card>

          {/* Card 3: Total Clienți */}
          <Card className="relative p-6 rounded-3xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20 shadow-xl hover:shadow-slate-500/20 dark:hover:shadow-slate-900/30 transition-all duration-300 group">
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-xl" />
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
            </div>
            <p className="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1 tracking-wide">Total Clienți</p>
            <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200">
              {data.totalClients}
            </h2>
          </Card>

          {/* Card 4: Rată Confirmare */}
          <Card className="relative p-6 rounded-3xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20 shadow-xl hover:shadow-slate-500/20 dark:hover:shadow-slate-900/30 transition-all duration-300 group">
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-xl" />
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <CheckCircle className="w-7 h-7" />
              </div>
            </div>
            <p className="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1 tracking-wide">Rată Confirmare</p>
            <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200">
              {data.confirmationRate}%
            </h2>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Today's Schedule & Performance Chart */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Today's Schedule */}
            <Card className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 blur-2xl opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-3xl font-black text-foreground">Programări Astăzi</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
                
                {data.todaySchedule.length > 0 ? (
                  <div className="space-y-4">
                    {data.todaySchedule.map((booking, index) => (
                      <div
                        key={booking.id}
                        className="relative flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="w-20 h-12 rounded-xl bg-slate-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                          {booking.time}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                          <div>
                            <p className="font-semibold text-lg">{booking.client}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Briefcase className="w-4 h-4 text-slate-500" /> {booking.service} cu {booking.staff}
                            </p>
                          </div>
                          <div className="flex items-center justify-end gap-3 md:ml-auto">
                            {getStatusBadge(booking.status)}
                            <p className="font-bold text-xl text-foreground">{booking.price} RON</p>
                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                              <Phone className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                              <Mail className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarDays className="w-16 h-16 mx-auto mb-4 text-slate-400 dark:text-slate-600" />
                    <p className="text-xl font-semibold mb-2">Nicio programare astăzi</p>
                    <p className="mb-6">Timpul perfect pentru a te relaxa sau a adăuga noi programări!</p>
                    <Button className="bg-slate-600 hover:bg-slate-700 shadow-lg">
                      <Plus className="w-4 h-4 mr-2" /> Adaugă Programare
                    </Button>
                  </div>
                )}
                <div className="text-center mt-8">
                  <Button variant="outline" className="text-lg px-6 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Vezi Toate Programările <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Weekly Performance Chart */}
            <Card className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 blur-2xl opacity-50" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-foreground mb-6">Performanță Săptămânală</h3>
                <div className="space-y-6">
                  {data.weeklyPerformance.map((dayData, index) => (
                    <div key={dayData.day} className="flex items-center gap-4">
                      <p className="w-20 font-semibold text-slate-700 dark:text-slate-300">{dayData.day}</p>
                      <div className="flex-1">
                        <div className="h-4 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out animate-slide-in-left`}
                            style={{
                              width: `${Math.min((dayData.bookings / 10) * 100, 100)}%`,
                              background: `linear-gradient(to right, #64748b, #475569)`,
                              animationDelay: `${index * 100}ms`
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>{dayData.bookings} programări</span>
                          <span>{dayData.revenue} RON</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Quick Actions, Weekly Overview, Upcoming Bookings */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Quick Actions */}
            <Card className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 blur-2xl opacity-50" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-foreground mb-6">Acțiuni Rapide</h3>
                <div className="space-y-4">
                  <Button className="w-full h-12 text-lg font-semibold bg-slate-600 hover:bg-slate-700 shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <Plus className="w-5 h-5 mr-2" /> Programare Nouă
                  </Button>
                  <Button variant="outline" className="w-full h-12 text-lg font-semibold border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                    <Users className="w-5 h-5 mr-2 text-slate-600 group-hover:scale-110 transition-transform" /> Adaugă Client
                  </Button>
                  <Button variant="outline" className="w-full h-12 text-lg font-semibold border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                    <Settings className="w-5 h-5 mr-2 text-slate-600 group-hover:rotate-45 transition-transform" /> Gestionează Servicii
                  </Button>
                </div>
              </div>
            </Card>

            {/* Weekly Overview */}
            <Card className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/5 to-blue-500/5 blur-2xl opacity-50" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-foreground mb-6">Săptămâna Curentă</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-muted-foreground flex items-center gap-2"><CalendarDays className="w-5 h-5 text-slate-600" /> Programări</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{data.weeklyOverview.totalBookings}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-muted-foreground flex items-center gap-2"><DollarSign className="w-5 h-5 text-slate-600" /> Venit Total</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{data.weeklyOverview.totalRevenue} RON</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-muted-foreground flex items-center gap-2"><Sparkles className="w-5 h-5 text-slate-600" /> Valoare Medie</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{data.weeklyOverview.avgBookingValue} RON</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-muted-foreground flex items-center gap-2"><Users className="w-5 h-5 text-slate-600" /> Personal Activ</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{data.weeklyOverview.activeStaff}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Upcoming Bookings */}
            <Card className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/5 to-red-500/5 blur-2xl opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-foreground">Programări Viitoare</h3>
                  <Badge className="bg-slate-600 text-white shadow-md text-lg px-4 py-2 rounded-full">
                    {data.upcomingBookings.length}
                  </Badge>
                </div>
                <div className="space-y-4">
                  {data.upcomingBookings.length > 0 ? (
                    data.upcomingBookings.map((booking, index) => (
                      <div
                        key={booking.id}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg hover:-translate-x-1 transition-all duration-300 group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{booking.client}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Briefcase className="w-4 h-4 text-slate-500" /> {booking.service}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {getStatusBadge(booking.status)}
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4 text-slate-500" /> {booking.date}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-4 h-4 text-slate-500" /> {booking.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">Nu există programări viitoare</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
