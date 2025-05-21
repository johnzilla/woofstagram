import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  userId: string;
  postId?: string;
  createdAt: string;
  read: boolean;
}

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would fetch notifications from an API
    setTimeout(() => {
      if (currentUser) {
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'like',
            userId: '2',
            postId: '1',
            createdAt: new Date('2024-06-15T10:30:00').toISOString(),
            read: false
          },
          {
            id: '2',
            type: 'comment',
            userId: '3',
            postId: '1',
            createdAt: new Date('2024-06-15T09:45:00').toISOString(),
            read: false
          },
          {
            id: '3',
            type: 'follow',
            userId: '2',
            createdAt: new Date('2024-06-14T15:20:00').toISOString(),
            read: true
          },
          {
            id: '4',
            type: 'like',
            userId: '3',
            postId: '2',
            createdAt: new Date('2024-06-14T11:10:00').toISOString(),
            read: true
          },
          {
            id: '5',
            type: 'comment',
            userId: '2',
            postId: '3',
            createdAt: new Date('2024-06-13T14:30:00').toISOString(),
            read: true
          }
        ];
        
        setNotifications(mockNotifications);
      }
      setLoading(false);
    }, 800);
  }, [currentUser]);
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getNotificationText = (notification: Notification) => {
    const username = `user_${notification.userId}`;
    
    switch (notification.type) {
      case 'like':
        return (
          <>
            <Link to={`/profile/${username}`} className="font-medium">
              {username}
            </Link>{' '}
            liked your post
          </>
        );
      case 'comment':
        return (
          <>
            <Link to={`/profile/${username}`} className="font-medium">
              {username}
            </Link>{' '}
            commented on your post
          </>
        );
      case 'follow':
        return (
          <>
            <Link to={`/profile/${username}`} className="font-medium">
              {username}
            </Link>{' '}
            started following you
          </>
        );
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-blue-500 text-sm font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => markAsRead(notification.id)}
              className={`p-4 rounded-lg flex items-start space-x-3 ${
                notification.read ? 'bg-white' : 'bg-blue-50'
              }`}
            >
              <div className="flex-shrink-0 p-2 rounded-full bg-gray-100">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1">
                <p className="text-sm">
                  {getNotificationText(notification)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </div>
              
              {notification.type !== 'follow' && notification.postId && (
                <div className="flex-shrink-0 ml-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
                    <img
                      src={`https://images.pexels.com/photos/3361739/pexels-photo-3361739.jpeg?auto=compress&cs=tinysrgb&w=100`}
                      alt="Post thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Notifications Yet</h3>
          <p className="text-gray-500 text-sm">
            When you get notifications about your posts or profile, you'll see them here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;