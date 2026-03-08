import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark bg-grid-pattern flex flex-col items-center justify-center relative overflow-hidden text-white">
      
      {/* Background Lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[150px] -z-10"></div>

      {/* Main Card */}
      <div className="relative z-10 p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent shadow-2xl">
        <div className="bg-dark/80 backdrop-blur-xl border border-white/10 p-12 md:p-16 rounded-xl text-center max-w-2xl mx-4">
          
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wide shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            ✨ V1.0 - Early Access
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-lg">
            Code<span className="text-primary">-Stash</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed">
            Stop losing your logic. <br />
            The <span className="text-white font-medium">ultimate snippet manager</span> for pro developers.
          </p>

          <button 
            onClick={() => navigate('/dashboard')}
            className="group relative px-8 py-3 bg-primary text-white font-semibold rounded-lg overflow-hidden transition-all hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_rgba(99,102,241,0.7)]"
          >
            <span className="relative z-10 flex items-center gap-2">Let's Build 🚀</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Home;