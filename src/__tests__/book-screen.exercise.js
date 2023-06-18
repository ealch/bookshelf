
import { buildBook, buildListItem } from 'test/generate'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import { render, screen, userEvent, waitForLoadingToFinish, loginAsUser } from 'test/app-test-utils';
import { formatDate } from 'utils/misc';


test('renders all the book information', async () => {
    const book = await booksDB.create(buildBook())
    const route = `/book/${book.id}`
    await render({ route });

    expect(screen.getByText(book.title)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', book.coverImageUrl);
    expect(screen.getByText(book.author)).toBeInTheDocument();
    expect(screen.getByText(book.publisher)).toBeInTheDocument();
    expect(screen.getByText(book.synopsis)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: 'Add to list' })).toBeInTheDocument();

    expect(screen.queryByRole("button", { name: 'Mark as unread' })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: 'Mark as read' })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: 'Remove from list' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Notes' })).not.toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Start date')).not.toBeInTheDocument()
})

test('can create a list item for the book', async () => {
    const book = await booksDB.create(buildBook())
    const route = `/book/${book.id}`
    await render({ route });

    const addToListButton = screen.getByRole("button", { name: 'Add to list' });
    await userEvent.click(addToListButton)

    await waitForLoadingToFinish();


    expect(screen.getByRole("button", { name: 'Mark as read' })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: 'Remove from list' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Notes' })).toBeInTheDocument()
    expect(screen.getByLabelText('Start date')).toBeInTheDocument()

    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: 'Add to list' })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: 'Mark as unread' })).not.toBeInTheDocument();
})

test('can remove a list item for the book', async () => {
    const user = await loginAsUser()
    const book = await booksDB.create(buildBook())
    await listItemsDB.create(buildListItem({ owner: user, book }))
    const route = `/book/${book.id}`

    await render({ route, user })

    const removeFromListButton = screen.getByRole("button", { name: 'Remove from list' });
    await userEvent.click(removeFromListButton);

    await waitForLoadingToFinish();

    expect(screen.queryByRole("button", { name: 'Mark as read' })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: 'Remove from list' })).not.toBeInTheDocument();

    expect(screen.queryByRole("button", { name: 'Add to list' })).toBeInTheDocument();
})

test('can mark a list item as read', async () => {
    const user = await loginAsUser()
    const book = await booksDB.create(buildBook())
    const listItem = await listItemsDB.create(buildListItem({ owner: user, book, finishDate: null, }))
    const route = `/book/${book.id}`

    await render({ route, user })

    const markAsReadButton = screen.getByRole("button", { name: 'Mark as read' });
    await userEvent.click(markAsReadButton);

    await waitForLoadingToFinish();

    expect(screen.queryByRole("button", { name: 'Mark as read' })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: 'Mark as unread' })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: 'Remove from list' })).toBeInTheDocument();
    expect(screen.queryAllByRole('radio')).toHaveLength(5)
    expect(screen.queryByLabelText("Start and finish date")).toHaveTextContent(
        `${formatDate(listItem.startDate)} — ${formatDate(new Date())}`
    )

})

const fakeTimerUserEvent = userEvent.setup({
    advanceTimers: () => jest.runOnlyPendingTimers(),
})

test('can edit a note', async () => {
    jest.useFakeTimers()
    const user = await loginAsUser()
    const book = await booksDB.create(buildBook())
    const listItem = await listItemsDB.create(buildListItem({ owner: user, book }))
    const route = `/book/${book.id}`

    await render({ route, user })
    const newNotes = "This is a note!"

    const notesTextarea = screen.getByRole('textbox', { name: "Notes" })
    await fakeTimerUserEvent.clear(notesTextarea)
    await fakeTimerUserEvent.type(notesTextarea, newNotes)

    await screen.findByLabelText("loading")
    await waitForLoadingToFinish()

    expect(notesTextarea).toHaveValue(newNotes)

    expect(await listItemsDB.read(listItem.id)).toMatchObject({
        notes: newNotes,
    })
})

