// Utility script to create default plans for testing
// Run this script once to populate the database with sample plans

const defaultPlans = [
  {
    name: 'Free',
    description: 'Perfect for getting started with AI chatbots',
    price: 0,
    billingCycle: 'monthly',
    status: 'active',
    features: [
      '1 AI chatbot',
      '100 messages per day',
      '100MB storage',
      'Basic analytics',
      'Email support'
    ],
    limits: {
      bots: 1,
      messagesPerDay: 100,
      storage: '100MB',
      teamMembers: 1
    },
    isPopular: false,
    isUnlimited: false
  },
  {
    name: 'Pro',
    description: 'For growing businesses and professionals',
    price: 29,
    billingCycle: 'monthly',
    status: 'active',
    features: [
      '5 AI chatbots',
      '1000 messages per day',
      '1GB storage',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
      'API access'
    ],
    limits: {
      bots: 5,
      messagesPerDay: 1000,
      storage: '1GB',
      teamMembers: 3
    },
    isPopular: true,
    isUnlimited: false
  },
  {
    name: 'Business',
    description: 'Enterprise-grade solution for large teams',
    price: 99,
    billingCycle: 'monthly',
    status: 'active',
    features: [
      'Unlimited AI chatbots',
      'Unlimited messages',
      '10GB storage',
      'Advanced analytics & reporting',
      '24/7 priority support',
      'Custom branding',
      'API access',
      'Team collaboration',
      'White-label solution'
    ],
    limits: {
      bots: -1, // Unlimited
      messagesPerDay: -1, // Unlimited
      storage: '10GB',
      teamMembers: -1 // Unlimited
    },
    isPopular: false,
    isUnlimited: true
  }
];

console.log('Default plans configuration:');
console.log(JSON.stringify(defaultPlans, null, 2));
console.log('\nTo create these plans, use the admin panel at /admin/plans/create');
console.log('Or manually add them to your Firebase database.');

