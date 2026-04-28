import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, HeartPulse, Shield, BookOpen } from 'lucide-react';
import { blogPosts } from '../data/blogData';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Home() {
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-light via-white to-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl -z-10"></div>
        <div className="section-container text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="inline-block px-4 py-1.5 bg-brand-blue/10 text-brand-blue rounded-full text-sm font-medium mb-6">
              Healthcare Meets Innovation
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-brand-dark leading-tight tracking-tight max-w-4xl mx-auto">
              The Future of Nursing is <span className="text-brand-blue">Digital</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-brand-gray max-w-2xl mx-auto leading-relaxed">
              Empowering nurses to master healthcare technology, reduce burnout, and advance their careers in the digital age.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/blog" className="btn-primary inline-flex items-center gap-2">
                Explore Blog <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-secondary">Our Mission</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 section-container">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { icon: HeartPulse, title: "Health Tech Literacy", desc: "Breaking down complex technologies like AI, IoT, and EHRs into nurse-friendly concepts." },
            { icon: Shield, title: "Career Transitioning", desc: "Step-by-step guides to move from bedside care to informatics, UX, and tech sales." },
            { icon: BookOpen, title: "Evidence-Based Content", desc: "Every article is researched and reviewed by practicing nurses and tech experts." }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center p-6 rounded-2xl hover:bg-brand-light transition-colors duration-300"
            >
              <div className="w-14 h-14 bg-brand-cyan/10 text-brand-blue rounded-xl flex items-center justify-center mx-auto mb-5">
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-brand-gray leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-24 bg-gray-50/50">
        <div className="section-container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Featured Insights</h2>
              <p className="text-brand-gray mt-2">Latest articles at the intersection of nursing and tech.</p>
            </div>
            <Link to="/blog" className="hidden md:flex items-center gap-2 text-brand-blue font-semibold hover:gap-3 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredPosts.map((post, i) => (
              <motion.article 
                key={post.id}
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/blog/${post.id}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-border">
                  <div className="h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-brand-gray mb-2">{post.date} • {post.author}</div>
                    <h3 className="text-lg font-bold group-hover:text-brand-blue transition-colors mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-brand-gray line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
