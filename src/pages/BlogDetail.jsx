import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, UserCircle, MessageSquare, Send, Loader2, Twitter, Linkedin, Mail, LinkIcon, Check } from 'lucide-react';
import { useBlog } from '../hooks/useBlogData';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function BlogDetail() {
  const { id } = useParams();
  const { blog, loading, error } = useBlog(id);

  // --- COMMENTS STATE ---
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: '', text: '' });
  const [submittingComment, setSubmittingComment] = useState(false);

  // --- SHARE STATE ---
  const [copied, setCopied] = useState(false);
  const pageUrl = window.location.href; // Gets the exact URL of the current blog post

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied!" text after 2 seconds
  };

  // Fetch comments for THIS specific post
  const fetchComments = async () => {
    if (!id) return;
    try {
      const q = query(
        collection(db, 'comments'), 
        where('postId', '==', id), 
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Just now'
      }));
      setComments(commentsData);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => { fetchComments(); }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.text.trim()) return alert("Please enter your name and a comment.");

    setSubmittingComment(true);
    try {
      await addDoc(collection(db, 'comments'), {
        postId: id,
        name: commentForm.name,
        text: commentForm.text,
        createdAt: serverTimestamp()
      });
      setCommentForm({ name: '', text: '' });
      fetchComments();
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Failed to post comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  // --- 1. Loading State ---
  if (loading) return (<div className="flex justify-center items-center py-32"><div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div></div>);

  // --- 2. Error State ---
  if (error || !blog) {
    return (
      <div className="section-container py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
        <p className="text-brand-gray mb-6">{error || "This article may have been moved or deleted."}</p>
        <Link to="/blog" className="btn-primary inline-block">Back to Blog</Link>
      </div>
    );
  }

  // --- 3. Success State ---
  return (
    <div className="bg-white">
      {/* Hero Image */}
      <div className="h-[40vh] md:h-[50vh] w-full relative overflow-hidden bg-gray-100">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <article className="section-container max-w-3xl mx-auto py-12 md:py-16">
        <Link to="/blog" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-blue mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-extrabold text-brand-dark leading-tight mb-6">
            {blog.title}
          </h1>
          
          {/* Author, Date, & SHARE BUTTONS */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10 pb-10 border-b border-brand-border">
            <div className="flex items-center gap-6 text-sm text-brand-gray">
              <div className="flex items-center gap-2">
                <UserCircle size={18} />
                {blog.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                {blog.date}
              </div>
            </div>

            {/* Spacer to push share buttons to the right on desktop */}
            <div className="flex-grow"></div>

            {/* Share Buttons */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-brand-gray tracking-wider mr-2">SHARE:</span>
              
              {/* Twitter/X */}
              <a 
                href={`https://twitter.com/intent/tweet?url=${pageUrl}&text=${blog.title}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-brand-gray hover:text-[#1DA1F2] hover:bg-gray-50 rounded-lg transition-colors"
                title="Share on X (Twitter)"
              >
                <Twitter size={18} />
              </a>

              {/* LinkedIn */}
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-brand-gray hover:text-[#0077B5] hover:bg-gray-50 rounded-lg transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin size={18} />
              </a>

              {/* Email */}
              <a 
                href={`mailto:?subject=${blog.title}&body=Check out this article: ${pageUrl}`} 
                className="p-2 text-brand-gray hover:text-brand-dark hover:bg-gray-50 rounded-lg transition-colors"
                title="Share via Email"
              >
                <Mail size={18} />
              </a>

              {/* Copy Link */}
              <button 
                onClick={handleCopyLink} 
                className="p-2 text-brand-gray hover:text-brand-blue hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1"
                title="Copy Link"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <LinkIcon size={18} />}
                {copied && <span className="text-xs text-green-500 font-medium">Copied!</span>}
              </button>
            </div>
          </div>

          {/* Blog Content */}
          <div className="max-w-none text-brand-dark/80 leading-relaxed space-y-6
                    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-brand-dark [&_h1]:mt-8 [&_h1]:mb-4
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand-dark [&_h2]:mt-6 [&_h2]:mb-3
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
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </motion.div>

        {/* --- COMMENTS SECTION --- */}
        <div className="mt-16 pt-10 border-t border-brand-border">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare size={24} className="text-brand-blue" />
            <h2 className="text-2xl md:text-3xl font-extrabold">Comments ({comments.length})</h2>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="bg-gray-50 p-6 rounded-xl border border-brand-border mb-10">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                value={commentForm.name}
                onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none bg-white"
                required
              />
              <div className="hidden md:block"></div> {/* Spacer for grid alignment */}
            </div>
            <textarea 
              rows="3" 
              placeholder="Write your comment..." 
              value={commentForm.text}
              onChange={(e) => setCommentForm({...commentForm, text: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none bg-white resize-none mb-4"
              required
            ></textarea>
            <div className="flex justify-end">
              <button type="submit" disabled={submittingComment} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                {submittingComment ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                Post Comment
              </button>
            </div>
          </form>

          {/* Comments List */}
          {commentsLoading ? (
            <div className="text-center py-8 text-brand-gray">Loading comments...</div>
          ) : comments.length === 0 ? (
            <p className="text-center text-brand-gray py-8 bg-gray-50 rounded-xl border border-dashed border-brand-border">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-4 bg-white border border-brand-border rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-brand-light text-brand-blue flex items-center justify-center font-bold flex-shrink-0">
                    {comment.name.charAt(0).toUpperCase()}
                  </div>
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
