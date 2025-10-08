# Business Employee Roles Guide

## 🎭 **Sistemul de Roluri cu 3 Niveluri**

BIZNIZZ.EU folosește un sistem avansat de Role-Based Access Control (RBAC) cu 3 niveluri:

### **1️⃣ Super Admin** (`super_admin`)
- **Scop:** Administrator platformă SaaS
- **Acces:** Toate funcționalitățile platformei
- **Zone:** `/admin/*` - Admin Panel complet
- **Permisiuni:** FULL ACCESS la toate resursele

### **2️⃣ Business Owner** (`business_owner`)
- **Scop:** Proprietar business
- **Acces:** Management complet al propriului business
- **Zone:** `/dashboard/*` - Dashboard complet
- **Permisiuni:**
  - ✅ Crearea și ștergerea business-ului
  - ✅ Gestionare staff (add/edit/delete + atribuire roluri)
  - ✅ Gestionare servicii
  - ✅ Vezi toate programările
  - ✅ Setări business
  - ✅ Billing și subscripții
  - ✅ Analytics

### **3️⃣ Business Employee** (`business_employee`)
- **Scop:** Angajat/Staff member al unui business
- **Acces:** Dashboard limitat pentru propriul business
- **Zone:** `/dashboard/*` - Doar resurse permise
- **Permisiuni:**
  - ✅ Vezi informații business (read-only)
  - ✅ Vezi programările proprii
  - ✅ Gestionează programările proprii
  - ✅ Vezi lista de servicii (read-only)
  - ✅ Vezi lista de staff (read-only)
  - ❌ NU poate modifica setările business-ului
  - ❌ NU poate accesa billing
  - ❌ NU poate șterge business-ul
  - ❌ NU poate gestiona alți staff members

---

## 📋 **Cum Funcționează Sistemul**

### **Flow-ul Complet:**

1. **Business Owner** creează un business
2. **Business Owner** adaugă staff members în `/dashboard/staff`
3. **Staff Member** se înregistrează pe platformă (dacă nu are cont)
4. **Business Owner** atribuie rolul de **Employee** staff member-ului
5. **Employee** se loghează și vede dashboard-ul business-ului (cu permisiuni limitate)

---

## 🔧 **Setup: Adăugarea unui Employee**

### **Pasul 1: Adăugați Staff Member**

```typescript
// În dashboard/staff - Business Owner creează un staff member
POST /api/staff
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+40 123 456 789",
  "specialty": "Hairstylist"
}
```

### **Pasul 2: Staff Member se Înregistrează**

Staff member-ul trebuie să se înregistreze pe platformă folosind același email:

```
1. Mergi la /sign-up
2. Creează cont cu emailul: john@example.com
3. Confirmă emailul
```

### **Pasul 3: Business Owner Atribuie Rolul**

După ce staff member-ul are cont, owner-ul atribuie rolul de employee:

```typescript
// Business Owner face request
POST /api/staff/{staffId}/assign-role
{
  "userEmail": "john@example.com"
}
```

**Ce se întâmplă în backend:**
- Se creează un record în `user_roles`:
  - `userId`: ID-ul staff member-ului
  - `businessId`: ID-ul business-ului
  - `role`: `'business_employee'`
  - `permissions`: Array de permisiuni default pentru employee

- Se updatează staff record:
  - `userId`: Link către user account

---

## 🔐 **Verificarea Permisiunilor**

### **Server-Side (API Routes):**

```typescript
import { checkBusinessPermission, checkBusinessAccess } from '@/lib/check-permissions';
import { PERMISSIONS } from '@/lib/permissions';

// Verifică dacă user-ul are permisiune specifică pentru un business
export async function GET(request: NextRequest) {
  const authCheck = await checkBusinessPermission(
    PERMISSIONS.VIEW_ALL_BOOKINGS,
    businessId
  );

  if (!authCheck.authorized) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: 403 }
    );
  }

  // User-ul are permisiune, continuă...
}

// Verifică dacă user-ul are acces la business (owner sau employee)
export async function GET(request: NextRequest) {
  const accessCheck = await checkBusinessAccess(businessId);

  if (!accessCheck.authorized) {
    return NextResponse.json(
      { error: accessCheck.error },
      { status: 403 }
    );
  }

  // User-ul are acces, returnează date...
}
```

### **Client-Side (React Components):**

```typescript
import { useRole } from '@/hooks/use-role';
import { PERMISSIONS } from '@/lib/permissions';

function BookingsPage() {
  const { hasPermission, isBusinessEmployee, role } = useRole(businessId);

  if (isBusinessEmployee) {
    return <EmployeeBookingsView />;
  }

  return (
    <div>
      {hasPermission(PERMISSIONS.MANAGE_ALL_BOOKINGS) && (
        <Button onClick={handleDeleteBooking}>Delete</Button>
      )}

      {hasPermission(PERMISSIONS.VIEW_ALL_BOOKINGS) ? (
        <AllBookingsList />
      ) : (
        <OwnBookingsList />
      )}
    </div>
  );
}
```

---

## 📊 **Matrice de Permisiuni**

| Permisiune | Super Admin | Business Owner | Business Employee |
|-----------|-------------|----------------|-------------------|
| `view_business` | ✅ | ✅ | ✅ (read-only) |
| `edit_business` | ✅ | ✅ | ❌ |
| `delete_business` | ✅ | ✅ | ❌ |
| `view_staff` | ✅ | ✅ | ✅ |
| `manage_staff` | ✅ | ✅ | ❌ |
| `view_services` | ✅ | ✅ | ✅ |
| `manage_services` | ✅ | ✅ | ❌ |
| `view_all_bookings` | ✅ | ✅ | ❌ |
| `view_own_bookings` | ✅ | ✅ | ✅ |
| `manage_all_bookings` | ✅ | ✅ | ❌ |
| `manage_own_bookings` | ✅ | ✅ | ✅ |
| `create_bookings` | ✅ | ✅ | ✅ |
| `view_settings` | ✅ | ✅ | ✅ (read-only) |
| `edit_settings` | ✅ | ✅ | ❌ |
| `view_billing` | ✅ | ✅ | ❌ |
| `manage_billing` | ✅ | ✅ | ❌ |
| `view_analytics` | ✅ | ✅ | ❌ |
| `admin_access` | ✅ | ❌ | ❌ |

---

## 🛠️ **API Endpoints pentru Employee Management**

### **1. Atribuire Rol de Employee**

```http
POST /api/staff/{staffId}/assign-role
Authorization: Bearer {token}

Request Body:
{
  "userEmail": "employee@example.com"
}

Response:
{
  "success": true,
  "message": "Staff member assigned business employee role successfully",
  "data": {
    "role": {...},
    "staffMember": {...}
  }
}
```

### **2. Revocare Rol de Employee**

```http
DELETE /api/staff/{staffId}/assign-role
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Staff member role removed successfully"
}
```

### **3. Verificare Rol (cu businessId)**

```http
GET /api/auth/role?businessId={businessId}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "userId": "abc123",
    "role": "business_employee",
    "businessId": "business123",
    "permissions": ["view_own_bookings", "manage_own_bookings", ...],
    "isSuperAdmin": false,
    "isBusinessOwner": false,
    "isBusinessEmployee": true
  }
}
```

---

## 💡 **Exemple de Utilizare**

### **Exemplu 1: Staff Management UI cu Atribuire Rol**

```typescript
// În dashboard/staff/page.tsx
function StaffManagementPage() {
  const handleAssignRole = async (staffId: string, email: string) => {
    try {
      const response = await fetch(`/api/staff/${staffId}/assign-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: email }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Employee role assigned!');
      }
    } catch (error) {
      toast.error('Failed to assign role');
    }
  };

  return (
    <div>
      {staffList.map(staff => (
        <div key={staff.id}>
          <h3>{staff.name}</h3>
          {staff.userId ? (
            <Badge>Has Account</Badge>
          ) : (
            <Button onClick={() => handleAssignRole(staff.id, staff.email)}>
              Invite & Assign Role
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### **Exemplu 2: Dashboard Adaptat după Rol**

```typescript
function Dashboard() {
  const { role, isBusinessEmployee, isBusinessOwner } = useRole();

  if (isBusinessEmployee) {
    return (
      <EmployeeDashboard>
        <MySchedule />
        <MyBookings />
      </EmployeeDashboard>
    );
  }

  if (isBusinessOwner) {
    return (
      <OwnerDashboard>
        <FullStatistics />
        <AllBookings />
        <StaffManagement />
        <BusinessSettings />
      </OwnerDashboard>
    );
  }

  return <div>Loading...</div>;
}
```

---

## 🔒 **Best Practices**

### **1. Verificare Permisiuni pe Ambele Părți**
- ✅ **Server-side:** API routes verifică întotdeauna permisiunile
- ✅ **Client-side:** UI se adaptează după permisiuni (UX)

### **2. Permisiuni Granulare**
```typescript
// BAD - Verifică doar rolul
if (role === 'business_owner') {
  // show delete button
}

// GOOD - Verifică permisiunea specifică
if (hasPermission(PERMISSIONS.DELETE_BUSINESS)) {
  // show delete button
}
```

### **3. Fallback la Permisiuni Default**
```typescript
// Employees pot avea permisiuni custom, dar fallback la default
const permissions = customPermissions || ROLE_PERMISSIONS[role];
```

### **4. Audit Trail**
- Log când se atribuie/revocă roluri
- Păstrează istoric de modificări

---

## 🚨 **Troubleshooting**

### **Problem:** Employee nu vede dashboard-ul business-ului

**Soluții:**
1. Verifică că user-ul are cont (s-a înregistrat)
2. Verifică că owner-ul a atribuit rolul: `SELECT * FROM user_roles WHERE user_id = '...' AND business_id = '...'`
3. Verifică că `staff.user_id` este setat corect
4. Log out și log in din nou

### **Problem:** Employee vede opțiuni de management (nu ar trebui)

**Soluții:**
1. Verifică că UI folosește `hasPermission()` pentru conditional rendering
2. Verifică că API routes verifică permisiunile server-side
3. Check că rolul returnat este corect: `GET /api/auth/role?businessId=...`

---

## 📝 **Database Schema**

### **user_roles Table:**

```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,  -- Link to auth.user
  business_id UUID,       -- Only for business_employee
  role VARCHAR(50) NOT NULL,  -- 'super_admin', 'business_owner', 'business_employee'
  permissions JSONB,      -- Array of permission strings
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_business_id ON user_roles(business_id);
```

### **staff Table (Updated):**

```sql
CREATE TABLE staff (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id TEXT,  -- Link to auth.user (when employee has account)
  name VARCHAR(256) NOT NULL,
  email VARCHAR(256) UNIQUE,
  ...
);
```

---

## ✅ **Checklist pentru Setup**

- [ ] Schema updated cu `businessId` în `user_roles`
- [ ] Schema updated cu `userId` în `staff`
- [ ] Permissions system definit în `lib/permissions.ts`
- [ ] Middleware creat în `lib/check-permissions.ts`
- [ ] API endpoint pentru atribuire rol: `/api/staff/[id]/assign-role`
- [ ] API endpoint `/api/auth/role` suportă `businessId` query param
- [ ] Custom hook `useRole(businessId)` actualizat
- [ ] UI pentru staff management cu buton "Assign Role"
- [ ] Employee dashboard view creat
- [ ] Toate API routes verifică permisiunile

---

**Last Updated:** October 2025  
**Version:** 1.0.0



