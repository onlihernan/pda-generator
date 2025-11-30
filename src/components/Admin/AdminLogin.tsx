import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(username, password)) {
            setError('');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="card fade-in" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h2 className="text-xl font-bold mb-4">Admin Access</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label className="label">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        autoComplete="username"
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label className="label">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        autoComplete="current-password"
                    />
                </div>
                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9em' }}>{error}</div>}
                <button type="submit" style={{ width: '100%' }}>Login</button>
            </form>
        </div>
    );
};
