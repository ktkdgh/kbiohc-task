'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Post {
	id: string;
	title: string;
	contents: string;
	createdAt: string;
	commentCount: number;
	username: string;
	isMine: boolean;
}

interface PostsContextType {
	selectedPost: Post | null;
	setSelectedPost: (post: Post | null) => void;
	isAuthenticated: boolean;
	setIsAuthenticated: (auth: boolean) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const usePostsContext = () => {
	const context = useContext(PostsContext);
	if (!context) {
		throw new Error('usePostsContext must be used within a PostsProvider');
	}
	return context;
};

export const PostsProvider = ({ children }: { children: React.ReactNode }) => {
	const [selectedPost, setSelectedPostState] = useState<Post | null>(null);
	const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(false);

	useEffect(() => {
		const storedPost = localStorage.getItem('selectedPost');
		if (storedPost) {
			setSelectedPostState(JSON.parse(storedPost));
		}

		const storedAuth = localStorage.getItem('isAuthenticated');
		if (storedAuth) {
			setIsAuthenticatedState(JSON.parse(storedAuth));
		}
	}, []);

	useEffect(() => {
		if (selectedPost) {
			localStorage.setItem('selectedPost', JSON.stringify(selectedPost));
		}
	}, [selectedPost]);

	useEffect(() => {
		localStorage.setItem(
			'isAuthenticated',
			JSON.stringify(isAuthenticated),
		);
	}, [isAuthenticated]);

	const setSelectedPost = (post: Post | null) => {
		setSelectedPostState(post);
	};

	const setIsAuthenticated = (auth: boolean) => {
		setIsAuthenticatedState(auth);
	};

	return (
		<PostsContext.Provider
			value={{
				selectedPost,
				setSelectedPost,
				isAuthenticated,
				setIsAuthenticated,
			}}
		>
			{children}
		</PostsContext.Provider>
	);
};
