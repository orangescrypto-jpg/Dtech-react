import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Loader2, Save, LinkIcon, Bold, Italic, List, Image, LogIn, LogOut, Code } from 'lucide-react';

const provider = new GoogleAuthProvider();

export default function Admin() {
  const navigate = useNavigate();
  const editorRef = useRef(null);

  // --- AUTH STATE ---
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // --- FORM STATE ---
  const [formData, setFormData] = useState({ title: '', author: '', excerpt: '', content: '', coverUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- NEW: HTML VIEW TOGGLE ---
  const [isHtmlView, setIsHtmlView] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- EDITOR COMMANDS ---
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInlineImage = () => {
    const url = window.prompt("Paste the external image URL here:");
    if (url) document.execCommand('insertImage', false, url);
  };

  const handleEditorBlur = () => {
    if (editorRef.current && !isHtmlView) {
      setFormData({ ...formData, content: editorRef.current.innerHTML });
    }
  };

  // --- NEW: Handle switching back from HTML to Visual ---
  const switchToVisual = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = formData.content;
    }
    setIsHtmlView(false);
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalContent = isHtmlView ? formData.content : (editorRef.current?.innerHTML || '');
    
    if (!formData.title || !finalContent || !formData.coverUrl) return alert("Please fill out all fields.");

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'blogPosts'), {
        title: formData.title,
        author: formData.author || "DTECHNURSE Admin",
        excerpt: formData.excerpt,
        content: finalContent, 
        image: formData.coverUrl,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        createdAt: serverTimestamp()
      });
      alert("Published successfully!");
      navigate('/blog'); 
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to publish.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 1. AUTH LOADING ---
  if (authLoading) return (<div className="section-container py-32 flex justify-center"><Loader2 className="animate-spin text-brand-blue w-10 h-10" /></div>);

  // --- 2. LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="section-container py-24 md:py-32 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="mb-8 p-6 bg-brand-light rounded-full"><LogIn size={40} className="text-brand-blue" /></div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">Admin Access</h1>
        <p className="text-brand-gray mb-8">You must be an authorized editor. Please sign in with your approved Google account.</p>
        <button onClick={handleLogin} className="btn-primary flex items-center gap-3 text-lg px-8 py-4">Sign in with Google</button>
      </div>
    );
  }

  // --- 3. ADMIN DASHBOARD ---
  return (
    <div>
      {/* Top Admin Bar */}
      <div className="bg-brand-dark text-white px-4 py-3 shadow-lg">
        <div className="section-container flex items-center justify-between mx-auto w-full">
          <div className="flex items-center gap-3">
            <img src={user.photoURL} alt="Admin" className="w-8 h-8 rounded-full border-2 border-brand-cyan" />
            <div><p className="text-sm font-semibold leading-tight">{user.displayName}</p><p className="text-xs text-gray-400">{user.email}</p></div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"><LogOut size={16} /> Logout</button>
        </div>
      </div>

      <div className="section-container py-12 md:py-16 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div><h1 className="text-3xl md:text-4xl font-extrabold">Create Post</h1><p className="text-brand-gray mt-1">Write a new article for DTECHNURSE</p></div>
          <button onClick={() => navigate('/blog')} className="text-sm text-brand-gray hover:text-brand-dark border border-brand-border px-4 py-2 rounded-lg">Back to Site</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-10 rounded-2xl border border-brand-border shadow-sm">
          
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-semibold mb-3 flex items-center gap-2"><LinkIcon size={16} /> Cover Image URL</label>
            <input type="url" name="coverUrl" value={formData.coverUrl} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none mb-4" placeholder="https://images.unsplash.com/photo-xxxxx..." required />
            <div className="border-2 border-dashed border-brand-border rounded-xl h-64 flex items-center justify-center bg-gray-50 overflow-hidden">
              {formData.coverUrl ? (<img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" onError={(e) => e.target.src = ''} />) : (<p className="text-brand-gray text-sm">Paste a URL above to see a preview</p>)}
            </div>
          </div>

          {/* Title & Author */}
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-semibold mb-2">Blog Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none" placeholder="e.g., The Future of Nursing..." required /></div>
            <div><label className="block text-sm font-semibold mb-2">Author Name</label><input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none" placeholder="e.g., Jane Doe, RN" /></div>
          </div>

          {/* Excerpt */}
          <div><label className="block text-sm font-semibold mb-2">Short Excerpt</label><textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows="2" className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none resize-none" placeholder="A brief summary..." required></textarea></div>

          {/* Content Editor */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2">Content</label>
            
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 p-2 border border-b-0 border-brand-border rounded-t-lg bg-gray-50">
              <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-200 rounded"><Bold size={18} /></button>
              <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-200 rounded"><Italic size={18} /></button>
              <button type="button" onClick={() => execCommand('formatBlock', '<h2>')} className="p-2 hover:bg-gray-200 rounded font-bold">H2</button>
              <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded"><List size={18} /></button>
              <button type="button" onClick={handleInlineImage} className="p-2 hover:bg-gray-200 rounded text-brand-blue"><Image size={18} /></button>
              
              {/* NEW: HTML Toggle Button */}
              <button 
                type="button" 
                onClick={() => isHtmlView ? switchToVisual() : (setIsHtmlView(true), handleEditorBlur())} 
                className={`ml-auto p-2 rounded flex items-center gap-1 text-xs font-mono font-bold ${isHtmlView ? 'bg-brand-blue text-white' : 'hover:bg-gray-200 text-gray-600'}`}
                title="Toggle HTML View"
              >
                <Code size={16} /> HTML
              </button>
            </div>

            {/* NEW: Conditional Rendering for Visual vs HTML */}
            {isHtmlView ? (
              <textarea 
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="h-[300px] md:h-[400px] p-4 border border-brand-border rounded-b-lg overflow-y-auto focus:ring-2 focus:ring-brand-blue outline-none text-sm font-mono bg-gray-900 text-green-400 resize-none"
                placeholder="<p>Type your raw HTML here...</p>"
              />
            ) : (
              <div 
                ref={editorRef} 
                contentEditable 
                suppressContentEditableWarning 
                onBlur={handleEditorBlur} 
                className="h-[300px] md:h-[400px] p-4 border border-brand-border rounded-b-lg overflow-y-auto focus:ring-2 focus:ring-brand-blue outline-none text-brand-gray leading-relaxed prose max-w-none" 
                style={{ minHeight: '300px' }} 
              />
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4 border-t border-brand-border">
            {isSubmitting && (<div className="flex items-center gap-2 text-sm text-brand-blue font-medium"><Loader2 className="animate-spin" size={18} /> Saving...</div>)}
            <button type="submit" disabled={isSubmitting} className="btn-primary ml-auto flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><Save size={18} /> {isSubmitting ? 'Publishing...' : 'Publish Post'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
