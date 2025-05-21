import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { mockPosts } from '../data/mockData';

const Upload = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setError('');
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Check if file is an image
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setError('');
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
      setPreviewURL(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }
    
    try {
      setUploading(true);
      
      // Mock upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would upload the file to a cloud service
      // and store the post information in a database
      
      if (currentUser) {
        // Create a new post with mock data
        const newPost = {
          id: `post-${Date.now()}`,
          userId: currentUser.id,
          image: previewURL || 'https://images.pexels.com/photos/3361739/pexels-photo-3361739.jpeg',
          caption,
          likes: [],
          comments: [],
          createdAt: new Date().toISOString()
        };
        
        // Add to mock data
        mockPosts.unshift(newPost);
        
        // Redirect to home page
        navigate('/');
      }
    } catch (err) {
      setError('Failed to upload post');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {!previewURL ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <UploadIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-700 mb-2">Drag and drop your dog photo here</p>
            <p className="text-gray-500 text-sm mb-4">or</p>
            <label
              htmlFor="file-upload"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium cursor-pointer inline-block"
            >
              Select from computer
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </motion.div>
        ) : (
          <div className="relative mb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <img
                src={previewURL}
                alt="Preview"
                className="w-full h-auto rounded-lg max-h-96 object-contain bg-black"
              />
              <button
                type="button"
                onClick={clearSelectedFile}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        )}
        
        <div className="mb-6">
          <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
            Caption
          </label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-24"
            placeholder="Write a caption for your dog photo..."
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Posting...' : 'Share'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;