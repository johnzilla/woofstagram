import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { Post } from '../../types/Post';
import { User } from '../../types/User';
import { Comment } from '../../types/Comment';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface PostCardProps {
  post: Post;
  author: User;
  comments: Comment[];
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
}

const PostCard = ({ post, author, comments, onLike, onComment }: PostCardProps) => {
  const { currentUser } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  
  const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
  
  const handleLike = () => {
    onLike(post.id);
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
      setShowComments(true);
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-hidden shadow-sm">
      {/* Post header */}
      <div className="flex items-center justify-between p-3">
        <Link to={`/profile/${author.username}`} className="flex items-center space-x-2">
          <img 
            src={author.profileImage} 
            alt={author.username} 
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="font-medium text-sm">{author.username}</span>
        </Link>
        <button className="text-gray-500">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      
      {/* Post image */}
      <div className="relative aspect-square bg-gray-100">
        <img 
          src={post.image} 
          alt="Post" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Post actions */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={handleLike}
            className={`${isLiked ? 'text-red-500' : 'text-gray-700'} focus:outline-none`}
          >
            <Heart className={`h-6 w-6 ${isLiked ? 'fill-red-500' : ''}`} />
          </motion.button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="text-gray-700 focus:outline-none"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
          <button className="text-gray-700 focus:outline-none">
            <Share2 className="h-6 w-6" />
          </button>
        </div>
        <button className="text-gray-700 focus:outline-none">
          <Bookmark className="h-6 w-6" />
        </button>
      </div>
      
      {/* Likes count */}
      <div className="px-3 pb-2">
        <p className="font-medium text-sm">
          {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
        </p>
      </div>
      
      {/* Caption */}
      <div className="px-3 pb-2">
        <p className="text-sm">
          <Link to={`/profile/${author.username}`} className="font-medium mr-1">
            {author.username}
          </Link>
          {post.caption}
        </p>
      </div>
      
      {/* Comments section */}
      {(comments.length > 0 || showComments) && (
        <div className="px-3 pb-2">
          {comments.length > 0 && !showComments && (
            <button 
              onClick={() => setShowComments(true)}
              className="text-gray-500 text-sm"
            >
              View all {comments.length} comments
            </button>
          )}
          
          {showComments && (
            <div className="mt-1 space-y-1.5">
              {comments.map((comment) => (
                <p key={comment.id} className="text-sm">
                  <Link to={`/profile/${comment.userId}`} className="font-medium mr-1">
                    {comment.userId}
                  </Link>
                  {comment.text}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Post time */}
      <div className="px-3 pb-3">
        <p className="text-xs text-gray-500 uppercase">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>
      </div>
      
      {/* Add comment */}
      <form 
        onSubmit={handleSubmitComment}
        className="border-t border-gray-200 px-3 py-2 flex items-center"
      >
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 border-0 focus:ring-0 text-sm"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        {newComment.trim() && (
          <button 
            type="submit"
            className="text-blue-500 font-medium text-sm"
          >
            Post
          </button>
        )}
      </form>
    </div>
  );
};

export default PostCard;