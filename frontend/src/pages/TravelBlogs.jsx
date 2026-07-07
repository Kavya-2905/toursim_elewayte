import { useState } from 'react';
import { FaCalendarAlt, FaUser, FaTag, FaArrowRight, FaSearch } from 'react-icons/fa';

const mockBlogs = [
  {
    id: 1,
    title: '10 Hidden Gems in Rajasthan You Must Visit',
    excerpt: 'Discover the lesser-known treasures of Rajasthan beyond the usual tourist spots. From secret forts to untouched lakes, these destinations will leave you mesmerized.',
    author: 'Priya Sharma',
    date: '2024-12-15',
    category: 'Destinations',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=500&fit=crop',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'Budget Travel: How to Explore Kerala on $50/Day',
    excerpt: 'Kerala doesn\'t have to break the bank. Here\'s a complete guide to experiencing God\'s Own Country on a budget, including affordable stays, local transport, and street food.',
    author: 'Rahul Verma',
    date: '2024-12-10',
    category: 'Budget Travel',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=500&fit=crop',
    readTime: '7 min read'
  },
  {
    id: 3,
    title: 'The Ultimate Guide to Street Food in India',
    excerpt: 'From pani puri to dosa, India\'s street food culture is a culinary adventure. Join us as we explore the best street food cities and must-try dishes.',
    author: 'Anita Desai',
    date: '2024-12-05',
    category: 'Food & Culture',
    image: 'https://images.unsplash.com/photo-1610237368628-168522438099?w=800&h=500&fit=crop',
    readTime: '6 min read'
  },
  {
    id: 4,
    title: 'Solo Travel in Ladakh: A Complete Safety Guide',
    excerpt: 'Planning a solo trip to Ladakh? This comprehensive guide covers everything from permits to altitude sickness, ensuring your adventure is safe and memorable.',
    author: 'Vikram Singh',
    date: '2024-11-28',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=500&fit=crop',
    readTime: '8 min read'
  },
  {
    id: 5,
    title: 'Best Time to Visit Every State in India',
    excerpt: 'India is diverse in climate and culture. Find out the perfect time to plan your visit to each state for the best experience.',
    author: 'Meera Nair',
    date: '2024-11-20',
    category: 'Travel Tips',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=500&fit=crop',
    readTime: '10 min read'
  },
  {
    id: 6,
    title: 'Sustainable Travel: How to Reduce Your Carbon Footprint',
    excerpt: 'Travel responsibly! Learn practical tips to minimize your environmental impact while still enjoying incredible travel experiences across India.',
    author: 'Arjun Patel',
    date: '2024-11-15',
    category: 'Sustainable Travel',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=500&fit=crop',
    readTime: '6 min read'
  }
];

const categories = ['All', 'Destinations', 'Budget Travel', 'Food & Culture', 'Adventure', 'Travel Tips', 'Sustainable Travel'];

const TravelBlogs = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlogs = mockBlogs.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Travel Blogs</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stories, tips, and guides from fellow travelers to inspire your next adventure
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              placeholder="Search articles..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Blog */}
        {filteredBlogs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 group cursor-pointer">
            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-auto overflow-hidden">
                <img
                  src={filteredBlogs[0].image}
                  alt={filteredBlogs[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
                  <FaTag className="mr-2" /> {filteredBlogs[0].category}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 transition-colors">
                  {filteredBlogs[0].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{filteredBlogs[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center"><FaUser className="mr-1" /> {filteredBlogs[0].author}</span>
                    <span className="flex items-center"><FaCalendarAlt className="mr-1" /> {new Date(filteredBlogs[0].date).toLocaleDateString()}</span>
                  </div>
                  <span className="text-sm text-primary-600 font-medium flex items-center">
                    Read More <FaArrowRight className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.slice(1).map((blog) => (
            <article key={blog.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-all">
              <div className="h-48 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium mb-3">
                  <FaTag className="mr-1" /> {blog.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center"><FaUser className="mr-1" /> {blog.author}</span>
                  <span>{blog.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <FaSearch className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No articles found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelBlogs;
