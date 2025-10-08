'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Package, TrendingUp, CheckCircle2, XCircle, Loader2, AlertCircle, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface PackageType {
  id: string;
  name: string;
  description?: string;
  priceMonthly: number;
  priceAnnually?: number;
  features?: string[];
  maxUsers?: number;
  maxBookings?: number;
  apiAccess: boolean;
  customBranding: boolean;
  prioritySupport: boolean;
  isActive: boolean;
  createdAt: Date;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceMonthly: 0,
    priceAnnually: 0,
    maxUsers: 5,
    maxBookings: 100,
    apiAccess: false,
    customBranding: false,
    prioritySupport: false,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/packages');
      const result = await response.json();

      if (result.success) {
        setPackages(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load packages",
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

  const handleCreatePackage = async () => {
    if (!formData.name || formData.priceMonthly <= 0) {
      toast({
        title: "Validation Error",
        description: "Name and monthly price are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          priceMonthly: Math.round(formData.priceMonthly * 100), // Convert to cents
          priceAnnually: formData.priceAnnually ? Math.round(formData.priceAnnually * 100) : null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Package created successfully",
        });
        fetchPackages();
        setCreateDialogOpen(false);
        setFormData({
          name: '',
          description: '',
          priceMonthly: 0,
          priceAnnually: 0,
          maxUsers: 5,
          maxBookings: 100,
          apiAccess: false,
          customBranding: false,
          prioritySupport: false,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create package",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create package",
        variant: "destructive",
      });
    }
  };

  const handleEditPackage = async () => {
    if (!selectedPackage || !formData.name || formData.priceMonthly <= 0) {
      toast({
        title: "Validation Error",
        description: "Name and monthly price are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/packages/${selectedPackage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          priceMonthly: Math.round(formData.priceMonthly * 100),
          priceAnnually: formData.priceAnnually ? Math.round(formData.priceAnnually * 100) : null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Package updated successfully",
        });
        fetchPackages();
        setEditDialogOpen(false);
        setSelectedPackage(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update package",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update package",
        variant: "destructive",
      });
    }
  };

  const handleDeletePackage = async () => {
    if (!packageToDelete) return;

    try {
      const response = await fetch(`/api/admin/packages/${packageToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Package deleted successfully",
        });
        fetchPackages();
        setDeleteDialogOpen(false);
        setPackageToDelete(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete package",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      priceMonthly: pkg.priceMonthly / 100,
      priceAnnually: pkg.priceAnnually ? pkg.priceAnnually / 100 : 0,
      maxUsers: pkg.maxUsers || 5,
      maxBookings: pkg.maxBookings || 100,
      apiAccess: pkg.apiAccess,
      customBranding: pkg.customBranding,
      prioritySupport: pkg.prioritySupport,
    });
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-green-950/20 dark:to-emerald-950/20 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-teal-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white shadow-xl">
                  <Package className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  Packages Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Manage subscription packages and pricing
                </p>
              </div>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 h-12 px-8">
                  <Plus className="w-5 h-5" />
                  Add Package
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Add New Package</DialogTitle>
                  <DialogDescription>Create a new subscription package</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Package Name *</Label>
                    <Input
                      placeholder="Professional"
                      className="h-12 rounded-xl"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Package description..."
                      className="rounded-xl"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Monthly Price (RON) *</Label>
                      <Input
                        type="number"
                        placeholder="49"
                        className="h-12 rounded-xl"
                        value={formData.priceMonthly}
                        onChange={(e) => setFormData({ ...formData, priceMonthly: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Annual Price (RON)</Label>
                      <Input
                        type="number"
                        placeholder="490"
                        className="h-12 rounded-xl"
                        value={formData.priceAnnually}
                        onChange={(e) => setFormData({ ...formData, priceAnnually: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Max Users</Label>
                      <Input
                        type="number"
                        className="h-12 rounded-xl"
                        value={formData.maxUsers}
                        onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Bookings/Month</Label>
                      <Input
                        type="number"
                        className="h-12 rounded-xl"
                        value={formData.maxBookings}
                        onChange={(e) => setFormData({ ...formData, maxBookings: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <div>
                        <p className="font-semibold">API Access</p>
                        <p className="text-sm text-slate-500">Enable API integrations</p>
                      </div>
                      <Switch
                        checked={formData.apiAccess}
                        onCheckedChange={(checked) => setFormData({ ...formData, apiAccess: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <div>
                        <p className="font-semibold">Custom Branding</p>
                        <p className="text-sm text-slate-500">Allow custom logo and colors</p>
                      </div>
                      <Switch
                        checked={formData.customBranding}
                        onCheckedChange={(checked) => setFormData({ ...formData, customBranding: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <div>
                        <p className="font-semibold">Priority Support</p>
                        <p className="text-sm text-slate-500">24/7 priority customer support</p>
                      </div>
                      <Switch
                        checked={formData.prioritySupport}
                        onCheckedChange={(checked) => setFormData({ ...formData, prioritySupport: checked })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreatePackage} className="bg-gradient-to-r from-green-600 to-emerald-600 h-12 px-8">
                    Create Package
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Total Packages</p>
          <p className="text-3xl font-black mt-2">{packages.length}</p>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="w-10 h-10 text-blue-600" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Active</p>
          <p className="text-3xl font-black mt-2 text-blue-600">{packages.filter(p => p.isActive).length}</p>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-10 h-10 text-purple-600" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Avg Price</p>
          <p className="text-3xl font-black mt-2 text-purple-600">
            {packages.length > 0 ? Math.round(packages.reduce((sum, p) => sum + p.priceMonthly, 0) / packages.length / 100) : 0} RON
          </p>
        </Card>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <p className="text-xl font-semibold mb-2">No packages yet</p>
            <p className="text-slate-500 mb-4">Create your first subscription package</p>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </div>
        ) : (
          packages.map((pkg, idx) => (
            <Card key={pkg.id} className="relative p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 hover:border-green-500 dark:hover:border-green-500 shadow-xl hover:shadow-green-500/20 transition-all duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black mb-2">{pkg.name}</h3>
                  {pkg.isActive ? (
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-0">
                      <XCircle className="w-3 h-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog(pkg)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                    onClick={() => {
                      setPackageToDelete(pkg.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {pkg.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{pkg.description}</p>
              )}

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-green-600">{pkg.priceMonthly / 100}</span>
                  <span className="text-slate-600 dark:text-slate-400">RON/month</span>
                </div>
                {pkg.priceAnnually && (
                  <p className="text-sm text-slate-500 mt-1">
                    or {pkg.priceAnnually / 100} RON/year
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Max Users</span>
                  <span className="font-semibold">{pkg.maxUsers || 'Unlimited'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Max Bookings</span>
                  <span className="font-semibold">{pkg.maxBookings || 'Unlimited'}/month</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">API Access</span>
                  {pkg.apiAccess ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Custom Branding</span>
                  {pkg.customBranding ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Priority Support</span>
                  {pkg.prioritySupport ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog - Similar structure to create, pre-filled */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Package</DialogTitle>
            <DialogDescription>Update package details</DialogDescription>
          </DialogHeader>
          {/* Same form fields as create */}
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Package Name *</Label>
              <Input
                className="h-12 rounded-xl"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
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
                <Label>Monthly Price (RON) *</Label>
                <Input
                  type="number"
                  className="h-12 rounded-xl"
                  value={formData.priceMonthly}
                  onChange={(e) => setFormData({ ...formData, priceMonthly: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Annual Price (RON)</Label>
                <Input
                  type="number"
                  className="h-12 rounded-xl"
                  value={formData.priceAnnually}
                  onChange={(e) => setFormData({ ...formData, priceAnnually: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Users</Label>
                <Input
                  type="number"
                  className="h-12 rounded-xl"
                  value={formData.maxUsers}
                  onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Bookings/Month</Label>
                <Input
                  type="number"
                  className="h-12 rounded-xl"
                  value={formData.maxBookings}
                  onChange={(e) => setFormData({ ...formData, maxBookings: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className="font-semibold">API Access</p>
                  <p className="text-sm text-slate-500">Enable API integrations</p>
                </div>
                <Switch
                  checked={formData.apiAccess}
                  onCheckedChange={(checked) => setFormData({ ...formData, apiAccess: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className="font-semibold">Custom Branding</p>
                  <p className="text-sm text-slate-500">Allow custom logo and colors</p>
                </div>
                <Switch
                  checked={formData.customBranding}
                  onCheckedChange={(checked) => setFormData({ ...formData, customBranding: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className="font-semibold">Priority Support</p>
                  <p className="text-sm text-slate-500">24/7 priority customer support</p>
                </div>
                <Switch
                  checked={formData.prioritySupport}
                  onCheckedChange={(checked) => setFormData({ ...formData, prioritySupport: checked })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditPackage} className="bg-gradient-to-r from-green-600 to-emerald-600 h-12 px-8">
              Update Package
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
              Are you sure you want to delete this package? Active subscriptions using this package will be affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeletePackage}
            >
              Delete Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
