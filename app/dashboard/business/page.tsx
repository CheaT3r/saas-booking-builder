'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Building2, Edit, Trash2, Plus, Loader2, XCircle, Globe, ExternalLink, Calendar } from "lucide-react"
import { format } from 'date-fns'
import Link from 'next/link'

interface Business {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function BusinessManagementPage() {
  const { toast } = useToast();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6',
  });

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/business');
      const result = await response.json();
      if (result.success) {
        setBusinesses(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch businesses');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'An unexpected error occurred');
      toast({
        variant: "destructive",
        title: "Error loading businesses",
        description: (err as Error).message || "Failed to load businesses.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      tagline: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      primaryColor: '#3b82f6',
      accentColor: '#8b5cf6',
    });
  };

  const handleCreateBusiness = async () => {
    try {
      const response = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "Business created!",
          description: `${result.data.name} has been created successfully.`,
        });
        setCreateDialogOpen(false);
        resetForm();
        fetchBusinesses();
      } else {
        throw new Error(result.error || 'Failed to create business');
      }
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Error creating business",
        description: (err as Error).message || "Failed to create business.",
      });
    }
  };

  const handleUpdateBusiness = async () => {
    if (!selectedBusiness) return;
    try {
      const response = await fetch(`/api/business/${selectedBusiness.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "Business updated!",
          description: `${result.data.name} has been updated successfully.`,
        });
        setEditDialogOpen(false);
        setSelectedBusiness(null);
        resetForm();
        fetchBusinesses();
      } else {
        throw new Error(result.error || 'Failed to update business');
      }
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Error updating business",
        description: (err as Error).message || "Failed to update business.",
      });
    }
  };

  const handleDeleteBusiness = async () => {
    if (!selectedBusiness) return;
    try {
      const response = await fetch(`/api/business/${selectedBusiness.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "Business deleted!",
          description: "Business has been deleted successfully.",
        });
        setDeleteDialogOpen(false);
        setSelectedBusiness(null);
        fetchBusinesses();
      } else {
        throw new Error(result.error || 'Failed to delete business');
      }
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Error deleting business",
        description: (err as Error).message || "Failed to delete business.",
      });
    }
  };

  const openEditDialog = (business: Business) => {
    setSelectedBusiness(business);
    setFormData({
      name: business.name,
      tagline: business.tagline || '',
      description: business.description || '',
      email: business.email || '',
      phone: business.phone || '',
      address: business.address || '',
      website: business.website || '',
      primaryColor: business.primaryColor,
      accentColor: business.accentColor,
    });
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading businesses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen text-red-500">
        <XCircle className="h-16 w-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error loading businesses</h2>
        <p className="text-lg">{error}</p>
        <Button onClick={fetchBusinesses} className="mt-6">Retry</Button>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-xl">
                  <Building2 className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  Business Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Manage your business profiles and settings
                </p>
              </div>
            </div>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 h-12 px-8"
            >
              <Plus className="w-5 h-5" />
              Create Business
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative p-6 rounded-3xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20 shadow-xl hover:shadow-slate-500/20 dark:hover:shadow-slate-900/30 transition-all duration-300 group">
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Building2 className="w-7 h-7" />
            </div>
          </div>
          <p className="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1 tracking-wide">Total Businesses</p>
          <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200">
            {businesses.length}
          </h2>
        </Card>
      </div>

      {/* Businesses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {businesses.map((business, idx) => (
          <div key={business.id} className="group relative" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-3xl transition-all duration-500" />
            <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-500 dark:hover:border-slate-500 shadow-xl hover:shadow-slate-500/20 transition-all duration-300 overflow-hidden">
              {/* Header with Gradient */}
              <div className="h-24" style={{ background: `linear-gradient(135deg, ${business.primaryColor}, ${business.accentColor})` }} />
              
              <CardHeader className="-mt-12 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 shadow-xl flex items-center justify-center">
                    {business.logoUrl ? (
                      <img src={business.logoUrl} alt={business.name} className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      <Building2 className="w-10 h-10" style={{ color: business.primaryColor }} />
                    )}
                  </div>
                  <Badge className="bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-0">
                    {business.tagline || 'Business'}
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold mt-4">{business.name}</CardTitle>
                <CardDescription className="line-clamp-2">{business.description || 'No description provided'}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Business Info */}
                <div className="space-y-2 text-sm">
                  {business.email && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Email:</span>
                      <span className="truncate">{business.email}</span>
                    </div>
                  )}
                  {business.phone && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Phone:</span>
                      <span>{business.phone}</span>
                    </div>
                  )}
                </div>

                {/* Public Page Link */}
                <Link href={`/book/${business.slug}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full gap-2 hover:bg-slate-50 dark:hover:bg-slate-950/30 border-slate-300 dark:border-slate-700">
                    <Globe className="w-4 h-4" />
                    View Public Page
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>

                {/* Dates */}
                <div className="flex items-center gap-4 pt-4 border-t text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Created {format(new Date(business.createdAt), 'dd MMM yyyy')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(business)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 border-red-300 dark:border-red-800"
                    onClick={() => {
                      setSelectedBusiness(business);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Business</DialogTitle>
            <DialogDescription>Add a new business profile to your account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  placeholder="My Awesome Business"
                  className="h-12 rounded-xl mt-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="tagline">Tagline / Industry</Label>
                <Input
                  id="tagline"
                  placeholder="e.g. Veterinary Clinic"
                  className="h-12 rounded-xl mt-2"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your business..."
                  className="rounded-xl mt-2"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@business.com"
                  className="h-12 rounded-xl mt-2"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+40 123 456 789"
                  className="h-12 rounded-xl mt-2"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City"
                  className="h-12 rounded-xl mt-2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://example.com"
                  className="h-12 rounded-xl mt-2"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    className="h-12 w-16 p-1 rounded-xl"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  />
                  <Input
                    value={formData.primaryColor}
                    className="h-12 rounded-xl flex-1"
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="accentColor"
                    type="color"
                    className="h-12 w-16 p-1 rounded-xl"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  />
                  <Input
                    value={formData.accentColor}
                    className="h-12 rounded-xl flex-1"
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateDialogOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreateBusiness} className="bg-gradient-to-r from-blue-600 to-purple-600 h-12 px-8">
              Create Business
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Business</DialogTitle>
            <DialogDescription>Update business information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="edit-name">Business Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="My Awesome Business"
                  className="h-12 rounded-xl mt-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-tagline">Tagline / Industry</Label>
                <Input
                  id="edit-tagline"
                  placeholder="e.g. Veterinary Clinic"
                  className="h-12 rounded-xl mt-2"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Tell us about your business..."
                  className="rounded-xl mt-2"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="contact@business.com"
                  className="h-12 rounded-xl mt-2"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  placeholder="+40 123 456 789"
                  className="h-12 rounded-xl mt-2"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  placeholder="123 Main St, City"
                  className="h-12 rounded-xl mt-2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-website">Website</Label>
                <Input
                  id="edit-website"
                  placeholder="https://example.com"
                  className="h-12 rounded-xl mt-2"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-primaryColor">Primary Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="edit-primaryColor"
                    type="color"
                    className="h-12 w-16 p-1 rounded-xl"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  />
                  <Input
                    value={formData.primaryColor}
                    className="h-12 rounded-xl flex-1"
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-accentColor">Accent Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="edit-accentColor"
                    type="color"
                    className="h-12 w-16 p-1 rounded-xl"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  />
                  <Input
                    value={formData.accentColor}
                    className="h-12 rounded-xl flex-1"
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditDialogOpen(false); setSelectedBusiness(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleUpdateBusiness} className="bg-gradient-to-r from-blue-600 to-purple-600 h-12 px-8">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">Delete Business</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedBusiness?.name}</strong>? This will also delete all associated data including services, staff, and bookings. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setSelectedBusiness(null); }}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteBusiness}>
              Delete Business
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
