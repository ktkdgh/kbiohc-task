import React, { createContext, useContext, useEffect, useState } from 'react';
import { clearTokens, getAccessToken } from '../utils/auth';

interface AuthContextValue {
	isAuthenticated: boolean;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const token = getAccessToken();
		if (token) {
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
	}, []);

	const logout = () => {
		clearTokens();
		setIsAuthenticated(false);
		window.location.href = '/login';
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuthContext must be used within an AuthProvider');
	}
	return context;
};
