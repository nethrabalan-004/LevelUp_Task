import { motion } from 'framer-motion';

const XPBar = ({ xp, level, totalPoints }) => {
    // Basic level calculation matches backend
    // Level formula: level = Math.floor(totalPoints / 500) + 1;
    // XP for current level progress: totalPoints % 500 / 500

    // We can use the passed props. Assuming 'xp' passed here refers to 'totalPoints' 
    // effectively or we calculate progress based on partial xp for current level.

    const xpForCurrentLevel = totalPoints % 500;
    const progress = (xpForCurrentLevel / 500) * 100;

    return (
        <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden shadow-inner border border-slate-700/50 relative">
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
                <span className="text-[10px] font-bold text-white drop-shadow-md tracking-wider">
                    {xpForCurrentLevel} / 500 XP
                </span>
            </div>
            <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <div className="absolute top-0 right-0 h-full w-2 bg-white/30 blur-[2px]"></div>
            </motion.div>
        </div>
    );
};

export default XPBar;
