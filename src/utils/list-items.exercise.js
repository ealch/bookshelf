import { useQuery, useMutation, queryCache } from 'react-query'
import { client } from 'utils/api-client'
import { setQueryDataForBook } from './books'


const useListItems = (user) => {
    const { data: listItems } = useQuery({
        queryKey: 'list-items',
        queryFn: () => client(`list-items`, { token: user.token }).then(data => data.listItems),
        config: {
            onSuccess: data => {
                data.forEach(item => setQueryDataForBook(item.book));
            }
        }
    })
    return listItems ?? [];
}

const useListItem = (user, bookId) => {
    const listItems = useListItems(user);
    return listItems?.find(item => item.bookId === bookId) ?? null;
}

const defaultOptions = {
    onSettled: () => queryCache.invalidateQueries('list-items'),
    onError: (err, variables, onMutateValue) => {
        onMutateValue?.();
    }
}

const useUpdateListItem = (user, options) => {
    return useMutation(
        updates => client(`list-items/${updates.id}`, { method: 'PUT', data: updates, token: user.token }),
        {
            onMutate: (updatedItem) => {
                const oldData = queryCache.getQueryData("list-items");

                queryCache.setQueryData("list-items", old => {
                    return old.map(item => {
                        return item.id === updatedItem.id ? { ...item, ...updatedItem } : item
                    })
                })

                return () => queryCache.setQueryData("list-items", oldData)
            },
            ...defaultOptions,
            ...options
        }
    )
}

const useRemoveListItem = (user, options) => {
    return useMutation(
        ({ id }) => client(`list-items/${id}`, { method: 'DELETE', token: user.token }),
        {
            onMutate: (removedItem) => {
                const oldData = queryCache.getQueryData("list-items");

                queryCache.setQueryData("list-items", old => {
                    return old.filter(item => item.id !== removedItem.id)
                })

                return () => queryCache.setQueryData("list-items", oldData)
            },
            ...defaultOptions,
            ...options
        }
    )

}
const useCreateListItem = (user, options) => {
    return useMutation(
        ({ bookId }) => client(`list-items`, { data: { bookId }, token: user.token }),
        {
            ...defaultOptions,
            ...options
        }
    )
}

export {
    useListItem,
    useListItems,
    useUpdateListItem,
    useRemoveListItem,
    useCreateListItem,
}