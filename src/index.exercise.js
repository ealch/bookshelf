import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Logo } from 'components/logo';

import { Dialog } from "@reach/dialog";
import '@reach/dialog/styles.css'

const LoginForm = ({ onSubmit, buttonText }) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    // Alternative without `useState`: 
    // const {username, password} = event.target.elements 

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({
            username,
            password,
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='username' >Username: </label>
                <input id='username' type='text' placeholder='username' value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
                <label htmlFor='password' >Password: </label>
                <input id='password' type='password' placeholder='password' value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type='submit'>{buttonText}</button>
        </form>
    )
}

const App = () => {
    const [showDialog, setShowDialog] = React.useState("none");
    const open = (type) => setShowDialog(type);
    const close = () => setShowDialog('none');

    const handleLogin = (formData) => {
        console.log('login', formData);
    }

    const handleRegister = (formData) => {
        console.log('register', formData);
    }

    return (
        <>
            <div>
                <Logo />
                <h1>Bookshelf</h1>
                <div>
                    <button onClick={() => open('login')}>Login</button>
                    <Dialog aria-label='Login' isOpen={showDialog === 'login'} onDismiss={close}>
                        <div>
                            <button onClick={close}>Close login</button>
                            <h2>Login</h2>
                        </div>
                        <LoginForm onSubmit={handleLogin} buttonText='Login' />
                    </Dialog>
                </div>
                <div>
                    <button onClick={() => open('register')}>Register</button>
                    <Dialog aria-label='Register' isOpen={showDialog === 'register'} onDismiss={close}>
                        <div>
                            <button onClick={close}>Close register</button>
                            <h2>Register</h2>
                            <LoginForm onSubmit={handleRegister} buttonText='Register' />
                        </div>
                    </Dialog>
                </div>
            </div>



        </>
    );
}

createRoot(document.getElementById('root')).render(<App />)
