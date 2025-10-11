'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, DollarSign, MapPin, Phone, Mail, Globe, User, CheckCircle2, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface Business {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  workingHours: Record<string, { open: string; close: string; closed: boolean }> | null;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  category: string | null;
  imageUrl: string | null;
}

interface Staff {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  specialty: string | null;
}

interface Props {
  business: Business;
  services: Service[];
  staff: Staff[];
}

export default function BookingPageClient({ business, services, staff }: Props) {
  const { toast } = useToast();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setBookingDialogOpen(true);
  };

  const handleSubmitBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientData.name || !clientData.phone) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First, create or find the client
      const clientResponse = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          notes: clientData.notes,
        }),
      });

      const clientResult = await clientResponse.json();

      if (!clientResult.success) {
        throw new Error('Failed to create client');
      }

      const clientId = clientResult.data.id;

      // Create the booking
      const [hours, minutes] = selectedTime.split(':');
      const startTime = new Date(selectedDate);
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + selectedService.duration);

      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          clientId: clientId,
          serviceId: selectedService.id,
          staffId: selectedStaff?.id || null,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          status: 'pending',
          notes: clientData.notes,
          priceAtBooking: selectedService.price,
        }),
      });

      const bookingResult = await bookingResponse.json();

      if (bookingResult.success) {
        toast({
          title: "Booking Confirmed! 🎉",
          description: `Your appointment for ${selectedService.name} has been scheduled for ${format(selectedDate, 'PPP')} at ${selectedTime}`,
        });
        setBookingDialogOpen(false);
        // Reset form
        setSelectedService(null);
        setSelectedStaff(null);
        setSelectedDate(undefined);
        setSelectedTime('');
        setClientData({ name: '', email: '', phone: '', notes: '' });
      } else {
        throw new Error(bookingResult.error || 'Failed to create booking');
      }
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: (err as Error).message || "Failed to create your booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate available time slots
  const generateTimeSlots = () => {
    if (!selectedDate) return [];

    const dayName = format(selectedDate, 'EEEE').toLowerCase();
    const workingDay = business.workingHours?.[dayName];

    if (!workingDay || workingDay.closed) return [];

    const slots: string[] = [];
    const [openHour, openMin] = workingDay.open.split(':').map(Number);
    const [closeHour, closeMin] = workingDay.close.split(':').map(Number);

    let currentHour = openHour;
    let currentMin = openMin;

    while (currentHour < closeHour || (currentHour === closeHour && currentMin < closeMin)) {
      const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      slots.push(timeString);

      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour += 1;
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20"
      style={{
        '--primary-color': business.primaryColor || '#3b82f6',
        '--accent-color': business.accentColor || '#8b5cf6',
      } as React.CSSProperties}
    >
      {/* Header/Hero Section */}
      <div className="relative h-80 overflow-hidden">
        {business.coverImageUrl ? (
          <img src={business.coverImageUrl} alt={business.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            {business.logoUrl && (
              <img src={business.logoUrl} alt={business.name} className="w-20 h-20 rounded-2xl bg-white p-2 shadow-xl" />
            )}
            <div>
              <h1 className="text-5xl font-black mb-2">{business.name}</h1>
              {business.tagline && (
                <p className="text-xl text-white/90">{business.tagline}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="@container/main max-w-7xl mx-auto p-4 md:p-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">About Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {business.description && (
                  <p className="text-slate-600 dark:text-slate-400">{business.description}</p>
                )}
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {business.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span className="text-sm">{business.address}</span>
                    </div>
                  )}
                  {business.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-green-600" />
                      <a href={`tel:${business.phone}`} className="text-sm hover:underline">{business.phone}</a>
                    </div>
                  )}
                  {business.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-red-600" />
                      <a href={`mailto:${business.email}`} className="text-sm hover:underline">{business.email}</a>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-purple-600" />
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                        {business.website}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Working Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {business.workingHours && Object.entries(business.workingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <span className="font-semibold capitalize">{day}</span>
                      {hours.closed ? (
                        <span className="text-red-600">Closed</span>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400">{hours.open} - {hours.close}</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Staff */}
            {staff.length > 0 && (
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Our Team
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {staff.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        {member.specialty && (
                          <p className="text-xs text-slate-500">{member.specialty}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Services */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                ✨
              </span>
              Our Services
            </h2>
            {services.length === 0 ? (
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
                <CardContent className="text-center py-12">
                  <p className="text-xl text-slate-500">No services available at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, idx) => (
                  <Card 
                    key={service.id} 
                    className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {service.imageUrl && (
                      <div className="h-48 overflow-hidden rounded-t-xl">
                        <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">{service.name}</CardTitle>
                      {service.category && (
                        <Badge className="w-fit bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-0">
                          {service.category}
                        </Badge>
                      )}
                      {service.description && (
                        <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1 text-2xl font-black text-blue-600">
                          <DollarSign className="w-5 h-5" />
                          <span>{(service.price / 100).toFixed(0)} RON</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleServiceSelect(service)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg h-12"
                      >
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Book Appointment</DialogTitle>
            <DialogDescription>
              {selectedService && `${selectedService.name} - ${selectedService.duration} min - ${(selectedService.price / 100).toFixed(0)} RON`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Select Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-12 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            {selectedDate && timeSlots.length > 0 && (
              <div className="space-y-2">
                <Label>Select Time *</Label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTime === slot ? "default" : "outline"}
                      className="h-10"
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && timeSlots.length === 0 && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
                <p className="text-red-700 dark:text-red-400 font-semibold">Business is closed on this day</p>
              </div>
            )}

            {/* Staff Selection */}
            {staff.length > 0 && (
              <div className="space-y-2">
                <Label>Select Staff Member (Optional)</Label>
                <div className="grid grid-cols-1 gap-2">
                  {staff.map((member) => (
                    <Button
                      key={member.id}
                      variant={selectedStaff?.id === member.id ? "default" : "outline"}
                      className="h-auto py-3 justify-start"
                      onClick={() => setSelectedStaff(member)}
                    >
                      <div className="flex items-center gap-3">
                        {member.avatarUrl ? (
                          <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div className="text-left">
                          <p className="font-semibold">{member.name}</p>
                          {member.specialty && <p className="text-xs text-slate-500">{member.specialty}</p>}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Client Information */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-bold">Your Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    placeholder="John Doe"
                    className="h-12 rounded-xl"
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input
                    placeholder="+40 7XX XXX XXX"
                    className="h-12 rounded-xl"
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email (Optional)</Label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="h-12 rounded-xl"
                  value={clientData.email}
                  onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Any special requests or notes..."
                  className="rounded-xl"
                  rows={3}
                  value={clientData.notes}
                  onChange={(e) => setClientData({ ...clientData, notes: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmitBooking}
              disabled={isSubmitting || !selectedDate || !selectedTime || !clientData.name || !clientData.phone}
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-12 px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}



