// 🐨 here are the things you're going to need for this test:
import * as React from 'react'
import { render as renderRtl, waitForElementToBeRemoved, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { queryCache } from 'react-query'
import { buildUser, buildBook } from 'test/generate'
import * as auth from 'auth-provider'
import { AppProviders } from 'context'
import { App } from 'app'

import * as usersDB from 'test/data/users'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'

// 🐨 after each test, clear the queryCache and auth.logout
afterEach(async () => {
    queryCache.clear()
    await Promise.all([
        auth.logout(),
        usersDB.reset(),
        booksDB.reset(),
        listItemsDB.reset(),
    ])

})

const loginAsUser = async () => {
    const user = buildUser()
    await usersDB.create(user)
    const authUser = await usersDB.authenticate(user)
    window.localStorage.setItem(auth.localStorageKey, authUser.token)
}

//  The benefit of using screen is you no longer need to keep the render 
//  call destructure up-to-date as you add/remove the queries you need. 
//  You only need to type screen. and let your editor's magic autocomplete 
//  take care of the rest.
const waitForLoadingToFinish = () => {
    return waitForElementToBeRemoved(() => [
        ...screen.queryAllByLabelText(/loading/i),
        ...screen.queryAllByText(/loading/i),
    ])
}


const render = async (route) => {
    await loginAsUser();
    window.history.pushState({}, `page title`, route)

    renderRtl(<App />, { wrapper: AppProviders })
    await waitForLoadingToFinish();
}

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


