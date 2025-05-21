import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFeedPosts, getUserById, getPostComments, mockComments } from '../data/mockData';
import PostCard from '../components/post/PostCard';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';

const Home = () => {
  const { currentUser } = useAuth();
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const posts = getFeedPosts(currentUser.id);
      setFeedPosts(posts);
      setLoading(false);
    }
  }, [currentUser]);

  const handleLike = (postId: string) => {
    setFeedPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId && currentUser) {
          // If user already liked the post, unlike it
          if (post.likes.includes(currentUser.id)) {
            return {
              ...post,
              likes: post.likes.filter(id => id !== currentUser.id)
            };
          }
          // Otherwise, add like
          return {
            ...post,
            likes: [...post.likes, currentUser.id]
          };
        }
        return post;
      })
    );
  };

  const handleComment = (postId: string, text: string) => {
    if (!currentUser) return;
    
    // Create a new comment
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      userId: currentUser.id,
      text,
      createdAt: new Date().toISOString()
    };
    
    // Add comment to mock data
    mockComments.push(newComment);
    
    // Update post to reference the new comment
    setFeedPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment.id]
          };
        }
        return post;
      })
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="space-y-6">
        {feedPosts.length > 0 ? (
          feedPosts.map(post => {
            const author = getUserById(post.userId);
            const comments = getPostComments(post.id);
            
            if (!author) return null;
            
            return (
              <PostCard
                key={post.id}
                post={post}
                author={author}
                comments={comments}
                onLike={handleLike}
                onComment={handleComment}
              />
            );
          })
        ) : (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Welcome to Woofstagram!</h3>
            <p className="text-gray-600 mb-4">Your feed is empty. Start following other dog accounts to see their posts here.</p>
            <button 
              onClick={() => window.location.href = '/explore'}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Explore Dogs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;