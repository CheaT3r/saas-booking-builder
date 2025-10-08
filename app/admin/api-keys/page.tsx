'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Key, Plus, Edit, Trash2, Eye, EyeOff, Copy, Check, AlertTriangle, Loader2, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

interface ApiKey {
  id: string;
  name: string;
  key: string;
  provider: string;
  environment: string;
  isActive: boolean;
  createdAt: Date;
}

const providerColors: { [key: string]: string } = {
  "Stripe": "from-blue-500 to-cyan-500",
  "SendGrid": "from-green-500 to-emerald-500",
  "Twilio": "from-purple-500 to-pink-500",
  "Google": "from-orange-500 to-red-500",
  "Other": "from-slate-500 to-gray-500",
};

const providerIcons: { [key: string]: string } = {
  "Stripe": "💳",
  "SendGrid": "📧",
  "Twilio": "📱",
  "Google": "🗺️",
  "Other": "🔧",
};

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null);
  const [apiKeyToDelete, setApiKeyToDelete] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    environment: 'production',
    key: '',
    isActive: true,
  });

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/admin/api-keys');
      const result = await response.json();

      if (result.success) {
        setApiKeys(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load API keys",
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

  const handleCreateApiKey = async () => {
    if (!formData.name || !formData.key || !formData.provider) {
      toast({
        title: "Validation Error",
        description: "Name, provider, and key are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/api-keys', {
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
          description: "API key created successfully",
        });
        fetchApiKeys();
        setCreateDialogOpen(false);
        setFormData({
          name: '',
          provider: '',
          environment: 'production',
          key: '',
          isActive: true,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create API key",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    }
  };

  const handleEditApiKey = async () => {
    if (!selectedApiKey || !formData.name || !formData.key || !formData.provider) {
      toast({
        title: "Validation Error",
        description: "Name, provider, and key are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/api-keys/${selectedApiKey.id}`, {
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
          description: "API key updated successfully",
        });
        fetchApiKeys();
        setEditDialogOpen(false);
        setSelectedApiKey(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update API key",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update API key",
        variant: "destructive",
      });
    }
  };

  const handleDeleteApiKey = async () => {
    if (!apiKeyToDelete) return;

    try {
      const response = await fetch(`/api/admin/api-keys/${apiKeyToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "API key deleted successfully",
        });
        fetchApiKeys();
        setDeleteDialogOpen(false);
        setApiKeyToDelete(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete API key",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey);
    setFormData({
      name: apiKey.name,
      provider: apiKey.provider,
      environment: apiKey.environment,
      key: apiKey.key,
      isActive: apiKey.isActive,
    });
    setEditDialogOpen(true);
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    });
  };

  const maskKey = (key: string) => {
    if (key.length <= 10) return "•".repeat(key.length);
    return key.substring(0, 10) + "•".repeat(20);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading API keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-orange-50/30 to-red-50/30 dark:from-slate-950 dark:via-orange-950/20 dark:to-red-950/20 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-red-600/10 to-pink-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-white shadow-xl">
                  <Key className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  API Keys Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Manage third-party service integrations
                </p>
              </div>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg shadow-orange-500/30 h-12 px-8">
                  <Plus className="w-5 h-5" />
                  Add API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Add New API Key</DialogTitle>
                  <DialogDescription>Configure a new third-party integration</DialogDescription>
                </DialogHeader>
                <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                    Never share your API keys. Keep them secure and rotate them regularly.
                  </AlertDescription>
                </Alert>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Key Name *</Label>
                    <Input 
                      placeholder="Stripe Production" 
                      className="h-12 rounded-xl"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Provider *</Label>
                      <Select value={formData.provider} onValueChange={(value) => setFormData({ ...formData, provider: value })}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Stripe">💳 Stripe</SelectItem>
                          <SelectItem value="SendGrid">📧 SendGrid</SelectItem>
                          <SelectItem value="Twilio">📱 Twilio</SelectItem>
                          <SelectItem value="Google">🗺️ Google</SelectItem>
                          <SelectItem value="Other">🔧 Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Environment *</Label>
                      <Select value={formData.environment} onValueChange={(value) => setFormData({ ...formData, environment: value })}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select environment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>API Key *</Label>
                    <Input 
                      type="password" 
                      placeholder="sk_live_..." 
                      className="h-12 rounded-xl font-mono"
                      value={formData.key}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div>
                      <p className="font-semibold">Active</p>
                      <p className="text-sm text-slate-500">Enable this API key immediately</p>
                    </div>
                    <Switch 
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateApiKey} className="bg-gradient-to-r from-orange-600 to-red-600 h-12 px-8">
                    Add Key
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Key className="w-10 h-10 text-blue-600" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Total Keys</p>
          <p className="text-3xl font-black mt-2">{apiKeys.length}</p>
        </Card>
        
        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Active</p>
          <p className="text-3xl font-black mt-2 text-green-600">{apiKeys.filter(k => k.isActive).length}</p>
        </Card>
        
        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-10 h-10 text-orange-600" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Inactive</p>
          <p className="text-3xl font-black mt-2 text-orange-600">{apiKeys.filter(k => !k.isActive).length}</p>
        </Card>
        
        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🔧</span>
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Providers</p>
          <p className="text-3xl font-black mt-2">{new Set(apiKeys.map(k => k.provider)).size}</p>
        </Card>
      </div>

      {/* API Keys List */}
      {apiKeys.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <p className="text-xl font-semibold mb-2">No API keys configured</p>
          <p className="text-slate-500 mb-4">Add your first API key to get started with integrations</p>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-gradient-to-r from-orange-600 to-red-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add API Key
          </Button>
        </div>
      ) : (
        <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
          <div className="space-y-4">
            {apiKeys.map((apiKey, idx) => (
              <div
                key={apiKey.id}
                className="group relative"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${providerColors[apiKey.provider] || providerColors['Other']}/5 group-hover:${providerColors[apiKey.provider] || providerColors['Other']}/10 rounded-2xl transition-all duration-500`} />
                <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${providerColors[apiKey.provider] || providerColors['Other']} rounded-xl blur-lg opacity-30`} />
                    <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${providerColors[apiKey.provider] || providerColors['Other']} flex items-center justify-center text-white font-bold text-3xl shadow-xl`}>
                      {providerIcons[apiKey.provider] || providerIcons['Other']}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{apiKey.name}</h3>
                      <Badge className={`${providerColors[apiKey.provider] || providerColors['Other']} bg-gradient-to-r text-white border-0 shadow-lg`}>
                        {apiKey.provider}
                      </Badge>
                      <Badge variant={apiKey.environment === "production" ? "default" : "secondary"}>
                        {apiKey.environment}
                      </Badge>
                      {apiKey.isActive ? (
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0">
                          <Check className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-0">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="text-sm font-mono px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {visibleKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {visibleKeys[apiKey.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => copyToClipboard(apiKey.id, apiKey.key)}
                      >
                        {copiedKey === apiKey.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 px-4 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      onClick={() => openEditDialog(apiKey)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 w-10 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => {
                        setApiKeyToDelete(apiKey.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit API Key</DialogTitle>
            <DialogDescription>Update API key configuration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Key Name *</Label>
              <Input 
                className="h-12 rounded-xl"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provider *</Label>
                <Select value={formData.provider} onValueChange={(value) => setFormData({ ...formData, provider: value })}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Stripe">💳 Stripe</SelectItem>
                    <SelectItem value="SendGrid">📧 SendGrid</SelectItem>
                    <SelectItem value="Twilio">📱 Twilio</SelectItem>
                    <SelectItem value="Google">🗺️ Google</SelectItem>
                    <SelectItem value="Other">🔧 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Environment *</Label>
                <Select value={formData.environment} onValueChange={(value) => setFormData({ ...formData, environment: value })}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>API Key *</Label>
              <Input 
                type="password" 
                className="h-12 rounded-xl font-mono"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div>
                <p className="font-semibold">Active</p>
                <p className="text-sm text-slate-500">Enable/disable this API key</p>
              </div>
              <Switch 
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditApiKey} className="bg-gradient-to-r from-orange-600 to-red-600 h-12 px-8">
              Update Key
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
              Are you sure you want to delete this API key? This action cannot be undone and may break integrations.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteApiKey}
            >
              Delete API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
