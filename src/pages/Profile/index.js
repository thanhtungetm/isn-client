import { faCheck, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import cls from 'classnames'
import PostList from '../Home/PostList'
import PostListGrid from './PostListGrid'
import UserService from '../../services/UserService'
import UserDescription from '../../components/UserDescription'
import FriendService from '../../services/FriendService'
import { useSelector } from 'react-redux'

const POST_TAB = 0
const SAVED_TAB = 1
const TAG_TAB = 2

const SELF = 0
const NO_FRIEND = 1
const INVITATION = 2
const FRIEND = 3
const INVITE_ME = 4

const HOST = process.env.REACT_APP_IMAGE_HOST

function Profile() {
    const params = useParams()
    const socket = useSelector((state) => state.socket.current)

    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const [tab, setTab] = useState(POST_TAB)

    const fetchUser = async (username) => {
        try {
            setLoading(true)
            const res = await UserService.get(username)
            setLoading(false)
            setUserInfo(res.data)
            console.log('UserInfo:', res)
        } catch (error) {
            setLoading(false)
            setMessage(error.message)
        }
    }
    useEffect(() => {
        const username = params.username
        fetchUser(username)
    }, [params])

    const reload = (friendship) => {
        setUserInfo((user) => ({ ...user, friendship: friendship }))
    }

    useEffect(() => {
        if (socket) {
            socket.on('notification:action:profile:makeFriend', (payload) => {
                console.log('Notify MakeFriend:', payload)
                if (payload.type === 1) reload(INVITE_ME)
                else reload(NO_FRIEND)
            })
            socket.on('notification:action:profile:friend', (payload) => {
                console.log('Notify MakeFriend:', payload)
                if (payload.type === 0) reload(NO_FRIEND)
                else reload(FRIEND)
            })


            return () => {
                socket.off('notification:action:profile:makeFriend')
                socket.off('notification:action:profile:friend')
            }
        }
    }, [socket])

    return (
        <div>
            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <span className="block w-20 h-20 animate-spin rounded-full border-[4px] border-t-transparent"></span>
                </div>
            ) : (
                <div>
                    {message ? (
                        <div className="flex justify-center items-center h-80">
                            Không tìm thấy người dùng!
                        </div>
                    ) : (
                        userInfo && (
                            <div className=" w-full mx-2 md:m-auto md:w-2/3 mt-1">
                                <UserDescription userInfo={userInfo} onReload={reload} />
                                <div className="w-4/5 md:w-2/4 pt-2 flex items-center gap-5 content-center m-auto text-sm  md:text-xl mb-6 justify-center border-b-[2px] solid gray">
                                    <span
                                        className={cls(' cursor-pointer', {
                                            'text-blue-600 font-medium': tab === POST_TAB,
                                        })}
                                        onClick={() => setTab(POST_TAB)}
                                    >
                                        Bài đăng
                                    </span>
                                    {userInfo?.friendship === SELF && (
                                        <>
                                            <span
                                                className={cls(' cursor-pointer', {
                                                    'text-blue-600 font-medium': tab === SAVED_TAB,
                                                })}
                                                onClick={() => setTab(SAVED_TAB)}
                                            >
                                                Đã lưu
                                            </span>
                                            <span
                                                className={cls(' cursor-pointer', {
                                                    'text-blue-600 font-medium': tab === TAG_TAB,
                                                })}
                                                onClick={() => setTab(TAG_TAB)}
                                            >
                                                Được gắn thẻ
                                            </span>
                                        </>
                                    )}
                                </div>

                                <div>
                                    {userInfo?.friendship === NO_FRIEND ||
                                    userInfo?.friendship === INVITATION ||
                                    userInfo?.friendship === INVITE_ME ? (
                                        <div className="flex justify-center">
                                            Chỉ khi là bạn bè bạn mới có thể xem ảnh của
                                            <span className="font-medium pl-1">
                                                {' '}
                                                @{userInfo.user_name}
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            {tab === POST_TAB && (
                                                <PostListGrid list={userInfo.postBriefData} />
                                            )}
                                            {tab === SAVED_TAB && (
                                                <div className="overflow-hidden text-gray-700  ">
                                                    <PostListGrid />
                                                </div>
                                            )}
                                            {tab === TAG_TAB && (
                                                <div className="overflow-hidden text-gray-700  ">
                                                    <PostListGrid />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}

export default Profile
