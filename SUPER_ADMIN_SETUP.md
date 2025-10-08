# Super Admin Setup Guide

## 🔐 How to Set Up the First Super Admin

After deploying the BIZNIZZ.EU SaaS platform, you need to manually set the first Super Admin user.

### Prerequisites
- A user account must already exist (sign up normally through `/sign-up`)
- Access to the database (via Drizzle Studio or direct SQL)

---

## Method 1: Using Drizzle Studio (Recommended)

1. **Start Drizzle Studio:**
   ```bash
   cd saas-booking-builder
   npx drizzle-kit studio
   ```

2. **Open** `https://local.drizzle.studio` in your browser

3. **Navigate to** the `user_roles` table

4. **Insert a new role record:**
   - `id`: Auto-generated UUID
   - `user_id`: Copy the user ID from the `user` table (the account you want to make Super Admin)
   - `role`: `'super_admin'`
   - `permissions`: `[]` (empty array for now)
   - `created_at`: Current timestamp
   - `updated_at`: Current timestamp

5. **Save** the record

6. **Refresh** the application and log in with that user account

7. **Verify** - You should now see the "Super Admin" section in the sidebar

---

## Method 2: Using Direct SQL

Connect to your PostgreSQL database and run:

```sql
INSERT INTO user_roles (id, user_id, role, permissions, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'YOUR_USER_ID_HERE',  -- Replace with actual user ID from 'user' table
  'super_admin',
  '[]'::jsonb,
  NOW(),
  NOW()
);
```

**To find your user ID:**
```sql
SELECT id, name, email FROM "user" WHERE email = 'your-email@example.com';
```

---

## Method 3: Using Drizzle Studio - Quick Steps

1. **Find your user ID:**
   - Go to `user` table
   - Find your account by email
   - Copy the `id` value

2. **Create the role:**
   - Go to `user_roles` table
   - Click "Add Row"
   - Fill in:
     - `user_id`: (paste the ID from step 1)
     - `role`: `super_admin`
     - `permissions`: `[]`
   - Save

---

## ✅ Verification

After setting up the Super Admin role:

1. **Log out** and **log back in**
2. **Check the sidebar** - You should see a "Super Admin" section with:
   - Businesses
   - Users
   - API Keys
   - Packages
   - Analytics

3. **Navigate to** `/admin/users` - You should have full access

4. **Test permissions:**
   - Try accessing `/admin/businesses`
   - Try accessing `/admin/packages`
   - All should work without "Access Denied" errors

---

## 🎭 User Roles

The platform supports two main roles:

| Role | Description | Access |
|------|-------------|--------|
| `business_owner` | Default role for new users | Dashboard, Business Management, Settings |
| `super_admin` | Platform administrator | Full access including Admin Panel |

---

## 🔒 Security Notes

1. **Limit Super Admins:** Only create Super Admin accounts for trusted platform administrators
2. **Audit Access:** Regularly check the `user_roles` table for unauthorized Super Admin entries
3. **Use Strong Passwords:** Super Admin accounts should have extra-strong passwords
4. **Enable 2FA:** (When implemented) Enable two-factor authentication for Super Admin accounts

---

## 🚨 Troubleshooting

**Problem:** "Access Denied" even after setting Super Admin role

**Solutions:**
1. **Clear cache** - Hard refresh the browser (Ctrl+Shift+R)
2. **Log out and log in again** - Session needs to refresh
3. **Verify role in database:**
   ```sql
   SELECT * FROM user_roles WHERE user_id = 'YOUR_USER_ID';
   ```
4. **Check API response:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Navigate to `/admin/users`
   - Check the response from `/api/auth/role`
   - Should return: `{ "isSuperAdmin": true }`

---

## 📝 Example: Complete Setup

```bash
# 1. Start Drizzle Studio
cd saas-booking-builder
npx drizzle-kit studio

# 2. Open browser to https://local.drizzle.studio

# 3. Find your user ID in 'user' table
#    Example: user_id = "abc123xyz"

# 4. Add role in 'user_roles' table:
#    user_id: abc123xyz
#    role: super_admin
#    permissions: []

# 5. Save and close Drizzle Studio

# 6. Refresh your app and log in
#    You should now have Super Admin access!
```

---

## 🎯 Next Steps

After setting up your Super Admin:

1. **Create Packages** - Set up subscription tiers at `/admin/packages`
2. **Configure API Keys** - Add payment gateway keys at `/admin/api-keys`
3. **Monitor Analytics** - Check platform metrics at `/admin/analytics`
4. **Manage Users** - View and manage all users at `/admin/users`
5. **Oversee Businesses** - Monitor all businesses at `/admin/businesses`

---

## 🤝 Support

If you encounter issues setting up Super Admin access:

1. Check the browser console for errors
2. Verify database connection
3. Ensure migrations are up to date: `npx drizzle-kit push`
4. Review the `checkIsSuperAdmin()` function in `lib/check-admin.ts`

---

**Last Updated:** October 2025  
**Version:** 1.0.0



