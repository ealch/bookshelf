// 🐨 We'll use renderHook rather than render here
import { renderHook, act } from '@testing-library/react'
// 🐨 Here's the thing you'll be testing:
import { useAsync } from '../hooks'

beforeEach(() => {
    jest.spyOn(console, 'error')
})

afterEach(() => {
    console.error.mockRestore()
})

// 💰 I'm going to give this to you. It's a way for you to create a promise
// which you can imperatively resolve or reject whenever you want.
function deferred() {
    let resolve, reject
    const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
    })
    return { promise, resolve, reject }
}

// Use it like this:
// const {promise, resolve} = deferred()
// promise.then(() => console.log('resolved'))
// do stuff/make assertions you want to before calling resolve
// resolve()
// await promise
// do stuff/make assertions you want to after the promise has resolved

const defaultState = {
    data: null,
    error: null,
    status: "idle",

    isError: false,
    isIdle: true,
    isLoading: false,
    isSuccess: false,

    reset: expect.any(Function),
    run: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
}

const pendingState = {
    ...defaultState,
    isLoading: true,
    isIdle: false,
    status: "pending"
}

const resolvedState = {
    ...defaultState,
    isSuccess: true,
    isIdle: false,
    status: 'resolved',
}

const rejectedState = {
    ...defaultState,
    isError: true,
    isIdle: false,
    status: 'rejected',
}

// 🐨 flesh out these tests
test('calling run with a promise which resolves', async () => {
    // 🐨 get a promise and resolve function from the deferred utility
    const { promise, resolve } = deferred();
    // 🐨 use renderHook with useAsync to get the result
    const { result } = renderHook(() => useAsync())
    // 🐨 assert the result.current is the correct default state
    expect(result.current).toEqual(defaultState)

    // 🐨 call `run`, passing the promise
    // 💰 this updates state so it needs to be done in an `act` callback
    let p;
    act(() => {
        p = result.current.run(promise)
    })

    // 🐨 assert that result.current is the correct pending state
    expect(result.current).toEqual(pendingState)

    // 🐨 call resolve and wait for the promise to be resolved
    // 💰 this updates state too and you'll need it to be an async `act` call so you can await the promise
    await act(async () => {
        resolve("Something");
        await p;
    })


    // 🐨 assert the resolved state
    expect(result.current).toEqual({ ...resolvedState, data: 'Something' })

    // 🐨 call `reset` (💰 this will update state, so...)
    act(() => result.current.reset())
    // 🐨 assert the result.current has actually been reset
    expect(result.current).toEqual(defaultState)
})

test('calling run with a promise which rejects', async () => {
    // 🐨 this will be very similar to the previous test, except you'll reject the
    // promise instead and assert on the error state.
    // 💰 to avoid the promise actually failing your test, you can catch
    //    the promise returned from `run` with `.catch(() => {})`

    const { promise, reject } = deferred();
    const { result } = renderHook(() => useAsync())
    let p;
    act(() => {
        p = result.current.run(promise).catch(() => { })
    })

    // 🐨 assert that result.current is the correct pending state
    expect(result.current).toEqual(pendingState)

    // 🐨 call resolve and wait for the promise to be resolved
    // 💰 this updates state too and you'll need it to be an async `act` call so you can await the promise
    await act(async () => {
        reject("Something");
        await p;
    })

    // 🐨 assert the resolved state
    expect(result.current).toEqual({ ...rejectedState, error: 'Something' })

    // 🐨 call `reset` (💰 this will update state, so...)
    act(() => result.current.reset())
    // 🐨 assert the result.current has actually been reset
    expect(result.current).toEqual(defaultState)
})

const customInitialState = { status: 'resolved', data: "Hello", error: null }


test('can specify an initial state', () => {
    // 💰 useAsync(customInitialState)
    const { result } = renderHook(() => useAsync(customInitialState))

    expect(result.current).toEqual({ ...resolvedState, ...customInitialState })
})


test('can set the data', () => {
    // 💰 result.current.setData('whatever you want')
    const { result } = renderHook(() => useAsync())
    act(() => {
        result.current.setData('whatever you want')
    })

    expect(result.current).toEqual({ ...resolvedState, data: 'whatever you want' })
})


test('can set the error', () => {
    // 💰 result.current.setError('whatever you want')
    const { result } = renderHook(() => useAsync())
    act(() => {
        result.current.setError('whatever you want')
    })

    expect(result.current).toEqual({ ...rejectedState, error: 'whatever you want' })
})


test('No state updates happen if the component is unmounted while pending', async () => {
    // 💰 const {result, unmount} = renderHook(...)
    const { promise, resolve } = deferred();
    const { result, unmount } = renderHook(() => useAsync())

    expect(result.current).toEqual(defaultState)

    // 🐨 ensure that console.error is not called (React will call console.error if updates happen when unmounted)
    let p;
    act(() => {
        p = result.current.run(promise)
    })

    expect(result.current).toEqual(pendingState)

    expect(console.error).not.toBeCalled()

    unmount();

    await act(async () => {
        resolve("Something");
        await p;
    })

    expect(console.error).not.toBeCalled()

})



test('calling "run" without a promise results in an early error', () => {
    const { result } = renderHook(() => useAsync())

    expect(() => result.current.run()).toThrowError("The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?")
})
