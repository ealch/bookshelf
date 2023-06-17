// 🐨 here are the things you're going to need for this test:
import * as React from 'react'
import { render } from '@testing-library/react'
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

test('renders all the book information', async () => {
    // 🐨 create a user using `buildUser`
    const user = buildUser()
    await usersDB.create(user)
    const authUser = await usersDB.authenticate(user)
    window.localStorage.setItem(auth.localStorageKey, authUser.token)

    // 🐨 create a book use `buildBook`
    const book = await booksDB.create(buildBook())
    // 🐨 update the URL to `/book/${book.id}`
    //   💰 window.history.pushState({}, 'page title', route)
    //   📜 https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
    const route = `/book/${book.id}`
    window.history.pushState({}, `page title`, route)

    // 🐨 render the App component and set the wrapper to the AppProviders
    // (that way, all the same providers we have in the app will be available in our tests)
    const component = render(<App />, { wrapper: AppProviders })

    // 🐨 use findBy to wait for the book title to appear
    // 📜 https://testing-library.com/docs/dom-testing-library/api-async#findby-queries
    await component.findByRole("heading", { name: book.title })
    // 🐨 assert the book's info is in the document
    expect(component.getByText(book.title)).toBeInTheDocument();
    expect(component.getByRole('img')).toHaveAttribute('src', book.coverImageUrl);
    expect(component.getByText(book.author)).toBeInTheDocument();
    expect(component.getByText(book.publisher)).toBeInTheDocument();
    expect(component.getByText(book.synopsis)).toBeInTheDocument();
    expect(component.getByRole("button", { name: 'Add to list' })).toBeInTheDocument();

    expect(component.queryByRole("button", { name: 'Mark as unread' })).not.toBeInTheDocument();
    expect(component.queryByRole("button", { name: 'Mark as read' })).not.toBeInTheDocument();
    expect(component.queryByRole("button", { name: 'Remove from list' })).not.toBeInTheDocument();
    expect(component.queryByRole('textbox', { name: 'Notes' })).not.toBeInTheDocument()
    expect(component.queryByRole('radio')).not.toBeInTheDocument()
    expect(component.queryByLabelText('Start date')).not.toBeInTheDocument()
})







