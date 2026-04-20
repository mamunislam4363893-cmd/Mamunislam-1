import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Settings, 
  BarChart3, 
  User as UserIcon, 
  CreditCard, 
  LayoutDashboard, 
  LogOut,
  Bell,
  Shield,
  Search,
  Plus,
  Trash2,
  AlertCircle,
  Gamepad2,
  Zap,
  Sparkles,
  Smartphone,
  Phone,
  Youtube,
  Trophy,
  History,
  Timer,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Button = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900',
    outline: 'border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'hover:bg-slate-100 text-slate-600',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  };
  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm', className)} {...props}>
    {children}
  </div>
);

// --- Pages ---

const UserPanel = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [adOverlay, setAdOverlay] = useState(false);
  const [adCountdown, setAdCountdown] = useState(0);

  const showAd = (callback?: () => void) => {
    setAdOverlay(true);
    setAdCountdown(5);
    const timer = setInterval(() => {
      setAdCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setAdOverlay(false);
          if (callback) if (callback) callback();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fetchUser = () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId') || '8125978050';

    fetch(`/api/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleCopy = () => {
    const referralLink = `https://t.me/${user.botUsername || 'AutosVerify_bot'}?start=${user.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verifyTask = async (taskId: string) => {
    setVerifying(taskId);
    try {
      const res = await fetch('/api/user/verify-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.userId, taskId })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchUser(); // Refresh data
      } else {
        alert(data.message || 'Verification failed. Did you join?');
      }
    } catch (e) {
      alert('Verification error. Please try again.');
    } finally {
      setVerifying(null);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!user) return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
      <h1 className="text-xl font-semibold text-slate-900">User Not Found</h1>
      <p className="text-slate-500 mt-2">Please open the panel through the Telegram Bot.</p>
    </div>
  );

  const tasks = user.availableTasks || [
    { id: 'task_telegram_channel', name: 'Join Telegram Channel', reward: 50 },
    { id: 'task_telegram_group', name: 'Join Telegram Group', reward: 50 },
    { id: 'task_youtube', name: 'Subscribe Youtube', reward: 100 }
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans relative">
      {/* Ad Overlay */}
      <AnimatePresence>
        {adOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">High Reward Ad</h2>
            <p className="text-slate-400 text-sm mb-8">Please wait while the ad completes to receive your tokens.</p>
            <div className="text-4xl font-black text-amber-500 tabular-nums">
              {adCountdown}s
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
              <UserIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">@{user.username}</h2>
              <p className="text-[10px] font-mono text-slate-400">ID: {user.userId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-lg shadow-blue-200/50 relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <CreditCard className="w-24 h-24 rotate-12" />
              </div>
              <div className="flex items-center justify-between opacity-80 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest">Available Credits</span>
                <CreditCard className="h-4 w-4" />
              </div>
              <div className="text-3xl font-black mb-1">{user.tokens || 0}</div>
              <div className="text-blue-100 text-[10px] font-medium">TC Tokens</div>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-5 bg-slate-900 text-white border-none shadow-lg shadow-slate-200/50 relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Shield className="w-24 h-24 -rotate-12" />
              </div>
              <div className="flex items-center justify-between opacity-80 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest">Premium Gems</span>
                <Shield className="h-4 w-4" />
              </div>
              <div className="text-3xl font-black mb-1">{user.Gems || 0}</div>
              <div className="text-slate-400 text-[10px] font-medium">Unlocked Rewards</div>
            </Card>
          </motion.div>
        </div>

        {/* Invite Link Section */}
        <Card className="p-6 bg-white">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            Refer & Earn
          </h3>
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex-1 truncate text-xs font-mono text-slate-500 px-2">
              https://t.me/{user.botUsername || 'AutosVerify_bot'}?start={user.referralCode}
            </div>
            <Button 
              size="sm" 
              variant={copied ? 'secondary' : 'outline'}
              onClick={handleCopy}
              className={cn(
                "shrink-0 gap-2 min-w-[100px] transition-all duration-300",
                copied ? "bg-green-500 hover:bg-green-600 border-green-500" : "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
              )}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 text-center">
            Earn 50 Tokens for every friend who joins using your link!
          </p>
        </Card>

        {/* Stats & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Your Activity</h3>
            <Card className="divide-y divide-slate-100">
              {[
                { label: 'Total Referrals', value: user.invites || 0, icon: Users },
                { label: 'Daily Streak', value: `${user.dailyStreak || 0} Days`, icon: CheckCircle2 },
                { label: 'Tasks Finished', value: user.completedTasks?.length || 0, icon: BarChart3 },
              ].map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600 font-medium">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </Card>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Quick Tools</h3>
            <div className="grid grid-cols-4 gap-3">
              <button 
                onClick={() => setActiveTab('numbers')}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-amber-200 hover:bg-amber-50/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <Smartphone className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-600">Number</span>
              </button>
              <button 
                onClick={() => setActiveTab('earn')}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-amber-200 hover:bg-amber-50/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-600">Earn</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-amber-200 hover:bg-amber-50/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                  <Gamepad className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-600">Games</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-amber-200 hover:bg-amber-50/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600">
                  <History className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-600">History</span>
              </button>
            </div>
          </section>
        </div>

        {/* Tasks Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Earning Tasks</h3>
            <Button variant="ghost" size="sm" className="text-blue-600 font-bold">Refresh</Button>
          </div>
          <div className="space-y-3">
            {tasks.map((task: any) => {
              const isCompleted = user.completedTasks?.includes(task.id);
              return (
                <Card key={task.id} className={cn("p-4 flex items-center gap-4 transition-all", isCompleted ? "opacity-60 bg-slate-50" : "hover:border-blue-300 shadow-sm")}>
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", isCompleted ? "bg-slate-200" : "bg-blue-50")}>
                    {isCompleted ? <CheckCircle2 className="h-6 w-6 text-slate-400" /> : <BarChart3 className="h-6 w-6 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{task.name}</h4>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Reward: +{task.reward} Tokens</p>
                  </div>
                  {isCompleted ? (
                    <span className="text-xs font-bold text-green-600 px-3 py-1 bg-green-50 rounded-full border border-green-100">Claimed</span>
                  ) : (
                    <div className="flex flex-col gap-1.5 min-w-[80px]">
                      <a 
                        href={task.url || '#'} 
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => {
                          if (task.id.includes('telegram')) {
                            // Link to channel
                          }
                        }}
                      >
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="w-full"
                          onClick={() => {
                            showAd(() => window.open(task.link, '_blank'));
                          }}
                        >
                          Start
                        </Button>
                      </a>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-[10px] py-1 h-7 border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => verifyTask(task.id)}
                        disabled={verifying === task.id}
                      >
                        {verifying === task.id ? 'Checking...' : 'Verify'}
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    )}

        {/* --- Feature Pages --- */}
        
        {activeTab === 'numbers' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost" onClick={() => setActiveTab('home')} className="rounded-full h-10 w-10 bg-white shadow-sm border border-slate-100">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-bold text-slate-900">Virtual Numbers</h1>
            </div>
            
            <Card className="p-8 text-center space-y-6 bg-white border-none shadow-xl shadow-purple-100/50">
              <div className="w-20 h-20 rounded-3xl bg-purple-100 flex items-center justify-center text-purple-600 mx-auto shadow-inner">
                <Smartphone className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Select Service</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Connect with Global Platforms</p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'telegram', name: 'TG', color: '#229ed9' },
                  { id: 'whatsapp', name: 'WA', color: '#22c55e' },
                  { id: 'tiktok', name: 'TT', color: '#000' },
                  { id: 'twitter', name: 'X', color: '#1da1f2' },
                  { id: 'facebook', name: 'FB', color: '#1877f2' },
                  { id: 'google', name: 'GO', color: '#4285f4' },
                  { id: 'microsoft', name: 'MS', color: '#00a4ef' },
                ].map(s => (
                  <button key={s.id} className="flex flex-col items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-purple-200 hover:shadow-lg transition-all group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform" style={{ background: s.color }}>
                      <Phone className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-black text-slate-600">{s.name}</span>
                  </button>
                ))}
              </div>
              <div className="pt-4">
                <Button className="w-full py-6 rounded-2xl bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200">
                  Generate Number (15 TC)
                </Button>
                <p className="text-[10px] text-slate-400 mt-3 font-medium italic">Instant activation • Global coverage</p>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'earn' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost" onClick={() => setActiveTab('home')} className="rounded-full h-10 w-10 bg-white shadow-sm border border-slate-100">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-bold text-slate-900">Earn Rewards</h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 flex flex-col items-center gap-4 cursor-pointer hover:border-blue-300 transition-all group bg-white border-none shadow-lg" onClick={() => showAd()}>
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Gamepad2 className="h-7 w-7" />
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-bold text-slate-900">Play Quiz</h4>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium leading-tight uppercase tracking-wider">Test knowledge</p>
                </div>
              </Card>

              <Card className="p-6 flex flex-col items-center gap-4 cursor-pointer hover:border-amber-300 transition-all group bg-white border-none shadow-lg" onClick={() => showAd()}>
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                  <Youtube className="h-7 w-7" />
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-bold text-slate-900">Watch Ad</h4>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium leading-tight uppercase tracking-wider">Instant Credits</p>
                </div>
              </Card>

              <Card className="p-6 flex flex-col items-center gap-4 cursor-pointer hover:border-purple-300 transition-all group bg-white border-none shadow-lg" onClick={() => showAd()}>
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-bold text-slate-900">Scratch Card</h4>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium leading-tight uppercase tracking-wider">Lucky Win</p>
                </div>
              </Card>

              {/* Monitor Section Removed by User Request */}
            </div>
            
            <Card className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 border-none relative overflow-hidden">
                <Zap className="absolute -right-4 -bottom-4 w-20 h-20 text-white opacity-5 rotate-12" />
                <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-widest text-blue-400">Pro Tip</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Complete all daily tasks to unlock a <span className="text-white font-bold">1.5x Multiplier</span> on your ad rewards!</p>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Admin Data
    fetch('/api/admin/db/backups')
      .then(res => res.json())
      .then(data => {
        setStats({ totalBackups: data.files?.length || 0 });
        setLoading(false);
      });
  }, []);

  const SidebarItem = ({ icon: Icon, label, id }: { icon: any, label: string, id: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all',
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100'
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">AUTOS ADMIN</span>
        </div>

        <nav className="space-y-1 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" id="overview" />
          <SidebarItem icon={Users} label="Users Management" id="users" />
          <SidebarItem icon={CreditCard} label="Transactions" id="tx" />
          <SidebarItem icon={BarChart3} label="Analytics" id="metrics" />
          <SidebarItem icon={Settings} label="System Config" id="config" />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-slate-500 text-sm">Welcome back, manager.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200" />
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: '1,284', change: '+12%', icon: Users, color: 'text-blue-600' },
                { label: 'Revenue', value: '$4,290', change: '+5%', icon: CreditCard, color: 'text-green-600' },
                { label: 'Tasks Done', value: '18.4k', change: '+24%', icon: BarChart3, color: 'text-purple-600' },
                { label: 'Backups', value: stats?.totalBackups || '0', change: 'Stable', icon: Shield, color: 'text-slate-600' },
              ].map((stat, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn('p-2 rounded-lg bg-slate-50', stat.color)}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">{stat.label}</div>
                </Card>
              ))}
            </div>

            {/* Recent Users Table */}
            <Card>
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Recent Registrations</h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Balance</th>
                      <th className="px-6 py-3">Joined</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[1, 2, 3, 4, 5].map(i => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">U</div>
                            <div>
                              <div className="font-medium text-slate-900">User_{i}</div>
                              <div className="text-xs text-slate-500 italic">@username_{i}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-medium">{Math.floor(Math.random() * 1000)} CR</td>
                        <td className="px-6 py-4 text-slate-500 font-medium">May {i}, 2024</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <LayoutDashboard className="h-12 w-12 text-slate-200 mb-4" />
            <h2 className="text-lg font-semibold text-slate-900">Module Coming Soon</h2>
            <p className="text-slate-500 text-sm mt-1">The {activeTab} panel is being optimized for your bot.</p>
          </div>
        )}
      </main>
    </div>
  );
};

// --- App Entry ---

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserPanel />} />
        <Route path="/admin" element={<AdminPanel />} />
        {/* Callback for Telegram back button or deep links */}
        <Route path="/user" element={<UserPanel />} />
      </Routes>
    </Router>
  );
}
