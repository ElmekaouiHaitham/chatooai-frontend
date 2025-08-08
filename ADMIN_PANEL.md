# Admin Panel - User Management

The admin panel now includes comprehensive user management functionality that fetches real user data from Firebase Firestore.

## Features Implemented

### 1. **Real-time User Data**
- **Firebase Integration**: Fetches users directly from Firestore database
- **Automatic User Creation**: User documents are created automatically when users sign up
- **Real-time Updates**: User data is updated in real-time when changes are made

### 2. **User Management Functions**
- **View All Users**: Display all registered users with their details
- **Search & Filter**: Search by name/email, filter by status and plan
- **Edit User Details**: Update user plan and status
- **Refresh Data**: Manually refresh user data from Firebase

### 3. **User Information Display**
- **User Profile**: Name, email, profile picture
- **Account Details**: Plan (Free/Pro/Business), status (active/suspended/inactive)
- **Usage Statistics**: Number of bots, revenue generated
- **Activity Tracking**: Join date, last active time

### 4. **Admin Security**
- **Admin-only Access**: Only users with admin privileges can access the panel
- **Route Protection**: Automatic redirect for non-admin users
- **Secure Operations**: All user management operations are secured

### 5. **Logout Functionality**
- **Secure Logout**: Properly signs out from Firebase Authentication
- **Confirmation Dialog**: Prevents accidental logouts with confirmation prompt
- **Loading States**: Shows "Logging out..." during the logout process
- **Automatic Redirect**: Redirects to login page after successful logout
- **Error Handling**: Graceful error handling with fallback redirect
- **Mobile Support**: Logout functionality works on both desktop and mobile

## Technical Implementation

### **Firebase Firestore Integration**

#### **User Document Structure**
```typescript
interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  plan?: string;           // 'Free', 'Pro', 'Business'
  status?: string;         // 'active', 'suspended', 'inactive'
  bots?: number;           // Number of chatbots
  joined?: Timestamp;      // Account creation date
  lastActive?: Timestamp;  // Last login time
  revenue?: number;        // Total revenue generated
  isAdmin?: boolean;       // Admin privileges
}
```

#### **Key Functions**
- `getAllUsers()`: Fetch all users from Firestore
- `getUserById(uid)`: Get specific user by ID
- `updateUserStatus(uid, status)`: Update user status
- `updateUserPlan(uid, plan)`: Update user plan
- `createUserDocument(user, displayName)`: Create user document on signup
- `signOutUser()`: Sign out from Firebase Authentication

### **Admin Panel Features**

#### **User List View**
- **Responsive Table**: Displays all user information in a clean table format
- **Search Functionality**: Search users by name or email
- **Status Filtering**: Filter by active, suspended, or inactive users
- **Plan Filtering**: Filter by Free, Pro, or Business plans
- **Real-time Updates**: Changes are reflected immediately in the UI

#### **User Management Actions**
- **Edit User**: Modal popup to edit user plan and status
- **Bulk Operations**: Future enhancement for bulk user management

#### **Data Visualization**
- **User Count**: Total number of users displayed
- **Status Indicators**: Color-coded status badges
- **Plan Indicators**: Color-coded plan badges
- **Activity Tracking**: Formatted dates and time ago display

#### **Navigation & Logout**
- **Admin Navigation**: Clean navigation with admin branding
- **User Dropdown**: Admin profile menu with logout option
- **Mobile Responsive**: Full functionality on mobile devices
- **Click Outside**: Dropdown closes when clicking outside
- **Loading States**: Visual feedback during logout process

## Usage Instructions

### **Accessing the Admin Panel**
1. Navigate to `/admin/users`
2. Must be logged in with admin privileges
3. Non-admin users will be redirected to dashboard

### **Managing Users**
1. **View Users**: All users are displayed in a table
2. **Search**: Use the search bar to find specific users
3. **Filter**: Use status and plan filters to narrow down results
4. **Edit**: Click "Edit" button to modify user details
5. **Refresh**: Click "Refresh" to reload data from Firebase

### **Logging Out**
1. **Desktop**: Click the admin user dropdown in the top-right corner
2. **Mobile**: Open the mobile menu and scroll to the logout button
3. **Confirmation**: Confirm the logout action in the dialog
4. **Redirect**: Automatically redirected to the login page

### **Creating an Admin User**
For testing purposes, you can create an admin user using the browser console:

```javascript
// After signing in, run this in browser console
import { createAdminUser } from './lib/firebase';
const currentUser = auth.currentUser;
if (currentUser) {
  await createAdminUser(currentUser.uid);
}
```

## Security Considerations

### **Admin Access Control**
- Only users with `isAdmin: true` can access admin routes
- Automatic redirect for unauthorized users
- Server-side validation recommended for production

### **Data Protection**
- User passwords are not stored in Firestore (handled by Firebase Auth)
- Sensitive operations require confirmation
- Audit trail recommended for production

### **Logout Security**
- Proper Firebase Authentication signout
- Session cleanup on logout
- Automatic redirect to login page
- Error handling with fallback redirect

### **Error Handling**
- Comprehensive error messages for failed operations
- Graceful fallbacks for network issues
- Loading states for better UX

## File Structure

```
app/admin/
└── users/
    └── page.tsx          # Admin users management page

components/
├── AdminNavigation.tsx   # Admin navigation with logout
└── ProtectedRoute.tsx    # Route protection with admin check

lib/
└── firebase.ts           # Firebase functions for user management
```

## Future Enhancements

1. **Bulk Operations**: Select multiple users for bulk actions
2. **User Analytics**: Charts and graphs for user growth
3. **Export Functionality**: Export user data to CSV/Excel
4. **Advanced Filtering**: More sophisticated search and filter options
5. **User Activity Logs**: Track user actions and changes
6. **Email Notifications**: Notify users of status changes
7. **User Import**: Bulk import users from external sources
8. **Session Management**: Remember me functionality
9. **Two-Factor Authentication**: Enhanced security for admin accounts

## Testing

### **Test Data Setup**
1. Create test users through the signup process
2. Use the `createAdminUser()` function to grant admin access
3. Test all CRUD operations on user data
4. Verify admin-only access restrictions
5. Test logout functionality on both desktop and mobile

### **Production Considerations**
1. Implement proper admin role management
2. Add audit logging for all admin actions
3. Set up proper Firebase security rules
4. Implement rate limiting for admin operations
5. Add backup and recovery procedures
6. Implement session timeout for admin accounts
7. Add activity logging for logout events 