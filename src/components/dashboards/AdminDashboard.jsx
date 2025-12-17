import { useAuth } from '../../contexts/AuthContext';
import Card from '../Card';
import Button from '../Button';
import Toast from '../Toast';
import { useState } from 'react';
import { Shield, Flag, Users, CheckCircle, XCircle, Ban, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { currentUser, appData, updateData } = useAuth();
  const [toast, setToast] = useState(null);

  // Pending mentor approvals
  const pendingMentors = appData.users?.filter(u => u.role === 'mentor' && !u.isApproved) || [];

  // Flagged forum posts
  const flaggedPosts = appData.forum_posts?.filter(post => post.isFlagged) || [];

  // All users
  const allUsers = appData.users || [];

  const handleApproveMentor = (userId) => {
    const updatedUsers = appData.users.map(user =>
      user.id === userId ? { ...user, isApproved: true } : user
    );
    updateData('users', updatedUsers);
    setToast({ message: 'Mentor approved successfully', type: 'success' });
  };

  const handleRejectMentor = (userId) => {
    const updatedUsers = appData.users.filter(user => user.id !== userId);
    updateData('users', updatedUsers);
    setToast({ message: 'Mentor application rejected', type: 'info' });
  };

  const handleUnflagPost = (postId) => {
    const updatedPosts = appData.forum_posts.map(post =>
      post.id === postId ? { ...post, isFlagged: false } : post
    );
    updateData('forum_posts', updatedPosts);
    setToast({ message: 'Post unflagged', type: 'success' });
  };

  const handleDeletePost = (postId) => {
    const updatedPosts = appData.forum_posts.filter(post => post.id !== postId);
    updateData('forum_posts', updatedPosts);
    setToast({ message: 'Post deleted', type: 'success' });
  };

  const handleSuspendUser = (userId) => {
    const updatedUsers = appData.users.map(user =>
      user.id === userId ? { ...user, isSuspended: true } : user
    );
    updateData('users', updatedUsers);
    setToast({ message: 'User suspended', type: 'success' });
  };

  const handleBanUser = (userId) => {
    const updatedUsers = appData.users.map(user =>
      user.id === userId ? { ...user, isBanned: true } : user
    );
    updateData('users', updatedUsers);
    setToast({ message: 'User banned', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-background py-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -z-10 inset-0">
        <div className="absolute -top-24 -right-16 w-72 h-72 bg-peach/60 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-[-80px] w-80 h-80 bg-cream/70 rounded-full blur-3xl" />
        <div className="absolute bottom-[-60px] right-1/4 w-64 h-64 bg-secondary/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-burgundy mb-2">Admin Dashboard</h1>
            <p className="text-text-main text-lg">Manage the Wonder Women platform</p>
          </div>
          <div className="hidden md:block">
            <div className="w-40 h-32 rounded-[2rem] bg-peach/60 flex items-center justify-center shadow-card-soft">
              <span className="text-burgundy font-semibold text-sm text-center px-3">
                Keeping the community safe
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-terracotta text-burgundy overflow-hidden relative rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-80 mb-1 text-sm">Pending Approvals</p>
                <p className="text-3xl font-bold">{pendingMentors.length}</p>
              </div>
              <Shield size={48} className="opacity-40" />
            </div>
          </Card>

          <Card className="bg-mustard text-burgundy overflow-hidden relative rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-80 mb-1 text-sm">Flagged Posts</p>
                <p className="text-3xl font-bold">{flaggedPosts.length}</p>
              </div>
              <Flag size={48} className="opacity-40" />
            </div>
          </Card>

          <Card className="bg-sage text-burgundy overflow-hidden relative rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-80 mb-1 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{allUsers.length}</p>
              </div>
              <Users size={48} className="opacity-40" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pending Mentor Approvals */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Shield size={24} />
                Pending Mentor Approvals
              </h2>
            </div>
            {pendingMentors.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending approvals</p>
            ) : (
              <div className="space-y-4">
                {pendingMentors.map((mentor) => (
                  <div key={mentor.id} className="border border-accent rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-text-main">{mentor.name}</h3>
                        <p className="text-sm text-gray-600">{mentor.bio}</p>
                        {mentor.industry && (
                          <p className="text-sm text-secondary mt-1">Industry: {mentor.industry}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          onClick={() => handleApproveMentor(mentor.id)}
                          className="text-sm"
                        >
                          <CheckCircle size={16} className="inline mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleRejectMentor(mentor.id)}
                          className="text-sm"
                        >
                          <XCircle size={16} className="inline mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Flagged Forum Posts */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Flag size={24} />
                Flagged Forum Posts
              </h2>
              <Link to="/forum">
                <Button variant="outline" className="text-sm">View Forum</Button>
              </Link>
            </div>
            {flaggedPosts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No flagged posts</p>
            ) : (
              <div className="space-y-4">
                {flaggedPosts.map((post) => (
                  <div key={post.id} className="border border-red-300 rounded-lg p-4 bg-red-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-text-main">{post.title}</h3>
                      <span className="px-2 py-1 bg-red-200 text-red-700 rounded text-xs font-semibold">
                        Flagged
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">By: {post.authorName}</p>
                    <p className="text-sm text-text-main line-clamp-2 mb-3">{post.content}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleUnflagPost(post.id)}
                        className="text-sm"
                      >
                        Unflag
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Users size={24} />
              User Management
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-accent">
                  <th className="text-left py-3 px-4 font-semibold text-text-main">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-text-main">Username</th>
                  <th className="text-left py-3 px-4 font-semibold text-text-main">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-text-main">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-text-main">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user.id} className="border-b border-accent hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-text-main">{user.name}</td>
                    <td className="py-3 px-4 text-gray-600">{user.username}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-accent bg-opacity-30 text-secondary rounded text-xs font-semibold capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.isBanned ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">Banned</span>
                      ) : user.isSuspended ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">Suspended</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Active</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {!user.isSuspended && !user.isBanned && (
                          <Button
                            variant="outline"
                            onClick={() => handleSuspendUser(user.id)}
                            className="text-xs"
                          >
                            Suspend
                          </Button>
                        )}
                        {!user.isBanned && (
                          <Button
                            variant="danger"
                            onClick={() => handleBanUser(user.id)}
                            className="text-xs"
                          >
                            <Ban size={14} className="inline mr-1" />
                            Ban
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

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

export default AdminDashboard;

