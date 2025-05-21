export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  profileImage: string;
  bio: string;
  followers: string[]; // Array of user IDs
  following: string[]; // Array of user IDs
  posts: string[]; // Array of post IDs
}