import * as React from 'react';
export const AuthContext = React.createContext();

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error(`useAuth must be used within a AuthContext provider `)
    }
    return context;
}