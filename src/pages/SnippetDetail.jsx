import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaCopy, FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { auth, db } from '../firebase'; // 1. Firebase Import
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, child, remove } from 'firebase/database'; // 2. Database Functions
import toast from 'react-hot-toast';

const SnippetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 3. FETCH DATA FROM FIREBASE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Database se specific ID wala snippet mango
        const dbRef = ref(db);
        get(child(dbRef, `users/${currentUser.uid}/snippets/${id}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              setSnippet(snapshot.val());
            } else {
              toast.error("Snippet not found!");
              navigate('/dashboard');
            }
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
          
      } else {
        // Agar login nahi hai to wapas bhejo
        toast.error("Please Login first");
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [id, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    toast.success("Code Copied! 📋");
    setTimeout(() => setCopied(false), 2000);
  };

  // 4. DELETE FROM FIREBASE
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this from Cloud?")) {
      try {
        const snippetRef = ref(db, `users/${user.uid}/snippets/${id}`);
        await remove(snippetRef);
        toast.success("Snippet Deleted Successfully 🗑️");
        navigate('/dashboard');
      } catch (error) {
        toast.error("Error deleting snippet");
      }
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Snippet... ☁️</div>;
  if (!snippet) return null;

  return (
    <div className="min-h-screen bg-dark text-white">
      <Navbar />
      
      <div className="max-w-5xl mx-auto p-6 mt-6">
        
        {/* Back Button */}
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
          <FaArrowLeft /> Back to Library
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{snippet.title}</h1>
            <div className="flex gap-3">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium uppercase">
                {snippet.language}
              </span>
              {snippet.tags && (
                <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-sm">
                  {snippet.tags}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button onClick={handleCopy} className="bg-darkLight border border-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
              <FaCopy /> {copied ? "Copied!" : "Copy Code"}
            </button>

            {/* EDIT BUTTON */}
            <Link to={`/edit/${snippet.id}`}>
              <button className="bg-blue-500/10 border border-blue-500/50 hover:bg-blue-500 hover:text-white text-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 transition">
                <FaEdit /> Edit
              </button>
            </Link>

            {/* DELETE BUTTON */}
            <button onClick={handleDelete} className="bg-red-500/10 border border-red-500/50 hover:bg-red-500 hover:text-white text-red-500 px-4 py-2 rounded-lg flex items-center gap-2 transition">
              <FaTrash /> Delete
            </button>
          </div>
        </div>

        {/* Code Editor Look */}
        <div className="rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
          <div className="bg-[#1e1e1e] px-4 py-2 flex items-center gap-2 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-xs text-gray-400 font-mono">
              code.{snippet.language === 'C++' ? 'cpp' : snippet.language.toLowerCase()}
            </span>
          </div>

          <SyntaxHighlighter 
            language={snippet.language.toLowerCase()} 
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.9rem', lineHeight: '1.5' }}
            showLineNumbers={true}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>

      </div>
    </div>
  );
};

export default SnippetDetail;