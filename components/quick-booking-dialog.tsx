"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ro } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface Staff {
  id: string;
  name: string;
}

interface QuickBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickBookingDialog({ open, onOpenChange }: QuickBookingDialogProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    serviceId: '',
    clientId: '',
    staffId: '',
    time: '09:00',
    notes: '',
  });

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      const [servicesRes, clientsRes, staffRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/clients'),
        fetch('/api/staff'),
      ]);

      const [servicesData, clientsData, staffData] = await Promise.all([
        servicesRes.json(),
        clientsRes.json(),
        staffRes.json(),
      ]);

      if (servicesData.success) setServices(servicesData.data);
      if (clientsData.success) setClients(clientsData.data);
      if (staffData.success) setStaff(staffData.data);
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca datele necesare",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.serviceId || !formData.clientId || !date || !formData.time) {
      toast({
        title: "Validare",
        description: "Te rog completează toate câmpurile obligatorii",
        variant: "destructive",
      });
      return;
    }

    const selectedService = services.find(s => s.id === formData.serviceId);
    if (!selectedService) return;

    const [hours, minutes] = formData.time.split(':').map(Number);
    const startTime = new Date(date);
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + selectedService.duration);

    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: formData.serviceId,
          clientId: formData.clientId,
          staffId: formData.staffId || null,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          notes: formData.notes || null,
          priceAtBooking: selectedService.price,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Programare creată!",
          description: "Programarea a fost adăugată cu succes",
        });
        onOpenChange(false);
        setFormData({
          serviceId: '',
          clientId: '',
          staffId: '',
          time: '09:00',
          notes: '',
        });
        setDate(undefined);
        
        // Reload page to show new booking
        window.location.reload();
      } else {
        toast({
          title: "Eroare",
          description: result.error || "Nu s-a putut crea programarea",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut crea programarea",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Programare Rapidă</DialogTitle>
          <DialogDescription>Creează o programare nouă rapid</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="service">Serviciu *</Label>
            <Select value={formData.serviceId} onValueChange={(value) => setFormData({ ...formData, serviceId: value })}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selectează serviciul" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - {service.duration} min - {service.price / 100} RON
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client *</Label>
            <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selectează clientul" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                    {client.phone && ` - ${client.phone}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff">Personal (opțional)</Label>
            <Select value={formData.staffId} onValueChange={(value) => setFormData({ ...formData, staffId: value })}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selectează membrul echipei" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Fără preferință</SelectItem>
                {staff.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 rounded-xl justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ro }) : <span>Alege data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={ro}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Ora *</Label>
              <Input
                id="time"
                type="time"
                className="h-12 rounded-xl"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notițe (opțional)</Label>
            <Input
              id="notes"
              placeholder="Notițe adiționale..."
              className="h-12 rounded-xl"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Anulează
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-12 px-8"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Creează Programare
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}



