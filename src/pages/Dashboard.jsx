import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { FaSearch, FaPlus, FaFolderOpen, FaTrash, FaFilter } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // Firebase imports
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, remove } from 'firebase/database'; // Database functions
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 1. DATA FETCHING LOGIC
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Firebase se data suno (Listen)
        const snippetsRef = ref(db, `users/${currentUser.uid}/snippets`);
        
        onValue(snippetsRef, (snapshot) => {
          const data = snapshot.val();
          
          if (data) {
            // Firebase object return karta hai, usko Array mein convert kar rahe hain
            const snippetsArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key]
            }));
            // Naya snippet sabse upar dikhe, isliye reverse kiya
            setSnippets(snippetsArray.reverse());
          } else {
            setSnippets([]); // Agar data nahi hai to empty array
          }
          setLoading(false);
        });

      } else {
        setUser(null);
        setSnippets([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. DELETE FUNCTION (Cloud se delete)
  const handleDelete = async (id) => {
    if(window.confirm("Delete this snippet permanently?")) {
      try {
        const snippetRef = ref(db, `users/${user.uid}/snippets/${id}`);
        await remove(snippetRef);
        toast.success("Snippet Deleted");
      } catch (error) {
        toast.error("Error deleting snippet");
      }
    }
  };

  // 3. FILTER LOGIC (Wahi purana wala)
  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
       // C++ aur C# ka special case handle kiya
       if (selectedCategory === 'C++') {
         matchesCategory = snippet.language === 'cpp' || snippet.language === 'C++';
       } else if (selectedCategory === 'C#') {
         matchesCategory = snippet.language === 'csharp' || snippet.language === 'C#';
       } else {
         matchesCategory = snippet.language.toLowerCase() === selectedCategory.toLowerCase();
       }
    }
    return matchesSearch && matchesCategory;
  });

  const categories = [
    'All', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Python', 'Java', 
    'C++', 'C', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 
    'SQL', 'Bash', 'Dart', 'JSON', 'XML'
  ];

  return (
    <div className="min-h-screen bg-dark text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {user ? "My Cloud Library ☁️" : "Library"}
            </h1>
            <p className="text-gray-400 mt-1">Manage and organize your code snippets.</p>
          </div>
          
          <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
            
            {/* Search */}
            <div className="relative w-full md:w-64">
              <FaSearch className="absolute left-3 top-3.5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search snippets..." 
                className="w-full bg-darkLight border border-gray-700 text-sm py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:border-primary placeholder-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-3.5 text-gray-500 pointer-events-none" />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-48 bg-darkLight border border-gray-700 text-sm py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:border-primary appearance-none cursor-pointer text-gray-300"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat === 'All' ? 'Filter by Language' : cat}</option>
                ))}
              </select>
              <div className="absolute right-3 top-4 pointer-events-none">
                <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Add Button */}
            <Link to="/add">
              <button className="bg-primary hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition shadow-lg flex items-center justify-center gap-2 font-medium whitespace-nowrap">
                <FaPlus /> New
              </button>
            </Link>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-xl text-gray-400 animate-pulse">Loading from Cloud... ☁️</div>
          </div>
        ) : !user ? (
          // NOT LOGGED IN STATE
          <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-xl">
             <h3 className="text-xl text-white mb-2">Please Login to view your snippets</h3>
             <p className="text-gray-500">Your snippets are safe in the cloud.</p>
          </div>
        ) : filteredSnippets.length === 0 ? (
          // EMPTY STATE
          <div className="min-h-[400px] border-2 border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center text-center p-8">
            <div className="bg-darkLight p-4 rounded-full mb-4">
              <FaFolderOpen className="text-4xl text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No snippets found</h3>
            <p className="text-gray-500 max-w-sm mb-6">
               {searchQuery || selectedCategory !== 'All' ? "Try adjusting your filters." : "Your cloud library is empty."}
            </p>
            {snippets.length === 0 && (
              <Link to="/add">
                <button className="bg-white text-dark px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition">Create First Snippet</button>
              </Link>
            )}
          </div>
        ) : (
          // SNIPPET CARDS
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSnippets.map((snippet) => (
              <div key={snippet.id} className="bg-darkLight border border-gray-800 rounded-xl p-6 hover:border-primary/50 transition duration-300 shadow-lg group flex flex-col h-full">
                
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-2 py-1 rounded uppercase tracking-wider">
                    {snippet.language}
                  </span>
                  <button onClick={() => handleDelete(snippet.id)} className="text-gray-500 hover:text-red-500 transition">
                    <FaTrash />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{snippet.title}</h3>
                
                <div className="bg-dark p-3 rounded-lg mb-4 font-mono text-xs text-gray-400 overflow-hidden h-24 opacity-70 group-hover:opacity-100 transition relative">
                  <pre>{snippet.code}</pre>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                  <span>{snippet.date}</span>
                  <Link to={`/snippet/${snippet.id}`}>
                    <button className="text-white hover:text-primary font-medium transition">View Code →</button>
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;