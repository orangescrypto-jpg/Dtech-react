import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, Save, LinkIcon } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const quillRef = useRef();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    excerpt: '',
    content: '',
    coverUrl: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInlineImage = () => {
    const url = window.prompt("Paste the external image URL here:");
    if (url) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', url);
      quill.setSelection(range.index + 1);
    }
  };

  const quillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'], 
        ['clean']
      ],
      handlers: {
        image: handleInlineImage
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.coverUrl) {
      return alert("Please fill out all fields and provide a cover image URL.");
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'blogPosts'), {
        title: formData.title,
        author: formData.author || "DTECHNURSE Admin",
        excerpt: formData.excerpt,
        content: formData.content, 
        image: formData.coverUrl,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        createdAt: serverTimestamp()
      });

      alert("Blog post published successfully!");
      navigate('/blog'); 
    } catch (error) {
      console.error("Error publishing post:", error);
      alert("Failed to publish post. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-container py-12 md:py-24 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Admin Dashboard</h1>
          <p className="text-brand-gray mt-1">Create a new blog post</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-sm text-brand-gray hover:text-brand-dark border border-brand-border px-4 py-2 rounded-lg">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-10 rounded-2xl border border-brand-border shadow-sm">
        
        {/* Cover Image URL Input & Live Preview */}
        <div>
          <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
            <LinkIcon size={16} /> Cover Image URL
          </label>
          <input 
            type="url" 
            name="coverUrl" 
            value={formData.coverUrl} 
            onChange={handleChange} 
            className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none mb-4" 
            placeholder="https://images.unsplash.com/photo-xxxxx..." 
            required 
          />
          
          {/* Live Preview Box */}
          <div className="border-2 border-dashed border-brand-border rounded-xl h-64 flex items-center justify-center bg-gray-50 overflow-hidden">
            {formData.coverUrl ? (
              <img 
                src={formData.coverUrl} 
                alt="Cover Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null; // Prevents infinite loop
                  e.target.src = '';       // Silently clears broken images
                }}
              />
            ) : (
              <p className="text-brand-gray text-sm">Paste a URL above to see a preview</p>
            )}
          </div>
        </div>

        {/* Title & Author Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Blog Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none" placeholder="e.g., The Future of Nursing..." required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Author Name</label>
            <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none" placeholder="e.g., Jane Doe, RN" />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold mb-2">Short Excerpt</label>
          <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows="2" className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none resize-none" placeholder="A brief summary shown on the blog grid..." required></textarea>
        </div>

        {/* Rich Text Editor */}
        <div className="h-[400px] md:h-[500px] flex flex-col">
          <label className="block text-sm font-semibold mb-2">Content <span className="font-normal text-brand-gray">(Click the image icon in the toolbar to insert external images)</span></label>
          <div className="flex-grow rounded-lg overflow-hidden border border-brand-border">
            <ReactQuill 
              ref={quillRef}
              theme="snow" 
              value={formData.content} 
              onChange={(val) => setFormData({...formData, content: val})}
              modules={quillModules}
              className="h-[90%]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-4 pt-4 border-t border-brand-border">
          {isSubmitting && (
            <div className="flex items-center gap-2 text-sm text-brand-blue font-medium">
              <Loader2 className="animate-spin" size={18} />
              Saving to database...
            </div>
          )}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary ml-auto flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
