// 🐨 here are the things you're going to need for this test:
import * as React from 'react'
import { render as renderRtl, waitForElementToBeRemoved, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildUser } from 'test/generate'
import * as auth from 'auth-provider'
import { AppProviders } from 'context'
import { App } from 'app'

import * as usersDB from 'test/data/users'

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

export * from '@testing-library/react'
export { render, waitForLoadingToFinish, loginAsUser, userEvent }