import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, getUserPosts } from '../data/mockData';
import { User } from '../types/User';
import { Post } from '../types/Post';
import { Grid, List, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { currentUser } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (username) {
      const foundUser = getUserById(getUserByUsername(username)?.id || '');
      if (foundUser) {
        setUser(foundUser);
        setPosts(getUserPosts(foundUser.id));
        
        if (currentUser) {
          setIsFollowing(currentUser.following.includes(foundUser.id));
        }
      }
      setLoading(false);
    }
  }, [username, currentUser]);
  
  const getUserByUsername = (username: string): User | undefined => {
    return [...getUsersFromMockData()].find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
  };
  
  const getUsersFromMockData = (): User[] => {
    // This would normally be an API call
    return require('../data/mockData').mockUsers;
  };
  
  const handleFollow = () => {
    if (!currentUser || !user) return;
    
    setIsFollowing(prev => !prev);
    
    // In a real app, this would update the database
    if (isFollowing) {
      // Unfollow logic
      console.log(`${currentUser.username} unfollowed ${user.username}`);
    } else {
      // Follow logic
      console.log(`${currentUser.username} followed ${user.username}`);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">User not found</h2>
        <p className="text-gray-600">The user you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  const isCurrentUser = currentUser?.id === user.id;
  
  return (
    <div className="pb-6">
      {/* Profile header */}
      <div className="flex flex-col md:flex-row items-center md:items-start py-6 px-4">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
          <img
            src={user.profileImage}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="mt-4 md:mt-0 md:ml-8 text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center">
            <h1 className="text-xl font-bold">{user.username}</h1>
            
            {isCurrentUser ? (
              <div className="mt-2 md:mt-0 md:ml-4 flex space-x-2 justify-center md:justify-start">
                <button className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium text-gray-800">
                  Edit Profile
                </button>
                <button className="bg-gray-100 p-1 rounded-md">
                  <Settings className="h-5 w-5 text-gray-800" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleFollow}
                className={`mt-2 md:mt-0 md:ml-4 px-6 py-1.5 rounded-md text-sm font-medium ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
          
          <div className="flex justify-center md:justify-start space-x-5 mt-4">
            <div className="text-center">
              <span className="font-bold">{posts.length}</span>
              <p className="text-sm text-gray-600">posts</p>
            </div>
            <div className="text-center">
              <span className="font-bold">{user.followers.length}</span>
              <p className="text-sm text-gray-600">followers</p>
            </div>
            <div className="text-center">
              <span className="font-bold">{user.following.length}</span>
              <p className="text-sm text-gray-600">following</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h2 className="font-bold">{user.fullName}</h2>
            <p className="text-sm mt-1">{user.bio}</p>
          </div>
        </div>
      </div>
      
      {/* Posts navigation */}
      <div className="border-t border-gray-200">
        <div className="flex justify-center">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-6 py-3 flex items-center space-x-1 ${
              viewMode === 'grid' ? 'text-blue-500 border-t border-blue-500' : 'text-gray-500'
            }`}
          >
            <Grid className="h-5 w-5" />
            <span className="text-xs uppercase font-medium">Posts</span>
          </button>
          
          <button
            onClick={() => setViewMode('list')}
            className={`px-6 py-3 flex items-center space-x-1 ${
              viewMode === 'list' ? 'text-blue-500 border-t border-blue-500' : 'text-gray-500'
            }`}
          >
            <List className="h-5 w-5" />
            <span className="text-xs uppercase font-medium">Feed</span>
          </button>
        </div>
      </div>
      
      {/* Posts grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <div key={post.id} className="aspect-square relative">
              <img
                src={post.image}
                alt="Post"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6 mt-4">
          {posts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-md overflow-hidden">
              <div className="p-3 flex items-center">
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="h-8 w-8 rounded-full mr-2"
                />
                <span className="font-medium">{user.username}</span>
              </div>
              <img
                src={post.image}
                alt="Post"
                className="w-full aspect-square object-cover"
              />
              <div className="p-3">
                <p className="text-sm">
                  <span className="font-medium mr-1">{user.username}</span>
                  {post.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {posts.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Posts Yet</h3>
          <p className="text-gray-600">
            {isCurrentUser
              ? "When you share photos and videos, they'll appear here."
              : `${user.username} hasn't shared any posts yet.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;