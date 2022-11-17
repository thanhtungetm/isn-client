import { faCheck, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import FriendService from '../../services/FriendService'
import AvatarImage from '../AvatarImage'

const SELF = 0
const NO_FRIEND = 1
const INVITATION = 2
const FRIEND = 3
const INVITE_ME = 4
const HOST = process.env.REACT_APP_IMAGE_HOST

function UserDescription({ userInfo, onReload }) {
    const socket = useSelector((state) => state.socket.current)
    const user = useSelector((state) => state.auth.user)

    const handleSendRequestFriend = async () => {
        console.log('Send request make friend to: ', userInfo.user_id)
        const friendId = userInfo.user_id
        try {
            const res = await FriendService.sendRequestMakeFriend(friendId)
            console.log(res)
            onReload(INVITATION)

            //Notification
            const fromUser = {
                user_id: user.id,
                user_name: user.username,
                user_avatar: user.avatar,
                user_fullname: user.fullname,
            }
            socket.emit('notification:makeFriend', {
                from: fromUser,
                to: userInfo.user_name,
                type: 1,
            })
        } catch (error) {
            console.log('Error in sendRequestMakeFriend')
        }
    }

    const handleRemoveRequestFriend = async () => {
        console.log('Remove request make friend to: ', userInfo.user_id)
        const friendId = userInfo.user_id
        try {
            const res = await FriendService.removeRequestMakeFriend(friendId)
            console.log(res)
            onReload(NO_FRIEND)

            //Notification
            socket.emit('notification:makeFriend', {
                from: user.username,
                to: userInfo.user_name,
                type: 0,
            })
        } catch (error) {
            console.log('Error in sendRequestMakeFriend')
        }
    }

    const handleRemoveFriend = async () => {
        try {
            const friendId = userInfo.user_id
            const res = await FriendService.removeFriend(friendId)
            console.log(res)
            onReload(NO_FRIEND)

            //Notification
           
            socket.emit('notification:friend', {
                from: user.username,
                to: userInfo.user_name,
                type: 0,
            })
        } catch (error) {
            console.log('Error in acceptRequestMakeFriend')
        }
    }

    const handleAccept = async () => {
        try {
            const friendId = userInfo.user_id
            const res = await FriendService.acceptRequestMakeFriend(friendId)
            console.log(res)
            onReload(FRIEND)

            //Notification
            const fromUser = {
                user_id: user.id,
                user_name: user.username,
                user_avatar: user.avatar,
                user_fullname: user.user_fullname,
            }
            socket.emit('notification:friend', {
                from: fromUser,
                to: userInfo.user_name,
                type: 1,
            })
        } catch (error) {
            console.log('Error in acceptRequestMakeFriend')
        }
    }

    const handleRefuse = async () => {
        try {
            const friendId = userInfo.user_id
            const res = await FriendService.refuseRequestMakeFriend(friendId)
            console.log(res)
            onReload(NO_FRIEND)
        } catch (error) {
            console.log('Error in refuseRequestMakeFriend')
        }
    }

    return (
        <div className="w-full flex flex-col md:flex-row text-xl items-center justify-around  mb-3 border-b-[2px] solid gray">
            <div className="w-full md:w-1/2 h-full  flex justify-center items-center">
                <div className="w-20 h-20 md:w-[200px] md:h-[200px] border-2 border-pink-500 rounded-full">
                    {/* <img
                        src={`${HOST}/static/avatar/${userInfo?.user_avatar || 'avatar.png'}`}
                        alt=""
                        className="w-full h-full rounded-full  object-cover"
                    /> */}
                    <AvatarImage filename={userInfo?.user_avatar} />
                </div>
            </div>
            <div className="w-full md:w-1/2 mb-3">
                <div className="flex mb-3  items-center justify-center md:justify-start">
                    <div className="font-medium text-2xl">
                        <span>@{userInfo?.user_name || userInfo?.username}</span>
                    </div>
                    <div className="pl-10 ">
                        {/* Aready make friend */}
                        {userInfo?.friendship === FRIEND && (
                            <div className="border p-1 px-2 rounded-md bg-white cursor-pointer relative">
                                <div className="peer">
                                    <FontAwesomeIcon className="text-blue-600" icon={faCheck} />
                                    <span className="pl-2">Bạn bè</span>
                                </div>
                                <div className="absolute  text-[14px] bg-white top-full -left-0 py-2 px-3 rounded-lg border hidden peer-hover:block hover:block -mt-1">
                                    <ul>
                                        <li onClick={handleRemoveFriend}>Hủy kết bạn</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        {userInfo?.friendship === NO_FRIEND && (
                            <div className="border p-1 px-2 rounded-md bg-blue-400 cursor-pointer relative shadow-lg">
                                <div className="peer" onClick={handleSendRequestFriend}>
                                    <FontAwesomeIcon className="text-white" icon={faPaperPlane} />
                                    <span className="pl-2 text-white text-sm">Thêm bạn bè</span>
                                </div>
                            </div>
                        )}

                        {/* has send request of making friend */}
                        {userInfo?.friendship === INVITATION && (
                            <div className="border p-1 px-2 rounded-md bg-purple-500 cursor-pointer relative shadow-lg">
                                <div className="peer">
                                    <FontAwesomeIcon className="text-white" icon={faPaperPlane} />
                                    <span className="pl-2 text-white text-sm">Đã gửi lời mời</span>
                                </div>
                                <div className="absolute  text-[14px] bg-white top-full -left-0 py-2 px-3 rounded-lg border hidden peer-hover:block hover:block -mt-1">
                                    <ul>
                                        <li onClick={handleRemoveRequestFriend}>Xoá lời mời</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        {/* has invitaion from a friend */}
                        {userInfo?.friendship === INVITE_ME && (
                            <div className="border p-1 px-2 rounded-md bg-purple-500 cursor-pointer relative shadow-lg">
                                <div className="peer">
                                    <FontAwesomeIcon className="text-white" icon={faPaperPlane} />
                                    <span className="pl-2 text-white text-sm">Lời mời kết bạn</span>
                                </div>
                                <div className="absolute  text-[14px] bg-white top-full -left-0 py-2 px-3 rounded-lg border hidden peer-hover:block hover:block -mt-1">
                                    <ul>
                                        <li
                                            onClick={handleAccept}
                                            className="font-medium text-blue-600"
                                        >
                                            Chấp nhập
                                        </li>
                                        <hr></hr>
                                        <li onClick={handleRefuse} className=" text-red-600">
                                            Xóa
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {userInfo?.friendship === SELF && (
                            <NavLink className="" to={'/account'}>
                                <button
                                    type="submit"
                                    className=" border-2 px-2 text-sm border-gray-100 focus:outline-none bg-purple-600 p-1 text-white font-bold tracking-wider rounded-lg focus:border-gray-700 hover:bg-purple-700"
                                >
                                    Chỉnh sửa
                                </button>
                            </NavLink>
                        )}
                    </div>
                </div>
                <div className="flex mb-3 gap-5 text-[15px]">
                    <div className="">
                        <span className="font-medium mr-2">{userInfo.post_total}</span>
                        <span>Bài đăng</span>
                    </div>

                    <div className="">
                        <span className="font-medium mr-2">{userInfo.friend_total}</span>
                        <span>Bạn bè</span>
                    </div>
                </div>
                <div className="nickname">
                    <span className="font-bold">{userInfo?.user_fullname}</span>
                    <div className="my-2">
                        <span className="text-gray-500 ">Bio</span>
                        <p className="text-[15px]">{userInfo.user_description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDescription
