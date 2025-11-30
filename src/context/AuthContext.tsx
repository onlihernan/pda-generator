import React, { createContext, useState, useContext, useEffect } from 'react';
import { authenticateUser, type User } from '../config/users';

interface AuthContextType {
    isAuthenticated: boolean;
    currentUser: User | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setCurrentUser(user);
                setIsAuthenticated(true);
            } catch (e) {
                localStorage.removeItem('currentUser');
            }
        }
    }, []);

    const login = (username: string, password: string) => {
        const user = authenticateUser(username, password);
        if (user) {
            setIsAuthenticated(true);
            setCurrentUser(user);
            // Store user info (excluding password) in localStorage
            const { password: _, ...userWithoutPassword } = user;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
