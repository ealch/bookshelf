
import { buildBook } from 'test/generate'
import * as booksDB from 'test/data/books'
import { render, screen, userEvent, waitForLoadingToFinish } from 'test/app-test-utils';


test('renders all the book information', async () => {
    const book = await booksDB.create(buildBook())
    const route = `/book/${book.id}`
    await render(route);

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
    await render(route);

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


