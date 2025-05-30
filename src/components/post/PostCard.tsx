import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Link as LinkIcon, Twitter, Facebook } from 'lucide-react';
import { Post } from '../../types/Post';
import { User } from '../../types/User';
import { Comment } from '../../types/Comment';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  
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

  const handleShare = async () => {
    setShowShareMenu(true);
  };

  const getPostUrl = () => {
    // In a real app, this would be a proper URL to the post
    return `${window.location.origin}/p/${post.id}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getPostUrl());
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
    setShowShareMenu(false);
  };

  const shareToTwitter = () => {
    const text = `Check out this amazing dog photo by @${author.username}`;
    const url = getPostUrl();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
    setShowShareMenu(false);
  };

  const shareToFacebook = () => {
    const url = getPostUrl();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank'
    );
    setShowShareMenu(false);
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
      <div className="p-3 flex items-center justify-between relative">
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
          <button 
            onClick={handleShare}
            className="text-gray-700 focus:outline-none"
          >
            <Share2 className="h-6 w-6" />
          </button>
        </div>
        <button className="text-gray-700 focus:outline-none">
          <Bookmark className="h-6 w-6" />
        </button>

        {/* Share menu */}
        <AnimatePresence>
          {showShareMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute left-0 bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10"
            >
              <button
                onClick={copyLink}
                className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-gray-50 text-left"
              >
                <LinkIcon className="h-4 w-4" />
                <span>Copy link</span>
              </button>
              <button
                onClick={shareToTwitter}
                className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-gray-50 text-left"
              >
                <Twitter className="h-4 w-4" />
                <span>Share to Twitter</span>
              </button>
              <button
                onClick={shareToFacebook}
                className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-gray-50 text-left"
              >
                <Facebook className="h-4 w-4" />
                <span>Share to Facebook</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success message */}
        <AnimatePresence>
          {shareSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 bottom-full mb-2 bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              Link copied!
            </motion.div>
          )}
        </AnimatePresence>
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