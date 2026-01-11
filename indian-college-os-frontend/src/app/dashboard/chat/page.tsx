'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { chatApi, ChatRoom, ChatMessage } from '@/lib/api';
import { Send, Plus, X, MessageSquare, Radio, Circle, Lock, Unlock, ArrowLeft, Users } from 'lucide-react';

export default function ChatPage() {
    const { user } = useAuth();
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showCreateRoom, setShowCreateRoom] = useState(false);
    const [roomForm, setRoomForm] = useState({ name: '', description: '', broadcastMode: true });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isAdmin = user?.role === 'ADMIN';

    const loadRooms = useCallback(async () => {
        // Token check removed - using cookies
        try {
            const data = await chatApi.getRooms();
            setRooms(data);
        } catch (error) {
            console.error('Failed to load rooms:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const loadMessages = useCallback(async () => {
        if (!selectedRoom) return;
        try {
            const data = await chatApi.getMessages(selectedRoom.id);
            setMessages(data);
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    }, [user, selectedRoom]);

    useEffect(() => {
        loadRooms();
    }, [loadRooms]);

    useEffect(() => {
        if (selectedRoom) {
            loadMessages();
            // Poll for new messages every 3 seconds
            const interval = setInterval(loadMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [loadMessages, selectedRoom]);

    const handleSend = async () => {
        if (!selectedRoom || !newMessage.trim()) return;
        try {
            await chatApi.sendMessage(selectedRoom.id, { content: newMessage, type: 'TEXT' });
            setNewMessage('');
            loadMessages();
        } catch (error: any) {
            alert(error.message || 'Failed to send message');
        }
    };

    const handleToggleBroadcast = async () => {
        if (!selectedRoom) return;
        try {
            const updated = await chatApi.toggleBroadcast(selectedRoom.id);
            setSelectedRoom(updated);
            loadRooms();
            loadMessages();
        } catch (error) {
            console.error('Failed to toggle broadcast:', error);
        }
    };

    const handleCreateRoom = async () => {
        if (!roomForm.name.trim()) return;
        try {
            await chatApi.createRoom(roomForm);
            setShowCreateRoom(false);
            setRoomForm({ name: '', description: '', broadcastMode: true });
            loadRooms();
        } catch (error) {
            console.error('Failed to create room:', error);
        }
    };

    const selectRoom = async (room: ChatRoom) => {
        // Token check removed - using cookies
        try {
            const fullRoom = await chatApi.getRoom(room.id);
            setSelectedRoom(fullRoom);
        } catch (error) {
            console.error('Failed to get room:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-6rem)] flex gap-6 animate-fade-in">
            {/* Room List */}
            <div className={`${selectedRoom ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 glass rounded-2xl overflow-hidden`}>
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary-400" />
                        Chat Rooms
                    </h2>
                    {isAdmin && (
                        <button
                            onClick={() => setShowCreateRoom(true)}
                            className="p-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {rooms.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No chat rooms yet</p>
                    ) : (
                        rooms.map(room => (
                            <button
                                key={room.id}
                                onClick={() => selectRoom(room)}
                                className={`w-full p-4 rounded-xl text-left transition-all ${selectedRoom?.id === room.id
                                    ? 'bg-primary-500/20 border border-primary-500/30'
                                    : 'hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold">{room.name}</span>
                                    {room.broadcastMode ? (
                                        <Lock className="h-4 w-4 text-orange-400" />
                                    ) : (
                                        <Unlock className="h-4 w-4 text-green-400" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-400 truncate">{room.description || 'No description'}</p>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {selectedRoom ? (
                <div className="flex-1 flex flex-col glass rounded-2xl overflow-hidden">
                    {/* Room Header */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedRoom(null)}
                                className="md:hidden p-2 rounded-lg hover:bg-white/10"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h3 className="font-bold">{selectedRoom.name}</h3>
                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                    {selectedRoom.broadcastMode ? (
                                        <>
                                            <Radio className="h-3 w-3 text-orange-400" />
                                            <span className="text-orange-400">Broadcast Mode</span>
                                        </>
                                    ) : (
                                        <>
                                            <Users className="h-3 w-3 text-green-400" />
                                            <span className="text-green-400">Open Chat</span>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>

                        {isAdmin && (
                            <button
                                onClick={handleToggleBroadcast}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${selectedRoom.broadcastMode
                                    ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                    }`}
                            >
                                {selectedRoom.broadcastMode ? (
                                    <>
                                        <Circle className="h-4 w-4" />
                                        <span className="hidden sm:inline">Disable Broadcast</span>
                                    </>
                                ) : (
                                    <>
                                        <Radio className="h-4 w-4" />
                                        <span className="hidden sm:inline">Enable Broadcast</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No messages yet. Start the conversation!</p>
                        ) : (
                            messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.type === 'SYSTEM'
                                            ? 'bg-gray-500/20 text-gray-400 text-center mx-auto text-sm'
                                            : msg.senderRole === 'AI'
                                                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-bl-sm'
                                                : msg.isOwn
                                                    ? 'bg-primary-500/30 rounded-br-sm'
                                                    : 'bg-white/10 rounded-bl-sm'
                                            }`}
                                    >
                                        {msg.type !== 'SYSTEM' && !msg.isOwn && (
                                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                                {msg.senderName}
                                                {msg.senderRole === 'ADMIN' && (
                                                    <span className="px-1.5 py-0.5 bg-purple-500/30 text-purple-300 rounded-full text-[10px]">
                                                        Admin
                                                    </span>
                                                )}
                                                {msg.senderRole === 'AI' && (
                                                    <span className="px-1.5 py-0.5 bg-cyan-500/30 text-cyan-300 rounded-full text-[10px]">
                                                        AI
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                        <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                                        <p className="text-[10px] text-gray-500 text-right mt-1">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-white/10">
                        {selectedRoom.canSendMessage ? (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                                        placeholder="Type a message... (use @AI to ask AI)"
                                        className="flex-1 input-field"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!newMessage.trim()}
                                        className="btn-primary px-4 disabled:opacity-50"
                                    >
                                        <Send className="h-5 w-5" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 text-center">
                                    💡 Tip: Type <span className="text-cyan-400 font-medium">@AI</span> followed by your question to get AI help!
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-3 bg-orange-500/20 rounded-xl text-orange-400">
                                <Lock className="h-5 w-5 inline mr-2" />
                                Only admins can send messages in broadcast mode
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 glass rounded-2xl items-center justify-center text-gray-500">
                    <div className="text-center">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p>Select a chat room to start messaging</p>
                    </div>
                </div>
            )}

            {/* Create Room Modal */}
            {showCreateRoom && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-2xl p-6 w-full max-w-md animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Create Chat Room</h2>
                            <button onClick={() => setShowCreateRoom(false)} className="p-2 rounded-lg hover:bg-white/10">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Room Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., Announcements, Class Updates"
                                    value={roomForm.name}
                                    onChange={e => setRoomForm({ ...roomForm, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="What's this room for?"
                                    value={roomForm.description}
                                    onChange={e => setRoomForm({ ...roomForm, description: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div>
                                    <p className="font-medium">Broadcast Mode</p>
                                    <p className="text-sm text-gray-400">Only admins can send messages</p>
                                </div>
                                <button
                                    onClick={() => setRoomForm({ ...roomForm, broadcastMode: !roomForm.broadcastMode })}
                                    className={`w-12 h-6 rounded-full transition-colors ${roomForm.broadcastMode ? 'bg-orange-500' : 'bg-gray-600'
                                        } relative`}
                                >
                                    <div
                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${roomForm.broadcastMode ? 'translate-x-7' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowCreateRoom(false)} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button onClick={handleCreateRoom} className="btn-primary flex-1">
                                    Create Room
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
