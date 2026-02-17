import { useEffect, useState } from 'react';
import useTaskStore from '../store/taskStore';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import { Plus, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const Tasks = () => {
    const { tasks, fetchTasks, isLoading } = useTaskStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('all'); // all, daily, weekly, monthly

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.type === filter;
    });

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mission Control</h1>
                    <p className="text-slate-400 text-sm">Manage your tasks and quests</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-purple-500/20"
                >
                    <Plus className="w-4 h-4" /> New Mission
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Filter className="w-4 h-4 text-slate-500 mr-2" />
                {['all', 'daily', 'weekly', 'monthly'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={clsx(
                            "px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize whitespace-nowrap",
                            filter === f
                                ? "bg-white text-slate-900 shadow-md"
                                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode='popLayout'>
                    {isLoading ? (
                        <div className="text-center text-slate-500 py-12">Loading missions...</div>
                    ) : filteredTasks.length > 0 ? (
                        filteredTasks.map(task => (
                            <TaskCard key={task._id} task={task} />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-slate-800/30 border border-dashed border-slate-700 rounded-2xl p-12 text-center"
                        >
                            <p className="text-slate-400 mb-2">No missions found for this filter.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                            >
                                Create one now
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Tasks;
