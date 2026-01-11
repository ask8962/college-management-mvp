'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { taskApi, Task, TaskStats } from '@/lib/api';
import { Target, Plus, X, Check, Trash2, Clock, AlertCircle } from 'lucide-react';

const CATEGORIES = ['STUDY', 'ASSIGNMENT', 'PERSONAL', 'EXAM', 'OTHER'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function TasksPage() {
    const { user } = useAuth();
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
        // Token check removed - using cookies
        try {
            const completed = filter === 'all' ? undefined : filter === 'completed';
            const [tasksData, statsData] = await Promise.all([
                taskApi.getAll(completed),
                taskApi.getStats()
            ]);
            setTasks(tasksData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setLoading(false);
        }
    }, [user, filter]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const handleCreate = async () => {
        if (!form.title.trim()) return;
        try {
            await taskApi.create({
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
        // Token check removed - using cookies
        try {
            await taskApi.toggle(taskId);
            loadTasks();
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    const handleDelete = async (taskId: string) => {
        // Token check removed - using cookies
        try {
            await taskApi.delete(taskId);
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

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'URGENT':
                return <span className="badge badge-error">{priority}</span>;
            case 'HIGH':
                return <span className="badge badge-warning">{priority}</span>;
            case 'MEDIUM':
                return <span className="badge badge-info">{priority}</span>;
            default:
                return <span className="badge badge-neutral">{priority}</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="spinner-lg"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="page-header">
                    <h1 className="page-title">Tasks & Goals</h1>
                    <p className="page-subtitle">Manage your personal to-do list.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <Plus className="w-4 h-4" />
                    Add Task
                </button>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="stat-card">
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Tasks</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value text-warning-600">{stats.pending}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value text-success-600">{stats.completed}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value text-error-500">{stats.overdue}</div>
                        <div className="stat-label">Overdue</div>
                    </div>
                </div>
            )}

            {/* Filter */}
            <div className="flex gap-2">
                {(['all', 'pending', 'completed'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <div className="card">
                {tasks.length === 0 ? (
                    <div className="empty-state">
                        <Target className="empty-state-icon" />
                        <p className="empty-state-title">No tasks found</p>
                        <p className="empty-state-text">Create a task to get started.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-200">
                        {tasks.map((task) => (
                            <div key={task.id} className={`py-4 first:pt-0 last:pb-0 flex items-start gap-4 ${task.completed ? 'opacity-60' : ''}`}>
                                <button
                                    onClick={() => handleToggle(task.id)}
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${task.completed
                                        ? 'bg-success-500 border-success-500'
                                        : 'border-neutral-300 hover:border-primary-500'
                                        }`}
                                >
                                    {task.completed && <Check className="w-3 h-3 text-white" />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                                        {task.title}
                                    </p>
                                    {task.description && (
                                        <p className="text-sm text-neutral-500 mt-1">{task.description}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="badge badge-neutral">{task.category}</span>
                                        {getPriorityBadge(task.priority)}
                                        {task.dueDate && (
                                            <span className={`text-xs flex items-center gap-1 ${task.overdue ? 'text-error-500' : 'text-neutral-500'}`}>
                                                <Clock className="w-3 h-3" />
                                                {formatDate(task.dueDate)}
                                                {task.overdue && <AlertCircle className="w-3 h-3" />}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="p-2 text-neutral-400 hover:text-error-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Add New Task</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-neutral-100 rounded">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="input-label">Title *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="What needs to be done?"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="input-label">Description</label>
                                <textarea
                                    className="input-field min-h-[80px]"
                                    placeholder="Add details..."
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">Category</label>
                                    <select
                                        className="input-field"
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    >
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="input-label">Priority</label>
                                    <select
                                        className="input-field"
                                        value={form.priority}
                                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                    >
                                        {PRIORITIES.map((p) => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="input-label">Due Date</label>
                                <input
                                    type="datetime-local"
                                    className="input-field"
                                    value={form.dueDate}
                                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button onClick={handleCreate} className="btn btn-primary flex-1">
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
