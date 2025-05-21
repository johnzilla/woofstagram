import { User } from '../types/User';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'golden_max',
    email: 'max@example.com',
    fullName: 'Max the Golden',
    profileImage: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Golden Retriever living my best life. I love beaches, tennis balls, and belly rubs!',
    followers: ['2', '3'],
    following: ['2'],
    posts: ['1', '2', '3']
  },
  {
    id: '2',
    username: 'corgi_cooper',
    email: 'cooper@example.com',
    fullName: 'Cooper the Corgi',
    profileImage: 'https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Professional corgi model. Tiny legs, big personality. Treats, please!',
    followers: ['1'],
    following: ['1', '3'],
    posts: ['4', '5']
  },
  {
    id: '3',
    username: 'husky_luna',
    email: 'luna@example.com',
    fullName: 'Luna the Husky',
    profileImage: 'https://images.pexels.com/photos/3726313/pexels-photo-3726313.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Husky queen. Snow lover. Professional howler. Will sing for treats.',
    followers: ['1'],
    following: ['2'],
    posts: ['6', '7']
  }
];

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    image: 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Beach day is the best day! 🏖️',
    likes: ['2', '3'],
    comments: ['1', '2'],
    createdAt: new Date('2024-06-15T10:30:00').toISOString()
  },
  {
    id: '2',
    userId: '1',
    image: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Just hanging out in the garden 🌿',
    likes: ['2'],
    comments: [],
    createdAt: new Date('2024-06-14T15:45:00').toISOString()
  },
  {
    id: '3',
    userId: '1',
    image: 'https://images.pexels.com/photos/3397939/pexels-photo-3397939.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Caught the frisbee like a pro! 🏆',
    likes: ['3'],
    comments: ['3'],
    createdAt: new Date('2024-06-12T12:15:00').toISOString()
  },
  {
    id: '4',
    userId: '2',
    image: 'https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Short legs don\'t stop me! 🏃‍♂️',
    likes: ['1'],
    comments: [],
    createdAt: new Date('2024-06-15T09:20:00').toISOString()
  },
  {
    id: '5',
    userId: '2',
    image: 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'My favorite toy 🧸',
    likes: ['1', '3'],
    comments: ['4'],
    createdAt: new Date('2024-06-13T14:30:00').toISOString()
  },
  {
    id: '6',
    userId: '3',
    image: 'https://images.pexels.com/photos/2853422/pexels-photo-2853422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Snow day is my kind of day! ❄️',
    likes: ['1', '2'],
    comments: ['5'],
    createdAt: new Date('2024-06-14T11:10:00').toISOString()
  },
  {
    id: '7',
    userId: '3',
    image: 'https://images.pexels.com/photos/4587971/pexels-photo-4587971.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Ready for my close-up! 📸',
    likes: ['2'],
    comments: [],
    createdAt: new Date('2024-06-12T16:40:00').toISOString()
  }
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    userId: '2',
    text: 'Looking good, Max! 🐶',
    createdAt: new Date('2024-06-15T10:45:00').toISOString()
  },
  {
    id: '2',
    postId: '1',
    userId: '3',
    text: 'I wish I could join you at the beach!',
    createdAt: new Date('2024-06-15T11:05:00').toISOString()
  },
  {
    id: '3',
    postId: '3',
    userId: '3',
    text: 'Nice catch! 🏆',
    createdAt: new Date('2024-06-12T12:30:00').toISOString()
  },
  {
    id: '4',
    postId: '5',
    userId: '1',
    text: 'Aww, so cute! What toy is that?',
    createdAt: new Date('2024-06-13T15:00:00').toISOString()
  },
  {
    id: '5',
    postId: '6',
    userId: '1',
    text: 'You look right at home in the snow!',
    createdAt: new Date('2024-06-14T11:45:00').toISOString()
  }
];

// Helper function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Helper function to get post by ID
export const getPostById = (id: string): Post | undefined => {
  return mockPosts.find(post => post.id === id);
};

// Helper function to get posts for feed
export const getFeedPosts = (userId: string): Post[] => {
  const user = getUserById(userId);
  if (!user) return [];
  
  // Get posts from users the current user follows + their own posts
  const relevantUserIds = [...user.following, userId];
  
  return mockPosts
    .filter(post => relevantUserIds.includes(post.userId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Helper function to get user posts
export const getUserPosts = (userId: string): Post[] => {
  return mockPosts
    .filter(post => post.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Helper function to get post comments
export const getPostComments = (postId: string): Comment[] => {
  return mockComments
    .filter(comment => comment.postId === postId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};