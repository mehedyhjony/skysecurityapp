
import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_MODULES, BLOG_POSTS } from './constants';
import { Module, Lab, Language, AppView, BlogPost, ForumPost, User } from './types';
import { translations } from './translations';
import ModuleCard from './components/ModuleCard';
import BlogCard from './components/BlogCard';
import Terminal from './components/Terminal';
import Hero from './components/Hero';
import Forum from './components/Forum';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppView>('landing');
  const [isAdmin, setIsAdmin] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('skyteam_lang');
    return (saved as Language) || 'en';
  });
  
  // Manage dynamic state for modules (CRUD enabled)
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);
  
  // Mock users for admin panel
  const [users, setUsers] = useState<User[]>([
    { id: 'u1', codename: 'Ghost_Operative', email: 'ghost@sky.net', credits: 12500, status: 'Active', rank: 'Master', joinedDate: '2024-01-12' },
    { id: 'u2', codename: 'Pulse_Lead', email: 'pulse@sky.net', credits: 8900, status: 'Active', rank: 'Elite', joinedDate: '2024-02-05' },
    { id: 'u3', codename: 'Newbie_Breaker', email: 'breaker@sky.net', credits: 450, status: 'Active', rank: 'Initiate', joinedDate: '2024-05-18' },
    { id: 'u4', codename: 'Zero_Shadow', email: 'shadow@sky.net', credits: 15000, status: 'Suspended', rank: 'Ghost Operative', joinedDate: '2023-11-20' },
  ]);

  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeLabIndex, setActiveLabIndex] = useState<number>(0);
  const [labTab, setLabTab] = useState<'manual' | 'setup' | 'terminal' | 'validate'>('manual');
  const [search, setSearch] = useState('');
  
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: 'fp-001',
      title: 'Zero-Day in Legacy VPN Gateways',
      author: 'Ghost_Operative',
      content: 'Discovered a buffer overflow in 2018-era VPN concentrators. Looking for collaborators to test a stable PoC.',
      category: 'ZeroDay',
      timestamp: '2024-05-20 14:30',
      comments: [
        { id: 'c-001', author: 'Pulse_Lead', text: 'I have some legacy hardware in my lab. Sending encrypted coords.', timestamp: '2024-05-20 15:00' }
      ]
    },
    {
      id: 'fp-002',
      title: 'Best rockyou extensions?',
      author: 'Newbie_Breaker',
      content: 'Standard rockyou.txt is missing modern 2024 patterns. Any recommended specialist wordlists for Fintech targets?',
      category: 'Exploit',
      timestamp: '2024-05-21 09:12',
      comments: []
    }
  ]);

  const t = translations[language];

  const [completedLabs, setCompletedLabs] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('skyteam_progress_v9');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('skyteam_progress_v9', JSON.stringify(completedLabs));
  }, [completedLabs]);

  useEffect(() => {
    localStorage.setItem('skyteam_lang', language);
  }, [language]);

  const activeLab = useMemo(() => {
    if (!selectedModule) return null;
    return selectedModule.labs[activeLabIndex];
  }, [selectedModule, activeLabIndex]);

  const totalCredits = useMemo(() => {
    return modules.reduce((acc, module) => {
      const completedInModule = module.labs.filter((_, i) => completedLabs[`${module.id}-${i}`]).length;
      return acc + (completedInModule * 10);
    }, 0);
  }, [modules, completedLabs]);

  const stats = useMemo(() => {
    const total = modules.reduce((acc, m) => acc + m.labs.length, 0);
    const completed = Object.values(completedLabs).filter(Boolean).length;
    const level = Math.floor(totalCredits / 1000) + 1;
    let rank = "Initiate";
    if (level > 20) rank = "Ghost Operative";
    else if (level > 15) rank = "Master";
    else if (level > 10) rank = "Elite";
    else if (level > 5) rank = "Specialist";
    
    return { total, completed, level, rank };
  }, [modules, completedLabs, totalCredits]);

  const filteredModules = useMemo(() => {
    const typeFilter = appState === 'red-team' ? 'Red Team' : 'Blue Team';
    return modules.filter(m => m.type === typeFilter && (
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
    ));
  }, [modules, search, appState]);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.bnTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Admin Handlers
  const handleUpdateUserCredits = (userId: string, amount: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, credits: u.credits + amount } : u));
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  const handleDeletePost = (postId: string) => {
    setForumPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleAddModule = (newModule: Module) => {
    setModules(prev => [...prev, newModule]);
  };

  const handleAddForumPost = (newPostData: Omit<ForumPost, 'id' | 'timestamp' | 'comments'>) => {
    const newPost: ForumPost = {
      ...newPostData,
      id: `fp-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      comments: []
    };
    setForumPosts(prev => [newPost, ...prev]);
  };

  const handleAddForumComment = (postId: string, text: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            id: `c-${Date.now()}`,
            author: 'OPERATIVE_YOU',
            text,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
          }]
        };
      }
      return post;
    }));
  };

  const logout = () => {
    setAppState('landing');
    setSelectedModule(null);
    setSelectedPost(null);
    setIsAdmin(false);
  };

  const enterPortal = (admin: boolean = false) => {
    setIsAdmin(admin);
    setAppState('profile');
  };

  if (appState === 'landing') return <Hero onEnter={(admin) => enterPortal(admin)} language={language} setLanguage={setLanguage} />;

  const NavItems = [
    { id: 'profile', label: t.profile, icon: '👤', color: 'indigo' },
    { id: 'intelligence', label: t.intelligence, icon: '📖', color: 'emerald' },
    { id: 'red-team', label: t.redTeam, icon: '🎯', color: 'red' },
    { id: 'blue-team', label: t.blueTeam, icon: '🛡️', color: 'blue' },
    { id: 'forum', label: t.forum, icon: '🌐', color: 'purple' }
  ];

  if (isAdmin) {
    NavItems.push({ id: 'admin', label: 'ADMIN PANEL', icon: '⚡', color: 'amber' });
  }

  const isEn = language === 'en';

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-[#020617] text-slate-100 font-mono selection:bg-indigo-500/30 overflow-hidden ${language === 'bn' ? 'bn-font' : ''}`}>
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-slate-900 border-r border-slate-800 p-6 flex-col gap-8 shrink-0 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-black shadow-lg shadow-indigo-500/20">S</div>
            <div>
              <h1 className="text-sm font-black uppercase italic tracking-tighter">{t.appTitle}</h1>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">v9.0.0 [STABLE]</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
          <div className="text-[9px] text-slate-500 font-black uppercase mb-1">{t.power}</div>
          <div className="text-2xl font-black italic text-white">{totalCredits} <span className="text-[10px] text-indigo-400 uppercase tracking-widest">{t.credits}</span></div>
        </div>

        <nav className="flex-1 space-y-2">
          {NavItems.map(item => (
            <button 
              key={item.id}
              onClick={() => { setAppState(item.id as AppView); setSelectedModule(null); setSelectedPost(null); }}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${appState === item.id ? (item.id === 'admin' ? 'bg-amber-600 text-black font-black' : `bg-${item.color}-600 text-white shadow-lg`) : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={logout}
          className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
        >
          <span>🚪</span>
          <span className="text-[10px] font-black uppercase tracking-widest">{t.logout}</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 pb-24 md:pb-10">
          {selectedModule ? (
             <div className="flex flex-col gap-6 max-w-7xl mx-auto h-full">
             {/* Lab Header */}
             <header className={`flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 p-4 md:p-6 rounded-2xl border border-slate-800 shadow-xl border-b-4 ${selectedModule.type === 'Red Team' ? 'border-b-red-600' : 'border-b-blue-600'} gap-4`}>
               <div className="flex items-center gap-4 w-full sm:w-auto">
                 <button onClick={() => setSelectedModule(null)} className="p-2 hover:bg-slate-800 rounded-lg text-indigo-400 shrink-0">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                 </button>
                 <div className="min-w-0">
                   <h2 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter text-white truncate">{selectedModule.title}</h2>
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate">Lab {activeLabIndex + 1}: {activeLab?.name}</p>
                 </div>
               </div>
               <button 
                 onClick={() => {
                   const key = `${selectedModule.id}-${activeLabIndex}`;
                   setCompletedLabs(prev => ({ ...prev, [key]: !prev[key] }));
                 }} 
                 className={`w-full sm:w-auto px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${completedLabs[`${selectedModule.id}-${activeLabIndex}`] ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : (selectedModule.type === 'Red Team' ? 'bg-red-600 text-white shadow-red-500/20 shadow-lg' : 'bg-blue-600 text-white shadow-blue-500/20 shadow-lg')}`}
               >
                 {completedLabs[`${selectedModule.id}-${activeLabIndex}`] ? 'CHANNEL STABLE ✓' : (selectedModule.type === 'Red Team' ? 'EXECUTE BREACH' : 'INITIALIZE DEFENSE')}
               </button>
             </header>

             <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
               {/* Lab Selector */}
               <div className="w-full lg:w-64 bg-slate-900/50 rounded-2xl border border-slate-800 p-4 flex flex-col h-48 sm:h-64 lg:h-auto overflow-hidden shrink-0">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">TACTICAL NODES</span>
                 <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                   {selectedModule.labs.map((lab, i) => (
                     <button 
                       key={i} 
                       onClick={() => { setActiveLabIndex(i); setLabTab('manual'); }}
                       className={`w-full text-left px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-between gap-2 ${activeLabIndex === i ? (selectedModule.type === 'Red Team' ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'bg-blue-600/20 text-blue-400 border border-blue-500/30') : 'text-slate-500 hover:bg-slate-800'}`}
                     >
                       <span className="truncate">{i+1}. {lab.name}</span>
                       {completedLabs[`${selectedModule.id}-${i}`] && <span className="text-emerald-500 shrink-0">✓</span>}
                     </button>
                   ))}
                 </div>
               </div>

               {/* Lab Content */}
               <div className="flex-1 bg-black rounded-3xl border border-slate-800 overflow-hidden flex flex-col min-h-[400px]">
                 <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex overflow-x-auto whitespace-nowrap gap-2 no-scrollbar">
                   {['manual', 'setup', 'terminal', 'validate'].map(tab => (
                     <button 
                       key={tab} 
                       onClick={() => setLabTab(tab as any)}
                       className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${labTab === tab ? (selectedModule.type === 'Red Team' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white') : 'text-slate-500 hover:text-slate-300'}`}
                     >
                       {tab}
                     </button>
                   ))}
                 </div>

                 <div className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-10">
                   {labTab === 'manual' && (
                     <div className="space-y-8">
                       <section>
                         <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">OBJECTIVE</h4>
                         <p className="text-lg md:text-2xl text-slate-200 leading-relaxed font-bold">
                           {language === 'bn' ? activeLab?.bnObjective : activeLab?.objective}
                         </p>
                       </section>
                       <section>
                         <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">INSTRUCTIONS</h4>
                         <div className="space-y-6">
                           {(language === 'bn' ? activeLab?.bnInstructions : activeLab?.instructions)?.map((step, idx) => (
                             <div key={idx} className="flex gap-4">
                               <span className="text-indigo-500 font-black text-lg md:text-xl shrink-0">0{idx + 1}</span>
                               <p className="text-base md:text-2xl text-slate-400 leading-snug">{step}</p>
                             </div>
                           ))}
                         </div>
                       </section>
                     </div>
                   )}
                   {labTab === 'setup' && (
                     <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">ENVIRONMENT_PROVISIONING</h4>
                       <Terminal label="provisioning.log" content={activeLab?.setupWalkthrough} type="text" />
                       <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                          <p className="text-[10px] text-indigo-300 uppercase leading-relaxed">
                            Ensure your local VPN bridge is active and connected to <strong>{activeLab?.targetOs}</strong>. 
                            Required tools: {activeLab?.requiredTools?.join(', ')}.
                          </p>
                       </div>
                     </div>
                   )}
                   {labTab === 'terminal' && <Terminal content={activeLab?.command} />}
                   {labTab === 'validate' && (
                     <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-10">
                       <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                       </div>
                       <div>
                         <h3 className="text-lg md:text-xl font-black uppercase text-white">Validation Protocol</h3>
                         <p className="text-slate-500 text-xs md:text-sm mt-2 max-w-sm px-4">Capture the flag or confirm system integrity to validate the module.</p>
                       </div>
                       <input 
                         type="text" 
                         placeholder="ENTER_SIGNATURE_HASH..." 
                         className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl w-full max-w-sm focus:outline-none focus:border-indigo-500 text-center uppercase tracking-widest text-[10px] md:text-xs"
                       />
                       <button className="bg-white text-black font-black uppercase tracking-widest px-8 md:px-10 py-3 rounded-xl hover:bg-emerald-500 hover:text-white transition-all text-[10px] md:text-xs">
                         Submit Intel
                       </button>
                     </div>
                   )}
                 </div>
               </div>
             </div>
           </div>
          ) : selectedPost ? (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <header className="bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-800 border-l-4 border-l-emerald-500 shadow-2xl relative overflow-hidden">
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-500 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {selectedPost.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{selectedPost.date}</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white leading-tight">
                {isEn ? selectedPost.title : selectedPost.bnTitle}
              </h2>
              <div className="mt-6 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-emerald-500 shrink-0">
                   {selectedPost.author[0]}
                 </div>
                 <div className="min-w-0">
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">TRANSMITTED BY</p>
                   <p className="text-sm font-black text-white uppercase italic truncate">{selectedPost.author}</p>
                 </div>
              </div>
            </header>

            <div className="space-y-10">
              <section>
                <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">TACTICAL_OVERVIEW</h3>
                <p className="text-base md:text-xl text-slate-300 leading-relaxed">
                  {isEn ? selectedPost.content.overview : selectedPost.content.bnOverview}
                </p>
              </section>

              <section>
                <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">LAB_ENVIRONMENT_SETUP</h3>
                <p className="text-xs text-slate-400 mb-4">{isEn ? "Execute this command to spawn the tactical environment:" : "ট্যাকটিক্যাল এনভায়রনমেন্ট স্পন করতে এই কমান্ডটি চালান:"}</p>
                <Terminal label="provisioning.sh" content={isEn ? selectedPost.content.labSetup : selectedPost.content.bnLabSetup} type="text" />
              </section>

              <section>
                <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6">ATTACK_PROTOCOL_STEPS</h3>
                <div className="space-y-6">
                  {(isEn ? selectedPost.content.attackSteps : selectedPost.content.bnAttackSteps).map((step, idx) => (
                    <div key={idx} className="flex gap-4 border-l-2 border-slate-800 pl-4 md:pl-6 py-2 group hover:border-red-500 transition-colors">
                      <span className="text-red-500 font-black text-lg md:text-xl italic opacity-50 group-hover:opacity-100 shrink-0">0{idx + 1}</span>
                      <p className="text-base md:text-2xl text-slate-200 group-hover:text-white transition-colors leading-snug">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="p-6 md:p-8 bg-slate-900/50 rounded-2xl md:rounded-3xl border border-slate-800">
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">REMEDIATION_STRATEGY</h3>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed italic border-l-2 border-blue-500/50 pl-4 md:pl-6">
                  {isEn ? selectedPost.content.remediation : selectedPost.content.bnRemediation}
                </p>
              </section>
            </div>

            <div className="pt-6 flex justify-center">
              <button 
                onClick={() => setSelectedPost(null)}
                className="px-8 md:px-10 py-3 md:py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
              >
                Return to Intel Terminal
              </button>
            </div>
          </div>
          ) : appState === 'intelligence' ? (
            <div className="space-y-12 pb-10">
            <header className="mb-12">
             <h2 className="text-3xl sm:text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-emerald-500">
               OPS JOURNAL
             </h2>
             <div className="mt-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest border-l-4 border-emerald-500 pl-4 py-1 shrink-0">
                  {filteredPosts.length} Classified Intel Entries // Clearance: Level 1
                </p>
                <div className="relative w-full md:w-80">
                   <input 
                     type="text" 
                     placeholder="Search Journal..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs font-mono w-full focus:border-emerald-500 outline-none transition-all pl-10"
                   />
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
             </div>
           </header>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {filteredPosts.map(post => (
               <BlogCard 
                 key={post.id} 
                 post={post} 
                 onClick={setSelectedPost}
                 language={language}
               />
             ))}
           </div>
         </div>
          ) : appState === 'profile' ? (
            <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <header className="flex flex-col sm:flex-row items-center gap-6 bg-slate-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-800 text-center sm:text-left">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-indigo-600 flex items-center justify-center text-3xl md:text-4xl font-black shadow-xl shrink-0">S</div>
              <div className="min-w-0">
                <h2 className="text-2xl md:text-4xl font-black italic uppercase text-white truncate">Operative Profile</h2>
                <p className="text-xs md:text-sm text-emerald-500 font-bold uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Identity Verified // Rank: {stats.rank}
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {[
                { label: 'Level', value: stats.level, color: 'indigo' },
                { label: 'Credits', value: totalCredits, color: 'emerald' },
                { label: 'Completed', value: stats.completed, color: 'purple' }
              ].map(item => (
                <div key={item.label} className="bg-slate-900/40 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-800 text-center">
                  <h4 className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">{item.label}</h4>
                  <div className="text-4xl md:text-5xl font-black italic text-white">{item.value}</div>
                </div>
              ))}
            </div>

            <section className="bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-800">
              <h3 className="text-lg md:text-xl font-black italic uppercase tracking-widest text-white mb-6">Service Record</h3>
              <div className="space-y-3">
                {modules.map(m => {
                  const comp = m.labs.filter((_, i) => completedLabs[`${m.id}-${i}`]).length;
                  if (comp === 0) return null;
                  return (
                    <div key={m.id} className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-slate-800 gap-4">
                      <span className="text-[10px] font-black uppercase text-white truncate">{m.title}</span>
                      <span className="text-xs md:text-sm font-black italic text-indigo-400 shrink-0">{comp}/{m.labs.length}</span>
                    </div>
                  );
                })}
                {!modules.some(m => m.labs.some((_, i) => completedLabs[`${m.id}-${i}`])) && (
                  <p className="text-center text-slate-600 py-4 text-xs font-bold uppercase italic">No active field operations recorded.</p>
                )}
              </div>
            </section>
          </div>
          ) : appState === 'forum' ? (
            <div className="pb-10">
              <Forum 
                posts={forumPosts} 
                onAddPost={handleAddForumPost} 
                onAddComment={handleAddForumComment} 
                isPrivileged={totalCredits >= 1000} 
                requiredCredits={1000} 
                userCredits={totalCredits} 
              />
            </div>
          ) : appState === 'admin' && isAdmin ? (
            <div className="pb-10">
              <AdminPanel 
                users={users} 
                forumPosts={forumPosts} 
                modules={modules}
                onAddModule={handleAddModule}
                onUpdateUserCredits={handleUpdateUserCredits}
                onToggleUserStatus={handleToggleUserStatus}
                onDeletePost={handleDeletePost}
              />
            </div>
          ) : (
            <div className="space-y-8 pb-10">
            <header className="mb-10">
              <h2 className={`text-3xl sm:text-5xl md:text-7xl font-black italic tracking-tighter uppercase ${appState === 'red-team' ? 'text-red-500' : 'text-blue-500'}`}>
                {appState === 'red-team' ? 'RED TEAM OPS' : 'BLUE TEAM OPS'}
              </h2>
              <div className="mt-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest border-l-4 border-indigo-500 pl-4 py-1 shrink-0">
                   {filteredModules.length} Sectors Detected // Secure Link Active
                 </p>
                 <div className="relative w-full md:w-80">
                    <input 
                      type="text" 
                      placeholder="Filter Intel..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs font-mono w-full focus:border-indigo-500 outline-none transition-all pl-10"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                 </div>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredModules.map(module => (
                <ModuleCard 
                  key={module.id} 
                  module={module} 
                  onClick={() => { setSelectedModule(module); setActiveLabIndex(0); setLabTab('manual'); }}
                  progress={{ completed: module.labs.filter((_, i) => completedLabs[`${module.id}-${i}`]).length, total: module.labs.length }}
                />
              ))}
            </div>
          </div>
          )}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 py-3 z-[100] safe-area-bottom shadow-2xl">
          {NavItems.map(item => (
            <button 
              key={item.id}
              onClick={() => { setAppState(item.id as AppView); setSelectedModule(null); setSelectedPost(null); }}
              className={`flex flex-col items-center gap-1.5 p-1 rounded-lg transition-all ${appState === item.id ? (item.id === 'admin' ? 'text-amber-500' : item.color === 'emerald' ? 'text-emerald-500' : item.color === 'red' ? 'text-red-500' : item.color === 'blue' ? 'text-blue-500' : item.color === 'purple' ? 'text-purple-500' : 'text-indigo-500') : 'text-slate-500'}`}
            >
              <span className="text-xl md:text-2xl">{item.icon}</span>
              <span className="text-[7px] font-black uppercase tracking-widest">{item.label.split(' ')[0]}</span>
            </button>
          ))}
          <button onClick={logout} className="flex flex-col items-center gap-1.5 p-1 text-red-500 opacity-80 hover:opacity-100">
            <span className="text-xl md:text-2xl">🚪</span>
            <span className="text-[7px] font-black uppercase tracking-widest">Exit</span>
          </button>
        </nav>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .safe-area-bottom { padding-bottom: calc(env(safe-area-inset-bottom) + 12px); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}} />
    </div>
  );
};

export default App;