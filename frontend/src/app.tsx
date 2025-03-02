import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import Navigation from '@/components/navHeader';
import Landing from '@/pages/landing';
import Login from '@/pages/login';
import Home from '@/pages/home';
import Register from '@/pages/sign-in';

const App = () => {
    function title(Text: string): React.JSX.Element {
        return <h1 className='m-7 text-3xl'>{Text}</h1>
    }
    return (
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <BrowserRouter>
                <Navigation />
                <Routes>
                    <Route path='/' element={<Landing />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='*' element={title("404 - Not found")} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};



export default App;