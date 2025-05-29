import { default as Post } from '@components/Post';
import { fireEvent, render, screen } from '@testing-library/react';
import { useUserInfor } from '@hooks/index';

jest.mock('@hooks/index', () => ({
    useUserInfor: jest.fn(),
}));

beforeEach(() => {
    useUserInfor.mockReturnValue({
        _id: '682ae4923ecea490d05b56ea',
        fullName: 'Minh Vo',
        image: 'https://utfs.io/f/SOp9eVsW3dP79RG41sTGSpfhePMqC8TXBmoyWzZraHQ6N2tv',
        imagePublicId: 'SOp9eVsW3dP79RG41sTGSpfhePMqC8TXBmoyWzZraHQ6N2tv',
    });
});

describe('Post Component', () => {
    test('renders the post content correctly', () => {
        const { getByText } = render(
            <Post
                userInfo={{ fullName: 'Minh Vo' }}
                createAt={Date.now()}
                content='hihi'
            />,
        );
        expect(getByText('Minh Vo')).toBeInTheDocument();
        expect(getByText('hihi')).toBeInTheDocument();
    });

    test('should render correctly number of like', () => {
        const like = [1, 2, 3, 4, 5];
        const { getByText } = render(
            <Post
                userInfo={{ fullName: 'Minh Vo' }}
                createAt={Date.now()}
                content='hihi'
                likes={like}
            />,
        );
        expect(getByText('5')).toBeInTheDocument();
    });

    test('should calls onLike with id when llike button is clicked', () => {
        const mockOnLike = jest.fn();
        render(
            <Post
                userInfo={{ fullName: 'Minh Vo' }}
                createAt={Date.now()}
                content='hihi'
                onLike={mockOnLike}
                id='test-post-id'
            />,
        );
        const likeButton = screen.getByTestId('like-button');
        fireEvent.click(likeButton);
        expect(mockOnLike).toHaveBeenCalledWith('test-post-id');
    });

    test('should render correctly img', () => {
        render(
            <Post
                userInfo={{ fullName: 'Minh Vo' }}
                createAt={Date.now()}
                content='hihi'
                image='https://example.com/image.jpg'
            />,
        );
        const imgElement = screen.getByRole('img');
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', 'https://example.com/image.jpg');
        expect(imgElement).toHaveAttribute('alt', 'Post image');
    });

    test('should render correct number of comments', () => {
        const comments = [
            {
                _id: '68371a77c82ad41330e33dec',
                comment: 'love...',
                author: {
                    _id: '682ae4923ecea490d05b56ea',
                    fullName: 'Minh Vo',
                    image: 'https://utfs.io/f/SOp9eVsW3dP79RG41sTGSpfhePMqC8TXBmoyWzZraHQ6N2tv',
                    imagePublicId: 'SOp9eVsW3dP79RG41sTGSpfhePMqC8TXBmoyWzZraHQ6N2tv',
                },
                post: '6836fd5ac82ad41330e33930',
                createdAt: '2025-05-28T14:15:19.572Z',
                updatedAt: '2025-05-28T14:15:19.572Z',
                __v: 0,
            },
            {
                _id: '6837c2b5c82ad41330e3405d',
                comment: 'love Vy',
                author: {
                    _id: '682ae4923ecea490d05b56ea',
                    fullName: 'Minh Vo',
                    image: 'https://utfs.io/f/SOp9eVsW3dP79RG41sTGSpfhePMqC8TXBmoyWzZraHQ6N2tv',
                    imagePublicId: 'SOp9eVsW3dP79RG41sTGSpfhePMqC8TXBmoyWzZraHQ6N2tv',
                },
                post: '6836fd5ac82ad41330e33930',
                createdAt: '2025-05-29T02:13:09.569Z',
                updatedAt: '2025-05-29T02:13:09.569Z',
                __v: 0,
            },
            {
                _id: '6837c3c8c82ad41330e34095',
                comment: 'hihihihi',
                author: {
                    _id: '682ae4923ecea490d05b56ea',
                    fullName: 'Minh Vo',
                    image: 'https://utfs.io/f/SOp9eVsW3dP79RG41sTGSpfhePMqC8TXBmoyWzZraHQ6N2tv',
                    imagePublicId: 'SOp9eVsW3dP79RG41sTGSpfhePMqC8TXBmoyWzZraHQ6N2tv',
                },
                post: '6836fd5ac82ad41330e33930',
                createdAt: '2025-05-29T02:17:44.953Z',
                updatedAt: '2025-05-29T02:17:44.953Z',
                __v: 0,
            },
            {
                _id: '6837c3eac82ad41330e340be',
                comment: 'noooo',
                author: {
                    _id: '682ae4923ecea490d05b56ea',
                    fullName: 'Minh Vo',
                    image: 'https://utfs.io/f/SOp9eVsW3dP79RG41sTGSpfhePMqC8TXBmoyWzZraHQ6N2tv',
                    imagePublicId: 'SOp9eVsW3dP79RG41sTGSpfhePMqC8TXBmoyWzZraHQ6N2tv',
                },
                post: '6836fd5ac82ad41330e33930',
                createdAt: '2025-05-29T02:18:18.879Z',
                updatedAt: '2025-05-29T02:18:18.879Z',
                __v: 0,
            },
        ]; //4
        render(
            <Post
                userInfo={{ fullName: 'Minh Vo' }}
                createAt={Date.now()}
                content='hihi'
                comments={comments}
            />,
        );
        expect(screen.getByText('4')).toBeInTheDocument();
    });
    test('should comment box when comment button is clicked', () => {
        render(
            <Post
                userInfo={{ fullName: 'Minh Vo' }}
                createAt={Date.now()}
                content='hihi'
                comments={[]}
                id='test-post-id'
            />,
        );
        const commentButton = screen.getByTestId('comment-button');
        fireEvent.click(commentButton);
        expect(screen.getByPlaceholderText('Left a comment...')).toBeInTheDocument();
    });
    test('should calls onComment callback when sending a comment', () => {
        const mockOnComment = jest.fn();
        render(
            <Post
                userInfo={{ fullName: 'Minh Vo' }}
                createAt={Date.now()}
                content='hihi'
                comments={[]}
                id='test-post-id'
                onComment={mockOnComment}
            />,
        );
        const commentButton = screen.getByTestId('comment-button');
        fireEvent.click(commentButton);
        const commentInput = screen.getByPlaceholderText('Left a comment...');
        fireEvent.change(commentInput, { target: { value: 'This is a comment' } });
        const sendButton = screen.getByTestId('send-comment-button');
        fireEvent.click(sendButton);
        expect(mockOnComment).toHaveBeenCalledWith({
            postId: 'test-post-id',
            comment: 'This is a comment',
        });
        expect(commentInput.value).toBe('');
    });
});
