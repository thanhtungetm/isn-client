import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import UserDescription from '../../components/UserDescription'
import FriendService from '../../services/FriendService'
import FriendItem from './FriendItem'
import RequestFriend from './RequestFriend'

function Friend() {
    const user = useSelector((state) => state.auth.user)
    const socket = useSelector((state) => state.socket.current)

    const [requestFriendList, setRequestFriendList] = useState([])
    const [friendList, setFriendList] = useState([])

    const fetchAllRequestMakeFriend = async () => {
        try {
            const res = await FriendService.getAllRequestMakeFriend()
            console.log("Request friend list: ",res.data)
            setRequestFriendList(res.data)
        } catch (error) {}
    }
    const fetchAllFriend = async () => {
        try {
            const res = await FriendService.get()
            console.log("Friend list: ",res.data)
            setFriendList(res.data)
        } catch (error) {}
    }

    useEffect(() => {
        fetchAllRequestMakeFriend()
        fetchAllFriend()
    }, [])

    const handleRefuse = async (friendId, username) => {
        try {
            await FriendService.refuseRequestMakeFriend(friendId)
            fetchAllRequestMakeFriend()

            socket.emit('notification:makeFriend', {
                from: user.username,
                to: username,
                type: 2,
            })
        } catch (error) {
            console.log('Error in refuseRequestMakeFriend')
        }
    }

    const handleAccept = async (friendId, username) => {
        try {
            await FriendService.acceptRequestMakeFriend(friendId)
            fetchAllRequestMakeFriend()
            fetchAllFriend()

            //Notification
            const fromUser = {
                user_id: user.id,
                user_name: user.username,
                user_avatar: user.avatar,
                user_fullname: user.user_fullname,
            }
            socket.emit('notification:friend', {
                from: fromUser,
                to: username,
                type: 1,
            })
        } catch (error) {
            console.log('Error in acceptRequestMakeFriend')
        }
    }
    const handleRemoveFriend = async (friendId, username) => {
        try {
            await FriendService.removeFriend(friendId)
            fetchAllFriend()

            //Notification
           
            socket.emit('notification:friend', {
                from: user.username,
                to: username,
                type: 0,
            })
        } catch (error) {
            console.log('Error in acceptRequestMakeFriend')
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on('notification:action:makeFriend', (payload) => {
                console.log('New request:', payload)
                if (payload.type === 1) {
                    setRequestFriendList((preList) => [...preList, payload.from])
                } else {
                    setRequestFriendList((preList) => [
                        ...preList.filter((item) => item.user_name !== payload.from),
                    ])
                }
            })
            socket.on('notification:action:friend', (payload) => {
                console.log('New accepted friend:', payload)
                if (payload.type === 1) {
                    setFriendList((preList) => [...preList, payload.from])
                } else {
                    setFriendList((preList) => [
                        ...preList.filter((item) => item.user_name !== payload.from),
                    ])
                }
            })
            return () => {
                socket.off('notification:action:makeFriend')
                socket.off('notification:action:friend')
            }
        }
    }, [socket])

    return (
        <div className="w-full">
            <div className="w-full px-2 md:w-2/3 md:mx-auto shadow-lg bg-white rounded-xl">
                <div className="text-center border-b-2">
                    <h3 className="text-2xl py-2">Bạn bè</h3>
                </div>
                <div className="flex flex-col">
                    <div className="w-full md:w-3/5">
                        {friendList.length === 0 && (
                            <div className="text-center text-lg">Chưa có bạn bè!</div>
                        )}
                        <ul>
                            {friendList.map((friend) => (
                                <FriendItem
                                    key={friend.user_id}
                                    userInfo={friend}
                                    onRemoveFriend={handleRemoveFriend}
                                />
                            ))}
                        </ul>
                    </div>
                    <div className="w-full md:w-2/5">
                        <div className="text-center text-xl">
                            <span>Lời mời kết bạn</span>
                        </div>
                        <ul>
                            {requestFriendList.map((requestFriend) => (
                                <RequestFriend
                                    key={requestFriend.user_id}
                                    info={requestFriend}
                                    onRefuse={handleRefuse}
                                    onAccept={handleAccept}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Friend
