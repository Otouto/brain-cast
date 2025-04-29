export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Post {
  id: string;
  userId: string;
  rawContent: string;
  formattedContent: {
    linkedin?: string;
    twitter?: string;
  };
  imageUrl?: string;
  status: 'draft' | 'pending' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  platform: 'linkedin' | 'twitter' | 'all';
}

export interface SocialIntegration {
  id: string;
  userId: string;
  platform: 'linkedin' | 'twitter';
  connected: boolean;
}

// Mock user
export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  image: 'https://ui-avatars.com/api/?name=John+Doe',
}

// Mock posts
export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    rawContent: 'Just discovered an amazing productivity hack that changed the way I manage my business. Want to know what it is?',
    formattedContent: {
      linkedin: 'I just discovered an amazing productivity hack that completely transformed my business operations.\n\nBy implementing time-blocking and focus sessions, I\'ve increased my daily output by 40%.\n\nWant to know my exact system? Drop a comment below and I\'ll share the details!\n\n#ProductivityTips #BusinessGrowth #Entrepreneurship',
      twitter: 'Just discovered a productivity hack that boosted my business efficiency by 40%! 🚀\n\nTime-blocking + focus sessions = game changer\n\nWant my system? Reply with "YES" and I\'ll share the details! #ProductivityTips',
    },
    status: 'published',
    createdAt: '2023-06-15T10:30:00Z',
    updatedAt: '2023-06-15T11:00:00Z',
  },
  {
    id: '2',
    userId: '1',
    rawContent: 'Our team just launched a new feature that solves a major pain point for our customers.',
    formattedContent: {
      linkedin: 'Thrilled to announce that our team just launched a groundbreaking new feature that addresses one of the biggest challenges our customers face!\n\nAfter months of research, development, and testing, we\'ve created a solution that will save users an average of 5 hours per week.\n\nCheck out the link in the comments to see it in action.\n\n#ProductLaunch #Innovation #CustomerSuccess',
      twitter: 'JUST LAUNCHED: Our new feature solves a major customer pain point and saves users 5+ hours weekly! 🎉\n\nThe team has been working on this for months and I couldn\'t be prouder of what we\'ve built.\n\nCheck it out here: [link] #ProductLaunch',
    },
    status: 'pending',
    createdAt: '2023-06-20T14:45:00Z',
    updatedAt: '2023-06-20T15:15:00Z',
  },
  {
    id: '3',
    userId: '1',
    rawContent: 'I think AI will transform the future of work in the next 5 years.',
    formattedContent: {
      linkedin: 'AI is not just coming - it\'s already here, and it\'s reshaping the future of work faster than most realize.\n\nBased on current trends, I predict that within 5 years:\n\n- 40% of routine cognitive tasks will be automated\n- New job categories we can\'t yet imagine will emerge\n- The most valuable skills will be those that complement AI, not compete with it\n\nIs your business prepared for this shift? If not, now is the time to start adapting.\n\n#ArtificialIntelligence #FutureOfWork #BusinessStrategy',
    },
    status: 'draft',
    createdAt: '2023-06-25T09:15:00Z',
    updatedAt: '2023-06-25T09:15:00Z',
  },
]

// Mock templates
export const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Professional Announcement',
    description: 'Formal announcement of news, achievements, or milestones',
    platform: 'linkedin',
  },
  {
    id: '2',
    name: 'Engagement Question',
    description: 'Post ending with a question to drive audience engagement',
    platform: 'all',
  },
  {
    id: '3',
    name: 'Trending Topic Commentary',
    description: 'Your perspective on a trending industry topic',
    platform: 'twitter',
  },
  {
    id: '4',
    name: 'Quick Tip',
    description: 'Share a valuable tip related to your expertise',
    platform: 'all',
  },
]

// Mock social integrations
export const mockSocialIntegrations: SocialIntegration[] = [
  {
    id: '1',
    userId: '1',
    platform: 'linkedin',
    connected: true,
  },
  {
    id: '2',
    userId: '1',
    platform: 'twitter',
    connected: false,
  },
] 