import * as React from 'react';
import * as auth from 'auth-provider'
import { client } from 'utils/api-client'
import { useAsync } from 'utils/hooks'

const AuthContext = React.createContext();
AuthContext.displayName = "AuthContext";

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error(`useAuth must be used within a AuthContext provider `)
    }
    return context;
}


export const useClient = () => {
    const { user } = useAuth();
    return React.useCallback(function authenticatedClient(endpoint, config) {
        return client(endpoint, { ...config, token: user.token })
    }, [user.token])

}

async function getUser() {
    let user = null

    const token = await auth.getToken()
    if (token) {
        const data = await client('me', { token })
        user = data.user
    }

    return user
}

export const AuthProvider = ({ children }) => {

    const { data: user, error, isLoading, isIdle, isError, isSuccess, run, setData } = useAsync()

    React.useEffect(() => {
        run(getUser())
    }, [run])

    const login = form => auth.login(form).then(user => setData(user))
    const register = form => auth.register(form).then(user => setData(user))
    const logout = () => {
        auth.logout()
        setData(null)
    }

    return <AuthContext.Provider value={{
        user,
        login,
        register,
        logout,
        error,
        isLoading,
        isIdle,
        isError,
        isSuccess,
    }}>{children}</AuthContext.Provider>
}