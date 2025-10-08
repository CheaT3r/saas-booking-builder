import { useState, useEffect } from 'react';
import { Permission } from '@/lib/permissions';

interface RoleData {
  userId: string;
  role: string;
  businessId?: string;
  permissions: string[];
  isSuperAdmin: boolean;
  isBusinessOwner: boolean;
  isBusinessEmployee: boolean;
}

export function useRole(businessId?: string) {
  const [roleData, setRoleData] = useState<RoleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = businessId 
          ? `/api/auth/role?businessId=${businessId}`
          : '/api/auth/role';
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
          setRoleData(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch role');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
        console.error('Error fetching role:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [businessId]);

  const hasPermission = (permission: Permission): boolean => {
    if (!roleData) return false;
    if (roleData.isSuperAdmin) return true;
    return roleData.permissions.includes(permission);
  };

  return {
    roleData,
    isLoading,
    error,
    isSuperAdmin: roleData?.isSuperAdmin || false,
    isBusinessOwner: roleData?.isBusinessOwner || false,
    isBusinessEmployee: roleData?.isBusinessEmployee || false,
    role: roleData?.role || 'business_owner',
    businessId: roleData?.businessId,
    permissions: roleData?.permissions || [],
    hasPermission,
  };
}

