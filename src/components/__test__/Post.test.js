import { default as Post } from '@components/Post';
import { render } from '@testing-library/react';

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
});
