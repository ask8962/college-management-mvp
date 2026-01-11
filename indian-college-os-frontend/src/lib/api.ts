const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper to get token from localStorage (client-side only)
function getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

interface FetchOptions extends RequestInit {
    token?: string;
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token: explicitToken, ...fetchOptions } = options;

    // Use explicit token if provided, otherwise get from localStorage
    const token = explicitToken ?? getStoredToken();

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
    getStatus: () =>
        fetchApi<{ enabled: boolean }>('/auth/2fa/status', {}),

    setup: () =>
        fetchApi<TwoFactorSetup>('/auth/2fa/setup', {
            method: 'POST',
        }),

    verify: (code: string) =>
        fetchApi<{ success: boolean; message: string }>('/auth/2fa/verify', {
            method: 'POST',
            body: JSON.stringify({ code }),
        }),

    disable: (code: string) =>
        fetchApi<{ success: boolean; message: string }>('/auth/2fa/disable', {
            method: 'POST',
            body: JSON.stringify({ code }),
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
    getMyAttendance: () =>
        fetchApi<AttendanceRecord[]>('/attendance', {}),

    getAll: () =>
        fetchApi<AttendanceRecord[]>('/attendance/all', {}),

    create: (data: Omit<AttendanceRecord, 'id'>) =>
        fetchApi<AttendanceRecord>('/attendance', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Omit<AttendanceRecord, 'id'>) =>
        fetchApi<AttendanceRecord>(`/attendance/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/attendance/${id}`, {
            method: 'DELETE',
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
    getAll: () =>
        fetchApi<Notice[]>('/notices', {}),

    create: (title: string, file: File) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);

        return fetchApi<Notice>('/notices', {
            method: 'POST',
            body: formData,
        });
    },

    update: (id: string, title: string, file?: File) => {
        const formData = new FormData();
        formData.append('title', title);
        if (file) {
            formData.append('file', file);
        }

        return fetchApi<Notice>(`/notices/${id}`, {
            method: 'PUT',
            body: formData,
        });
    },

    delete: (id: string) =>
        fetchApi<void>(`/notices/${id}`, {
            method: 'DELETE',
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
    getAll: () =>
        fetchApi<Exam[]>('/exams', {}),

    getUpcoming: () =>
        fetchApi<Exam[]>('/exams/upcoming', {}),

    create: (data: Omit<Exam, 'id'>) =>
        fetchApi<Exam>('/exams', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Omit<Exam, 'id'>) =>
        fetchApi<Exam>(`/exams/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/exams/${id}`, {
            method: 'DELETE',
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
    getAll: () =>
        fetchApi<Placement[]>('/placements', {}),

    getActive: () =>
        fetchApi<Placement[]>('/placements/active', {}),

    create: (data: Omit<Placement, 'id'>) =>
        fetchApi<Placement>('/placements', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Omit<Placement, 'id'>) =>
        fetchApi<Placement>(`/placements/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/placements/${id}`, {
            method: 'DELETE',
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
    getAllStudents: () =>
        fetchApi<UserInfo[]>('/users/students', {}),

    updateStudentId: (userId: string, studentId: string) =>
        fetchApi<UserInfo>(`/users/${userId}/student-id`, {
            method: 'PUT',
            body: JSON.stringify({ studentId }),
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
    getAll: () =>
        fetchApi<Gig[]>('/gigs', {}),

    getByCategory: (category: string) =>
        fetchApi<Gig[]>(`/gigs/category/${category}`, {}),

    getMyGigs: () =>
        fetchApi<Gig[]>('/gigs/my', {}),

    create: (data: { title: string; description: string; category: string; budget: number; contactInfo: string; deadline?: string }) =>
        fetchApi<Gig>('/gigs', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    updateStatus: (id: string, status: string) =>
        fetchApi<Gig>(`/gigs/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/gigs/${id}`, {
            method: 'DELETE',
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
    getAll: () =>
        fetchApi<ProfessorReview[]>('/reviews', {}),

    search: (name: string) =>
        fetchApi<ProfessorReview[]>(`/reviews/search?name=${encodeURIComponent(name)}`, {}),

    getStats: () =>
        fetchApi<ProfessorStats[]>('/reviews/stats', {}),

    create: (data: {
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
    getActive: () =>
        fetchApi<AttendanceAlert[]>('/alerts', {}),

    create: (data: { subject: string; location: string; message?: string }) =>
        fetchApi<AttendanceAlert>('/alerts', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    deactivate: (id: string) =>
        fetchApi<void>(`/alerts/${id}`, {
            method: 'DELETE',
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
    get: () =>
        fetchApi<Activity>('/activity', {}),

    checkIn: () =>
        fetchApi<Activity>('/activity/checkin', {
            method: 'POST',
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
    getRooms: () =>
        fetchApi<ChatRoom[]>('/chat/rooms', {}),

    getRoom: (roomId: string) =>
        fetchApi<ChatRoom>(`/chat/rooms/${roomId}`, {}),

    createRoom: (data: { name: string; description?: string; broadcastMode: boolean }) =>
        fetchApi<ChatRoom>('/chat/rooms', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    toggleBroadcast: (roomId: string) =>
        fetchApi<ChatRoom>(`/chat/rooms/${roomId}/broadcast`, {
            method: 'PATCH',
        }),

    getMessages: (roomId: string) =>
        fetchApi<ChatMessage[]>(`/chat/rooms/${roomId}/messages`, {}),

    sendMessage: (roomId: string, data: { content: string; type?: string; fileUrl?: string; fileName?: string }) =>
        fetchApi<ChatMessage>(`/chat/rooms/${roomId}/messages`, {
            method: 'POST',
            body: JSON.stringify(data),
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
    getAll: (completed?: boolean) => {
        const query = completed !== undefined ? `?completed=${completed}` : '';
        return fetchApi<Task[]>(`/tasks${query}`, {});
    },

    getStats: () =>
        fetchApi<TaskStats>('/tasks/stats', {}),

    create: (data: { title: string; description?: string; category?: string; priority?: string; dueDate?: string }) =>
        fetchApi<Task>('/tasks', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (taskId: string, data: { title: string; description?: string; category?: string; priority?: string; dueDate?: string }) =>
        fetchApi<Task>(`/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    toggle: (taskId: string) =>
        fetchApi<Task>(`/tasks/${taskId}/toggle`, {
            method: 'PATCH',
        }),

    delete: (taskId: string) =>
        fetchApi<void>(`/tasks/${taskId}`, {
            method: 'DELETE',
        }),
};

// Subject APIs (Bunk-o-Meter)
export interface Subject {
    id: string;
    name: string;
    totalClasses: number;
    attendedClasses: number;
    currentPercentage: number;
    targetAttendance: number;
    status: 'SAFE' | 'DANGER';
    message: string;
    safeBunks?: number;
    neededClasses?: number;
}

export const subjectApi = {
    getAll: () =>
        fetchApi<Subject[]>('/subjects', {}),

    create: (name: string, targetAttendance: number = 75) =>
        fetchApi<Subject>('/subjects', {
            method: 'POST',
            body: JSON.stringify({ name, targetAttendance }),
        }),

    markAttendance: (id: string, status: 'PRESENT' | 'ABSENT' | 'CANCELLED') =>
        fetchApi<Subject>(`/subjects/${id}/attendance`, {
            method: 'POST',
            body: JSON.stringify({ status }),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/subjects/${id}`, {
            method: 'DELETE',
        }),
};
