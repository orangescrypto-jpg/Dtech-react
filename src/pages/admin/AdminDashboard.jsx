import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ArrowLeft, Save } from 'lucide-react';

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    date: new Date().toISOString().split('T')[0], // Defaults to today
    image: '',
    excerpt: '',
    content: ''
  });

  // Fetch existing post data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        const docSnap = await getDoc(doc(db, 'blogPosts', id));
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          alert("Post not found!");
          navigate('/admin');
        }
        setLoading(false);
      };
      fetchPost();
    }
  }, [id, navigate, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image || !formData.content) {
      alert("Title, Image URL, and Content are required.");
      return;
    }

    setSaving(true);
    try {
      if (isEditMode) {
        // UPDATE existing post
        await updateDoc(doc(db, 'blogPosts', id), formData);
        alert("Post updated successfully!");
      } else {
        // CREATE new post
        await addDoc(collection(db, 'blogPosts'), formData);
        alert("Post created successfully!");
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert("Error saving post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading editor...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-brand-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-brand-gray hover:text-brand-dark">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-brand-dark">{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
        {/* Main Card */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-brand-border space-y-6">
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1">Post Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-lg" placeholder="e.g., The Future of Nursing Tech" required />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1">Author</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-4 py-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" placeholder="Jane Doe, RN" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1">Publish Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1">External Image URL</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} className="w-full px-4 py-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" placeholder="https://images.unsplash.com/photo-..." required />
            {formData.image && (
              <div className="mt-3 h-40 w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1">Short Excerpt</label>
            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows="2" className="w-full px-4 py-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none resize-none" placeholder="A brief summary for the blog card..." required />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-brand-border">
          <label className="block text-sm font-semibold text-brand-dark mb-1">Full Content</label>
          <p className="text-xs text-brand-gray mb-3">You can write plain text, or paste Markdown/HTML if your frontend renderer supports it.</p>
          <textarea 
            name="content" 
            value={formData.content} 
            onChange={handleChange} 
            rows="15" 
            className="w-full px-4 py-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none resize-y font-mono text-sm" 
            placeholder="Write your article content here..."
            required 
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pb-10">
          <button type="button" onClick={() => navigate('/admin')} className="px-6 py-3 rounded-lg border border-brand-border text-brand-gray hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <Save size={18} /> {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
