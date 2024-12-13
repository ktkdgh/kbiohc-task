import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { getAccessToken } from '../utils/auth';

export const useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	useEffect(() => {
		const token = getAccessToken();

		if (token) {
			apiClient.interceptors.request.use((config) => {
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			});
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
	}, []);

	return { isAuthenticated };
};
