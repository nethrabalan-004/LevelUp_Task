import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Calendar, Star } from 'lucide-react';
import XPBar from '../components/XPBar';

const Progress = () => {
    const { user } = useAuthStore();

    if (!user) return null;

    const stats = [
        { label: 'Current Level', value: user.gamification?.level || 1, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { label: 'Total XP', value: user.gamification?.totalPoints || 0, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { label: 'Streak Days', value: user.gamification?.streak || 0, icon: Calendar, color: 'text-orange-400', bg: 'bg-orange-400/10' },
        { label: 'Achievements', value: 'Coming Soon', icon: Award, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Your Progress</h1>
                <p className="text-slate-400 text-sm">Track your journey to productivity mastery</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-white">Level Progress</h2>
                    <span className="text-purple-400 font-bold">{user.gamification?.totalPoints % 500} / 500 XP</span>
                </div>
                <XPBar totalPoints={user.gamification?.totalPoints || 0} />
                <p className="text-center text-slate-500 text-sm mt-4">
                    Keep completing missions to reach Level {(user.gamification?.level || 1) + 1}!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">{stat.label}</p>
                            <p className="text-xl font-bold text-white">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Placeholder for a Chart */}
            <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="bg-slate-700/50 p-4 rounded-full mb-4">
                    <TrendingUp className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Activity Chart</h3>
                <p className="text-slate-500 max-w-sm">
                    Detailed activity charts and history analytics will be available in the next update. Keep grinding!
                </p>
            </div>
        </div>
    );
};

export default Progress;
