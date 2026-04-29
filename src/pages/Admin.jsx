import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { addDoc, collection, serverTimestamp, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Loader2, Save, LinkIcon, Bold, Italic, List, Image, LogIn, LogOut, Code, Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';

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

  const handleLogin = async () => { try { await signInWithPopup(auth, provider); } catch (error) { alert("Login failed."); } };
  const handleLogout = async () => { await signOut(auth); };

  // --- DASHBOARD & POST STATE ---
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  
  // View state: 'list' or 'editor'
  const [view, setView] = useState('list'); 
  const [editingId, setEditingId] = useState(null);

  const emptyForm = { title: '', author: '', excerpt: '', content: '', coverUrl: '' };
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHtmlView, setIsHtmlView] = useState(false);

  // Fetch Posts for the list
  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    const querySnapshot = await getDocs(collection(db, 'blogPosts'));
    const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by date descending (newest first)
    postsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPosts(postsData);
    setIsLoadingPosts(false);
  };

  useEffect(() => { if (user) fetchPosts(); }, [user]);

  // --- FORM & EDITOR COMMANDS ---
  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
  
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

  const switchToVisual = () => {
    if (editorRef.current) editorRef.current.innerHTML = formData.content;
    setIsHtmlView(false);
  };

  // --- POST ACTIONS ---
  const handleCreateNew = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setIsHtmlView(false);
    setView('editor');
  };

  const handleEditPost = (post) => {
    setFormData({
      title: post.title,
      author: post.author,
      excerpt: post.excerpt,
      content: post.content,
      coverUrl: post.image
    });
    setEditingId(post.id);
    setIsHtmlView(false);
    setView('editor');
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post? This cannot be undone.")) {
      await deleteDoc(doc(db, 'blogPosts', postId));
      fetchPosts(); // Refresh list
    }
  };

  // --- SUBMIT (CREATE OR UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalContent = isHtmlView ? formData.content : (editorRef.current?.innerHTML || '');
    if (!formData.title || !finalContent || !formData.coverUrl) return alert("Please fill out all fields.");

    setIsSubmitting(true);
    try {
      const postPayload = {
        title: formData.title,
        author: formData.author || "DTECHNURSE Admin",
        excerpt: formData.excerpt,
        content: finalContent, 
        image: formData.coverUrl,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };

      if (editingId) {
        // UPDATE existing post
        await updateDoc(doc(db, 'blogPosts', editingId), postPayload);
        alert("Post updated successfully!");
      } else {
        // CREATE new post
        await addDoc(collection(db, 'blogPosts'), { ...postPayload, createdAt: serverTimestamp() });
        alert("Post published successfully!");
      }
      
      setView('list'); // Go back to list
      fetchPosts();   // Refresh list
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save post.");
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
        <p className="text-brand-gray mb-8">Sign in with your approved Google account.</p>
        <button onClick={handleLogin} className="btn-primary flex items-center gap-3 text-lg px-8 py-4">Sign in with Google</button>
      </div>
    );
  }

  // --- 3. ADMIN DASHBOARD (List View) ---
  if (view === 'list') {
    return (
      <div>
        <div className="bg-brand-dark text-white px-4 py-3 shadow-lg">
          <div className="section-container flex items-center justify-between mx-auto w-full">
            <div className="flex items-center gap-3">
              <img src={user.photoURL} alt="Admin" className="w-8 h-8 rounded-full border-2 border-brand-cyan" />
              <p className="text-sm font-semibold">{user.displayName}</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"><LogOut size={16} /> Logout</button>
          </div>
        </div>

        <div className="section-container py-12 md:py-16 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div><h1 className="text-3xl font-extrabold">Manage Posts</h1><p className="text-brand-gray mt-1">View, edit, or delete your articles.</p></div>
            <button onClick={handleCreateNew} className="btn-primary flex items-center gap-2"><Plus size={18} /> New Post</button>
          </div>

          {isLoadingPosts ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-blue w-8 h-8" /></div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-brand-border">
              <p className="text-brand-gray text-lg">No posts yet.</p>
              <button onClick={handleCreateNew} className="text-brand-blue font-semibold mt-2 hover:underline">Create your first post</button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center gap-4 p-4 bg-white border border-brand-border rounded-xl hover:shadow-sm transition-shadow">
                  <img src={post.image} alt="" className="w-16 h-16 rounded-lg object-cover hidden sm:block"/>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-brand-dark truncate">{post.title}</h3>
                    <p className="text-sm text-brand-gray">{post.date} • {post.author}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEditPost(post)} className="p-2 text-brand-blue hover:bg-brand-light rounded-lg transition-colors" title="Edit"><Pencil size={18} /></button>
                    <button onClick={() => handleDeletePost(post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- 4. EDITOR VIEW (Create or Edit Mode) ---
  return (
    <div>
      <div className="bg-brand-dark text-white px-4 py-3 shadow-lg">
        <div className="section-container flex items-center justify-between mx-auto w-full">
          <div className="flex items-center gap-3">
            <img src={user.photoURL} alt="Admin" className="w-8 h-8 rounded-full border-2 border-brand-cyan" />
            <p className="text-sm font-semibold">{user.displayName}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"><LogOut size={16} /> Logout</button>
        </div>
      </div>

      <div className="section-container py-12 md:py-16 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="text-brand-gray hover:text-brand-dark"><ArrowLeft size={24} /></button>
            <div>
              <h1 className="text-3xl font-extrabold">{editingId ? 'Edit Post' : 'Create Post'}</h1>
              <p className="text-brand-gray mt-1">{editingId ? 'Modify your existing article.' : 'Write a new article for DTECHNURSE'}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-10 rounded-2xl border border-brand-border shadow-sm">
          
          <div>
            <label className="block text-sm font-semibold mb-3 flex items-center gap-2"><LinkIcon size={16} /> Cover Image URL</label>
            <input type="url" name="coverUrl" value={formData.coverUrl} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none mb-4" placeholder="https://images.unsplash.com/photo-xxxxx..." required />
            <div className="border-2 border-dashed border-brand-border rounded-xl h-64 flex items-center justify-center bg-gray-50 overflow-hidden">
              {formData.coverUrl ? (<img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" onError={(e) => e.target.src = ''} />) : (<p className="text-brand-gray text-sm">Paste a URL above to see a preview</p>)}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-semibold mb-2">Blog Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none" placeholder="e.g., The Future of Nursing..." required /></div>
            <div><label className="block text-sm font-semibold mb-2">Author Name</label><input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none" placeholder="e.g., Jane Doe, RN" /></div>
          </div>

          <div><label className="block text-sm font-semibold mb-2">Short Excerpt</label><textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows="2" className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none resize-none" placeholder="A brief summary..." required></textarea></div>

          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2">Content</label>
            <div className="flex flex-wrap gap-2 p-2 border border-b-0 border-brand-border rounded-t-lg bg-gray-50">
              <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-200 rounded"><Bold size={18} /></button>
              <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-200 rounded"><Italic size={18} /></button>
              <button type="button" onClick={() => execCommand('formatBlock', '<h2>')} className="p-2 hover:bg-gray-200 rounded font-bold">H2</button>
              <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded"><List size={18} /></button>
              <button type="button" onClick={handleInlineImage} className="p-2 hover:bg-gray-200 rounded text-brand-blue"><Image size={18} /></button>
              <button type="button" onClick={() => isHtmlView ? switchToVisual() : (setIsHtmlView(true), handleEditorBlur())} className={`ml-auto p-2 rounded flex items-center gap-1 text-xs font-mono font-bold ${isHtmlView ? 'bg-brand-blue text-white' : 'hover:bg-gray-200 text-gray-600'}`} title="Toggle HTML View"><Code size={16} /> HTML</button>
            </div>

            {isHtmlView ? (
              <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="h-[300px] md:h-[400px] p-4 border border-brand-border rounded-b-lg overflow-y-auto focus:ring-2 focus:ring-brand-blue outline-none text-sm font-mono bg-gray-900 text-green-400 resize-none" placeholder="<p>Type raw HTML here...</p>" />
            ) : (
              <div ref={editorRef} contentEditable suppressContentEditableWarning onBlur={handleEditorBlur} className="h-[300px] md:h-[400px] p-4 border border-brand-border rounded-b-lg overflow-y-auto focus:ring-2 focus:ring-brand-blue outline-none text-brand-gray leading-relaxed prose max-w-none" style={{ minHeight: '300px' }} />
            )}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-brand-border">
            {isSubmitting && (<div className="flex items-center gap-2 text-sm text-brand-blue font-medium"><Loader2 className="animate-spin" size={18} /> Saving...</div>)}
            <button type="submit" disabled={isSubmitting} className="btn-primary ml-auto flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><Save size={18} /> {isSubmitting ? 'Saving...' : (editingId ? 'Update Post' : 'Publish Post')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
