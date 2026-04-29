import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, UserCircle, MessageSquare, Send, Loader2, Share2, List } from 'lucide-react';
import { useBlog } from '../hooks/useBlogData';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function BlogDetail() {
  const { id } = useParams();
  const { blog, loading, error } = useBlog(id);

  // --- STATE ---
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: '', text: '' });
  const [submittingComment, setSubmittingComment] = useState(false);

  // --- SHARE LOGIC ---
  const handleShare = async () => {
    const shareData = { title: blog.title, text: `Check out this article on DTECHNURSE: ${blog.excerpt}`, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { console.error("Share cancelled:", err); }
    } else {
      try { await navigator.clipboard.writeText(window.location.href); alert("Link copied to clipboard!"); } catch (err) { alert("Failed to copy link."); }
    }
  };

  // --- TABLE OF CONTENTS (TOC) LOGIC ---
  // This safely reads the HTML, finds <h2> tags, adds IDs to them, and builds the menu
  const { tocItems, modifiedHtml } = useMemo(() => {
    if (!blog?.content) return { tocItems: [], modifiedHtml: "" };

    const parser = new DOMParser();
    const doc = parser.parseFromString(blog.content, 'text/html');
    const headings = doc.querySelectorAll('h2');
    const items = [];

    headings.forEach((heading, index) => {
      const id = `section-${index}`;
      heading.id = id; // Inject ID into the HTML
      items.push({ id, text: heading.textContent });
    });

    return { tocItems: items, modifiedHtml: doc.body.innerHTML };
  }, [blog?.content]);

  // Smooth scroll handler that accounts for the sticky navbar height
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Height of your navbar
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  // --- COMMENTS LOGIC ---
  const fetchComments = async () => {
    if (!id) return;
    try {
      const q = query(collection(db, 'comments'), where('postId', '==', id));
      const snapshot = await getDocs(q);
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id, ...doc.data(),
        date: doc.data().createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Just now',
        rawTime: doc.data().createdAt?.seconds || 0
      }));
      commentsData.sort((a, b) => b.rawTime - a.rawTime);
      setComments(commentsData);
    } catch (err) { console.error("Error fetching comments:", err); }
    finally { setCommentsLoading(false); }
  };

  useEffect(() => { fetchComments(); }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.text.trim()) return alert("Please enter your name and a comment.");
    setSubmittingComment(true);
    try {
      await addDoc(collection(db, 'comments'), { postId: id, name: commentForm.name, text: commentForm.text, createdAt: serverTimestamp() });
      setCommentForm({ name: '', text: '' }); fetchComments();
    } catch (err) { console.error("Error submitting comment:", err); alert("Failed to post comment."); }
    finally { setSubmittingComment(false); }
  };

  // --- LOADING & ERROR STATES ---
  if (loading) return (<div className="flex justify-center items-center py-32"><div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div></div>);
  if (error || !blog) return (<div className="section-container py-24 text-center"><h1 className="text-3xl font-bold mb-4">Post not found</h1><p className="text-brand-gray mb-6">{error}</p><Link to="/blog" className="btn-primary inline-block">Back to Blog</Link></div>);

  return (
    <div className="bg-white">
      {/* Hero Image */}
      <div className="h-[40vh] md:h-[50vh] w-full relative overflow-hidden bg-gray-100">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <article className="section-container max-w-6xl mx-auto py-12 md:py-16">
        <Link to="/blog" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-blue mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-extrabold text-brand-dark leading-tight mb-6 max-w-4xl">{blog.title}</h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 pb-10 border-b border-brand-border max-w-4xl">
            <div className="flex items-center gap-6 text-sm text-brand-gray">
              <div className="flex items-center gap-2"><UserCircle size={18} />{blog.author}</div>
              <div className="flex items-center gap-2"><Calendar size={18} />{blog.date}</div>
            </div>
            <button onClick={handleShare} className="flex items-center gap-2 text-sm text-brand-blue hover:text-brand-dark transition-colors font-medium border border-brand-blue/20 px-4 py-2 rounded-lg hover:bg-brand-light w-fit">
              <Share2 size={16} /> Share Article
            </button>
          </div>

          {/* --- NEW: FLEX LAYOUT FOR CONTENT + TOC --- */}
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Blog Content */}
            <div className="flex-grow max-w-4xl">
              <div className="max-w-none text-brand-dark/80 leading-relaxed space-y-6
                    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-brand-dark [&_h1]:mt-8 [&_h1]:mb-4
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand-dark [&_h2]:mt-8 [&_h2]:mb-3
                    [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-brand-dark [&_h3]:mt-4 [&_h3]:mb-2
                    [&_p]:text-brand-gray [&_p]:leading-relaxed [&_p]:mb-4
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-brand-gray
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:text-brand-gray
                    [&_li]:mb-1
                    [&_strong]:font-bold [&_strong]:text-brand-dark
                    [&_a]:text-brand-blue [&_a]:underline
                    [&_blockquote]:border-l-4 [&_blockquote]:border-brand-blue [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600
                    [&_img]:rounded-xl [&_img]:shadow-md [&_img]:my-6 [&_img]:max-w-full [&_img]:mx-auto">
                <p className="text-xl font-medium text-brand-dark mb-4">{blog.excerpt}</p>
                {/* Notice we use modifiedHtml here so the IDs are injected! */}
                <div dangerouslySetInnerHTML={{ __html: modifiedHtml }} />
              </div>
            </div>

            {/* Sidebar Table of Contents (Sticky) */}
            {tocItems.length > 0 && (
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-28 border border-brand-border rounded-xl p-6 bg-gray-50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gray mb-4 flex items-center gap-2">
                    <List size={14} /> On This Page
                  </h4>
                  <nav className="space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
                    {tocItems.map((item, index) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => scrollToSection(e, item.id)}
                        className="block text-sm text-brand-gray hover:text-brand-blue transition-colors py-1 border-l-2 border-transparent hover:border-brand-blue pl-3"
                      >
                        {index + 1}. {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </motion.div>

        {/* --- COMMENTS SECTION --- */}
        <div className="mt-16 pt-10 border-t border-brand-border max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare size={24} className="text-brand-blue" />
            <h2 className="text-2xl md:text-3xl font-extrabold">Comments ({comments.length})</h2>
          </div>

          <form onSubmit={handleCommentSubmit} className="bg-gray-50 p-6 rounded-xl border border-brand-border mb-10">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Your Name" value={commentForm.name} onChange={(e) => setCommentForm({...commentForm, name: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none bg-white" required />
              <div className="hidden md:block"></div>
            </div>
            <textarea rows="3" placeholder="Write your comment..." value={commentForm.text} onChange={(e) => setCommentForm({...commentForm, text: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none bg-white resize-none mb-4" required></textarea>
            <div className="flex justify-end">
              <button type="submit" disabled={submittingComment} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                {submittingComment ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Post Comment
              </button>
            </div>
          </form>

          {commentsLoading ? (
            <div className="text-center py-8 text-brand-gray">Loading comments...</div>
          ) : comments.length === 0 ? (
            <p className="text-center text-brand-gray py-8 bg-gray-50 rounded-xl border border-dashed border-brand-border">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-4 bg-white border border-brand-border rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-brand-light text-brand-blue flex items-center justify-center font-bold flex-shrink-0">{comment.name.charAt(0).toUpperCase()}</div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-brand-dark text-sm">{comment.name}</span>
                      <span className="text-xs text-brand-gray">{comment.date}</span>
                    </div>
                    <p className="text-brand-gray text-sm leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </article>
    </div>
  );
}
