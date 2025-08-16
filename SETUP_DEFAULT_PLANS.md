# Setting Up Default Plans for Testing

To test the plan selection feature during signup, you'll need to create some default plans in your Firebase database.

## Option 1: Use the Admin Panel (Recommended)

1. Start your development server: `npm run dev`
2. Navigate to `/admin/plans/create`
3. Create the following plans manually:

### Free Plan
- **Name**: Free
- **Description**: Perfect for getting started with AI chatbots
- **Price**: $0
- **Billing Cycle**: Monthly
- **Status**: Active
- **Features**: 
  - 1 AI chatbot
  - 100 messages per day
  - 100MB storage
  - Basic analytics
  - Email support
- **Limits**:
  - Bots: 1
  - Messages per day: 100
  - Storage: 100MB
  - Team members: 1
- **Popular**: No
- **Unlimited**: No

### Pro Plan
- **Name**: Pro
- **Description**: For growing businesses and professionals
- **Price**: $29
- **Billing Cycle**: Monthly
- **Status**: Active
- **Features**:
  - 5 AI chatbots
  - 1000 messages per day
  - 1GB storage
  - Advanced analytics
  - Priority support
  - Custom branding
  - API access
- **Limits**:
  - Bots: 5
  - Messages per day: 1000
  - Storage: 1GB
  - Team members: 3
- **Popular**: Yes
- **Unlimited**: No

### Business Plan
- **Name**: Business
- **Description**: Enterprise-grade solution for large teams
- **Price**: $99
- **Billing Cycle**: Monthly
- **Status**: Active
- **Features**:
  - Unlimited AI chatbots
  - Unlimited messages
  - 10GB storage
  - Advanced analytics & reporting
  - 24/7 priority support
  - Custom branding
  - API access
  - Team collaboration
  - White-label solution
- **Limits**:
  - Bots: -1 (Unlimited)
  - Messages per day: -1 (Unlimited)
  - Storage: 10GB
  - Team members: -1 (Unlimited)
- **Popular**: No
- **Unlimited**: Yes

## Option 2: Direct Database Setup

If you prefer to set up plans directly in Firebase:

1. Go to your Firebase Console
2. Navigate to Firestore Database
3. Create a `plans` collection
4. Add documents with the structure defined in `scripts/create-default-plans.js`

## Testing the Feature

Once plans are created:

1. Navigate to `/signup`
2. Fill out the signup form
3. Click "Continue to Plan Selection"
4. Choose a plan
5. Complete signup with either email/password or Google

## Notes

- Plans must have `status: 'active'` to appear in the signup flow
- The `isPopular` flag adds a "Most Popular" badge to plans
- The `isUnlimited` flag sets limits to -1 for unlimited features
- All plans are automatically filtered to show only active ones

