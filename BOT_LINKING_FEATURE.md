# Bot Linking Feature

## Overview

The Bot Linking Feature automatically links created chatbots to their owners in the user data stored in Firestore. When a bot is created, its ID is automatically added to the user's `botIds` array, and when a bot is deleted, its ID is removed from this array.

## Implementation Details

### 1. User Data Structure

The `UserData` interface in `lib/firebase.ts` has been updated to include a `botIds` field:

```typescript
export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  plan?: string;
  planId?: string | null;
  status?: 'active' | 'suspended' | 'inactive';
  bots?: number;           // Count of bots
  botIds?: string[];       // Array of bot IDs owned by this user
  joined?: Timestamp;
  lastActive?: Timestamp;
  revenue?: number;
  isAdmin?: boolean;
}
```

### 2. Bot Creation and Linking

When a bot is created using the `createBot` function, the following happens:

1. **Bot Document Creation**: A new bot document is created in the `bots` collection
2. **User Update**: The user's document is updated to:
   - Increment the `bots` count by 1
   - Add the new bot ID to the `botIds` array

```typescript
export const createBot = async (botData: Omit<BotData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const botRef = doc(collection(db, 'bots'));
    const now = Timestamp.now();
    
    const newBot = {
      ...botData,
      id: botRef.id,
      createdAt: now,
      updatedAt: now
    };
    
    await setDoc(botRef, newBot);
    
    // Update user's bot count and add bot ID to botIds array
    const userRef = doc(db, 'users', botData.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const currentBots = userDoc.data().bots || 0;
      const currentBotIds = userDoc.data().botIds || [];
      await updateDoc(userRef, { 
        bots: currentBots + 1,
        botIds: [...currentBotIds, botRef.id] // Add new bot ID to array
      });
    }
    
    return botRef.id;
  } catch (error) {
    console.error('Error creating bot:', error);
    throw error;
  }
};
```

### 3. Bot Deletion and Unlinking

When a bot is deleted using the `deleteBot` function, the following happens:

1. **Bot Document Deletion**: The bot document is removed from the `bots` collection
2. **User Update**: The user's document is updated to:
   - Decrement the `bots` count by 1
   - Remove the bot ID from the `botIds` array

```typescript
export const deleteBot = async (botId: string, uid: string): Promise<void> => {
  try {
    const botRef = doc(db, 'bots', botId);
    await deleteDoc(botRef);
    
    // Update user's bot count and remove bot ID from botIds array
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const currentBots = userDoc.data().bots || 0;
      const currentBotIds = userDoc.data().botIds || [];
      const updatedBotIds = currentBotIds.filter((id: string) => id !== botId);
      await updateDoc(userRef, { 
        bots: Math.max(0, currentBots - 1),
        botIds: updatedBotIds
      });
    }
  } catch (error) {
    console.error('Error deleting bot:', error);
    throw error;
  }
};
```

### 4. User Document Initialization

When a new user is created, the `botIds` array is initialized as an empty array:

```typescript
const createUserDocument = async (user: User, displayName?: string, planId?: string) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // ... plan details logic ...
      
      await setDoc(userRef, {
        email: user.email,
        displayName: displayName || user.displayName || '',
        photoURL: user.photoURL || '',
        plan: planName,
        planId: planId || null,
        status: 'active',
        bots: 0,
        botIds: [], // Initialize empty array for bot IDs
        joined: Timestamp.now(),
        lastActive: Timestamp.now(),
        revenue: 0,
        isAdmin: false,
      });
    }
    // ... rest of function ...
  } catch (error) {
    console.error('Error creating user document:', error);
  }
};
```

### 5. Data Retrieval Functions Updated

All user data retrieval functions have been updated to include the `botIds` field:

- `getAllUsers()` - Returns all users with their `botIds` arrays
- `getUserById()` - Returns a specific user with their `botIds` array
- `getCurrentUserData()` - Returns current user data with their `botIds` array
- `getUsersByStatus()` - Returns users by status with their `botIds` arrays

## Benefits

1. **Efficient Queries**: Users can quickly find all their bots without querying the bots collection
2. **Data Consistency**: The `bots` count and `botIds` array are always in sync
3. **User Management**: Admins can easily see which bots belong to which users
4. **Analytics**: Better insights into user-bot relationships for reporting

## Usage Examples

### Get All Bots for a User

```typescript
import { getUserById } from '../lib/firebase';

const user = await getUserById('user-uid-123');
if (user && user.botIds) {
  console.log(`User has ${user.bots} bots:`, user.botIds);
}
```

### Check if User Has a Specific Bot

```typescript
const user = await getUserById('user-uid-123');
if (user && user.botIds) {
  const hasBot = user.botIds.includes('bot-id-456');
  console.log('User has this bot:', hasBot);
}
```

### Get Users with Most Bots

```typescript
import { getAllUsers } from '../lib/firebase';

const users = await getAllUsers();
const usersByBotCount = users
  .filter(user => user.bots && user.bots > 0)
  .sort((a, b) => (b.bots || 0) - (a.bots || 0));

console.log('Top users by bot count:', usersByBotCount.slice(0, 5));
```

## Testing

A test script has been created at `scripts/test-bot-linking.js` to verify the functionality:

1. Creates a test user with empty `botIds` array
2. Creates a test bot and verifies it's linked to the user
3. Deletes the bot and verifies it's unlinked from the user
4. Cleans up test data

To run the test:
1. Add your Firebase configuration to the script
2. Uncomment the `testBotLinking()` call
3. Run: `node scripts/test-bot-linking.js`

## Migration Notes

For existing users without the `botIds` field:

- The field will be automatically initialized as an empty array when accessed
- Existing bots will not be automatically linked (manual migration may be needed)
- New bots created after this update will be properly linked

## Future Enhancements

1. **Bulk Operations**: Add functions for bulk bot creation/deletion
2. **Bot Transfer**: Allow transferring bots between users
3. **Bot Sharing**: Implement bot sharing between users
4. **Audit Trail**: Track bot ownership changes over time

