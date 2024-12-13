import axios from 'axios';
import {
	clearTokens,
	getAccessToken,
	setAccessToken,
	setRefreshToken,
} from '../utils/auth';
import { API_BASE_URL } from '../utils/constants';

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
	const token = getAccessToken();

	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const { data } = await axios.post(
					`${API_BASE_URL}/auth/refresh`,
					{},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
						},
					},
				);

				setAccessToken(data.accessToken);
				setRefreshToken(data.refreshToken);

				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
				}

				return apiClient(originalRequest);
			} catch (refreshError: unknown) {
				console.error('Token refresh failed:', refreshError);
				clearTokens();
				window.location.href = '/login';
			}
		}

		return Promise.reject(error);
	},
);

export default apiClient;
