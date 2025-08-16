# Plan Selection Feature for User Signup

## Overview
This feature allows users to select a pricing plan during the signup process, ensuring they start with the right plan for their needs.

## What Was Implemented

### 1. New Components
- **PlanSelection.tsx**: A reusable component that displays available plans for users to choose from
- **Enhanced Signup Flow**: Modified signup page to include a two-step process:
  - Step 1: Basic user information (name, email, password)
  - Step 2: Plan selection

### 2. Firebase Integration Updates
- Modified `signUpWithEmail()` function to accept a `planId` parameter
- Modified `signInWithGoogle()` function to accept a `planId` parameter
- Updated `createUserDocument()` function to store the selected plan
- Enhanced `UserData` interface to include `planId` field

### 3. User Experience Improvements
- **Progressive Signup**: Users must complete basic info before seeing plan options
- **Plan Validation**: Users cannot proceed without selecting a plan
- **Visual Feedback**: Selected plans are highlighted with green borders and checkmarks
- **Responsive Design**: Plan cards work on both desktop and mobile devices

## How It Works

### Signup Flow
1. User fills out basic information (name, email, password)
2. User clicks "Continue to Plan Selection"
3. System validates basic information
4. User sees available plans and selects one
5. User can create account with email/password or continue with Google
6. Account is created with the selected plan

### Plan Display Features
- **Plan Cards**: Each plan shows:
  - Plan name and price
  - Billing cycle (monthly/yearly)
  - Feature limits (bots, messages per day, storage, team members)
  - Key features list
  - Popular plan indicators
- **Selection State**: Visual feedback when a plan is selected
- **Responsive Grid**: Adapts to different screen sizes

## Technical Details

### State Management
- `showPlanSelection`: Controls which step is visible
- `selectedPlanId`: Stores the user's plan choice
- Form validation ensures data integrity

### Error Handling
- Plan selection is required before account creation
- Graceful fallback if plans cannot be loaded
- User-friendly error messages

### Data Flow
1. Plans are fetched from Firebase on component mount
2. Only active plans are displayed to users
3. Selected plan ID is passed to Firebase during account creation
4. User document is created with plan information

## Benefits

1. **Better User Experience**: Users understand what they're signing up for
2. **Reduced Churn**: Clear expectations about features and limits
3. **Business Intelligence**: Track which plans are most popular
4. **Flexibility**: Easy to add new plans or modify existing ones
5. **Consistency**: Both email and Google signup support plan selection

## Future Enhancements

1. **Plan Comparison**: Side-by-side plan comparison
2. **Custom Plans**: Allow users to build custom plans
3. **Trial Periods**: Free trial options for premium plans
4. **Plan Switching**: Allow users to change plans after signup
5. **Promotional Codes**: Discount codes for specific plans

## Usage

The feature is automatically integrated into the signup process. No additional configuration is required for basic usage. Plans are managed through the admin panel and automatically appear in the signup flow.

## Testing

To test the feature:
1. Navigate to `/signup`
2. Fill out basic information
3. Click "Continue to Plan Selection"
4. Select a plan
5. Complete account creation

The selected plan will be stored in the user's profile and can be viewed in the admin panel.

