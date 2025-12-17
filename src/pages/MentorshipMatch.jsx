import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import RoleWrapper from '../components/RoleWrapper';
import Toast from '../components/Toast';
import { Check, X, UserCheck, Search, MessageSquare, Calendar, Star, Send } from 'lucide-react';

const MentorshipMatch = () => {
  const { currentUser, appData, updateData } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchIndustry, setSearchIndustry] = useState('');
  const [searchSkills, setSearchSkills] = useState('');
  const [searchMenteeIndustry, setSearchMenteeIndustry] = useState('');
  const [searchMenteeSkills, setSearchMenteeSkills] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [meetingForm, setMeetingForm] = useState({ date: '', time: '', link: '', venue: '', meetingType: 'online' });
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '', privateFeedback: '', isPublic: true });
  const [toast, setToast] = useState(null);

  const users = appData.users || [];
  const mentorshipRequests = appData.mentorship_requests || [];
  const messages = appData.messages || [];
  const meetings = appData.meetings || [];
  const feedbacks = appData.feedbacks || [];

  // Get all mentors (approved)
  const mentors = users.filter(u => u.role === 'mentor' && u.isApproved);
  const mentees = users.filter(u => u.role === 'mentee');

  // Get industries and skills from mentors
  const industries = ['All', ...new Set(mentors.map(m => m.industry).filter(Boolean))];
  const allSkills = [...new Set(mentors.flatMap(m => m.skills || []))];

  // Get industries and skills from mentees
  const menteeIndustries = ['All', ...new Set(mentees.map(m => m.industry).filter(Boolean))];
  const menteeSkills = [...new Set(mentees.flatMap(m => m.skills || []))];

  // Filter mentors
  const filteredMentors = mentors.filter(mentor => {
    const matchesIndustry = !searchIndustry || searchIndustry === 'All' || mentor.industry === searchIndustry;
    const matchesSkills = !searchSkills || (mentor.skills || []).some(skill => 
      skill.toLowerCase().includes(searchSkills.toLowerCase())
    );
    return matchesIndustry && matchesSkills;
  });

  // Filter mentees
  const filteredMentees = mentees.filter(mentee => {
    const matchesIndustry = !searchMenteeIndustry || searchMenteeIndustry === 'All' || mentee.industry === searchMenteeIndustry;
    const matchesSkills = !searchMenteeSkills || (mentee.skills || []).some(skill => 
      skill.toLowerCase().includes(searchMenteeSkills.toLowerCase())
    );
    return matchesIndustry && matchesSkills;
  });

  // Get connections for current user
  const connections = mentorshipRequests.filter(req => 
    (req.mentorId === currentUser.id || req.menteeId === currentUser.id) && req.status === 'connected'
  );

  // Get pending requests
  const pendingRequests = mentorshipRequests.filter(req => 
    (req.mentorId === currentUser.id || req.menteeId === currentUser.id) && req.status === 'pending'
  );

  const handleRequestConnection = (mentorId) => {
    const existingRequest = mentorshipRequests.find(
      req => req.mentorId === mentorId && req.menteeId === currentUser.id
    );
    
    if (existingRequest) {
      setToast({ message: 'Request already sent', type: 'info' });
      return;
    }

    const newRequest = {
      id: Date.now(),
      mentorId,
      menteeId: currentUser.id,
      status: 'pending'
    };

    updateData('mentorship_requests', [...mentorshipRequests, newRequest]);
    
    // Create notification
    const mentor = users.find(u => u.id === mentorId);
    const notification = {
      id: Date.now(),
      userId: mentorId,
      text: `${currentUser.name} requested mentorship`,
      read: false
    };
    updateData('notifications', [...(appData.notifications || []), notification]);
    
    setToast({ message: 'Request Sent', type: 'success' });
  };

  const handleAcceptRequest = (requestId) => {
    const updatedRequests = mentorshipRequests.map(req =>
      req.id === requestId ? { ...req, status: 'connected' } : req
    );
    updateData('mentorship_requests', updatedRequests);
    
    // Create notification
    const request = mentorshipRequests.find(r => r.id === requestId);
    const notification = {
      id: Date.now(),
      userId: request.menteeId,
      text: `Your mentorship request was accepted!`,
      read: false
    };
    updateData('notifications', [...(appData.notifications || []), notification]);
    
    setToast({ message: 'Mentorship request accepted', type: 'success' });
  };

  const handleDeclineRequest = (requestId) => {
    updateData('mentorship_requests', mentorshipRequests.filter(req => req.id !== requestId));
    setToast({ message: 'Mentorship request declined', type: 'info' });
  };

  const handleSendMessage = (receiverId) => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId,
      text: chatMessage,
      timestamp: new Date().toISOString(),
      status: 'sent' // TODO: Implement 'seen' status with websocket or polling mechanism
    };

    updateData('messages', [...messages, newMessage]);
    
    // Create notification
    const notification = {
      id: Date.now(),
      userId: receiverId,
      text: `New message from ${currentUser.name}`,
      read: false
    };
    updateData('notifications', [...(appData.notifications || []), notification]);
    
    setChatMessage('');
    setToast({ message: 'Message sent!', type: 'success' });
  };

  const handleBookMeeting = () => {
    if (!meetingForm.date || !meetingForm.time) {
      setToast({ message: 'Please fill all fields', type: 'error' });
      return;
    }

    if (meetingForm.meetingType === 'online' && !meetingForm.link) {
      setToast({ message: 'Please provide a meeting link for online meetings', type: 'error' });
      return;
    }
    if (meetingForm.meetingType === 'physical' && !meetingForm.venue) {
      setToast({ message: 'Please provide a venue for physical meetings', type: 'error' });
      return;
    }

    const newMeeting = {
      id: Date.now(),
      mentorId: selectedUser.role === 'mentor' ? selectedUser.id : currentUser.id,
      menteeId: selectedUser.role === 'mentee' ? selectedUser.id : currentUser.id,
      date: meetingForm.date,
      time: meetingForm.time,
      link: meetingForm.meetingType === 'online' ? meetingForm.link : '',
      venue: meetingForm.meetingType === 'physical' ? meetingForm.venue : '',
      meetingType: meetingForm.meetingType,
      status: 'scheduled'
    };

    updateData('meetings', [...meetings, newMeeting]);
    setShowMeetingModal(false);
    setMeetingForm({ date: '', time: '', link: '', venue: '', meetingType: 'online' });
    setToast({ message: 'Meeting scheduled!', type: 'success' });
  };

  const handleSubmitFeedback = () => {
    if (!feedbackForm.comment && !feedbackForm.privateFeedback) {
      setToast({ message: 'Please write feedback', type: 'error' });
      return;
    }

    const newFeedback = {
      id: Date.now(),
      mentorId: selectedUser.role === 'mentor' ? selectedUser.id : currentUser.id,
      menteeId: selectedUser.role === 'mentee' ? selectedUser.id : currentUser.id,
      rating: feedbackForm.rating,
      comment: feedbackForm.comment || '',
      privateFeedback: feedbackForm.privateFeedback || '',
      isPublic: feedbackForm.isPublic,
      date: new Date().toISOString()
    };

    updateData('feedbacks', [...(feedbacks || []), newFeedback]);
    setShowFeedbackModal(false);
    setFeedbackForm({ rating: 5, comment: '', privateFeedback: '', isPublic: true });
    setToast({ message: 'Feedback submitted!', type: 'success' });
  };

  const getChatMessages = (otherUserId) => {
    return messages.filter(m =>
      (m.senderId === currentUser.id && m.receiverId === otherUserId) ||
      (m.senderId === otherUserId && m.receiverId === currentUser.id)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const getOtherUser = (request) => {
    if (currentUser.role === 'mentor') {
      return users.find(u => u.id === request.menteeId);
    } else {
      return users.find(u => u.id === request.mentorId);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Mentorship Match</h1>
          <p className="text-text-main">Connect with experienced mentors in your field</p>
        </div>

        <div className="flex gap-2 mb-6 border-b border-accent">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'browse'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-main hover:text-primary'
            }`}
          >
            Browse Mentors
          </button>
          <RoleWrapper allowedRoles={['mentor', 'admin']}>
            <button
              onClick={() => setActiveTab('browseMentees')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'browseMentees'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-main hover:text-primary'
              }`}
            >
              Browse Mentees
            </button>
          </RoleWrapper>
          <button
            onClick={() => setActiveTab('connections')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'connections'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-main hover:text-primary'
            }`}
          >
            My Connections ({connections.length})
          </button>
          <RoleWrapper allowedRoles={['mentor']}>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'requests'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-main hover:text-primary'
              }`}
            >
              Requests ({pendingRequests.filter(r => r.mentorId === currentUser.id).length})
            </button>
          </RoleWrapper>
          <RoleWrapper allowedRoles={['admin']}>
            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'approvals'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-main hover:text-primary'
              }`}
            >
              Pending Approvals
            </button>
          </RoleWrapper>
        </div>

        {activeTab === 'browse' && (
          <>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={searchIndustry}
                  onChange={(e) => setSearchIndustry(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchSkills}
                  onChange={(e) => setSearchSkills(e.target.value)}
                  placeholder="Search by skills..."
                  className="w-full pl-10 pr-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <Card key={mentor.id}>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={mentor.avatar || `https://placehold.co/150x150/4E56C0/FFFFFF?text=${mentor.name.charAt(0)}`}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-primary">{mentor.name}</h3>
                      <p className="text-sm text-gray-600">{mentor.industry}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-text-main mb-2">{mentor.bio}</p>
                    {mentor.experience && (
                      <p className="text-xs text-gray-600 mb-2">Experience: {mentor.experience}</p>
                    )}
                    {mentor.availability && (
                      <p className="text-xs text-gray-600">Available: {mentor.availability.join(', ')}</p>
                    )}
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {(mentor.skills || []).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-accent bg-opacity-30 text-secondary rounded text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(mentor);
                        setShowProfileModal(true);
                      }}
                      className="flex-1"
                    >
                      View Profile
                    </Button>
                    <RoleWrapper allowedRoles={['mentee']}>
                      <Button
                        variant="primary"
                        onClick={() => handleRequestConnection(mentor.id)}
                        className="flex-1"
                      >
                        Request Connection
                      </Button>
                    </RoleWrapper>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'browseMentees' && (
          <>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={searchMenteeIndustry}
                  onChange={(e) => setSearchMenteeIndustry(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {menteeIndustries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchMenteeSkills}
                  onChange={(e) => setSearchMenteeSkills(e.target.value)}
                  placeholder="Search by skills..."
                  className="w-full pl-10 pr-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentees.map((mentee) => (
                <Card key={mentee.id}>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={mentee.avatar || `https://placehold.co/150x150/4E56C0/FFFFFF?text=${mentee.name.charAt(0)}`}
                      alt={mentee.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-primary">{mentee.name}</h3>
                      {mentee.industry && (
                        <p className="text-sm text-gray-600">{mentee.industry}</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-text-main mb-2">{mentee.bio}</p>
                    {mentee.age && (
                      <p className="text-xs text-gray-600 mb-2">Age: {mentee.age}</p>
                    )}
                    {mentee.goals && (
                      <p className="text-xs text-gray-600 mb-2">Goals: {mentee.goals}</p>
                    )}
                    {mentee.experience && (
                      <p className="text-xs text-gray-600">Experience: {mentee.experience}</p>
                    )}
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {(mentee.skills || []).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-accent bg-opacity-30 text-secondary rounded text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(mentee);
                        setShowProfileModal(true);
                      }}
                      className="flex-1"
                    >
                      View Profile
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            {filteredMentees.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-main text-lg">No mentees found matching your filters.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'connections' && (
          <div className="space-y-4">
            {connections.length === 0 ? (
              <Card>
                <p className="text-center text-text-main py-8">No connections yet</p>
              </Card>
            ) : (
              connections.map((connection) => {
                const otherUser = getOtherUser(connection);
                return (
                  <Card key={connection.id}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <img
                          src={otherUser?.avatar || `https://placehold.co/100x100/4E56C0/FFFFFF?text=${otherUser?.name.charAt(0)}`}
                          alt={otherUser?.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-bold text-primary">{otherUser?.name}</h3>
                          <p className="text-sm text-gray-600">{otherUser?.bio}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          onClick={() => {
                            setSelectedUser(otherUser);
                            setShowChatModal(true);
                          }}
                        >
                          <MessageSquare size={18} className="inline mr-1" />
                          Message
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSelectedUser(otherUser);
                            setShowMeetingModal(true);
                          }}
                        >
                          <Calendar size={18} className="inline mr-1" />
                          Book Meeting
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(otherUser);
                            setShowFeedbackModal(true);
                          }}
                        >
                          <Star size={18} className="inline mr-1" />
                          Feedback
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-4">
            {pendingRequests.filter(r => r.mentorId === currentUser.id).length === 0 ? (
              <Card>
                <p className="text-center text-text-main py-8">No pending requests</p>
              </Card>
            ) : (
              pendingRequests.filter(r => r.mentorId === currentUser.id).map((request) => {
                const mentee = users.find(u => u.id === request.menteeId);
                return (
                  <Card key={request.id}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-primary">{mentee?.name}</h3>
                        <p className="text-sm text-gray-600">{mentee?.bio}</p>
                        {mentee?.goals && (
                          <p className="text-xs text-gray-500 mt-1">Goals: {mentee.goals}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          <Check size={18} className="inline mr-1" />
                          Accept
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeclineRequest(request.id)}
                        >
                          <X size={18} className="inline mr-1" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-4">
            {users.filter(u => u.role === 'mentor' && !u.isApproved).length === 0 ? (
              <Card>
                <p className="text-center text-text-main py-8">No pending mentor applications</p>
              </Card>
            ) : (
              users.filter(u => u.role === 'mentor' && !u.isApproved).map((mentor) => (
                <Card key={mentor.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={mentor.avatar || `https://placehold.co/150x150/4E56C0/FFFFFF?text=${mentor.name.charAt(0)}`}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-primary">{mentor.name}</h3>
                        <p className="text-sm text-gray-600">{mentor.bio}</p>
                        {mentor.industry && (
                          <p className="text-xs text-secondary mt-1">{mentor.industry}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        onClick={() => {
                          const updatedUsers = users.map(u =>
                            u.id === mentor.id ? { ...u, isApproved: true } : u
                          );
                          updateData('users', updatedUsers);
                          setToast({ message: 'Mentor approved', type: 'success' });
                        }}
                      >
                        <UserCheck size={18} className="inline mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          updateData('users', users.filter(u => u.id !== mentor.id));
                          setToast({ message: 'Mentor application rejected', type: 'info' });
                        }}
                      >
                        <X size={18} className="inline mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title={`${selectedUser?.name}'s Profile`}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={selectedUser.avatar || `https://placehold.co/100x100/4E56C0/FFFFFF?text=${selectedUser.name.charAt(0)}`}
                alt={selectedUser.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-2xl font-bold text-primary">{selectedUser.name}</h3>
                <p className="text-gray-600">{selectedUser.bio}</p>
              </div>
            </div>
            {selectedUser.industry && (
              <div>
                <h4 className="font-semibold text-text-main mb-1">Industry</h4>
                <p className="text-gray-600">{selectedUser.industry}</p>
              </div>
            )}
            {selectedUser.experience && (
              <div>
                <h4 className="font-semibold text-text-main mb-1">Experience</h4>
                <p className="text-gray-600">{selectedUser.experience}</p>
              </div>
            )}
            {(selectedUser.skills || []).length > 0 && (
              <div>
                <h4 className="font-semibold text-text-main mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-accent bg-opacity-30 text-secondary rounded text-sm font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {selectedUser.goals && (
              <div>
                <h4 className="font-semibold text-text-main mb-1">Goals</h4>
                <p className="text-gray-600">{selectedUser.goals}</p>
              </div>
            )}
            {selectedUser.availability && (
              <div>
                <h4 className="font-semibold text-text-main mb-1">Availability</h4>
                <p className="text-gray-600">{selectedUser.availability.join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Chat Modal */}
      <Modal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        title={`Chat with ${selectedUser?.name}`}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="h-64 overflow-y-auto border border-accent rounded-lg p-4 space-y-3">
              {getChatMessages(selectedUser.id).map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.senderId === currentUser.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-text-main'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${message.senderId === currentUser.id ? 'text-white opacity-80' : 'text-gray-500'}`}>
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(selectedUser.id);
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                variant="primary"
                onClick={() => handleSendMessage(selectedUser.id)}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Book Meeting Modal */}
      <Modal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        title={`Book Meeting with ${selectedUser?.name}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Meeting Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="meetingType"
                  value="online"
                  checked={meetingForm.meetingType === 'online'}
                  onChange={(e) => setMeetingForm({ ...meetingForm, meetingType: e.target.value, link: '', venue: '' })}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-text-main">Online</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="meetingType"
                  value="physical"
                  checked={meetingForm.meetingType === 'physical'}
                  onChange={(e) => setMeetingForm({ ...meetingForm, meetingType: e.target.value, link: '', venue: '' })}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-text-main">Physical</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Date</label>
            <input
              type="date"
              value={meetingForm.date}
              onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Time</label>
            <input
              type="time"
              value={meetingForm.time}
              onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {meetingForm.meetingType === 'online' ? (
            <div>
              <label className="block text-sm font-semibold text-text-main mb-2">Meeting Link *</label>
              <input
                type="text"
                value={meetingForm.link}
                onChange={(e) => setMeetingForm({ ...meetingForm, link: e.target.value })}
                placeholder="zoom.us/j/123"
                className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-text-main mb-2">Venue/Location *</label>
              <input
                type="text"
                value={meetingForm.venue}
                onChange={(e) => setMeetingForm({ ...meetingForm, venue: e.target.value })}
                placeholder="Enter meeting location"
                className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleBookMeeting} className="flex-1">Book Meeting</Button>
            <Button variant="outline" onClick={() => setShowMeetingModal(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        title={`Leave Feedback for ${selectedUser?.name}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Rating</label>
            <p className="text-xs text-gray-600 mb-2">You can give stars to rate the mentor.</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    className={star <= feedbackForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Public Review</label>
            <textarea
              value={feedbackForm.comment}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="This review will be visible on the mentor's profile..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Private Feedback (for admin/internal use)</label>
            <textarea
              value={feedbackForm.privateFeedback}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, privateFeedback: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="This feedback is only visible to admins..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleSubmitFeedback} className="flex-1">Submit Feedback</Button>
            <Button variant="outline" onClick={() => setShowFeedbackModal(false)} className="flex-1">Cancel</Button>
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

export default MentorshipMatch;
