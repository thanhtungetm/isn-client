import { faTimes, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import cls from 'classnames'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FriendService from '../../../../../services/FriendService'

function FriendshipNav() {
    const socket = useSelector((state) => state.socket.current)

    const [newRequest, setNewRequest] = useState(false)
    const [friendNotify, setFriendNotify] = useState({ show: false, username: '' })

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (socket) {
            socket.on('notification:makeFriend', (payload) => {
                console.log('Notify MakeFriend:', payload)
                if (payload.type === 1) {
                    setNewRequest(true)
                    setFriendNotify({ show: true, username: payload.from.user_name })
                    setTimeout(() => {
                        setFriendNotify({ show: false, username: '' })
                    }, 3000)
                }
                // else setNewRequest(false)
            })
            socket.on('notification:friend', (payload) => {
                console.log('Notify Friend:', payload)
                if (payload.type === 1) {
                    setNewRequest(true)
                }
                // else setNewRequest(false)
            })
            return () => {
                socket.off('notification:makeFriend')
                socket.off('notification:friend')
            }
        }
    }, [socket])

    useEffect(() => {
        if (location.pathname === '/friend' && newRequest) setNewRequest(false)
    }, [location.pathname, newRequest])

    const getNewRequestStatus = async () => {
        try {
            const res = await FriendService.getNewRequestStatus()
            console.log('Res status', res)
            setNewRequest(res.data)
        } catch (error) {}
    }

    useEffect(() => {
        getNewRequestStatus()
    }, [])

    const isActive = location.pathname === '/friend'

    const handleGotoFriend = async () => {
        try {
            if (newRequest) {
                const res = await FriendService.updateNewRequestStatus()
                console.log('Res update new request status', res)
            }
            navigate(`/friend`)
        } catch (error) {}
    }

    return (
        <div className="relative">
            {friendNotify.show && (
                <div className="fixed bottom-0 mr-5 mb-2 right-0 text-xl text-blue-800 z-50">
                    <div className="bg-white w-full py-1 px-4 text-black rounded-md  cursor-default border border-gray-400 relactive">
                        <span>
                            <span className="text-blue-800 font-medium">
                                @{friendNotify.username}
                            </span>{' '}
                            đã gửi cho bạn lời mời kết bạn
                        </span>
                        <span
                            className="absolute -mr-2 right-0 bottom-full -mb-4 bg-white text-red-500 border border-red-500 w-5 h-5 flex justify-center text-sm items-center rounded-full cursor-pointer"
                            onClick={() => setFriendNotify({ show: false, username: '' })}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </div>
                </div>
            )}
            {/* <NavLink
                to="/friend"
                className={({ isActive }) => {
                    return cls({ 'text-blue-500': isActive })
                }}
                onClick={() => setNewRequest(false)}
            > */}
            <FontAwesomeIcon
                className={cls('cursor-pointer', { 'text-blue-500': isActive })}
                icon={faUserGroup}
                onClick={handleGotoFriend}
            />
            {/* </NavLink> */}

            {newRequest && (
                <div className="absolute right-0 top-0 w-3 h-3 bg-red-300  text-white text-center rounded-full flex justify-center items-center"></div>
            )}
        </div>
    )
}

export default FriendshipNav
