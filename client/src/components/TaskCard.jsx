import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import useTaskStore from '../store/taskStore';
import confetti from 'canvas-confetti';

const TaskCard = ({ task }) => {
    const { completeTask } = useTaskStore();

    const handleComplete = async () => {
        if (task.status === 'done') return;

        await completeTask(task._id);

        // Trigger confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const priorityColors = {
        low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        high: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    const isDone = task.status === 'done';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
                "p-4 rounded-xl border transition-all duration-300 group",
                isDone
                    ? "bg-slate-900/30 border-slate-800 opacity-60"
                    : "bg-slate-800/60 border-slate-700/50 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5"
            )}
        >
            <div className="flex items-start gap-4">
                <button
                    onClick={handleComplete}
                    disabled={isDone}
                    className={clsx(
                        "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                        isDone
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-slate-600 hover:border-purple-500 hover:scale-110"
                    )}
                >
                    {isDone && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className={clsx("font-semibold truncate", isDone ? "text-slate-500 line-through" : "text-white")}>
                            {task.title}
                        </h3>
                        <span className={clsx("text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold", priorityColors[task.priority])}>
                            {task.priority}
                        </span>
                    </div>

                    <p className={clsx("text-sm mb-3 line-clamp-2", isDone ? "text-slate-600" : "text-slate-400")}>
                        {task.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(task.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 capitalize">
                            <AlertCircle className="w-3 h-3" />
                            <span>{task.type}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;
