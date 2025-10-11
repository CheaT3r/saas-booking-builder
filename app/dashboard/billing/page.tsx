'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Calendar, DollarSign, TrendingUp, Loader2, XCircle, Plus, CheckCircle2, AlertCircle } from "lucide-react"

interface Subscription {
  id: string;
  businessId: string;
  packageId: string | null;
  packageName?: string;
  status: string;
  billingCycle: string;
  amount: number;
  startDate: Date;
  endDate: Date | null;
  nextBillingDate: Date | null;
  createdAt: Date;
}

interface Package {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnually: number | null;
  isActive: boolean;
}

export default function BillingPage() {
  const { toast } = useToast();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const [formData, setFormData] = useState({
    packageId: '',
    billingCycle: 'monthly' as 'monthly' | 'annually',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First get business info to get businessId
      const settingsResponse = await fetch('/api/settings');
      const settingsResult = await settingsResponse.json();
      
      if (!settingsResult.success) {
        throw new Error('Failed to fetch business info');
      }
      
      const fetchedBusinessId = settingsResult.data.id;
      setBusinessId(fetchedBusinessId);

      // Fetch subscriptions
      const subsResponse = await fetch(`/api/billing?businessId=${fetchedBusinessId}`);
      const subsResult = await subsResponse.json();

      // Fetch available packages
      const packagesResponse = await fetch('/api/packages');
      const packagesResult = await packagesResponse.json();

      if (subsResult.success && packagesResult.success) {
        setSubscriptions(subsResult.data);
        setPackages(packagesResult.data);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'An unexpected error occurred');
      toast({
        variant: "destructive",
        title: "Error loading billing data",
        description: (err as Error).message || "Failed to load billing information.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubscription = async () => {
    if (!formData.packageId) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a package",
      });
      return;
    }

    try {
      const selectedPackage = packages.find(p => p.id === formData.packageId);
      if (!selectedPackage) {
        throw new Error('Selected package not found');
      }

      const amount = formData.billingCycle === 'monthly' 
        ? selectedPackage.priceMonthly 
        : (selectedPackage.priceAnnually || selectedPackage.priceMonthly * 12);

      // Calculate next billing date
      const startDate = new Date(formData.startDate);
      const nextBillingDate = new Date(startDate);
      if (formData.billingCycle === 'monthly') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }

      const response = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          packageId: formData.packageId,
          billingCycle: formData.billingCycle,
          status: formData.status,
          amount,
          startDate: formData.startDate,
          nextBillingDate: nextBillingDate.toISOString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success!",
          description: "Subscription created successfully",
        });
        setCreateDialogOpen(false);
        fetchData();
      } else {
        throw new Error(result.error || 'Failed to create subscription');
      }
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Error creating subscription",
        description: (err as Error).message || "Failed to create subscription.",
      });
    }
  };

  const handleCancelSubscription = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;

    try {
      const response = await fetch(`/api/billing/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Subscription Cancelled",
          description: "The subscription has been cancelled successfully.",
        });
        fetchData();
      } else {
        throw new Error(result.error || 'Failed to cancel subscription');
      }
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Error cancelling subscription",
        description: (err as Error).message || "Failed to cancel subscription.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading billing data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen text-red-500">
        <XCircle className="h-16 w-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error loading billing data</h2>
        <p className="text-lg">{error}</p>
        <Button onClick={fetchData} className="mt-6">Retry</Button>
      </div>
    );
  }

  const activeSubscription = subscriptions.find(s => s.status === 'active');
  const totalSpent = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  const statusColors: { [key: string]: string } = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    expired: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400',
    trial: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  };

  return (
    <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500/10 via-blue-500/10 to-slate-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-blue-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-blue-600 flex items-center justify-center text-white shadow-xl">
                  <CreditCard className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  Billing & Subscriptions
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Manage your subscription and billing information
                </p>
              </div>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-500/30 h-12 px-8">
                  <Plus className="w-5 h-5" />
                  New Subscription
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Create Subscription</DialogTitle>
                  <DialogDescription>Choose a plan and start your subscription</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Select Package *</Label>
                    <Select value={formData.packageId} onValueChange={(value) => setFormData({ ...formData, packageId: value })}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Choose a package" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.filter(p => p.isActive).map(pkg => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            {pkg.name} - {(pkg.priceMonthly / 100).toFixed(0)} RON/month
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Billing Cycle *</Label>
                    <Select value={formData.billingCycle} onValueChange={(value: 'monthly' | 'annually') => setFormData({ ...formData, billingCycle: value })}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annually">Annually (Save 2 months)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Input
                      type="date"
                      className="h-12 rounded-xl"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  {formData.packageId && (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-1">Billing Summary</p>
                      <p className="text-2xl font-black text-emerald-600">
                        {(() => {
                          const pkg = packages.find(p => p.id === formData.packageId);
                          if (!pkg) return '0';
                          const amount = formData.billingCycle === 'monthly' ? pkg.priceMonthly : (pkg.priceAnnually || pkg.priceMonthly * 12);
                          return (amount / 100).toFixed(0);
                        })()} RON
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Billed {formData.billingCycle === 'monthly' ? 'monthly' : 'annually'}
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateSubscription} className="bg-gradient-to-r from-emerald-600 to-green-600 h-12 px-8">
                    Create Subscription
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Plan</CardDescription>
            <CardTitle className="text-3xl font-black text-slate-800 dark:text-slate-200">
              {activeSubscription ? activeSubscription.packageName : 'No Active Plan'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeSubscription && (
              <Badge className={`${statusColors[activeSubscription.status]} border-0`}>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {activeSubscription.status.charAt(0).toUpperCase() + activeSubscription.status.slice(1)}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-slate-600" />
              Next Billing Date
            </CardDescription>
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
              {activeSubscription?.nextBillingDate 
                ? new Date(activeSubscription.nextBillingDate).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
                : 'N/A'}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Total Spent
            </CardDescription>
            <CardTitle className="text-3xl font-black text-emerald-600">
              {(totalSpent / 100).toFixed(0)} RON
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Subscriptions List */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">Subscription History</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">All your past and current subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <p className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">No subscriptions yet</p>
              <p className="text-slate-500 mb-4">Create your first subscription to get started</p>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-green-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Subscription
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((sub, idx) => (
                <div
                  key={sub.id}
                  className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800/50 transition-all duration-300"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{sub.packageName || 'Custom Plan'}</h3>
                      <Badge className={`${statusColors[sub.status]} border-0`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="font-mono text-xs border-slate-300 dark:border-slate-700">
                        {sub.billingCycle === 'monthly' ? 'Monthly' : 'Annually'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        Started: {new Date(sub.startDate).toLocaleDateString('ro-RO')}
                      </span>
                      {sub.nextBillingDate && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-slate-500" />
                          Next: {new Date(sub.nextBillingDate).toLocaleDateString('ro-RO')}
                        </span>
                      )}
                      {sub.endDate && (
                        <span className="flex items-center gap-1 text-red-600">
                          Ended: {new Date(sub.endDate).toLocaleDateString('ro-RO')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-600">{(sub.amount / 100).toFixed(0)} RON</p>
                      <p className="text-xs text-slate-500">per {sub.billingCycle === 'monthly' ? 'month' : 'year'}</p>
                    </div>
                    {sub.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-red-100 dark:hover:bg-red-900/30 border-red-300 dark:border-red-700"
                        onClick={() => handleCancelSubscription(sub.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Packages */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">Available Packages</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">Choose the perfect plan for your business</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.filter(p => p.isActive).map((pkg, idx) => (
            <div
              key={pkg.id}
              className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <h3 className="text-2xl font-black mb-4 text-slate-800 dark:text-slate-200">{pkg.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-black text-emerald-600">{(pkg.priceMonthly / 100).toFixed(0)}</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">RON/month</span>
              </div>
              {pkg.priceAnnually && (
                <p className="text-sm text-slate-500 mb-4">
                  or {(pkg.priceAnnually / 100).toFixed(0)} RON/year (save {(((pkg.priceMonthly * 12 - pkg.priceAnnually) / (pkg.priceMonthly * 12)) * 100).toFixed(0)}%)
                </p>
              )}
              <Button
                onClick={() => {
                  setFormData({ ...formData, packageId: pkg.id });
                  setCreateDialogOpen(true);
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg"
              >
                Select Plan
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
