import {AppBar, Toolbar} from "@mui/material";
import {BrowserRouter, Routes, Route, NavLink} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ReportListPage from "./pages/ReportListPage";
import useMediaQuery from '@mui/material/useMediaQuery';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from "react";


export default function App() {

    const styles = {
        link: {
            color: '#FFF',
            padding: '20px',
            textDecoration: 'underline'
        },
        activeLink: {
            fontWeight: 'bold',
            color: '#FFF',
            padding: '20px',
            textDecoration: 'none'
        }
    };

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: 'light'
                },
            }),
        [prefersDarkMode]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <BrowserRouter>
                <AppBar position="static">
                    <Toolbar  style={{ display: 'flex', flexDirection: 'row'}}>
                        <div style={{ flex: 1 }}>Activity 2</div>
                        <div>
                            <NavLink to="/"
                                     style={({isActive}) => isActive ? styles.activeLink : styles.link}>
                                Home
                            </NavLink>
                            <NavLink
                                to="/reports"
                                style={({isActive}) => isActive ? styles.activeLink : styles.link}
                            >
                                Reports
                            </NavLink>
                        </div>
                    </Toolbar>
                </AppBar>
                <Routes>
                    <Route path='/' element={<HomePage/>}/>
                    <Route path='/reports' element={<ReportListPage/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}