import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// FIXED: Replaced static data with Firebase hook and added .js extension
import { useBlogs } from '../hooks/useBlogData.js';
import SkeletonCard from '../components/SkeletonCard.jsx';

export default function BlogList() {
  // Fetch live data from Firebase
  const { blogs, loading, error } = useBlogs();

  return (
    <div className="section-container py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">DTECHNURSE Blog</h1>
        <p className="text-lg text-brand-gray max-w-2xl mx-auto">Insights, tutorials, and career advice for the tech-savvy nurse.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Show 6 skeletons while loading
          Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : error ? (
          // Show error message if Firebase fails
          <p className="text-brand-gray col-span-3 text-center py-12">{error}</p>
        ) : (
          // Map through the live Firebase data
          blogs.map((post, i) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/blog/${post.id}`} className="group block h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-border hover:border-brand-blue/20">
                <div className="h-52 overflow-hidden">
                  {/* Added loading="lazy" for performance */}
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-6 flex flex-col h-full">
                  <div className="text-xs text-brand-gray font-medium mb-3 uppercase tracking-wider">{post.date}</div>
                  <h2 className="text-xl font-bold group-hover:text-brand-blue transition-colors mb-3">{post.title}</h2>
                  <p className="text-brand-gray text-sm mb-4 flex-grow">{post.excerpt}</p>
                  <span className="text-brand-blue text-sm font-semibold">Read Article →</span>
                </div>
              </Link>
            </motion.article>
          ))
        )}
      </div>
    </div>
  );
}
