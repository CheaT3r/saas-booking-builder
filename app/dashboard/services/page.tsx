'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, Plus, Edit, Trash2, Sparkles, Briefcase, TrendingUp, Loader2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: string;
  imageUrl?: string;
}

const categoryColors: { [key: string]: string } = {
  "Hair": "from-blue-500 to-cyan-500",
  "Nails": "from-purple-500 to-pink-500",
  "Skincare": "from-green-500 to-emerald-500",
  "Wellness": "from-orange-500 to-red-500",
  "Beauty": "from-pink-500 to-rose-500",
  "Cleaning": "from-cyan-500 to-blue-500",
  "Treatment": "from-emerald-500 to-green-500",
  "Cosmetic": "from-rose-500 to-pink-500",
  "Consultation": "from-indigo-500 to-purple-500",
  "Beard": "from-amber-500 to-orange-500",
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    category: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const result = await response.json();

      if (result.success) {
        setServices(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load services",
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

  const handleCreateService = async () => {
    if (!formData.name || !formData.duration || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          duration: parseInt(formData.duration),
          price: parseFloat(formData.price),
          category: formData.category || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Service created successfully",
        });
        fetchServices();
        setCreateDialogOpen(false);
        setFormData({ name: '', description: '', duration: '', price: '', category: '' });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create service",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service",
        variant: "destructive",
      });
    }
  };

  const handleEditService = async () => {
    if (!selectedService || !formData.name || !formData.duration || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/services/${selectedService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          duration: parseInt(formData.duration),
          price: parseFloat(formData.price),
          category: formData.category || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Service updated successfully",
        });
        fetchServices();
        setEditDialogOpen(false);
        setSelectedService(null);
        setFormData({ name: '', description: '', duration: '', price: '', category: '' });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update service",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await fetch(`/api/services/${serviceToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Service deleted successfully",
        });
        fetchServices();
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete service",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration.toString(),
      price: service.price.toString(),
      category: service.category || '',
    });
    setEditDialogOpen(true);
  };

  // Calculate statistics
  const stats = {
    total: services.length,
    avgPrice: services.length > 0 ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length) : 0,
    totalDuration: services.reduce((sum, s) => sum + s.duration, 0),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 min-h-screen">
      {/* Premium Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-orange-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-xl">
                  <Briefcase className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  Servicii
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Gestionează serviciile tale
                </p>
              </div>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 h-12 px-8">
                  <Plus className="w-5 h-5" />
                  Serviciu Nou
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Serviciu Nou</DialogTitle>
                  <DialogDescription>Adaugă un serviciu nou în listă</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nume Serviciu *</Label>
                    <Input 
                      id="name" 
                      placeholder="Ex: Haircut & Styling" 
                      className="h-12 rounded-xl"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categorie</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Selectează categorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hair">Hair</SelectItem>
                        <SelectItem value="Nails">Nails</SelectItem>
                        <SelectItem value="Skincare">Skincare</SelectItem>
                        <SelectItem value="Wellness">Wellness</SelectItem>
                        <SelectItem value="Beauty">Beauty</SelectItem>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Treatment">Treatment</SelectItem>
                        <SelectItem value="Cleaning">Cleaning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descriere</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Descriere scurtă" 
                      className="rounded-xl" 
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Durată (min) *</Label>
                      <Input 
                        id="duration" 
                        type="number" 
                        placeholder="60" 
                        className="h-12 rounded-xl"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Preț (RON) *</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        placeholder="150" 
                        className="h-12 rounded-xl"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateService} className="bg-gradient-to-r from-purple-600 to-pink-600 h-12 px-8">Salvează</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative p-6 rounded-3xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20 shadow-xl hover:shadow-slate-500/20 dark:hover:shadow-slate-900/30 transition-all duration-300 group">
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Briefcase className="w-7 h-7" />
            </div>
          </div>
          <p className="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1 tracking-wide">Total Servicii</p>
          <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200">
            {stats.total}
          </h2>
        </Card>

        <Card className="relative p-6 rounded-3xl border-2 border-emerald-200/50 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20 shadow-xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-900/30 transition-all duration-300 group">
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-emerald-500/10 to-green-500/10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <DollarSign className="w-7 h-7" />
            </div>
          </div>
          <p className="text-sm uppercase font-semibold text-emerald-700 dark:text-emerald-300 mb-1 tracking-wide">Preț Mediu</p>
          <h2 className="text-4xl font-black text-emerald-600">
            {stats.avgPrice} RON
          </h2>
        </Card>

        <Card className="relative p-6 rounded-3xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20 shadow-xl hover:shadow-slate-500/20 dark:hover:shadow-slate-900/30 transition-all duration-300 group">
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
          </div>
          <p className="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1 tracking-wide">Durată Totală</p>
          <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200">
            {stats.totalDuration} min
          </h2>
        </Card>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <p className="text-xl font-semibold mb-2">No services found</p>
            <p className="text-slate-500 mb-4">Create your first service to get started</p>
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
        ) : (
          services.map((service, idx) => (
            <div key={service.id} className="group relative" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${service.category ? categoryColors[service.category] || 'from-slate-500 to-slate-600' : 'from-slate-500 to-slate-600'} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
              <Card className="relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-500 dark:hover:border-slate-500 shadow-xl hover:shadow-slate-500/20 transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start justify-between mb-4">
                  {service.category && (
                    <Badge className={`bg-gradient-to-r ${categoryColors[service.category] || 'from-slate-500 to-slate-600'} text-white border-0 shadow-lg`}>
                      {service.category}
                    </Badge>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-900/30"
                      onClick={() => openEditDialog(service)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => {
                        setServiceToDelete(service.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{service.duration} min</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-600">
                    {service.price} RON
                  </div>
                </div>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Editează Serviciu</DialogTitle>
            <DialogDescription>Modifică detaliile serviciului</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nume Serviciu *</Label>
              <Input 
                id="edit-name" 
                className="h-12 rounded-xl"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categorie</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Selectează categorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hair">Hair</SelectItem>
                  <SelectItem value="Nails">Nails</SelectItem>
                  <SelectItem value="Skincare">Skincare</SelectItem>
                  <SelectItem value="Wellness">Wellness</SelectItem>
                  <SelectItem value="Beauty">Beauty</SelectItem>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Treatment">Treatment</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descriere</Label>
              <Textarea 
                id="edit-description" 
                className="rounded-xl" 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Durată (min) *</Label>
                <Input 
                  id="edit-duration" 
                  type="number" 
                  className="h-12 rounded-xl"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Preț (RON) *</Label>
                <Input 
                  id="edit-price" 
                  type="number" 
                  className="h-12 rounded-xl"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditService} className="bg-gradient-to-r from-purple-600 to-pink-600 h-12 px-8">
              Update Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteService}
            >
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
