'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePostsContext } from '../context/postsContext';
import apiClient from '@/api/client';

interface Comment {
	id: string;
	title: string;
	contents: string;
	createdAt: string;
	commentCount: number;
	username: string;
	isMine: boolean;
}

interface CommentData {
	comment: Comment;
}

interface ResponseData {
	items: CommentData[];
	totalPages: number;
	totalCount: number;
}

export default function PostDetailPage() {
	const { selectedPost, setSelectedPost } = usePostsContext();
	const router = useRouter();
	const [comments, setComments] = useState<CommentData[]>([]);
	const [totalPages, setTotalPages] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [newComment, setNewComment] = useState('');
	const [editingCommentId, setEditingCommentId] = useState<string | null>(
		null,
	);
	const [editingCommentContent, setEditingCommentContent] =
		useState<string>('');

	useEffect(() => {
		const token = localStorage.getItem('accessToken');
		if (!token && selectedPost && selectedPost.isMine !== false) {
			setSelectedPost({
				...selectedPost,
				isMine: false,
			});
		}
	}, [selectedPost, setSelectedPost]);

	useEffect(() => {
		if (selectedPost?.id && selectedPost.commentCount > 0) {
			const fetchPosts = async () => {
				try {
					const response = await apiClient.get<ResponseData>(
						`/posts/comment/${selectedPost.id}/list?pageParam=${currentPage - 1}`,
					);

					setComments(response.data.items);
					setTotalPages(response.data.totalPages);
					setTotalCount(response.data.totalCount);
				} catch (error) {
					console.error('Error fetching posts:', error);
				}
			};
			fetchPosts();
		}
	}, [currentPage, selectedPost?.id]);

	const formatDate = (createdAt: string) => {
		const postDate = createdAt.split('T')[0];
		const today = new Date();
		const todayString = today.toISOString().split('T')[0];
		const result =
			postDate === todayString
				? createdAt.split('T')[1].slice(0, 5)
				: postDate;
		return result;
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewComment(e.target.value);
	};

	const handleCommentSubmit = async () => {
		if (!newComment.trim()) {
			alert('댓글 내용을 입력해주세요.');
			return;
		}

		if (!selectedPost?.id) {
			alert('게시물이 선택되지 않았습니다.');
			return;
		}

		try {
			const response = await apiClient.post('/posts/comment', {
				postId: selectedPost.id,
				contents: newComment,
			});

			if (response.status === 201) {
				alert('댓글이 등록되었습니다.');
				window.location.reload();
			} else {
				alert('댓글 등록에 실패했습니다');
			}
		} catch (error) {
			console.error('Error submitting comment:', error);
			alert('댓글 등록 중 오류가 발생했습니다.');
		}
	};

	const handleEditComment = (commentId: string, content: string) => {
		setEditingCommentId(commentId);
		setEditingCommentContent(content);
	};

	const handleUpdateComment = async () => {
		if (!editingCommentContent.trim()) {
			alert('수정된 내용을 입력해주세요.');
			return;
		}

		if (!editingCommentId) {
			alert('수정할 댓글을 찾을 수 없습니다.');
			return;
		}

		try {
			const response = await apiClient.put(
				`/posts/comment/${editingCommentId}`,
				{
					contents: editingCommentContent,
					postId: selectedPost?.id as string,
				},
			);
			if (response.status === 200) {
				alert('댓글이 수정되었습니다.');
				setEditingCommentId(null);
				setEditingCommentContent('');
				window.location.reload();
			} else {
				alert('댓글 수정에 실패했습니다');
			}
		} catch (error) {
			console.error('Error updating comment:', error);
			alert('댓글 수정 중 오류가 발생했습니다.');
		}
	};

	const handleDeleteComment = async (commentId: string) => {
		if (window.confirm('정말 삭제하시겠습니까?')) {
			try {
				const response = await apiClient.delete(
					`/posts/comment/${commentId}`,
				);
				if (response.status === 200) {
					alert('댓글이 삭제되었습니다.');
					window.location.reload();
				} else {
					alert('댓글 삭제에 실패했습니다.');
				}
			} catch (error) {
				console.error('Error deleting comment:', error);
				alert('댓글 삭제 중 오류가 발생했습니다.');
			}
		}
	};

	const handleDelete = async () => {
		if (selectedPost?.id) {
			if (window.confirm('정말 삭제하시겠습니까?')) {
				try {
					const response = await apiClient.delete(
						`/posts/${selectedPost.id}`,
					);

					if (response.status === 200) {
						alert('삭제되었습니다.');
						router.push('/');
					} else {
						alert('삭제에 실패했습니다.');
					}
				} catch (error) {
					console.error('Error deleting post:', error);
				}
			}
		}
	};

	const handleEdit = () => {
		if (selectedPost?.id) {
			router.push(`/edit/${selectedPost.id}`);
		}
	};

	if (!selectedPost) {
		return <p>게시물을 불러오는 중입니다...</p>;
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-4xl mx-auto py-8">
				<div className="bg-white shadow rounded-lg p-6 mb-8">
					<div className="flex justify-end gap-4">
						{selectedPost.isMine && (
							<>
								<button
									className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
									onClick={handleEdit}
								>
									수정
								</button>
								<button
									className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
									onClick={handleDelete}
								>
									삭제
								</button>
							</>
						)}
					</div>
				</div>
				<div className="bg-white shadow rounded-lg p-6 mb-8">
					<div className="flex justify-between mb-4">
						<p className="text-xl font-semibold text-black">
							{selectedPost.username} &nbsp;
						</p>
						<p className="text-xl font-semibold text-black">
							{selectedPost.title} &nbsp; &nbsp;
						</p>
						<p className="text-lg text-gray-500">
							{formatDate(selectedPost.createdAt)}
						</p>
					</div>
					<div className="bg-gray-100 p-4 rounded-lg">
						<p className="text-lg text-gray-700">
							{selectedPost.contents}
						</p>
					</div>
				</div>
				<div className="bg-white shadow rounded-lg p-6 mb-8">
					{comments.length === 0 ? (
						<p className="font-semibold text-center text-black">
							댓글이 아직 없습니다.
						</p>
					) : (
						<div>
							<p className="text-lg font-semibold text-black mb-4">
								댓글: {totalCount}
							</p>
							<ul className="space-y-4">
								{comments.map((comment) => (
									<li
										key={comment.comment.id}
										className="border-b py-2"
									>
										<div className="flex justify-between items-center mb-2">
											<div className="flex-1">
												<div className="font-semibold text-black">
													{comment.comment.username}
												</div>
												<div className="text-gray-700">
													{comment.comment.contents}
												</div>
											</div>
											<div className="text-sm text-gray-500 text-right">
												{formatDate(
													comment.comment.createdAt,
												)}
												{comment.comment.isMine && (
													<div className="flex gap-2 ml-2">
														<button
															className="text-yellow-500 hover:text-yellow-600"
															onClick={() =>
																handleEditComment(
																	comment
																		.comment
																		.id,
																	comment
																		.comment
																		.contents,
																)
															}
														>
															수정
														</button>
														<button
															className="text-red-500 hover:text-red-600"
															onClick={() =>
																handleDeleteComment(
																	comment
																		.comment
																		.id,
																)
															}
														>
															삭제
														</button>
													</div>
												)}
											</div>
										</div>
									</li>
								))}
							</ul>
							<div className="mt-8 flex justify-center gap-2">
								{currentPage > 1 && (
									<button
										className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
										onClick={() =>
											handlePageChange(currentPage - 1)
										}
									>
										이전
									</button>
								)}
								{[...Array(totalPages)].map((_, idx) => (
									<button
										key={idx}
										className={`px-4 py-2 rounded ${
											currentPage === idx + 1
												? 'bg-blue-600 text-white'
												: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
										}`}
										onClick={() =>
											handlePageChange(idx + 1)
										}
									>
										{idx + 1}
									</button>
								))}
								{currentPage < totalPages && (
									<button
										className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
										onClick={() =>
											handlePageChange(currentPage + 1)
										}
									>
										다음
									</button>
								)}
							</div>
						</div>
					)}
				</div>
				<div className="bg-white shadow rounded-lg p-6">
					{editingCommentId ? (
						<div>
							<textarea
								value={editingCommentContent}
								onChange={(e) =>
									setEditingCommentContent(e.target.value)
								}
								className="w-full p-3 border text-black border-gray-300 rounded"
								placeholder="댓글을 수정하세요"
							/>
							<div className="flex justify-end gap-2 mt-4">
								<button
									className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
									onClick={handleUpdateComment}
								>
									수정
								</button>
								<button
									className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
									onClick={() => setEditingCommentId(null)}
								>
									취소
								</button>
							</div>
						</div>
					) : (
						<div>
							<textarea
								value={newComment}
								onChange={handleCommentChange}
								className="w-full p-3 border text-black border-gray-300 rounded"
								placeholder="댓글을 입력하세요"
							/>
							<div className="flex justify-end gap-2 mt-4">
								<button
									className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
									onClick={handleCommentSubmit}
								>
									댓글 작성
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
