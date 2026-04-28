import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, UserCircle } from 'lucide-react';
import { blogPosts } from '../data/blogData';

export default function BlogDetail() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return <div className="section-container py-24 text-center"><h1 className="text-3xl font-bold">Post not found</h1><Link to="/blog" className="text-brand-blue mt-4 inline-block">Back to Blog</Link></div>;
  }

  return (
    <div className="bg-white">
      {/* Hero Image */}
      <div className="h-[40vh] md:h-[50vh] w-full relative overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <article className="section-container max-w-3xl mx-auto py-12 md:py-16">
        <Link to="/blog" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-blue mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-extrabold text-brand-dark leading-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-brand-gray mb-10 pb-10 border-b border-brand-border">
            <div className="flex items-center gap-2">
              <UserCircle size={18} />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              {post.date}
            </div>
          </div>

          {/* Simulating Rich Text / Markdown Content */}
          <div className="prose prose-lg max-w-none text-brand-dark/80 leading-relaxed space-y-6">
            <p className="text-xl font-medium text-brand-dark">{post.excerpt}</p>
            <p>{post.content}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            <h2 className="text-2xl font-bold text-brand-dark mt-8 mb-4">Key Takeaways</h2>
            <ul className="list-disc pl-6 space-y-2 text-brand-gray">
              <li>Technology should augment, not replace, clinical judgment.</li>
              <li>Data literacy is as important as clinical literacy in 2024.</li>
              <li>Nurses are the ultimate end-users of health tech—our voices matter in design.</li>
            </ul>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
