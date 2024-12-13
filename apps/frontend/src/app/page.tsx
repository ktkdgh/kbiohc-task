'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { usePostsContext } from './context/postsContext';
import { clearTokens, getAccessToken } from '@/utils/auth';

interface Post {
	id: string;
	title: string;
	contents: string;
	createdAt: string;
	commentCount: number;
	username: string;
	isMine: boolean;
}

interface PostData {
	post: Post;
}

interface ResponseData {
	items: PostData[];
	totalPages: number;
}

export default function PostsPage() {
	const [posts, setPosts] = useState<PostData[]>([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const router = useRouter();
	const {
		selectedPost,
		setSelectedPost,
		isAuthenticated,
		setIsAuthenticated,
	} = usePostsContext();
	console.log(selectedPost);

	useEffect(() => {
		const token = getAccessToken();
		if (token) {
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
	}, [setIsAuthenticated]);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await apiClient.get<ResponseData>(
					`/posts/list?pageParam=${currentPage}`,
				);
				setPosts(response.data.items);
				setTotalPages(response.data.totalPages);
			} catch (error) {
				console.error('Error fetching posts:', error);
			}
		};
		fetchPosts();
	}, [currentPage]);

	const handlePostClick = (postData: PostData) => {
		setSelectedPost(postData.post);
		router.push(`/${postData.post.id}`);
	};

	const formatDate = (createdAt: string) => {
		const postDate = createdAt.split('T')[0];

		const today = new Date();
		const todayString = today.toISOString().split('T')[0];

		if (postDate === todayString) {
			return createdAt.split('T')[1].slice(0, 5);
		} else {
			return postDate;
		}
	};

	const handleLogout = () => {
		clearTokens();
		setIsAuthenticated(false);
		router.push('/');
	};

	const handleLogin = () => {
		router.push('/login');
	};

	const handleCreatePost = () => {
		router.push('/create');
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-4xl mx-auto py-8 relative">
				{isAuthenticated ? (
					<div className="flex justify-end gap-4">
						<>
							<button
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								onClick={handleLogout}
							>
								로그아웃
							</button>
							<button
								className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
								onClick={handleCreatePost}
							>
								글쓰기
							</button>
						</>
					</div>
				) : (
					<div className="flex justify-end gap-4">
						<>
							<button
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								onClick={handleLogin}
							>
								로그인
							</button>
						</>
					</div>
				)}
				<h1 className="text-2xl font-bold mb-6 text-center text-black">
					게시물
				</h1>
				<div className="bg-white shadow rounded-lg overflow-hidden">
					<div className="grid grid-cols-4 bg-gray-200 p-4 font-bold text-black">
						<span className="text-center">제목</span>
						<span className="text-center">작성자</span>
						<span className="text-center">날짜</span>
						<span className="text-center">댓글수</span>
					</div>
					{posts.map((postData) => (
						<div
							key={postData.post.id}
							className="grid grid-cols-4 p-4 border-b hover:bg-gray-50 cursor-pointer"
							onClick={() => handlePostClick(postData)}
						>
							<span className="truncate text-black text-center">
								{postData.post.title}
							</span>
							<span className="text-black text-center">
								{postData.post.username}
							</span>
							<span className="text-black text-center">
								{formatDate(postData.post.createdAt)}
							</span>
							<span className="text-black text-center">
								{postData.post.commentCount}
							</span>
						</div>
					))}
				</div>
				<div className="mt-8 flex justify-center gap-2">
					{currentPage > 0 && (
						<button
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
							onClick={() => setCurrentPage(currentPage - 1)}
						>
							이전
						</button>
					)}
					{[...Array(totalPages)].map((_, idx) => (
						<button
							key={idx}
							className={`px-4 py-2 rounded ${
								currentPage === idx
									? 'bg-blue-600 text-white'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
							onClick={() => setCurrentPage(idx)}
						>
							{idx + 1}
						</button>
					))}
					{currentPage < totalPages - 1 && (
						<button
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
							onClick={() => setCurrentPage(currentPage + 1)}
						>
							다음
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
