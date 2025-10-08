'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Building2, Users, Loader2, XCircle, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface AnalyticsData {
  totalBusinesses: number;
  totalBookings: number;
  totalRevenue: number;
  activeSubscriptions: number;
  bookingsByStatus: Array<{ status: string; count: number }>;
  weeklyBookings: Array<{ date: string; count: number }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/analytics');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch analytics');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'An unexpected error occurred');
      toast({
        variant: "destructive",
        title: "Error loading analytics",
        description: (err as Error).message || "Failed to load analytics data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen text-red-500">
        <XCircle className="h-16 w-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error loading analytics</h2>
        <p className="text-lg">{error}</p>
        <Button onClick={fetchAnalytics} className="mt-6">Retry</Button>
      </div>
    );
  }

  const statusColors: { [key: string]: string } = {
    confirmed: 'bg-green-500',
    pending: 'bg-yellow-500',
    cancelled: 'bg-red-500',
    completed: 'bg-blue-500',
  };

  return (
    <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl">
                  <Activity className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  Platform Analytics
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Real-time insights and performance metrics
                </p>
              </div>
            </div>
            <Button onClick={fetchAnalytics} variant="outline" className="h-12 px-6">
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16" />
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-700 dark:text-blue-400 font-semibold">Total Businesses</CardDescription>
            <CardTitle className="text-4xl font-black text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <Building2 className="w-8 h-8" />
              {data.totalBusinesses}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-slate-600 dark:text-slate-400">Active on platform</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16" />
          <CardHeader className="pb-3">
            <CardDescription className="text-green-700 dark:text-green-400 font-semibold">Total Bookings</CardDescription>
            <CardTitle className="text-4xl font-black text-green-700 dark:text-green-400 flex items-center gap-2">
              <Calendar className="w-8 h-8" />
              {data.totalBookings}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-slate-600 dark:text-slate-400">All time</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16" />
          <CardHeader className="pb-3">
            <CardDescription className="text-purple-700 dark:text-purple-400 font-semibold">Total Revenue</CardDescription>
            <CardTitle className="text-4xl font-black text-purple-700 dark:text-purple-400 flex items-center gap-2">
              <DollarSign className="w-8 h-8" />
              {(data.totalRevenue / 100).toFixed(0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600 dark:text-slate-400">RON from bookings</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-2 border-orange-200 dark:border-orange-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16" />
          <CardHeader className="pb-3">
            <CardDescription className="text-orange-700 dark:text-orange-400 font-semibold">Active Subscriptions</CardDescription>
            <CardTitle className="text-4xl font-black text-orange-700 dark:text-orange-400 flex items-center gap-2">
              <Users className="w-8 h-8" />
              {data.activeSubscriptions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-slate-600 dark:text-slate-400">Paying customers</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Status */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Bookings by Status</CardTitle>
            <CardDescription>Distribution of booking statuses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.bookingsByStatus.length > 0 ? (
              data.bookingsByStatus.map((item, idx) => {
                const total = data.bookingsByStatus.reduce((sum, i) => sum + i.count, 0);
                const percentage = total > 0 ? (item.count / total * 100).toFixed(1) : 0;
                
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold capitalize">{item.status}</span>
                      <span className="text-slate-600 dark:text-slate-400">{item.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${statusColors[item.status] || 'bg-gray-500'} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-slate-500 py-8">No booking data available</p>
            )}
          </CardContent>
        </Card>

        {/* Weekly Bookings Trend */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Weekly Bookings Trend</CardTitle>
            <CardDescription>Last 7 days booking activity</CardDescription>
          </CardHeader>
          <CardContent>
            {data.weeklyBookings.length > 0 ? (
              <div className="space-y-4">
                {data.weeklyBookings.map((item, idx) => {
                  const maxCount = Math.max(...data.weeklyBookings.map(i => i.count));
                  const barWidth = maxCount > 0 ? (item.count / maxCount * 100) : 0;
                  
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">{new Date(item.date).toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                        <span className="text-slate-600 dark:text-slate-400">{item.count} bookings</span>
                      </div>
                      <div className="w-full h-8 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg transition-all duration-500 flex items-center justify-end px-3"
                          style={{ width: `${barWidth}%` }}
                        >
                          {item.count > 0 && (
                            <span className="text-white text-xs font-bold">{item.count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">No weekly data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Platform Health</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <div className="text-4xl font-black text-blue-600 mb-2">
              {data.totalBusinesses > 0 ? (data.totalBookings / data.totalBusinesses).toFixed(1) : 0}
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Avg Bookings per Business</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <div className="text-4xl font-black text-green-600 mb-2">
              {data.totalBookings > 0 ? ((data.totalRevenue / 100) / data.totalBookings).toFixed(0) : 0} RON
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Avg Booking Value</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
            <div className="text-4xl font-black text-purple-600 mb-2">
              {data.totalBusinesses > 0 ? ((data.activeSubscriptions / data.totalBusinesses) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Subscription Rate</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
