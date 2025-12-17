import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import RoleWrapper from '../components/RoleWrapper';
import Toast from '../components/Toast';
import { Plus, Trash2, Edit, Search, Star, BookOpen, Settings, CheckCircle, Circle, X } from 'lucide-react';

const LearningHub = () => {
  const { currentUser, appData, updateData } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCourseContentModal, setShowCourseContentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [toast, setToast] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    category: 'Business',
    instructor: '',
    description: '',
    image: ''
  });
  const [review, setReview] = useState({ rating: 5, comment: '' });

  const categories = ['All', ...(appData.categories || [])];
  const courses = appData.courses || [];

  // Get enrollments for current user
  const enrollments = appData.enrollments?.filter(e => e.userId === currentUser.id) || [];

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (course.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isEnrolled = (courseId) => {
    return enrollments.some(e => e.courseId === courseId);
  };

  const getProgress = (courseId) => {
    const enrollment = enrollments.find(e => e.courseId === courseId);
    return enrollment?.progress || 0;
  };

  const handleEnroll = (courseId) => {
    if (!appData.enrollments) {
      updateData('enrollments', []);
    }
    const newEnrollment = {
      id: Date.now(),
      userId: currentUser.id,
      courseId,
      progress: 0,
      enrolledAt: new Date().toISOString()
    };
    updateData('enrollments', [...(appData.enrollments || []), newEnrollment]);
    setToast({ message: 'Successfully enrolled!', type: 'success' });
  };

  const handleStartLearning = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    setSelectedCourse(course);
    setShowCourseContentModal(true);
  };

  const handleCompleteModule = (courseId, moduleId) => {
    const enrollment = enrollments.find(e => e.courseId === courseId && e.userId === currentUser.id);
    if (!enrollment) return;

    const course = courses.find(c => c.id === courseId);
    const modules = course?.modules || [];
    const completedModules = enrollment.completedModules || [];
    
    if (!completedModules.includes(moduleId)) {
      const newCompletedModules = [...completedModules, moduleId];
      const newProgress = Math.round((newCompletedModules.length / modules.length) * 100);
      
      const updatedEnrollments = (appData.enrollments || []).map(e =>
        e.courseId === courseId && e.userId === currentUser.id
          ? { ...e, progress: newProgress, completedModules: newCompletedModules }
          : e
      );
      updateData('enrollments', updatedEnrollments);
    }
  };

  const getCompletedModules = (courseId) => {
    const enrollment = enrollments.find(e => e.courseId === courseId && e.userId === currentUser.id);
    return enrollment?.completedModules || [];
  };

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.instructor) {
      setToast({ message: 'Please fill all required fields', type: 'error' });
      return;
    }

    // Default modules if none provided
    const defaultModules = [
      { id: 1, title: 'Introduction', content: 'Welcome to the course!', type: 'video' },
      { id: 2, title: 'Core Concepts', content: 'Learn the fundamental concepts.', type: 'reading' },
      { id: 3, title: 'Practical Application', content: 'Apply what you\'ve learned.', type: 'assignment' },
      { id: 4, title: 'Final Assessment', content: 'Test your knowledge.', type: 'quiz' }
    ];

    const course = {
      id: Date.now(),
      ...newCourse,
      reviews: [],
      modules: newCourse.modules || defaultModules
    };

    updateData('courses', [...courses, course]);
    setShowAddModal(false);
    setNewCourse({ title: '', category: 'Business', instructor: '', description: '', image: '', modules: defaultModules });
    setToast({ message: 'Course added successfully!', type: 'success' });
  };

  const handleEditCourse = () => {
    if (!newCourse.title || !newCourse.instructor) {
      setToast({ message: 'Please fill all required fields', type: 'error' });
      return;
    }

    const updatedCourses = courses.map(course =>
      course.id === selectedCourse.id
        ? { ...course, ...newCourse }
        : course
    );

    updateData('courses', updatedCourses);
    setShowEditModal(false);
    setSelectedCourse(null);
    setNewCourse({ title: '', category: 'Business', instructor: '', description: '', image: '' });
    setToast({ message: 'Course updated successfully!', type: 'success' });
  };

  const handleDeleteCourse = (courseId) => {
    updateData('courses', courses.filter(course => course.id !== courseId));
    setToast({ message: 'Course deleted', type: 'success' });
  };

  const handleSubmitReview = () => {
    if (!review.comment) {
      setToast({ message: 'Please write a comment', type: 'error' });
      return;
    }

    const updatedCourses = courses.map(course => {
      if (course.id === selectedCourse.id) {
        return {
          ...course,
          reviews: [
            ...(course.reviews || []),
            {
              user: currentUser.name,
              rating: review.rating,
              comment: review.comment
            }
          ]
        };
      }
      return course;
    });
    updateData('courses', updatedCourses);
    setShowReviewModal(false);
    setSelectedCourse(null);
    setReview({ rating: 5, comment: '' });
    setToast({ message: 'Review submitted!', type: 'success' });
  };

  const handleAddCategory = (categoryName) => {
    if (!categoryName || appData.categories.includes(categoryName)) {
      setToast({ message: 'Category already exists or is invalid', type: 'error' });
      return;
    }
    updateData('categories', [...(appData.categories || []), categoryName]);
    setToast({ message: 'Category added!', type: 'success' });
  };

  const handleDeleteCategory = (categoryName) => {
    if (courses.some(c => c.category === categoryName)) {
      setToast({ message: 'Cannot delete category with existing courses', type: 'error' });
      return;
    }
    updateData('categories', (appData.categories || []).filter(c => c !== categoryName));
    setToast({ message: 'Category deleted!', type: 'success' });
  };

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
    if (file) {
      // Optional: Check file size (e.g., limit to 2MB to prevent lagging)
      if (file.size > 2 * 1024 * 1024) {
        setToast({ message: 'Image size should be less than 2MB', type: 'error' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // The result is a Base64 string that acts exactly like a URL
        setNewCourse({ ...newCourse, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getAverageRating = (course) => {
    if (!course.reviews || course.reviews.length === 0) return 0;
    const sum = course.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / course.reviews.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">SkillUp Learning Hub</h1>
            <p className="text-text-main">Empower yourself with knowledge and skills</p>
          </div>
          <div className="flex gap-2">
            <RoleWrapper allowedRoles={['admin']}>
              <Button onClick={() => setShowCategoryModal(true)} variant="outline">
                <Settings size={18} className="inline mr-2" />
                Manage Categories
              </Button>
              <Button onClick={() => {
                setSelectedCourse(null);
                setNewCourse({ title: '', category: 'Business', instructor: '', description: '', image: '' });
                setShowAddModal(true);
              }}>
                <Plus size={20} className="inline mr-2" />
                Add New Course
              </Button>
            </RoleWrapper>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by title, instructor, or description..."
            className="w-full pl-10 pr-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          />
        </div>

        {/* Category Filters */}
        <div className="mb-6 flex gap-4 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-white text-text-main border border-accent hover:bg-accent hover:bg-opacity-30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const enrolled = isEnrolled(course.id);
            const progress = getProgress(course.id);
            const avgRating = getAverageRating(course);

            return (
              <Card key={course.id} className="relative hover:shadow-xl transition-shadow">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold text-primary mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-1">Instructor: {course.instructor}</p>
                <p className="text-sm text-secondary mb-2">Category: {course.category}</p>
                
                {/* Rating Display */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= avgRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {avgRating > 0 ? avgRating : 'No ratings'}
                    {course.reviews && ` (${course.reviews.length})`}
                  </span>
                </div>

                {enrolled && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-main">Progress</span>
                      <span className="text-primary font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {enrolled ? (
                    progress === 100 ? (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSelectedCourse(course);
                          setReview({ rating: 5, comment: '' });
                          setShowReviewModal(true);
                        }}
                        className="flex-1"
                      >
                        <Star size={18} className="inline mr-2" />
                        Rate this Course
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={() => handleStartLearning(course.id)}
                        className="flex-1"
                      >
                        <BookOpen size={18} className="inline mr-2" />
                        Continue Learning
                      </Button>
                    )
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => handleEnroll(course.id)}
                      className="flex-1"
                    >
                      Enroll
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCourse(course);
                      setReview({ rating: 5, comment: '' });
                      setShowReviewModal(true);
                    }}
                  >
                    <Star size={18} />
                  </Button>
                  <RoleWrapper allowedRoles={['admin']}>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectedCourse(course);
                        setNewCourse({
                          title: course.title,
                          category: course.category,
                          instructor: course.instructor,
                          description: course.description || '',
                          image: course.image
                        });
                        setShowEditModal(true);
                      }}
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </RoleWrapper>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-main text-lg">No courses found.</p>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Course"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Course Title *</label>
            <input
              type="text"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter course title"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Category</label>
            <select
              value={newCourse.category}
              onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {(appData.categories || []).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Instructor *</label>
            <input
              type="text"
              value={newCourse.instructor}
              onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter instructor name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Description</label>
            <textarea
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Course description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Course Image</label>
            
            {/* File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90"
            />

            {/* Preview the image if one is selected */}
            {newCourse.image && (
              <div className="mt-2">
                <img 
                  src={newCourse.image} 
                  alt="Preview" 
                  className="h-32 w-full object-cover rounded-lg border border-accent" 
                />
                <button 
                  type="button"
                  onClick={() => setNewCourse({ ...newCourse, image: '' })}
                  className="text-red-500 text-sm mt-1 hover:underline"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleAddCourse} className="flex-1">Add Course</Button>
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Course"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Course Title *</label>
            <input
              type="text"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Category</label>
            <select
              value={newCourse.category}
              onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {(appData.categories || []).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Instructor *</label>
            <input
              type="text"
              value={newCourse.instructor}
              onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Description</label>
            <textarea
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Course Image</label>
            
            {/* File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90"
            />

            {/* Preview the image if one is selected */}
            {newCourse.image && (
              <div className="mt-2">
                <img 
                  src={newCourse.image} 
                  alt="Preview" 
                  className="h-32 w-full object-cover rounded-lg border border-accent" 
                />
                <button 
                  type="button"
                  onClick={() => setNewCourse({ ...newCourse, image: '' })}
                  className="text-red-500 text-sm mt-1 hover:underline"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleEditCourse} className="flex-1">Update Course</Button>
            <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Course Content Modal */}
      <Modal
        isOpen={showCourseContentModal}
        onClose={() => setShowCourseContentModal(false)}
        title={selectedCourse?.title || 'Course Content'}
      >
        {selectedCourse && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">Course Description</h3>
              <p className="text-text-main">{selectedCourse.description || 'No description available.'}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Learning Modules</h3>
              {selectedCourse.modules && selectedCourse.modules.length > 0 ? (
                <div className="space-y-3">
                  {selectedCourse.modules.map((module) => {
                    const completedModules = getCompletedModules(selectedCourse.id);
                    const isCompleted = completedModules.includes(module.id);
                    return (
                      <div
                        key={module.id}
                        className={`p-4 border-2 rounded-lg ${
                          isCompleted ? 'border-green-500 bg-green-50' : 'border-accent bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {isCompleted ? (
                                <CheckCircle className="text-green-500" size={20} />
                              ) : (
                                <Circle className="text-gray-400" size={20} />
                              )}
                              <h4 className="font-semibold text-text-main">{module.title}</h4>
                              <span className="px-2 py-1 bg-accent bg-opacity-30 text-secondary rounded text-xs font-semibold">
                                {module.type || 'content'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 ml-7">{module.content}</p>
                          </div>
                          {!isCompleted && (
                            <Button
                              variant="primary"
                              onClick={() => handleCompleteModule(selectedCourse.id, module.id)}
                              className="ml-4"
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No modules available for this course yet.</p>
                  <p className="text-sm mt-2">Course content will be added soon.</p>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-accent">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-text-main">Course Progress</span>
                <span className="text-sm font-semibold text-primary">{getProgress(selectedCourse.id)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${getProgress(selectedCourse.id)}%` }}
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCourseContentModal(false)}
                className="flex-1"
              >
                Close
              </Button>
              {getProgress(selectedCourse.id) === 100 && (
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowCourseContentModal(false);
                    setReview({ rating: 5, comment: '' });
                    setShowReviewModal(true);
                  }}
                  className="flex-1"
                >
                  <Star size={18} className="inline mr-2" />
                  Rate this Course
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={`Rate & Review: ${selectedCourse?.title}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReview({ ...review, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Comment</label>
            <textarea
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Share your thoughts about this course..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleSubmitReview} className="flex-1">Submit Review</Button>
            <Button variant="outline" onClick={() => setShowReviewModal(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Manage Categories Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="Manage Categories"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Add New Category</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="newCategory"
                className="flex-1 px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Category name"
              />
              <Button
                variant="primary"
                onClick={() => {
                  const input = document.getElementById('newCategory');
                  if (input.value) {
                    handleAddCategory(input.value);
                    input.value = '';
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Existing Categories</label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(appData.categories || []).map((category) => (
                <div key={category} className="flex justify-between items-center p-2 border border-accent rounded">
                  <span className="text-text-main">{category}</span>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteCategory(category)}
                    className="text-xs"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <Button variant="outline" onClick={() => setShowCategoryModal(false)} className="w-full">Close</Button>
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

export default LearningHub;
