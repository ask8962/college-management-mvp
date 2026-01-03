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
    token: string;
    id: string;
    studentId: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'STUDENT';
}

export const authApi = {
    register: (data: { name: string; studentId: string; email: string; password: string }) =>
        fetchApi<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    login: (data: { email: string; password: string }) =>
        fetchApi<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
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

