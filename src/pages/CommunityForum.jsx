import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import RoleWrapper from '../components/RoleWrapper';
import Toast from '../components/Toast';
import { MessageSquare, Plus, Trash2, Send, Heart, Flag, Search, Volume2, Ban, Reply } from 'lucide-react';

const CommunityForum = () => {
  const { currentUser, appData, updateData } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'General',
    content: ''
  });
  const [announcementText, setAnnouncementText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingToReplyId, setReplyingToReplyId] = useState(null);
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [listReplyText, setListReplyText] = useState('');

  const categories = ['All', 'Career Advice', 'Technology', 'General', 'Business'];
  const forumPosts = appData.forum_posts || [];
  const announcements = appData.announcements || [];

  // Filter posts
  const filteredPosts = forumPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch && !post.isFlagged;
  });

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) {
      setToast({ message: 'Please fill all fields', type: 'error' });
      return;
    }

    const post = {
      id: Date.now(),
      ...newPost,
      authorId: currentUser.id,
      authorName: currentUser.name,
      timestamp: 'Just now',
      likes: 0,
      likedBy: [],
      isFlagged: false,
      replies: []
    };

    updateData('forum_posts', [post, ...forumPosts]);
    setShowCreateModal(false);
    setNewPost({ title: '', category: 'General', content: '' });
    setToast({ message: 'Post created successfully!', type: 'success' });
  };

  const handleLike = (postId) => {
    const updatedPosts = forumPosts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy?.includes(currentUser.id);
        const newIsLiked = !isLiked;

        // Create notification for post author when someone likes their post
        if (newIsLiked && post.authorId !== currentUser.id) {
          const notification = {
            id: Date.now(),
            userId: post.authorId,
            text: `${currentUser.name} liked your post: "${post.title}"`,
            read: false,
            timestamp: new Date().toISOString(),
            postId: post.id,
            type: 'like'
          };
          updateData('notifications', [...(appData.notifications || []), notification]);
        }

        return {
          ...post,
          likes: isLiked ? (post.likes || 0) - 1 : (post.likes || 0) + 1,
          likedBy: isLiked
            ? (post.likedBy || []).filter(id => id !== currentUser.id)
            : [...(post.likedBy || []), currentUser.id]
        };
      }
      return post;
    });

    updateData('forum_posts', updatedPosts);

    // Update selectedPost if viewing it
    if (selectedPost && selectedPost.id === postId) {
      const updatedPost = updatedPosts.find(p => p.id === postId);
      setSelectedPost(updatedPost);
    }
  };

  const handleReply = (postId, parentReplyId = null, contentOverride) => {
    const content = (contentOverride !== undefined ? contentOverride : replyText).trim();
    if (!content) {
      setToast({ message: 'Please enter a reply', type: 'error' });
      return;
    }

    const updatedPosts = forumPosts.map(post => {
      if (post.id === postId) {
        const newReply = {
          id: Date.now(),
          authorId: currentUser.id,
          authorName: currentUser.name,
          content,
          timestamp: new Date().toISOString(),
          parentReplyId: parentReplyId || null,
          replies: []
        };

        // Ensure replies array exists
        const currentReplies = post.replies || [];

        if (parentReplyId) {
          // This is a nested reply - find the parent reply and add to its replies
          const addNestedReply = (replies) => {
            return replies.map(reply => {
              if (reply.id === parentReplyId) {
                return {
                  ...reply,
                  replies: [...(reply.replies || []), newReply]
                };
              } else if (reply.replies && reply.replies.length > 0) {
                return {
                  ...reply,
                  replies: addNestedReply(reply.replies)
                };
              }
              return reply;
            });
          };

          const updatedReplies = addNestedReply(currentReplies);

          // Create notification for parent reply author
          const findParentReply = (replies) => {
            for (const reply of replies) {
              if (reply.id === parentReplyId) return reply;
              if (reply.replies && reply.replies.length > 0) {
                const found = findParentReply(reply.replies);
                if (found) return found;
              }
            }
            return null;
          };

          const parentReply = findParentReply(currentReplies);
          if (parentReply && parentReply.authorId !== currentUser.id) {
            const notification = {
              id: Date.now(),
              userId: parentReply.authorId,
              text: `${currentUser.name} replied to your comment`,
              read: false,
              timestamp: new Date().toISOString(),
              postId: post.id,
              type: 'comment_reply'
            };
            updateData('notifications', [...(appData.notifications || []), notification]);
          }

          return {
            ...post,
            replies: updatedReplies
          };
        } else {
          // This is a top-level reply
          // Create notification for post author
          if (post.authorId !== currentUser.id) {
            const notification = {
              id: Date.now(),
              userId: post.authorId,
              text: `${currentUser.name} replied to your post: "${post.title}"`,
              read: false,
              timestamp: new Date().toISOString(),
              postId: post.id,
              type: 'reply'
            };
            updateData('notifications', [...(appData.notifications || []), notification]);
          }

          return {
            ...post,
            replies: [...currentReplies, newReply]
          };
        }
      }
      return post;
    });

    updateData('forum_posts', updatedPosts);

    // Update selectedPost with the latest data
    const updatedPost = updatedPosts.find(p => p.id === postId);
    if (updatedPost) {
      setSelectedPost(updatedPost);
    }

    setReplyText('');
    setReplyingToReplyId(null);
    setToast({ message: 'Reply posted!', type: 'success' });
  };

  const handleListReplySubmit = (postId) => {
    if (!listReplyText.trim()) {
      setToast({ message: 'Please enter a reply', type: 'error' });
      return;
    }
    // Submit as a top-level reply for this post
    handleReply(postId, null, listReplyText);
    setListReplyText('');
    // Close the reply section after successful submission
    setActiveReplyPostId(null);
  };

  const togglePostReplySection = (postId) => {
    if (activeReplyPostId === postId) {
      setActiveReplyPostId(null);
      setListReplyText('');
    } else {
      setActiveReplyPostId(postId);
      setListReplyText('');
    }
  };

  const handleReportPost = (postId) => {
    const updatedPosts = forumPosts.map(post =>
      post.id === postId ? { ...post, isFlagged: true } : post
    );
    updateData('forum_posts', updatedPosts);
    setToast({ message: 'Post reported. Admin will review it.', type: 'info' });
  };

  const handleDeletePost = (postId) => {
    updateData('forum_posts', forumPosts.filter(post => post.id !== postId));
    if (selectedPost?.id === postId) {
      setSelectedPost(null);
    }
    setToast({ message: 'Post deleted', type: 'success' });
  };

  const handleUnflagPost = (postId) => {
    const updatedPosts = forumPosts.map(post =>
      post.id === postId ? { ...post, isFlagged: false } : post
    );
    updateData('forum_posts', updatedPosts);
    setToast({ message: 'Post unflagged', type: 'success' });
  };

  const handleBroadcastAnnouncement = () => {
    if (!announcementText.trim()) {
      setToast({ message: 'Please enter announcement text', type: 'error' });
      return;
    }

    const announcement = {
      id: Date.now(),
      text: announcementText,
      date: new Date().toISOString().split('T')[0]
    };

    updateData('announcements', [...announcements, announcement]);

    // Create notification for all users
    const allUsers = appData.users || [];
    const notifications = allUsers.map(user => ({
      id: Date.now() + user.id,
      userId: user.id,
      text: `New announcement: ${announcementText.substring(0, 50)}...`,
      read: false
    }));
    updateData('notifications', [...(appData.notifications || []), ...notifications]);

    setShowAnnouncementModal(false);
    setAnnouncementText('');
    setToast({ message: 'Announcement broadcasted!', type: 'success' });
  };

  const handleViewPost = (post) => {
    // Always get the latest post data from appData
    const latestPost = forumPosts.find(p => p.id === post.id);
    setSelectedPost(latestPost || post);
  };

  const isLiked = (post) => {
    return post.likedBy?.includes(currentUser.id) || false;
  };

  // Refresh selectedPost when forum_posts updates
  useEffect(() => {
    if (selectedPost) {
      const updatedPost = forumPosts.find(p => p.id === selectedPost.id);
      if (updatedPost) {
        setSelectedPost(updatedPost);
      }
    }
  }, [forumPosts, selectedPost?.id]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Community Forum</h1>
            <p className="text-text-main">Share experiences, ask questions, and support each other</p>
          </div>
          <div className="flex gap-2">
            <RoleWrapper allowedRoles={['admin']}>
              <Button onClick={() => setShowAnnouncementModal(true)} variant="secondary">
                <Volume2 size={18} className="inline mr-2" />
                Broadcast Announcement
              </Button>
            </RoleWrapper>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus size={20} className="inline mr-2" />
              Create Post
            </Button>
          </div>
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div className="mb-6 space-y-2">
            {announcements.slice(0, 3).map((announcement) => (
              <Card key={announcement.id} className="bg-accent/10 border border-accent/40">
                <div className="flex items-start gap-3">
                  <Volume2 className="text-accent mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-text-main">Announcement</p>
                    <p className="text-sm text-text-main/80">{announcement.text}</p>
                    <p className="text-xs text-text-main/60 mt-1">{announcement.date}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts by keyword or tag..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-white shadow-sm"
          />
        </div>

        {/* Category Filters */}
        <div className="mb-6 flex gap-4 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === category
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-primary/5 text-text-main border border-transparent hover:bg-primary hover:text-white'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {!selectedPost ? (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="cursor-pointer hover:shadow-xl transition-shadow" onClick={() => handleViewPost(post)}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-primary">{post.title}</h3>
                      <span className="px-2 py-1 bg-accent bg-opacity-30 text-secondary rounded text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      by {post.authorName} • {post.timestamp}
                    </p>
                    <p className="text-text-main line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.id);
                        }}
                        className={`flex items-center gap-1 text-sm transition-colors ${isLiked(post) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                          }`}
                      >
                        <Heart size={16} className={isLiked(post) ? 'fill-current' : ''} />
                        {post.likes || 0}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePostReplySection(post.id);
                        }}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors"
                      >
                        <MessageSquare size={16} className="inline mr-1" />
                        {post.replies?.length || 0} {post.replies?.length === 1 ? 'reply' : 'replies'}
                      </button>
                    </div>
                    {activeReplyPostId === post.id && (
                      <div className="mt-3 border-t border-accent pt-3 space-y-3">
                        {post.replies && post.replies.length > 0 && (
                          <div className="space-y-2">
                            {post.replies.map((reply) => (
                              <div key={reply.id} className="bg-gray-50 rounded-lg p-3 border border-accent">
                                <p className="font-semibold text-primary mb-1">{reply.authorName}</p>
                                <p className="text-text-main text-sm">{reply.content}</p>
                                {reply.timestamp && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(reply.timestamp).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="space-y-2">
                          <textarea
                            value={listReplyText}
                            onChange={(e) => setListReplyText(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            placeholder="Write a reply to this post..."
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveReplyPostId(null);
                                setListReplyText('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleListReplySubmit(post.id);
                              }}
                            >
                              Submit
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      onClick={() => handleReportPost(post.id)}
                      className="text-xs"
                    >
                      <Flag size={14} className="inline mr-1" />
                      Report
                    </Button>
                    <RoleWrapper allowedRoles={['admin']}>
                      <Button
                        variant="danger"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </RoleWrapper>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <Button
              variant="outline"
              onClick={() => setSelectedPost(null)}
              className="mb-4"
            >
              ← Back to Forum
            </Button>
            <Card>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-primary">{selectedPost.title}</h2>
                  <span className="px-2 py-1 bg-accent bg-opacity-30 text-secondary rounded text-sm font-semibold">
                    {selectedPost.category}
                  </span>
                  <button
                    onClick={() => handleLike(selectedPost.id)}
                    className={`flex items-center gap-1 ml-auto transition-colors ${isLiked(selectedPost) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                  >
                    <Heart size={20} className={isLiked(selectedPost) ? 'fill-current' : ''} />
                    {selectedPost.likes || 0}
                  </button>
                  <RoleWrapper allowedRoles={['admin']}>
                    <Button
                      variant="danger"
                      onClick={() => {
                        handleDeletePost(selectedPost.id);
                        setSelectedPost(null);
                      }}
                    >
                      <Trash2 size={18} className="inline mr-1" />
                      Delete
                    </Button>
                  </RoleWrapper>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  by {selectedPost.authorName} • {selectedPost.timestamp}
                </p>
                <p className="text-text-main whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              <div className="border-t border-accent pt-6">
                <h3 className="text-lg font-bold text-primary mb-4">
                  Replies ({(selectedPost.replies || []).length})
                </h3>

                {/* Recursive Reply Component */}
                {(() => {
                  const renderReply = (reply, depth = 0) => {
                    const nestedReplies = reply.replies || [];
                    return (
                      <div key={reply.id} className={`${depth > 0 ? 'ml-6 mt-3' : ''}`}>
                        <div className="bg-gray-50 rounded-lg p-4 border border-accent">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-primary mb-1">{reply.authorName}</p>
                              <p className="text-text-main">{reply.content}</p>
                              {reply.timestamp && (
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(reply.timestamp).toLocaleString()}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setReplyingToReplyId(reply.id);
                                document.getElementById('reply-input')?.focus();
                              }}
                              className="ml-2 p-2 text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors"
                              title="Reply to this comment"
                            >
                              <Reply size={16} />
                            </button>
                          </div>
                        </div>
                        {nestedReplies.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {nestedReplies.map(nestedReply => renderReply(nestedReply, depth + 1))}
                          </div>
                        )}
                      </div>
                    );
                  };

                  return (
                    <div className="space-y-4 mb-6">
                      {!selectedPost.replies || selectedPost.replies.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No replies yet. Be the first to reply!</p>
                      ) : (
                        (selectedPost.replies || []).map((reply) => renderReply(reply))
                      )}
                    </div>
                  );
                })()}

                <div className="border-t border-accent pt-4">
                  <h4 className="text-sm font-semibold text-text-main mb-2">
                    {replyingToReplyId ? 'Reply to comment' : 'Add a Reply'}
                  </h4>
                  {replyingToReplyId && (
                    <button
                      onClick={() => setReplyingToReplyId(null)}
                      className="text-xs text-primary mb-2 hover:underline"
                    >
                      Cancel reply to comment
                    </button>
                  )}
                  <div className="flex gap-2">
                    <input
                      id="reply-input"
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleReply(selectedPost.id, replyingToReplyId);
                        }
                      }}
                      placeholder={replyingToReplyId ? "Write a reply to this comment..." : "Write a reply..."}
                      className="flex-1 px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      variant="primary"
                      onClick={() => handleReply(selectedPost.id, replyingToReplyId)}
                    >
                      <Send size={18} className="inline mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {filteredPosts.length === 0 && !selectedPost && (
          <div className="text-center py-12">
            <p className="text-text-main text-lg">No posts found in this category.</p>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewPost({ title: '', category: 'General', content: '' });
        }}
        title="Create New Post"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Title</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter post title"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Category</label>
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Career Advice">Career Advice</option>
              <option value="Technology">Technology</option>
              <option value="General">General</option>
              <option value="Business">Business</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Content</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Share your thoughts..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleCreatePost} className="flex-1">Create Post</Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setNewPost({ title: '', category: 'General', content: '' });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Broadcast Announcement Modal */}
      <Modal
        isOpen={showAnnouncementModal}
        onClose={() => {
          setShowAnnouncementModal(false);
          setAnnouncementText('');
        }}
        title="Broadcast Announcement"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Announcement Text</label>
            <textarea
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Enter announcement text..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleBroadcastAnnouncement} className="flex-1">
              Broadcast
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAnnouncementModal(false);
                setAnnouncementText('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CommunityForum;
