const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setAccessToken = (token: string) => {
	localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const setRefreshToken = (token: string) => {
	localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const clearTokens = () => {
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	localStorage.removeItem(REFRESH_TOKEN_KEY);
};
