import { useAuth } from '../../contexts/AuthContext';
import Card from '../Card';
import Button from '../Button';
import { BookOpen, Users, ShoppingBag, TrendingUp, Calendar, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroWoman from '../../assets/hero-woman.jpg';
import flowerDeco1 from '../../assets/flower-deco1.jpg';
import flowerDeco2 from '../../assets/flower-deco2.jpg';

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
    <div className="min-h-screen bg-background py-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -z-10 inset-0">
        <div className="absolute -top-24 -left-16 w-72 h-72 bg-peach/60 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-[-80px] w-80 h-80 bg-cream/70 rounded-full blur-3xl" />
        <div className="absolute bottom-[-60px] left-1/4 w-64 h-64 bg-secondary/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Hero Card */}
        <Card className="mb-10 rounded-[2rem] md:p-10 relative overflow-visible bg-white/90">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="uppercase tracking-[0.2em] text-xs text-text-main/70">Dashboard</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-burgundy leading-tight">
                Welcome back,&nbsp;
                <span className="italic">{currentUser.name}</span>
              </h1>
              <p className="text-text-main/80 text-base sm:text-lg max-w-md">
                Your learning, mentorship, and marketplace activity in one warm, curated space.
              </p>
            </div>

            <div className="relative flex justify-center md:justify-end">
              <div className="w-56 h-64 sm:w-64 sm:h-72 md:w-72 md:h-80 bg-peach/60 rounded-tl-[80px] rounded-br-[80px] overflow-hidden shadow-card-soft">
                <img
                  src={heroWoman}
                  alt="Smiling woman entrepreneur"
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>

              {/* Scrapbook flowers */}
              <img
                src={flowerDeco1}
                alt="Floral decoration"
                className="hidden sm:block absolute -top-6 -right-4 w-24 rounded-2xl mix-blend-multiply opacity-80 shadow-md"
              />
              <img
                src={flowerDeco2}
                alt="Floral decoration"
                className="hidden sm:block absolute -bottom-6 -left-4 w-20 rounded-2xl mix-blend-multiply opacity-80 -rotate-12 shadow-md"
              />
            </div>
          </div>
        </Card>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-terracotta text-burgundy overflow-hidden relative rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-80 mb-1 text-sm">Enrolled Courses</p>
                <p className="text-3xl font-bold">{enrolledCourses.length}</p>
              </div>
              <BookOpen size={48} className="opacity-40" />
            </div>
          </Card>

          <Card className="bg-mustard text-burgundy overflow-hidden relative rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-80 mb-1 text-sm">Upcoming Meetings</p>
                <p className="text-3xl font-bold">{upcomingMeetings.length}</p>
              </div>
              <Calendar size={48} className="opacity-40" />
            </div>
          </Card>

          <Card className="bg-sage text-burgundy overflow-hidden relative rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-80 mb-1 text-sm">Total Orders</p>
                <p className="text-3xl font-bold">{recentOrders.length}</p>
              </div>
              <ShoppingBag size={48} className="opacity-40" />
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

