'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Mail, Phone, Edit, Trash2, Users, TrendingUp, Calendar, Loader2, AlertCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  bookingsCount: number;
  createdAt: Date;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredClients(
        clients.filter(client =>
          client.name.toLowerCase().includes(query) ||
          client.email?.toLowerCase().includes(query) ||
          client.phone?.includes(query)
        )
      );
    }
  }, [searchQuery, clients]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const result = await response.json();

      if (result.success) {
        setClients(result.data);
        setFilteredClients(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load clients",
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

  const handleCreateClient = async () => {
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          notes: formData.notes || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Client created successfully",
        });
        fetchClients();
        setCreateDialogOpen(false);
        setFormData({ name: '', email: '', phone: '', notes: '' });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create client",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create client",
        variant: "destructive",
      });
    }
  };

  const handleEditClient = async () => {
    if (!selectedClient || !formData.name) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          notes: formData.notes || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Client updated successfully",
        });
        fetchClients();
        setEditDialogOpen(false);
        setSelectedClient(null);
        setFormData({ name: '', email: '', phone: '', notes: '' });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update client",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      const response = await fetch(`/api/clients/${clientToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Client deleted successfully",
        });
        fetchClients();
        setDeleteDialogOpen(false);
        setClientToDelete(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete client",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      notes: client.notes || '',
    });
    setEditDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const totalBookings = clients.reduce((sum, client) => sum + (client.bookingsCount || 0), 0);
  const avgBookingsPerClient = clients.length > 0 ? (totalBookings / clients.length).toFixed(1) : '0';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-teal-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white shadow-xl">
                  <Users className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  Clienți
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Gestionează baza ta de clienți
                </p>
              </div>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 h-12 px-8">
                  <Plus className="w-5 h-5" />
                  Client Nou
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Client Nou</DialogTitle>
                  <DialogDescription>Adaugă un client nou în baza de date</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nume Complet *</Label>
                    <Input 
                      id="name" 
                      placeholder="Ex: Maria Ionescu" 
                      className="h-12 rounded-xl"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="email@example.com" 
                        className="h-12 rounded-xl"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+40 7XX XXX XXX" 
                        className="h-12 rounded-xl"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notițe</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Notițe despre client..." 
                      className="rounded-xl" 
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateClient} className="bg-gradient-to-r from-green-600 to-emerald-600 h-12 px-8">
                    Salvează
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative p-6 rounded-3xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20 shadow-xl hover:shadow-slate-500/20 dark:hover:shadow-slate-900/30 transition-all duration-300 group">
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
          </div>
          <p className="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1 tracking-wide">Total Clienți</p>
          <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200">
            {clients.length}
          </h2>
        </Card>

        <Card className="relative p-6 rounded-3xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20 shadow-xl hover:shadow-slate-500/20 dark:hover:shadow-slate-900/30 transition-all duration-300 group">
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>
          </div>
          <p className="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1 tracking-wide">Total Programări</p>
          <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200">
            {totalBookings}
          </h2>
        </Card>

        <Card className="relative p-6 rounded-3xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20 shadow-xl hover:shadow-slate-500/20 dark:hover:shadow-slate-900/30 transition-all duration-300 group">
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>
          <p className="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1 tracking-wide">Medie Programări/Client</p>
          <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200">
            {avgBookingsPerClient}
          </h2>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Caută după nume, email sau telefon..."
          className="pl-12 h-14 rounded-2xl text-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 focus:border-slate-500 dark:focus:border-slate-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length === 0 ? (
          <div className="col-span-full text-center py-12">
            {searchQuery ? (
              <>
                <Search className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-xl font-semibold mb-2">Nu s-au găsit clienți</p>
                <p className="text-slate-500 mb-4">Încearcă un alt termen de căutare</p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Resetează căutarea
                </Button>
              </>
            ) : (
              <>
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-xl font-semibold mb-2">Nu ai clienți adăugați</p>
                <p className="text-slate-500 mb-4">Adaugă primul tău client pentru a începe</p>
                <Button 
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adaugă Client
                </Button>
              </>
            )}
          </div>
        ) : (
          filteredClients.map((client, idx) => (
            <div key={client.id} className="group relative" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Card className="relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-500 dark:hover:border-slate-500 shadow-xl hover:shadow-slate-500/20 transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-16 w-16 border-2 border-slate-500">
                    <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-white text-xl font-bold">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-900/30"
                      onClick={() => openEditDialog(client)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => {
                        setClientToDelete(client.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-1">{client.name}</h3>
                <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0 shadow-lg mb-3">
                  {client.bookingsCount} Programări
                </Badge>

                {client.notes && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {client.notes}
                  </p>
                )}

                <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Mail className="w-4 h-4 text-slate-600" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Phone className="w-4 h-4 text-slate-600" />
                      <span>{client.phone}</span>
                    </div>
                  )}
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
            <DialogTitle className="text-2xl font-bold">Editează Client</DialogTitle>
            <DialogDescription>Modifică informațiile clientului</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nume Complet *</Label>
              <Input 
                id="edit-name" 
                className="h-12 rounded-xl"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  className="h-12 rounded-xl"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefon</Label>
                <Input 
                  id="edit-phone" 
                  type="tel" 
                  className="h-12 rounded-xl"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notițe</Label>
              <Textarea 
                id="edit-notes" 
                className="rounded-xl" 
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditClient} className="bg-gradient-to-r from-green-600 to-emerald-600 h-12 px-8">
              Update Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteClient}
            >
              Delete Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
