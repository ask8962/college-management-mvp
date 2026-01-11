'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse, authApi } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface AuthContextType {
    user: AuthResponse | null;
    login: (userData: AuthResponse) => void;
    logout: () => Promise<void>;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount by calling /auth/me
    const checkAuthStatus = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                credentials: 'include',
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const refreshUser = async () => {
        await checkAuthStatus();
    };

    // Called after successful login - backend has already set the cookie
    const login = (userData: AuthResponse) => {
        // Backend sets httpOnly cookie, we just update local state
        setUser(userData);
    };

    const logout = async () => {
        try {
            // Call backend to clear the httpOnly cookie
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser }}>
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

