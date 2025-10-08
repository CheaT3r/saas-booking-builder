'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Plus, Filter, Search, CheckCircle2, XCircle, Edit, Trash2, Loader2, AlertCircle, TrendingUp, DollarSign, CalendarDays } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: string;
  date: string;
  time: string;
  client: string;
  clientEmail?: string;
  clientPhone?: string;
  service: string;
  serviceCategory?: string;
  staff: string;
  price: number;
  status: string;
  notes?: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg shadow-green-500/30"><CheckCircle2 className="w-3 h-3 mr-1" />Confirmed</Badge>;
    case "pending":
      return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg shadow-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    case "cancelled":
      return <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg shadow-red-500/30"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
    case "completed":
      return <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/30"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const result = await response.json();

      if (result.success) {
        setBookings(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load bookings",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;

    try {
      const response = await fetch(`/api/bookings/${bookingToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Booking deleted successfully",
        });
        fetchBookings(); // Refresh list
        setDeleteDialogOpen(false);
        setBookingToDelete(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Booking status updated",
        });
        fetchBookings(); // Refresh list
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === "all" || booking.status === filter;
    const matchesSearch = booking.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.price, 0),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 min-h-screen">
      {/* Premium Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-xl">
                  <Calendar className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  Programări
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Gestionează toate programările tale
                </p>
              </div>
            </div>
            <Button 
              onClick={() => toast({ title: "Coming Soon", description: "Create booking feature will be available soon" })}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 h-12 px-8"
            >
              <Plus className="w-5 h-5" />
              Programare Nouă
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative p-6 rounded-3xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20 shadow-xl hover:shadow-slate-500/20 dark:hover:shadow-slate-900/30 transition-all duration-300 group">
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <CalendarDays className="w-7 h-7" />
            </div>
          </div>
          <p className="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1 tracking-wide">Total Programări</p>
          <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200">
            {stats.total}
          </h2>
        </Card>

        <Card className="relative p-6 rounded-3xl border-2 border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-xl hover:shadow-green-500/20 dark:hover:shadow-green-900/30 transition-all duration-300 group">
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-green-500/10 to-emerald-500/10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </div>
          <p className="text-sm uppercase font-semibold text-green-700 dark:text-green-300 mb-1 tracking-wide">Confirmate</p>
          <h2 className="text-4xl font-black text-green-600">
            {stats.confirmed}
          </h2>
        </Card>

        <Card className="relative p-6 rounded-3xl border-2 border-yellow-200/50 dark:border-yellow-800/50 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20 shadow-xl hover:shadow-yellow-500/20 dark:hover:shadow-yellow-900/30 transition-all duration-300 group">
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-yellow-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
          </div>
          <p className="text-sm uppercase font-semibold text-yellow-700 dark:text-yellow-300 mb-1 tracking-wide">În Așteptare</p>
          <h2 className="text-4xl font-black text-yellow-600">
            {stats.pending}
          </h2>
        </Card>

        <Card className="relative p-6 rounded-3xl border-2 border-emerald-200/50 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20 shadow-xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-900/30 transition-all duration-300 group">
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-emerald-500/10 to-green-500/10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <DollarSign className="w-7 h-7" />
            </div>
          </div>
          <p className="text-sm uppercase font-semibold text-emerald-700 dark:text-emerald-300 mb-1 tracking-wide">Venit Total</p>
          <h2 className="text-4xl font-black text-emerald-600">
            {stats.totalRevenue.toLocaleString()} RON
          </h2>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Caută client sau serviciu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 pl-12 rounded-xl border-2 focus:border-slate-500"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border-2">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Bookings List */}
      <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <p className="text-xl font-semibold mb-2">No bookings found</p>
              <p className="text-slate-500">Try adjusting your filters or create a new booking</p>
            </div>
          ) : (
            filteredBookings.map((booking, idx) => (
              <div
                key={booking.id}
                className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-500 dark:hover:border-slate-500 bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Client</p>
                    <p className="font-bold text-lg flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-600" />
                      {booking.client}
                    </p>
                    {booking.clientPhone && (
                      <p className="text-xs text-slate-500">{booking.clientPhone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Service</p>
                    <p className="font-semibold">{booking.service}</p>
                    {booking.serviceCategory && (
                      <Badge variant="outline" className="mt-1">{booking.serviceCategory}</Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Date & Time</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {booking.date}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {booking.time}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
                  <div className="flex flex-col items-end">
                    {getStatusBadge(booking.status)}
                    <p className="font-bold text-xl mt-2">{booking.price} RON</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={booking.status} onValueChange={(value) => handleUpdateStatus(booking.id, value)}>
                      <SelectTrigger className="h-10 w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => {
                        setBookingToDelete(booking.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteBooking}
            >
              Delete Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
