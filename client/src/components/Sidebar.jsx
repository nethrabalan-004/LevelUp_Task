import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, BarChart2, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuthStore();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
        { icon: BarChart2, label: 'Progress', path: '/progress' },
    ];

    return (
        <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50 shadow-2xl"
        >
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Level Up
                </h1>
                <p className="text-xs text-slate-500 mt-1">Gamify your productivity</p>
            </div>

            <div className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-slate-800 text-white shadow-lg shadow-purple-500/10"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full"
                                />
                            )}
                            <Icon className={clsx("w-5 h-5", isActive ? "text-purple-400" : "text-slate-500 group-hover:text-purple-400")} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-800">
                <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">Lvl {user?.gamification?.level || 1} • {user?.gamification?.totalPoints || 0} XP</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
