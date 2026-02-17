import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import useTaskStore from '../store/taskStore';
import XPBar from '../components/XPBar';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Target, Plus } from 'lucide-react';

const Home = () => {
    const { user } = useAuthStore();
    const { tasks, fetchTasks, isLoading } = useTaskStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Fetch daily tasks or all and filter? 
        // Let's fetch all for now and filter client side for "Today" or just 5 most recent
        fetchTasks();
    }, [fetchTasks]);

    if (!user) return null;

    const todaysTasks = tasks.filter(t => {
        // Simple logic for "Today's Missions" - maybe tasks due today or created today?
        // Let's say tasks that are 'working' and not archived.
        return t.status !== 'archived';
    }).slice(0, 3); // Just show top 3

    const completedCount = tasks.filter(t => t.status === 'done').length;

    const stats = [
        { label: 'Current Streak', value: user.gamification?.streak || 0, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'Total Points', value: user.gamification?.totalPoints || 0, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { label: 'Tasks Done', value: completedCount, icon: Target, color: 'text-green-500', bg: 'bg-green-500/10' },
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Hello, {user.name.split(' ')[0]} 👋
                    </h1>
                    <p className="text-slate-400 mt-1">Ready to level up your day?</p>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm min-w-[280px]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-purple-400">Level {user.gamification?.level || 1}</span>
                        <span className="text-xs text-slate-500">Next Level: 500 XP</span>
                    </div>
                    <XPBar totalPoints={user.gamification?.totalPoints || 0} />
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-sm hover:bg-slate-800/60 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Tasks Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Active Missions</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" /> New Mission
                    </button>
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {todaysTasks.length > 0 ? (
                            todaysTasks.map(task => (
                                <TaskCard key={task._id} task={task} />
                            ))
                        ) : (
                            <div className="text-center py-10 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
                                <p className="text-slate-500">No active missions. Start one now!</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Home;
