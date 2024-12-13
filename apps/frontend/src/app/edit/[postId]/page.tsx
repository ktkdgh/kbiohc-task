'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePostsContext } from '../../context/postsContext';
import apiClient from '@/api/client';

export default function EditPostPage() {
	const router = useRouter();
	const { selectedPost, setSelectedPost } = usePostsContext();
	const [title, setTitle] = useState('');
	const [contents, setContents] = useState('');

	useEffect(() => {
		if (!selectedPost) {
			router.push('/');
		} else {
			setTitle(selectedPost.title);
			setContents(selectedPost.contents);
		}
	}, [selectedPost, router]);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleContentsChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		setContents(e.target.value);
	};

	const handleSubmit = async () => {
		if (!selectedPost) {
			return;
		}

		try {
			const response = await apiClient.put(`/posts/${selectedPost.id}`, {
				title,
				contents,
			});

			if (response.status === 200) {
				alert('수정되었습니다.');
				setSelectedPost(null);
				router.push('/');
			} else {
				alert('수정 실패');
			}
		} catch (error) {
			console.error('Error updating post:', error);
			alert('수정 중 오류가 발생했습니다.');
		}
	};

	if (!selectedPost) {
		return <p>로딩 중...</p>;
	}

	return (
		<div className="max-w-4xl mx-auto py-8">
			<div className="bg-white shadow rounded-lg p-6 mb-8">
				<h1 className="text-2xl text-black font-semibold mb-4">
					게시물 수정
				</h1>
				<div>
					<input
						type="text"
						className="w-full p-4 text-black border border-gray-300 rounded-lg mb-4"
						value={title}
						onChange={handleTitleChange}
						placeholder="제목"
					/>
					<textarea
						className="w-full p-4 text-black border border-gray-300 rounded-lg"
						rows={6}
						value={contents}
						onChange={handleContentsChange}
						placeholder="내용"
					/>
				</div>
				<div className="flex justify-end gap-4 mt-6">
					<button
						className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						onClick={handleSubmit}
					>
						수정하기
					</button>
				</div>
			</div>
		</div>
	);
}
