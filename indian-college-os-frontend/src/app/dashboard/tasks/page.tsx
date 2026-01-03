'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { taskApi, Task, TaskStats } from '@/lib/api';
import {
    Target, Plus, X, Check, Trash2, Clock, AlertCircle,
    ChevronDown, Calendar, Flag
} from 'lucide-react';

const CATEGORIES = ['STUDY', 'ASSIGNMENT', 'PERSONAL', 'EXAM', 'OTHER'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const PRIORITY_COLORS: Record<string, string> = {
    LOW: 'text-gray-400 bg-gray-500/20',
    MEDIUM: 'text-blue-400 bg-blue-500/20',
    HIGH: 'text-orange-400 bg-orange-500/20',
    URGENT: 'text-red-400 bg-red-500/20'
};

export default function TasksPage() {
    const { token } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState<TaskStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: 'PERSONAL',
        priority: 'MEDIUM',
        dueDate: ''
    });

    const loadTasks = useCallback(async () => {
        if (!token) return;
        try {
            const completed = filter === 'all' ? undefined : filter === 'completed';
            const [tasksData, statsData] = await Promise.all([
                taskApi.getAll(token, completed),
                taskApi.getStats(token)
            ]);
            setTasks(tasksData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setLoading(false);
        }
    }, [token, filter]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const handleCreate = async () => {
        if (!token || !form.title.trim()) return;
        try {
            await taskApi.create(token, {
                ...form,
                dueDate: form.dueDate || undefined
            });
            setShowModal(false);
            setForm({ title: '', description: '', category: 'PERSONAL', priority: 'MEDIUM', dueDate: '' });
            loadTasks();
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const handleToggle = async (taskId: string) => {
        if (!token) return;
        try {
            await taskApi.toggle(token, taskId);
            loadTasks();
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    const handleDelete = async (taskId: string) => {
        if (!token) return;
        try {
            await taskApi.delete(token, taskId);
            loadTasks();
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary-500/20 rounded-xl">
                        <Target className="h-8 w-8 text-primary-300" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">My Goals</h1>
                        <p className="text-gray-400">Personal todo list & tasks</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Add Task
                </button>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                        <p className="text-sm text-gray-400">Total</p>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                        <p className="text-sm text-gray-400">Pending</p>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                        <p className="text-sm text-gray-400">Completed</p>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
                        <p className="text-sm text-gray-400">Overdue</p>
                    </div>
                </div>
            )}

            {/* Filter */}
            <div className="flex gap-2">
                {(['all', 'pending', 'completed'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl capitalize transition-colors ${filter === f
                                ? 'bg-primary-500/20 text-primary-400'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <div className="space-y-3">
                {tasks.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <Target className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No tasks found. Create one to get started!</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div
                            key={task.id}
                            className={`glass rounded-xl p-4 flex items-center gap-4 transition-opacity ${task.completed ? 'opacity-60' : ''
                                }`}
                        >
                            <button
                                onClick={() => handleToggle(task.id)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-gray-500 hover:border-primary-400'
                                    }`}
                            >
                                {task.completed && <Check className="h-4 w-4 text-white" />}
                            </button>

                            <div className="flex-1">
                                <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                    {task.title}
                                </p>
                                {task.description && (
                                    <p className="text-sm text-gray-400">{task.description}</p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full">
                                        {task.category}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                                        {task.priority}
                                    </span>
                                    {task.dueDate && (
                                        <span className={`text-xs flex items-center gap-1 ${task.overdue ? 'text-red-400' : 'text-gray-400'}`}>
                                            <Clock className="h-3 w-3" />
                                            {formatDate(task.dueDate)}
                                            {task.overdue && <AlertCircle className="h-3 w-3" />}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(task.id)}
                                className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-2xl p-6 w-full max-w-md animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Add New Task</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Title *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="What needs to be done?"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea
                                    className="input-field min-h-[80px]"
                                    placeholder="Add details..."
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                                    <select
                                        className="input-field"
                                        value={form.category}
                                        onChange={e => setForm({ ...form, category: e.target.value })}
                                    >
                                        {CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Priority</label>
                                    <select
                                        className="input-field"
                                        value={form.priority}
                                        onChange={e => setForm({ ...form, priority: e.target.value })}
                                    >
                                        {PRIORITIES.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Due Date</label>
                                <input
                                    type="datetime-local"
                                    className="input-field"
                                    value={form.dueDate}
                                    onChange={e => setForm({ ...form, dueDate: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button onClick={handleCreate} className="btn-primary flex-1">
                                    Add Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
