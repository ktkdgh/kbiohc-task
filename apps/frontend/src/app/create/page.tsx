'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import apiClient from '@/api/client';
import { getAccessToken } from '@/utils/auth';

export default function CreatePostPage() {
	const [title, setTitle] = useState('');
	const [contents, setContents] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const token = getAccessToken();
		if (!token) {
			alert('로그인 후 작성 가능합니다.');
			router.push('/login');
			return;
		}

		try {
			const response = await apiClient.post('/posts', {
				title,
				contents,
			});

			if (response.status === 201 || response.status === 200) {
				alert('게시물이 등록되었습니다.');
				router.push('/');
			} else {
				alert('게시물 등록에 실패했습니다.');
			}
		} catch (error) {
			console.error('Error submitting post:', error);
			alert('오류가 발생했습니다.');
		}
	};

	return (
		<div className="max-w-4xl mx-auto py-8 ">
			<h1 className="text-2xl font-bold mb-6 text-center text-black">
				글쓰기
			</h1>
			<form
				onSubmit={handleSubmit}
				className="bg-white shadow rounded-lg p-6"
			>
				<div className="mb-4">
					<label
						htmlFor="title"
						className="block text-sm font-medium text-gray-700"
					>
						제목
					</label>
					<input
						type="text"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full p-2 border text-black border-gray-300 rounded mt-2"
						required
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="contents"
						className="block text-sm font-medium text-gray-700"
					>
						내용
					</label>
					<textarea
						id="contents"
						value={contents}
						onChange={(e) => setContents(e.target.value)}
						className="w-full p-2 text-black border border-gray-300 rounded mt-2"
						rows={5}
						required
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				>
					게시물 등록
				</button>
			</form>
		</div>
	);
}
