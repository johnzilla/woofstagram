export interface Post {
  id: string;
  userId: string;
  image: string;
  caption: string;
  likes: string[]; // Array of user IDs who liked the post
  comments: string[]; // Array of comment IDs
  createdAt: string;
}