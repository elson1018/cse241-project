import { useAuth } from '../../contexts/AuthContext';
import Card from '../Card';
import Button from '../Button';
import { BookOpen, Users, ShoppingBag, TrendingUp, Calendar, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { currentUser, appData } = useAuth();

  // Get enrolled courses with progress
  const enrolledCourses = appData.courses.filter(course => {
    const enrollment = appData.enrollments?.find(e => e.userId === currentUser.id && e.courseId === course.id);
    return enrollment;
  }).map(course => {
    const enrollment = appData.enrollments?.find(e => e.userId === currentUser.id && e.courseId === course.id);
    return { ...course, progress: enrollment?.progress || 0 };
  });

  // Get upcoming meetings
  const upcomingMeetings = appData.meetings?.filter(
    meeting => (meeting.mentorId === currentUser.id || meeting.menteeId === currentUser.id) && 
    meeting.status === 'scheduled' &&
    new Date(`${meeting.date}T${meeting.time}`) >= new Date()
  ) || [];

  // Get recent orders
  const recentOrders = appData.orders?.filter(order => order.buyerId === currentUser.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5) || [];

  const getProductName = (productId) => {
    const product = appData.products?.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-blue-100 text-blue-700',
      shipped: 'bg-yellow-100 text-yellow-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-burgundy mb-2">Welcome back, {currentUser.name}!</h1>
            <p className="text-text-main text-lg">Here's your activity overview</p>
          </div>
          <div className="hidden md:block">
            {/* Placeholder for future illustration */}
            <div className="w-40 h-32 rounded-3xl bg-gradient-to-br from-peach via-primary/10 to-accent/20 flex items-center justify-center">
              <span className="text-burgundy font-semibold text-sm text-center px-3">
                Empowering your journey
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-peach to-primary text-white overflow-hidden relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white opacity-90 mb-1">Enrolled Courses</p>
                <p className="text-3xl font-bold">{enrolledCourses.length}</p>
              </div>
              <BookOpen size={56} className="opacity-20" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-primary to-secondary text-white overflow-hidden relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white opacity-90 mb-1">Upcoming Meetings</p>
                <p className="text-3xl font-bold">{upcomingMeetings.length}</p>
              </div>
              <Calendar size={56} className="opacity-20" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-accent to-primary text-white overflow-hidden relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white opacity-90 mb-1">Total Orders</p>
                <p className="text-3xl font-bold">{recentOrders.length}</p>
              </div>
              <ShoppingBag size={56} className="opacity-20" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Learning Progress */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp size={24} />
                My Learning Progress
              </h2>
              <Link to="/learning">
                <Button variant="outline" className="text-sm">View All</Button>
              </Link>
            </div>
            {enrolledCourses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No enrolled courses yet</p>
            ) : (
              <div className="space-y-4">
                {enrolledCourses.slice(0, 3).map((course) => (
                  <div key={course.id} className="border border-accent rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-text-main">{course.title}</h3>
                      <span className="text-sm text-primary font-bold">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Upcoming Mentorship Meetings */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Users size={24} />
                Upcoming Meetings
              </h2>
              <Link to="/mentorship">
                <Button variant="outline" className="text-sm">View All</Button>
              </Link>
            </div>
            {upcomingMeetings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming meetings</p>
            ) : (
              <div className="space-y-4">
                {upcomingMeetings.slice(0, 3).map((meeting) => {
                  const otherUser = meeting.mentorId === currentUser.id
                    ? appData.users.find(u => u.id === meeting.menteeId)
                    : appData.users.find(u => u.id === meeting.mentorId);
                  return (
                    <div key={meeting.id} className="border border-accent rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-text-main">{otherUser?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-600">{meeting.date} at {meeting.time}</p>
                          {meeting.link && (
                            <a
                              href={`https://${meeting.link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              Join Meeting
                            </a>
                          )}
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Package size={24} />
                Recent Orders
              </h2>
              <Link to="/marketplace">
                <Button variant="outline" className="text-sm">View All</Button>
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-accent">
                      <th className="text-left py-3 px-4 font-semibold text-text-main">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-main">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-main">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-accent hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-text-main">{getProductName(order.productId)}</td>
                        <td className="py-3 px-4 text-gray-600">{order.date}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

