'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users as UsersIcon, Edit, Trash2, Search, CheckCircle2, XCircle, Loader2, AlertCircle, Mail, Calendar, Building2 } from "lucide-react"
import { format } from 'date-fns'

interface User {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  business: {
    id: string;
    name: string;
    slug: string;
    tagline: string | null;
  } | null;
  subscription: {
    id: string;
    status: string;
    billingCycle: string;
    amount: number;
    startDate: Date;
    endDate: Date | null;
  } | null;
}

interface Package {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnually: number | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    emailVerified: false,
  });

  useEffect(() => {
    fetchUsers();
    fetchPackages();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(u =>
          u.user.name.toLowerCase().includes(query) ||
          u.user.email.toLowerCase().includes(query) ||
          u.business?.name.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/users');
      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch users');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'An unexpected error occurred');
      toast({
        variant: "destructive",
        title: "Error loading users",
        description: (err as Error).message || "Failed to load users.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/packages');
      const result = await response.json();
      if (result.success) {
        setPackages(result.data.filter((p: Package & { isActive: boolean }) => p.isActive));
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "User updated!",
          description: `${result.data.name} has been updated successfully.`,
        });
        setEditDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        throw new Error(result.error || 'Failed to update user');
      }
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Error updating user",
        description: (err as Error).message || "Failed to update user.",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const response = await fetch(`/api/admin/users/${userToDelete}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "User deleted!",
          description: "User has been deleted successfully.",
        });
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        fetchUsers();
      } else {
        throw new Error(result.error || 'Failed to delete user');
      }
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Error deleting user",
        description: (err as Error).message || "Failed to delete user.",
      });
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.user.name,
      email: user.user.email,
      emailVerified: user.user.emailVerified,
    });
    setEditDialogOpen(true);
  };

  const totalUsers = users.length;
  const usersWithBusiness = users.filter(u => u.business).length;
  const usersWithSubscription = users.filter(u => u.subscription).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen text-red-500">
        <XCircle className="h-16 w-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error loading users</h2>
        <p className="text-lg">{error}</p>
        <Button onClick={fetchUsers} className="mt-6">Retry</Button>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/30 dark:from-slate-950 dark:via-cyan-950/20 dark:to-blue-950/20 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-indigo-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-xl">
                  <UsersIcon className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  Users Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Manage all registered users and their accounts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <UsersIcon className="w-10 h-10 text-cyan-600" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Total Users</p>
          <p className="text-3xl font-black mt-2">{totalUsers}</p>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-10 h-10 text-blue-600" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">With Business</p>
          <p className="text-3xl font-black mt-2 text-blue-600">{usersWithBusiness}</p>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Active Subscriptions</p>
          <p className="text-3xl font-black mt-2 text-green-600">{usersWithSubscription}</p>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Input
          placeholder="Search users by name, email, or business..."
          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-lg focus-visible:ring-cyan-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, idx) => (
            <div key={`user-${user.user.id}-${idx}`} className="group relative" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-3xl transition-all duration-500" />
              <Card className="relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    {user.user.image ? (
                      <img src={user.user.image} alt={user.user.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                        {user.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {user.user.emailVerified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{user.user.name}</h3>
                      {user.user.emailVerified ? (
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-0">
                          Unverified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                      <Mail className="w-4 h-4" />
                      <span>{user.user.email}</span>
                    </div>
                    
                    {/* Business Info */}
                    {user.business ? (
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 mb-3">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-semibold text-sm">{user.business.name}</p>
                          <p className="text-xs text-slate-500">/{user.business.slug}</p>
                        </div>
                        {user.business.tagline && (
                          <Badge variant="outline" className="ml-auto">{user.business.tagline}</Badge>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 mb-3">
                        <p className="text-sm text-slate-500">No business registered</p>
                      </div>
                    )}

                    {/* Subscription Info */}
                    {user.subscription ? (
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-green-700 dark:text-green-400">Active Subscription</p>
                          <p className="text-xs text-green-600 dark:text-green-500">
                            {user.subscription.billingCycle} • {(user.subscription.amount / 100).toFixed(0)} RON
                          </p>
                        </div>
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600">Since {format(new Date(user.subscription.startDate), 'dd MMM yyyy')}</span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30">
                        <p className="text-sm text-orange-600 dark:text-orange-400">No active subscription</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span>Joined: {format(new Date(user.user.createdAt), 'dd MMM yyyy')}</span>
                      <span>Updated: {format(new Date(user.user.updatedAt), 'dd MMM yyyy')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="h-10 px-4 hover:bg-blue-100 dark:hover:bg-blue-900/30" onClick={() => openEditDialog(user)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 px-4 hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => {
                        setUserToDelete(user.user.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400 dark:text-slate-600" />
            <p className="text-xl font-semibold mb-2">No users found!</p>
            <p>Try adjusting your search query.</p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit User</DialogTitle>
            <DialogDescription>Update user details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                className="h-12 rounded-xl"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="h-12 rounded-xl"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div>
                <p className="font-semibold">Email Verified</p>
                <p className="text-sm text-slate-500">Mark email as verified</p>
              </div>
              <Button
                variant={formData.emailVerified ? "default" : "outline"}
                size="sm"
                onClick={() => setFormData({ ...formData, emailVerified: !formData.emailVerified })}
              >
                {formData.emailVerified ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                {formData.emailVerified ? 'Verified' : 'Unverified'}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateUser} className="bg-gradient-to-r from-cyan-600 to-blue-600 h-12 px-8">
              Save Changes
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
              Are you sure you want to delete this user? This will also delete their business and all related data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteUser}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
