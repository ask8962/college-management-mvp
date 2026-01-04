const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface FetchOptions extends RequestInit {
    token?: string;
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: Record<string, string> = {};

    // Copy existing headers
    if (fetchOptions.headers) {
        const existingHeaders = fetchOptions.headers as Record<string, string>;
        Object.assign(headers, existingHeaders);
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(fetchOptions.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || 'Request failed');
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}


// Auth APIs
export interface AuthResponse {
    token?: string;
    id?: string;
    studentId?: string;
    name?: string;
    email: string;
    role?: 'ADMIN' | 'STUDENT';
    twoFactorRequired?: boolean;
    emailVerificationRequired?: boolean;
}

export interface MessageResponse {
    message: string;
    success: boolean;
}

export const authApi = {
    register: (data: { name: string; studentId: string; email: string; password: string }) =>
        fetchApi<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    login: (data: { email: string; password: string; twoFactorCode?: string }) =>
        fetchApi<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    forgotPassword: (email: string) =>
        fetchApi<MessageResponse>('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

    resetPassword: (token: string, newPassword: string) =>
        fetchApi<MessageResponse>('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
        }),

    verifyEmail: (token: string) =>
        fetchApi<MessageResponse>(`/auth/verify-email?token=${token}`, {
            method: 'GET',
        }),

    resendVerification: (email: string) =>
        fetchApi<MessageResponse>(`/auth/resend-verification?email=${encodeURIComponent(email)}`, {
            method: 'POST',
        }),
};

// 2FA APIs
export interface TwoFactorSetup {
    secret: string;
    qrCodeDataUri: string;
}

export const twoFactorApi = {
    getStatus: (token: string) =>
        fetchApi<{ enabled: boolean }>('/auth/2fa/status', { token }),

    setup: (token: string) =>
        fetchApi<TwoFactorSetup>('/auth/2fa/setup', {
            method: 'POST',
            token,
        }),

    verify: (token: string, code: string) =>
        fetchApi<{ success: boolean; message: string }>('/auth/2fa/verify', {
            method: 'POST',
            body: JSON.stringify({ code }),
            token,
        }),

    disable: (token: string, code: string) =>
        fetchApi<{ success: boolean; message: string }>('/auth/2fa/disable', {
            method: 'POST',
            body: JSON.stringify({ code }),
            token,
        }),
};


// Attendance APIs
export interface AttendanceRecord {
    id: string;
    studentId: string;
    subject: string;
    date: string;
    status: 'PRESENT' | 'ABSENT';
}

export const attendanceApi = {
    getMyAttendance: (token: string) =>
        fetchApi<AttendanceRecord[]>('/attendance', { token }),

    getAll: (token: string) =>
        fetchApi<AttendanceRecord[]>('/attendance/all', { token }),

    create: (token: string, data: Omit<AttendanceRecord, 'id'>) =>
        fetchApi<AttendanceRecord>('/attendance', {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        }),

    update: (token: string, id: string, data: Omit<AttendanceRecord, 'id'>) =>
        fetchApi<AttendanceRecord>(`/attendance/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            token,
        }),

    delete: (token: string, id: string) =>
        fetchApi<void>(`/attendance/${id}`, {
            method: 'DELETE',
            token,
        }),
};

// Notice APIs
export interface Notice {
    id: string;
    title: string;
    fileUrl: string;
    summary: string;
    createdAt: string;
}

export const noticeApi = {
    getAll: (token: string) =>
        fetchApi<Notice[]>('/notices', { token }),

    create: (token: string, title: string, file: File) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);

        return fetchApi<Notice>('/notices', {
            method: 'POST',
            body: formData,
            token,
        });
    },

    update: (token: string, id: string, title: string, file?: File) => {
        const formData = new FormData();
        formData.append('title', title);
        if (file) {
            formData.append('file', file);
        }

        return fetchApi<Notice>(`/notices/${id}`, {
            method: 'PUT',
            body: formData,
            token,
        });
    },

    delete: (token: string, id: string) =>
        fetchApi<void>(`/notices/${id}`, {
            method: 'DELETE',
            token,
        }),
};

// Exam APIs
export interface Exam {
    id: string;
    subject: string;
    examDate: string;
    deadline: string;
    description: string;
}

export const examApi = {
    getAll: (token: string) =>
        fetchApi<Exam[]>('/exams', { token }),

    getUpcoming: (token: string) =>
        fetchApi<Exam[]>('/exams/upcoming', { token }),

    create: (token: string, data: Omit<Exam, 'id'>) =>
        fetchApi<Exam>('/exams', {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        }),

    update: (token: string, id: string, data: Omit<Exam, 'id'>) =>
        fetchApi<Exam>(`/exams/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            token,
        }),

    delete: (token: string, id: string) =>
        fetchApi<void>(`/exams/${id}`, {
            method: 'DELETE',
            token,
        }),
};

// Placement APIs
export interface Placement {
    id: string;
    companyName: string;
    role: string;
    eligibility: string;
    deadline: string;
}

export const placementApi = {
    getAll: (token: string) =>
        fetchApi<Placement[]>('/placements', { token }),

    getActive: (token: string) =>
        fetchApi<Placement[]>('/placements/active', { token }),

    create: (token: string, data: Omit<Placement, 'id'>) =>
        fetchApi<Placement>('/placements', {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        }),

    update: (token: string, id: string, data: Omit<Placement, 'id'>) =>
        fetchApi<Placement>(`/placements/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            token,
        }),

    delete: (token: string, id: string) =>
        fetchApi<void>(`/placements/${id}`, {
            method: 'DELETE',
            token,
        }),
};

// User APIs (Admin only)
export interface UserInfo {
    id: string;
    studentId: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'STUDENT';
}

export const usersApi = {
    getAllStudents: (token: string) =>
        fetchApi<UserInfo[]>('/users/students', { token }),

    updateStudentId: (token: string, userId: string, studentId: string) =>
        fetchApi<UserInfo>(`/users/${userId}/student-id`, {
            method: 'PUT',
            body: JSON.stringify({ studentId }),
            token,
        }),
};

// Gig APIs (Assignment Hustle)
export interface Gig {
    id: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    contactInfo: string;
    postedBy: string;
    postedByName: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
    deadline: string | null;
    isOwner: boolean;
}

export const gigApi = {
    getAll: (token: string) =>
        fetchApi<Gig[]>('/gigs', { token }),

    getByCategory: (token: string, category: string) =>
        fetchApi<Gig[]>(`/gigs/category/${category}`, { token }),

    getMyGigs: (token: string) =>
        fetchApi<Gig[]>('/gigs/my', { token }),

    create: (token: string, data: { title: string; description: string; category: string; budget: number; contactInfo: string; deadline?: string }) =>
        fetchApi<Gig>('/gigs', {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        }),

    updateStatus: (token: string, id: string, status: string) =>
        fetchApi<Gig>(`/gigs/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
            token,
        }),

    delete: (token: string, id: string) =>
        fetchApi<void>(`/gigs/${id}`, {
            method: 'DELETE',
            token,
        }),
};

// Professor Review APIs (Rate My Khadoos)
export interface ProfessorReview {
    id: string;
    professorName: string;
    department: string;
    subject: string;
    chillFactor: number;
    attendanceStrictness: number;
    marksGenerosity: number;
    teachingQuality: number;
    overallRating: number;
    review: string;
    createdAt: string;
}

export interface ProfessorStats {
    professorName: string;
    department: string;
    reviewCount: number;
    avgChillFactor: number;
    avgAttendanceStrictness: number;
    avgMarksGenerosity: number;
    avgTeachingQuality: number;
    overallRating: number;
}

export const professorReviewApi = {
    getAll: (token: string) =>
        fetchApi<ProfessorReview[]>('/reviews', { token }),

    search: (token: string, name: string) =>
        fetchApi<ProfessorReview[]>(`/reviews/search?name=${encodeURIComponent(name)}`, { token }),

    getStats: (token: string) =>
        fetchApi<ProfessorStats[]>('/reviews/stats', { token }),

    create: (token: string, data: {
        professorName: string;
        department: string;
        subject?: string;
        chillFactor: number;
        attendanceStrictness: number;
        marksGenerosity: number;
        teachingQuality: number;
        review?: string;
    }) =>
        fetchApi<ProfessorReview>('/reviews', {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        }),
};

// Attendance Alert APIs (Flash Mob)
export interface AttendanceAlert {
    id: string;
    subject: string;
    location: string;
    message: string;
    postedByName: string;
    createdAt: string;
    minutesAgo: number;
    minutesLeft: number;
    isUrgent: boolean;
}

export const alertApi = {
    getActive: (token: string) =>
        fetchApi<AttendanceAlert[]>('/alerts', { token }),

    create: (token: string, data: { subject: string; location: string; message?: string }) =>
        fetchApi<AttendanceAlert>('/alerts', {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        }),

    deactivate: (token: string, id: string) =>
        fetchApi<void>(`/alerts/${id}`, {
            method: 'DELETE',
            token,
        }),
};

// Activity APIs (Streak & Heatmap)
export interface Activity {
    currentStreak: number;
    longestStreak: number;
    totalActiveDays: number;
    totalXP: number;
    level: string;
    xpToNextLevel: number;
    badges: string[];
    heatmapData: Record<string, number>;
    checkedInToday: boolean;
}

export const activityApi = {
    get: (token: string) =>
        fetchApi<Activity>('/activity', { token }),

    checkIn: (token: string) =>
        fetchApi<Activity>('/activity/checkin', {
            method: 'POST',
            token,
        }),
};

// Chat APIs (Broadcast Chat)
export interface ChatRoom {
    id: string;
    name: string;
    description: string;
    createdBy: string;
    broadcastMode: boolean;
    memberCount: number;
    createdAt: string;
    canSendMessage: boolean;
}

export interface ChatMessage {
    id: string;
    roomId: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
    type: string;
    fileUrl?: string;
    fileName?: string;
    createdAt: string;
    isOwn: boolean;
}

export const chatApi = {
    getRooms: (token: string) =>
        fetchApi<ChatRoom[]>('/chat/rooms', { token }),

    getRoom: (token: string, roomId: string) =>
        fetchApi<ChatRoom>(`/chat/rooms/${roomId}`, { token }),

    createRoom: (token: string, data: { name: string; description?: string; broadcastMode: boolean }) =>
        fetchApi<ChatRoom>('/chat/rooms', {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        }),

    toggleBroadcast: (token: string, roomId: string) =>
        fetchApi<ChatRoom>(`/chat/rooms/${roomId}/broadcast`, {
            method: 'PATCH',
            token,
        }),

    getMessages: (token: string, roomId: string) =>
        fetchApi<ChatMessage[]>(`/chat/rooms/${roomId}/messages`, { token }),

    sendMessage: (token: string, roomId: string, data: { content: string; type?: string; fileUrl?: string; fileName?: string }) =>
        fetchApi<ChatMessage>(`/chat/rooms/${roomId}/messages`, {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        }),
};

// Task APIs (Personal Todo List)
export interface Task {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    completed: boolean;
    dueDate: string;
    createdAt: string;
    completedAt?: string;
    overdue: boolean;
}

export interface TaskStats {
    completed: number;
    pending: number;
    overdue: number;
    total: number;
}

export const taskApi = {
    getAll: (token: string, completed?: boolean) => {
        const query = completed !== undefined ? `?completed=${completed}` : '';
        return fetchApi<Task[]>(`/tasks${query}`, { token });
    },

    getStats: (token: string) =>
        fetchApi<TaskStats>('/tasks/stats', { token }),

    create: (token: string, data: { title: string; description?: string; category?: string; priority?: string; dueDate?: string }) =>
        fetchApi<Task>('/tasks', {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        }),

    update: (token: string, taskId: string, data: { title: string; description?: string; category?: string; priority?: string; dueDate?: string }) =>
        fetchApi<Task>(`/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            token,
        }),

    toggle: (token: string, taskId: string) =>
        fetchApi<Task>(`/tasks/${taskId}/toggle`, {
            method: 'PATCH',
            token,
        }),

    delete: (token: string, taskId: string) =>
        fetchApi<void>(`/tasks/${taskId}`, {
            method: 'DELETE',
            token,
        }),
};

