import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bookmark } from 'lucide-react';
import { mockUsers, mockPosts } from '../data/mockData';
import { User } from '../types/User';
import { Post } from '../types/Post';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    // Get trending posts (mock implementation - in a real app, would be based on engagement)
    const trending = [...mockPosts].sort((a, b) => b.likes.length - a.likes.length);
    setTrendingPosts(trending);
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const query = searchQuery.toLowerCase();
      const users = mockUsers.filter(
        user => 
          user.username.toLowerCase().includes(query) || 
          user.fullName.toLowerCase().includes(query)
      );
      setFilteredUsers(users);
    } else {
      setIsSearching(false);
      setFilteredUsers([]);
    }
  }, [searchQuery]);
  
  return (
    <div className="py-4">
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search dogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-none focus:ring-0 ml-2 w-full text-sm"
          />
        </div>
      </div>
      
      {/* Search results */}
      {isSearching ? (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Search Results</h2>
          
          {filteredUsers.length > 0 ? (
            <div className="space-y-3">
              {filteredUsers.map(user => (
                <Link 
                  key={user.id} 
                  to={`/profile/${user.username}`}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-lg"
                >
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-sm">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.fullName}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No dogs found for "{searchQuery}"</p>
          )}
        </div>
      ) : (
        <>
          {/* Featured dogs */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Featured Dogs</h2>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {mockUsers.map(user => (
                <Link
                  key={user.id}
                  to={`/profile/${user.username}`}
                  className="flex flex-col items-center flex-shrink-0"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 p-0.5">
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <p className="text-xs mt-1 text-center">{user.username}</p>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Trending posts */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Popular Posts</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
              {trendingPosts.map(post => {
                const user = mockUsers.find(u => u.id === post.userId);
                
                return (
                  <div key={post.id} className="relative aspect-square">
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                      <Link
                        to={`/profile/${user?.username}`}
                        className="text-white font-medium text-sm bg-black bg-opacity-50 px-2 py-1 rounded"
                      >
                        @{user?.username}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Collections */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Collections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">Puppies</h3>
                    <p className="text-sm text-blue-100 mt-1">Adorable puppy pictures</p>
                  </div>
                  <Bookmark className="h-5 w-5" />
                </div>
                <div className="mt-4 flex -space-x-2">
                  <img src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Puppy" className="h-8 w-8 rounded-full border-2 border-blue-500 object-cover" />
                  <img src="https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Puppy" className="h-8 w-8 rounded-full border-2 border-blue-500 object-cover" />
                  <img src="https://images.pexels.com/photos/39317/chihuahua-dog-puppy-cute-39317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Puppy" className="h-8 w-8 rounded-full border-2 border-blue-500 object-cover" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">Beach Dogs</h3>
                    <p className="text-sm text-purple-100 mt-1">Dogs enjoying the beach</p>
                  </div>
                  <Bookmark className="h-5 w-5" />
                </div>
                <div className="mt-4 flex -space-x-2">
                  <img src="https://images.pexels.com/photos/1959052/pexels-photo-1959052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Beach dog" className="h-8 w-8 rounded-full border-2 border-purple-500 object-cover" />
                  <img src="https://images.pexels.com/photos/1938123/pexels-photo-1938123.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Beach dog" className="h-8 w-8 rounded-full border-2 border-purple-500 object-cover" />
                  <img src="https://images.pexels.com/photos/1835008/pexels-photo-1835008.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Beach dog" className="h-8 w-8 rounded-full border-2 border-purple-500 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Explore;