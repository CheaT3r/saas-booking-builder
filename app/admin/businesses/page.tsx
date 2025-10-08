'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Building2, TrendingUp, CheckCircle2, AlertCircle, Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  tagline?: string; // Used as industry
  email?: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  createdAt: Date;
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [businessToDelete, setBusinessToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    industry: '', // Maps to tagline
    contactEmail: '', // Maps to email
    contactPhone: '', // Maps to phone
    address: '',
  });

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBusinesses(businesses);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredBusinesses(
        businesses.filter(business =>
          business.name.toLowerCase().includes(query) ||
          business.slug.toLowerCase().includes(query) ||
          business.tagline?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, businesses]);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch('/api/admin/businesses');
      const result = await response.json();

      if (result.success) {
        setBusinesses(result.data);
        setFilteredBusinesses(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load businesses",
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

  const handleCreateBusiness = async () => {
    if (!formData.name || !formData.slug) {
      toast({
        title: "Validation Error",
        description: "Name and slug are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Business created successfully",
        });
        fetchBusinesses();
        setCreateDialogOpen(false);
        setFormData({
          name: '',
          slug: '',
          description: '',
          industry: '',
          contactEmail: '',
          contactPhone: '',
          address: '',
          isActive: true,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create business",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create business",
        variant: "destructive",
      });
    }
  };

  const handleEditBusiness = async () => {
    if (!selectedBusiness || !formData.name || !formData.slug) {
      toast({
        title: "Validation Error",
        description: "Name and slug are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/businesses/${selectedBusiness.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Business updated successfully",
        });
        fetchBusinesses();
        setEditDialogOpen(false);
        setSelectedBusiness(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update business",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBusiness = async () => {
    if (!businessToDelete) return;

    try {
      const response = await fetch(`/api/admin/businesses/${businessToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Business deleted successfully",
        });
        fetchBusinesses();
        setDeleteDialogOpen(false);
        setBusinessToDelete(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete business",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete business",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (business: Business) => {
    setSelectedBusiness(business);
    setFormData({
      name: business.name,
      slug: business.slug,
      description: business.description || '',
      industry: business.tagline || '',
      contactEmail: business.email || '',
      contactPhone: business.phone || '',
      address: business.address || '',
    });
    setEditDialogOpen(true);
  };

  // For stats: all businesses are considered active since we don't have isActive field
  const activeCount = businesses.length;
  const inactiveCount = 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-950 dark:via-purple-950/20 dark:to-pink-950/20 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-red-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-xl">
                  <Building2 className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  Businesses Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Manage all registered businesses
                </p>
              </div>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 h-12 px-8">
                  <Plus className="w-5 h-5" />
                  Add Business
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Add New Business</DialogTitle>
                  <DialogDescription>Register a new business on the platform</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Business Name *</Label>
                      <Input
                        placeholder="Salon Modern"
                        className="h-12 rounded-xl"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug *</Label>
                      <Input
                        placeholder="salon-modern"
                        className="h-12 rounded-xl"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beauty">Beauty & Wellness</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Barbershop">Barbershop</SelectItem>
                        <SelectItem value="Spa">Spa & Massage</SelectItem>
                        <SelectItem value="Fitness">Fitness & Gym</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Brief description..."
                      className="rounded-xl"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contact Email</Label>
                      <Input
                        type="email"
                        placeholder="contact@business.com"
                        className="h-12 rounded-xl"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <Input
                        type="tel"
                        placeholder="+40 7XX XXX XXX"
                        className="h-12 rounded-xl"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      placeholder="Street, City, Country"
                      className="h-12 rounded-xl"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateBusiness} className="bg-gradient-to-r from-purple-600 to-pink-600 h-12 px-8">
                    Create Business
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative p-6 rounded-3xl border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-10 h-10 text-purple-600" />
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Total Businesses</p>
          <p className="text-3xl font-black mt-2">{businesses.length}</p>
        </Card>

        <Card className="relative p-6 rounded-3xl border-2 border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">Active</p>
          <p className="text-3xl font-black mt-2 text-green-600">{activeCount}</p>
        </Card>

        <Card className="relative p-6 rounded-3xl border-2 border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-300 uppercase tracking-wide">Inactive</p>
          <p className="text-3xl font-black mt-2 text-red-600">{inactiveCount}</p>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Search businesses by name, slug, or industry..."
          className="pl-12 h-14 rounded-2xl text-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 focus:border-purple-500 dark:focus:border-purple-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Businesses List */}
      <div className="space-y-4">
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <>
                <Search className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-xl font-semibold mb-2">No businesses found</p>
                <p className="text-slate-500 mb-4">Try a different search term</p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-xl font-semibold mb-2">No businesses yet</p>
                <p className="text-slate-500 mb-4">Add your first business to get started</p>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Business
                </Button>
              </>
            )}
          </div>
        ) : (
          filteredBusinesses.map((business, idx) => (
            <div key={business.id} className="group relative" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-3xl transition-all duration-500" />
              <Card className="relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{business.name}</h3>
                      {business.tagline && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                          {business.tagline}
                        </Badge>
                      )}
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <code className="text-sm px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400">
                      /book/{business.slug}
                    </code>
                    {business.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 line-clamp-2">
                        {business.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-600 dark:text-slate-400">
                      {business.email && <span>📧 {business.email}</span>}
                      {business.phone && <span>📞 {business.phone}</span>}
                      {business.address && <span>📍 {business.address}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 px-4 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      onClick={() => openEditDialog(business)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => {
                        setBusinessToDelete(business.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Business</DialogTitle>
            <DialogDescription>Update business information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Business Name *</Label>
                <Input
                  className="h-12 rounded-xl"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  className="h-12 rounded-xl"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beauty">Beauty & Wellness</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Barbershop">Barbershop</SelectItem>
                  <SelectItem value="Spa">Spa & Massage</SelectItem>
                  <SelectItem value="Fitness">Fitness & Gym</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                className="rounded-xl"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  className="h-12 rounded-xl"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone</Label>
                <Input
                  type="tel"
                  className="h-12 rounded-xl"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                className="h-12 rounded-xl"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditBusiness} className="bg-gradient-to-r from-purple-600 to-pink-600 h-12 px-8">
              Update Business
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
              Are you sure you want to delete this business? This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteBusiness}
            >
              Delete Business
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
