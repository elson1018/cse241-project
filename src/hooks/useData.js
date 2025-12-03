import { useUser } from '../contexts/UserContext';

export const useData = () => {
  const { appData, updateData, setAppData } = useUser();

  const getCourses = () => appData.courses || [];
  const getMentors = () => appData.mentors || [];
  const getProducts = () => appData.products || [];
  const getForumPosts = () => appData.forum_posts || [];

  const updateCourses = (courses) => updateData('courses', courses);
  const updateMentors = (mentors) => updateData('mentors', mentors);
  const updateProducts = (products) => updateData('products', products);
  const updateForumPosts = (posts) => updateData('forum_posts', posts);

  return {
    courses: getCourses(),
    mentors: getMentors(),
    products: getProducts(),
    forumPosts: getForumPosts(),
    updateCourses,
    updateMentors,
    updateProducts,
    updateForumPosts,
    appData,
    setAppData
  };
};

