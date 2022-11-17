import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import routes from './routes'
import React, { useEffect } from 'react'
import PrivateRoute from './components/PrivateRoute'
import NotFound from './pages/NotFound'
import PublicRoute from './components/PublicRoute'
import AccountInfo from './pages/AccountInfo'
import PrivateAccountRoute from './components/PrivateAccountRoute'
import DefaultLayout from './components/layouts/DefautLayout'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { clearSocket, setSocket } from './app/slices/socketSlice'
import { SOCKET_SERVER } from './utils/variables'

function App() {
    const socket = useSelector((state) => state.socket.current)
    const token = useSelector((state) => state.auth.token)

    const dispatch = useDispatch()

    useEffect(() => {
        // console.log("Socket:" ,socket);
        if (!token) {
            // return () => {
            console.log('Logout', socket)
            if (socket) socket.disconnect()
            dispatch(clearSocket())
            // }
            return
        }
        if (socket) {
            return
        }
        const newSocket = io(SOCKET_SERVER, { autoConnect: false })
        newSocket.auth = { token }
        newSocket.connect()

        newSocket.on('connect', () => {
            console.log('Connected')
        })
        dispatch(setSocket({ socket: newSocket }))
    }, [token, socket])

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicRoute />}>
                    {routes.publicRoutes.map((route) => {
                        const Layout = route.layout || React.Fragment
                        const Component = route.component

                        return (
                            <Route
                                path={route.path}
                                key={route.path}
                                element={
                                    <Layout>
                                        <Component />
                                    </Layout>
                                }
                            />
                        )
                    })}
                </Route>
                <Route element={<PrivateRoute />}>
                    {routes.privateRoutes.map((route) => {
                        const Layout = route.layout || React.Fragment
                        const Component = route.component

                        return (
                            <Route
                                path={route.path}
                                key={route.path}
                                element={
                                    <Layout>
                                        <Component />
                                    </Layout>
                                }
                            />
                        )
                    })}
                </Route>
                <Route element={<PrivateAccountRoute />}>
                    <Route
                        path="/account"
                        element={
                            <DefaultLayout>
                                <AccountInfo />
                            </DefaultLayout>
                        }
                    />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
