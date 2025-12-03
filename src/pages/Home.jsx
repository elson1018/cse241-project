import { Link } from 'react-router-dom';
import { GraduationCap, Users, ShoppingBag, MessageSquare, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Home = () => {
  const modules = [
    {
      path: '/learning',
      title: 'SkillUp Learning Hub',
      description: 'Browse courses, enroll in programs, and track your learning progress',
      icon: GraduationCap,
      color: 'primary'
    },
    {
      path: '/mentorship',
      title: 'Mentorship Match',
      description: 'Connect with experienced mentors and grow your career',
      icon: Users,
      color: 'secondary'
    },
    {
      path: '/marketplace',
      title: 'Marketplace',
      description: 'Support women entrepreneurs and discover unique products',
      icon: ShoppingBag,
      color: 'accent'
    },
    {
      path: '/forum',
      title: 'Community Forum',
      description: 'Share experiences, ask questions, and support each other',
      icon: MessageSquare,
      color: 'primary'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-primary mb-4">Wonder Women</h1>
          <p className="text-2xl text-text-main mb-2">Empowering Women for Gender Equality</p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive platform supporting SDG 5 through learning, mentorship, entrepreneurship, and community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {modules.map((module) => {
            const Icon = module.icon;
            const iconColorClass = module.color === 'primary' ? 'text-primary' : module.color === 'secondary' ? 'text-secondary' : 'text-accent';
            const iconBgClass = module.color === 'primary' ? 'bg-primary bg-opacity-10' : module.color === 'secondary' ? 'bg-secondary bg-opacity-10' : 'bg-accent bg-opacity-10';
            return (
              <Card key={module.path} className="hover:shadow-2xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-lg ${iconBgClass}`}>
                    <Icon size={32} className={iconColorClass} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-primary mb-2">{module.title}</h3>
                    <p className="text-text-main mb-4">{module.description}</p>
                    <Link to={module.path}>
                      <Button variant={module.color === 'primary' ? 'primary' : module.color === 'secondary' ? 'secondary' : 'accent'}>
                        Explore <ArrowRight size={18} className="inline ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-primary to-secondary text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg mb-6 opacity-90">
              Together, we can create a more equal and inclusive world for all women
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/learning">
                <Button variant="outline" className="bg-white text-primary hover:bg-opacity-90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;

