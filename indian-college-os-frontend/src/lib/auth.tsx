'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse } from './api';

interface AuthContextType {
    user: AuthResponse | null;
    token: string | null;
    login: (userData: AuthResponse) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored auth data on mount (sessionStorage is cleared on browser close)
        const storedUser = sessionStorage.getItem('user');
        const storedToken = sessionStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    const login = (userData: AuthResponse) => {
        if (!userData.token) return;

        setUser(userData);
        setToken(userData.token);
        // Use sessionStorage (cleared on browser close, less XSS-persistent than localStorage)
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('token', userData.token);
        // Token cookie for middleware (role is NOT stored in cookie to prevent tampering)
        document.cookie = `token=${userData.token}; path=/; max-age=86400; SameSite=Strict`;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        // Remove cookie
        document.cookie = 'token=; path=/; max-age=0';
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
