import { useQuery, queryCache } from 'react-query'
import { client } from 'utils/api-client'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
    title: 'Loading...',
    author: 'loading...',
    coverImageUrl: bookPlaceholderSvg,
    publisher: 'Loading Publishing',
    synopsis: 'Loading...',
    loadingBook: true,
}


const useBook = (bookId, user) => {
    const { data: book = loadingBook } = useQuery({
        queryKey: ['book', { bookId }],
        queryFn: () => client(`books/${bookId}`, { token: user.token }).then(data => data.book)
    })
    return book;
}


const loadingBooks = Array.from({ length: 10 }, (v, index) => ({
    id: `loading-book-${index}`,
    ...loadingBook,
}))

const bookSearchQuery = (query, user) => ({
    queryKey: ['bookSearch', { query }],
    queryFn: () => {
        return client(`books?query=${encodeURIComponent(query)}`, {
            token: user.token,
        }).then(data => data.books)
    }
})


const useBookSearch = (query, user) => {
    const { data: books = loadingBooks, error, isLoading, isError, isSuccess } = useQuery(bookSearchQuery(query, user));
    return {
        books,
        error,
        isLoading,
        isError,
        isSuccess
    }
}

const refetchBookSearchQuery = async (user) => {
    queryCache.removeQueries('bookSearch');
    await queryCache.prefetchQuery(bookSearchQuery("", user))
}

export {
    useBook,
    useBookSearch,
    refetchBookSearchQuery,
}