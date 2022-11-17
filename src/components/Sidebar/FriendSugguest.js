import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import FriendService from '../../services/FriendService'
import { useSelector } from 'react-redux'
import AvatarImage from '../AvatarImage'

const HOST = process.env.REACT_APP_IMAGE_HOST

const NO_FRIEND = 1
const INVITATION = 2

function FriendSugguest({ user }) {
    const [status, setStatus] = useState(NO_FRIEND)
    const socket = useSelector((state) => state.socket.current)
    const myself = useSelector((state) => state.auth.user)

    const handleSendRequestFriend = async () => {
        console.log('Send request make friend to: ', user.user_id)
        const friendId = user.user_id
        try {
            const res = await FriendService.sendRequestMakeFriend(friendId)
            setStatus(INVITATION)
            console.log(res)

            //Notification
            const fromUser = {
                user_id: myself.id,
                user_name: myself.username,
                user_avatar: myself.avatar,
                user_fullname: myself.fullname,
            }
            socket.emit('notification:makeFriend', {
                from: fromUser,
                to: user.user_name,
                type: 1,
            })
        } catch (error) {
            console.log('Error in sendRequestMakeFriend')
        }
    }

    return (
        <div className="flex justify-between items-center relative border-b p-1">
            <NavLink to={`/profile/${user.user_name}`}>
                <div className="flex">
                    <div className="mt-1.5 w-10 h-10">
                        <AvatarImage filename={user.user_avatar} />
                        {/* <img
                            className="rounded-full w-full h-full object-cover cursor-pointer"
                            src={`${HOST}/static/avatar/${user?.user_avatar || 'avatar.png'}`}
                            alt="avatar"
                        /> */}
                    </div>
                    <div className="flex flex-col w-3/5 ml-2 peer">
                        <span className="useName text-base font-bold cursor-pointer ">
                            @{user.user_name}
                        </span>

                        <span className="text-xs text-slate-400">{user.user_fullname}</span>
                    </div>
                </div>
            </NavLink>

            <div className="right cursor-pointer text-sky-500">
                {status === NO_FRIEND && <span onClick={handleSendRequestFriend}>Kết bạn</span>}
                {status === INVITATION && (
                    <span className="text-pink-400 font-medium" onClick={handleSendRequestFriend}>
                        Đã gửi
                    </span>
                )}
            </div>
        </div>
    )
}

export default FriendSugguest
