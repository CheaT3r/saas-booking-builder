'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Mail, Phone, Edit, Trash2, Users, TrendingUp, Star, Loader2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Staff {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  specialty?: string;
  bio?: string;
  avatarUrl?: string;
  userId?: string | null;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignRoleDialogOpen, setAssignRoleDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const [staffForRole, setStaffForRole] = useState<Staff | null>(null);
  const [isAssigningRole, setIsAssigningRole] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    bio: '',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      const result = await response.json();

      if (result.success) {
        setStaff(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load staff",
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

  const handleCreateStaff = async () => {
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          specialty: formData.specialty || null,
          bio: formData.bio || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Staff member created successfully",
        });
        fetchStaff();
        setCreateDialogOpen(false);
        setFormData({ name: '', email: '', phone: '', specialty: '', bio: '' });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create staff member",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create staff member",
        variant: "destructive",
      });
    }
  };

  const handleEditStaff = async () => {
    if (!selectedStaff || !formData.name) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/staff/${selectedStaff.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          specialty: formData.specialty || null,
          bio: formData.bio || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Staff member updated successfully",
        });
        fetchStaff();
        setEditDialogOpen(false);
        setSelectedStaff(null);
        setFormData({ name: '', email: '', phone: '', specialty: '', bio: '' });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update staff member",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update staff member",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;

    try {
      const response = await fetch(`/api/staff/${staffToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Staff member deleted successfully",
        });
        fetchStaff();
        setDeleteDialogOpen(false);
        setStaffToDelete(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete staff member",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
    }
  };

  const handleAssignRole = async () => {
    if (!staffForRole || !staffForRole.email) {
      toast({
        title: "Validation Error",
        description: "Staff member must have an email address to assign a role",
        variant: "destructive",
      });
      return;
    }

    setIsAssigningRole(true);

    try {
      const response = await fetch(`/api/staff/${staffForRole.id}/assign-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: staffForRole.email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Rol Atribuit!",
          description: `${staffForRole.name} are acum acces la dashboard ca angajat.`,
        });
        fetchStaff();
        setAssignRoleDialogOpen(false);
        setStaffForRole(null);
      } else {
        toast({
          title: "Eroare",
          description: result.error || "Nu s-a putut atribui rolul. Asigură-te că utilizatorul s-a înregistrat cu acest email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut conecta la server",
        variant: "destructive",
      });
    } finally {
      setIsAssigningRole(false);
    }
  };

  const handleRevokeRole = async (staffMember: Staff) => {
    if (!staffMember.userId) return;

    try {
      const response = await fetch(`/api/staff/${staffMember.id}/assign-role`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Rol Revocat",
          description: `${staffMember.name} nu mai are acces la dashboard.`,
        });
        fetchStaff();
      } else {
        toast({
          title: "Eroare",
          description: result.error || "Nu s-a putut revoca rolul",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut conecta la server",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email || '',
      phone: staffMember.phone || '',
      specialty: staffMember.specialty || '',
      bio: staffMember.bio || '',
    });
    setEditDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-red-600/10 to-pink-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-white shadow-xl">
                  <Users className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  Personal
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Gestionează echipa ta
                </p>
              </div>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg shadow-orange-500/30 h-12 px-8">
                  <Plus className="w-5 h-5" />
                  Membru Nou
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Membru Nou</DialogTitle>
                  <DialogDescription>Adaugă un membru nou în echipă</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nume Complet *</Label>
                    <Input 
                      id="name" 
                      placeholder="Ex: Ion Popescu" 
                      className="h-12 rounded-xl"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specializare</Label>
                    <Input 
                      id="specialty" 
                      placeholder="Ex: Hair Stylist Senior" 
                      className="h-12 rounded-xl"
                      value={formData.specialty}
                      onChange={(e) => setFormData({...formData, specialty: e.target.value})}
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
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Scurtă descriere..." 
                      className="rounded-xl" 
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateStaff} className="bg-gradient-to-r from-orange-600 to-red-600 h-12 px-8">
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
          <p className="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1 tracking-wide">Total Personal</p>
          <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200">
            {staff.length}
          </h2>
        </Card>

        <Card className="relative p-6 rounded-3xl border-2 border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-xl hover:shadow-green-500/20 dark:hover:shadow-green-900/30 transition-all duration-300 group">
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-green-500/10 to-emerald-500/10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7" />
            </div>
          </div>
          <p className="text-sm uppercase font-semibold text-green-700 dark:text-green-300 mb-1 tracking-wide">Activi</p>
          <h2 className="text-4xl font-black text-green-600">
            {staff.length}
          </h2>
        </Card>

        <Card className="relative p-6 rounded-3xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20 shadow-xl hover:shadow-slate-500/20 dark:hover:shadow-slate-900/30 transition-all duration-300 group">
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Mail className="w-7 h-7" />
            </div>
          </div>
          <p className="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1 tracking-wide">Cu Email</p>
          <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200">
            {staff.filter(s => s.email).length}
          </h2>
        </Card>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <p className="text-xl font-semibold mb-2">No staff members found</p>
            <p className="text-slate-500 mb-4">Add your first team member to get started</p>
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              className="bg-gradient-to-r from-orange-600 to-red-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </div>
        ) : (
          staff.map((member, idx) => (
            <div key={member.id} className="group relative" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Card className="relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-500 dark:hover:border-slate-500 shadow-xl hover:shadow-slate-500/20 transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-16 w-16 border-2 border-slate-500">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-white text-xl font-bold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-900/30"
                      onClick={() => openEditDialog(member)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => {
                        setStaffToDelete(member.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  {member.userId ? (
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800">
                      👤 Are Cont
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-500">
                      Fără Cont
                    </Badge>
                  )}
                </div>

                {member.specialty && (
                  <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0 shadow-lg mb-3">
                    {member.specialty}
                  </Badge>
                )}

                {member.bio && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {member.bio}
                  </p>
                )}

                <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {member.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Mail className="w-4 h-4 text-slate-600" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Phone className="w-4 h-4 text-slate-600" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>

                {/* Employee Access Control */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {member.userId ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-10 text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => handleRevokeRole(member)}
                    >
                      🔒 Revocă Acces Dashboard
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-10 border-green-300 hover:bg-green-50 dark:hover:bg-green-950/30"
                      onClick={() => {
                        setStaffForRole(member);
                        setAssignRoleDialogOpen(true);
                      }}
                      disabled={!member.email}
                    >
                      🔓 Oferă Acces Dashboard
                    </Button>
                  )}
                  {!member.email && (
                    <p className="text-xs text-slate-500 mt-2 text-center">
                      Adaugă un email pentru a oferi acces
                    </p>
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
            <DialogTitle className="text-2xl font-bold">Editează Membru</DialogTitle>
            <DialogDescription>Modifică informațiile membrului echipei</DialogDescription>
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
            <div className="space-y-2">
              <Label htmlFor="edit-specialty">Specializare</Label>
              <Input 
                id="edit-specialty" 
                className="h-12 rounded-xl"
                value={formData.specialty}
                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
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
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea 
                id="edit-bio" 
                className="rounded-xl" 
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditStaff} className="bg-gradient-to-r from-orange-600 to-red-600 h-12 px-8">
              Update Staff Member
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
              Are you sure you want to delete this staff member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteStaff}
            >
              Delete Staff Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Role Dialog */}
      <Dialog open={assignRoleDialogOpen} onOpenChange={setAssignRoleDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">🔓 Oferă Acces Dashboard</DialogTitle>
            <DialogDescription>
              Atribuie rolul de angajat pentru a permite accesul la dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {staffForRole && (
              <>
                <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-4 mb-3">
                    <Avatar className="h-12 w-12 border-2 border-orange-500">
                      <AvatarImage src={staffForRole.avatarUrl} alt={staffForRole.name} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-600 to-red-600 text-white font-bold">
                        {getInitials(staffForRole.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">{staffForRole.name}</p>
                      {staffForRole.specialty && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">{staffForRole.specialty}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-orange-600" />
                    <span className="font-mono text-slate-700 dark:text-slate-300">{staffForRole.email}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Ce primește angajatul:</h4>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Acces la dashboard-ul business-ului</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Poate vedea și gestiona propriile programări</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Poate vizualiza serviciile și staff-ul (read-only)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">✗</span>
                      <span>NU poate modifica setările business-ului</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Notă:</strong> Angajatul trebuie să se înregistreze pe platformă folosind emailul <strong>{staffForRole.email}</strong> înainte de a putea accesa dashboard-ul.
                  </p>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAssignRoleDialogOpen(false);
              setStaffForRole(null);
            }}>
              Anulează
            </Button>
            <Button 
              onClick={handleAssignRole}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 px-8"
              disabled={isAssigningRole}
            >
              {isAssigningRole ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Se atribuie...
                </>
              ) : (
                <>
                  🔓 Oferă Acces
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
