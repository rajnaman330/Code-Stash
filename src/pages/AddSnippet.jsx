import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { auth, db } from '../firebase'; // db import kiya
import { onAuthStateChanged } from 'firebase/auth';
import { ref, set, push, get, child } from 'firebase/database'; // Database functions

const AddSnippet = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    language: 'JavaScript',
    code: '',
    tags: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        toast.error("Please Login to add snippets! 🔒");
        navigate("/");
      } else {
        setUser(currentUser);
        setLoading(false);

        // AGAR EDIT MODE HAI TO DATA FIREBASE SE LAO
        if (id) {
          const dbRef = ref(db);
          get(child(dbRef, `users/${currentUser.uid}/snippets/${id}`)).then((snapshot) => {
            if (snapshot.exists()) {
              setFormData(snapshot.val());
            } else {
              toast.error("Snippet not found");
              navigate('/dashboard');
            }
          });
        }
      }
    });
    return () => unsubscribe();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      if (id) {
        // UPDATE LOGIC (Firebase)
        // Hum wahi purani ID par naya data overwrite kar denge
        const snippetRef = ref(db, `users/${user.uid}/snippets/${id}`);
        await set(snippetRef, {
          ...formData,
          id: id,
          date: new Date().toLocaleDateString()
        });
        toast.success("Snippet Updated in Cloud! ☁️");
      } else {
        // CREATE LOGIC (Firebase)
        // 1. Ek nayi location (Ref) banao
        const newSnippetRef = push(ref(db, `users/${user.uid}/snippets`));
        // 2. Wahan data set kar do
        await set(newSnippetRef, {
          ...formData,
          id: newSnippetRef.key, // Firebase ki generated ID use karenge
          date: new Date().toLocaleDateString()
        });
        toast.success("Snippet Saved to Cloud! ☁️");
      }
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error("Error saving data 😢");
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Connecting to Cloud... ☁️</div>;

  return (
    <div className="min-h-screen bg-dark text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6 mt-6">
        <div className="bg-darkLight border border-gray-800 rounded-xl p-8 shadow-2xl">
          
          <h2 className="text-3xl font-bold mb-6 text-white">
            {id ? "Edit Snippet (Cloud) ✏️" : "Add New Snippet (Cloud) ☁️"}
          </h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Title */}
            <div>
              <label className="block text-gray-400 mb-2 font-medium">Snippet Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                placeholder="Ex: Navbar Center Logic"
                className="w-full bg-dark border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                onChange={handleChange}
                required
              />
            </div>

            {/* Language & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2 font-medium">Language</label>
                <select 
                  name="language"
                  className="w-full bg-dark border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                  onChange={handleChange}
                  value={formData.language}
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="HTML">HTML</option>
                  <option value="CSS">CSS</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                  <option value="C">C</option>
                  <option value="C#">C#</option>
                  <option value="PHP">PHP</option>
                  <option value="Ruby">Ruby</option>
                  <option value="Go">Go</option>
                  <option value="Rust">Rust</option>
                  <option value="Swift">Swift</option>
                  <option value="Kotlin">Kotlin</option>
                  <option value="SQL">SQL</option>
                  <option value="Bash">Bash/Shell</option>
                  <option value="Dart">Dart</option>
                  <option value="JSON">JSON</option>
                  <option value="XML">XML</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2 font-medium">Tags (Optional)</label>
                <input 
                  type="text" 
                  name="tags"
                  value={formData.tags}
                  placeholder="Ex: #ui, #algorithm, #db"
                  className="w-full bg-dark border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Code Editor */}
            <div>
              <label className="block text-gray-400 mb-2 font-medium">Paste Your Code</label>
              <textarea 
                name="code"
                rows="10"
                value={formData.code}
                placeholder="// Paste your code here..."
                className="w-full bg-dark border border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-300 focus:outline-none focus:border-primary resize-none"
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-2">
              <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-500/30">
                {id ? "Update Cloud Snippet" : "Save to Cloud"}
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} className="bg-transparent border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition">
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSnippet;