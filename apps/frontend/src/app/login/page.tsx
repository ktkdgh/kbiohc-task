'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAccessToken, setAccessToken, setRefreshToken } from '@/utils/auth';
import { API_BASE_URL } from '@/utils/constants';

export default function LoginPage() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	useEffect(() => {
		const token = getAccessToken();
		if (token) {
			alert('이미 로그인 상태입니다. 메인 페이지로 이동합니다.');
			router.push('/');
		}
	}, [router]);

	const storeTokens = (accessToken: string, refreshToken: string) => {
		setAccessToken(accessToken);
		setRefreshToken(refreshToken);
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			const response = await fetch(`${API_BASE_URL}/auth/signin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				setError(
					errorData.message ||
						'아이디와 비밀번호를 다시한번 입력해주세요.',
				);
				return;
			}

			const { accessToken, refreshToken } = await response.json();
			storeTokens(accessToken, refreshToken);
			router.push('/');
		} catch (error) {
			console.log(error);
			setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
		}
	};

	return (
		<div
			className="bg-gray-100"
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '100vh',
				textAlign: 'center',
			}}
		>
			<h1
				style={{
					color: 'black',
					fontSize: '2rem',
					marginBottom: '20px',
				}}
			>
				Login
			</h1>
			<form
				onSubmit={handleLogin}
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
					maxWidth: '300px',
					width: '100%',
				}}
			>
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					style={{
						padding: '10px',
						borderRadius: '4px',
						border: '1px solid #ccc',
						color: 'black',
					}}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					style={{
						padding: '10px',
						borderRadius: '4px',
						border: '1px solid #ccc',
						color: 'black',
					}}
				/>
				<button
					type="submit"
					style={{
						padding: '10px',
						backgroundColor: '#4CAF50',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
				>
					Login
				</button>
			</form>
			{error && (
				<p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
			)}
		</div>
	);
}
