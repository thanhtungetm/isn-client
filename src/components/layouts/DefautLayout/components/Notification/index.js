import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import NotificationService from '../../../../../services/NotificationService'
import cls from 'classnames'
import { NavLink } from 'react-router-dom'
import MentionNotify from './MentionNotify'
import LikeNotify from './LikeNotify'
import style from './Notification.module.css'
import { useSelector } from 'react-redux'

const MENTION = 0
const LIKE = 1

const MENTION_NOTIFY = 2
const COMMENT_NOTIFY = 3
const HOST = process.env.REACT_APP_IMAGE_HOST

function Notification() {
    const [notificationList, setNotificationList] = useState([])

    const soundRef = useRef(null)

    const [status, setStatus] = useState({ open: false, newNotification: false })
    const [likeNotify, setLikeNotify] = useState({ show: false, username: '' })
    const [commentNotify, setCommentNotify] = useState({ show: false, username: '' })
    const [mentionNotify, setMentionNotify] = useState({ show: false, username: '' })

    const socket = useSelector((state) => state.socket.current)

    const fetchNotification = async (frist) => {
        try {
            const res = await NotificationService.getAll()
            console.log('Notification:', res)
            const newNotify = res.data.some((item) => item.is_seen === 0)
            console.log('newNotifyStatus', newNotify)
            setStatus((status) => ({ ...status, newNotification: newNotify }))

            setNotificationList(res.data)
        } catch (error) {}
    }

    const closeNotification = () => {
        setStatus((status) => ({ ...status, open: false }))
        fetchNotification()
    }

    useEffect(() => {
        fetchNotification(true)
    }, [])

    useEffect(() => {
        if (!socket) return

        socket.on('notification:like', (payload) => {
            console.log('Notify LIKE: ', payload)
            setStatus((status) => {
                handleGetNotification(status.open)
                return status
            })
            if (payload.number === -1) return

            soundRef.current.play()
            setStatus((preStatus) => ({ ...preStatus, newNotification: true }))

            setLikeNotify({ show: true, username: payload.from })
            setTimeout(() => setLikeNotify({ show: false, username: '' }), 2500)
        })
        socket.on('notification:comment', (payload) => {
            console.log('Notify COMMENT:', payload)
            setStatus((status) => {
                handleGetNotification(status.open)
                return status
            })
            setStatus((preStatus) => ({ ...preStatus, newNotification: true }))

            soundRef.current.play()
            if (payload.type === COMMENT_NOTIFY) {
                setCommentNotify({ show: true, username: payload.from })
                setTimeout(() => setCommentNotify({ show: false, username: '' }), 2500)
            }
            if (payload.type === MENTION_NOTIFY) {
                setMentionNotify({ show: true, username: payload.from })
                setTimeout(() => setMentionNotify({ show: false, username: '' }), 2500)
            }
        })

        return () => {
            socket.off('notification:like')
            socket.off('notification:comment')
        }
    }, [socket])

    const handleOpen = () => {
        // updateNotifyStatus()
        setStatus({ ...status, open: true })
        // setStatus((preStatus) => ({ ...preStatus, newNotification: false }))
        fetchNotification()
    }
    const handleGetNotification = (open) => {
        console.log('Open', open)
        if (open) {
            // setStatus((preStatus) => ({ ...preStatus, newNotification: false }))
            fetchNotification()
        }
    }

    return (
        <div className="relative">
            <span className="peer cursor-pointer">
                <FontAwesomeIcon icon={faBell} onClick={handleOpen} />
            </span>
            <audio ref={soundRef} src={`${HOST}/static/sound/chuong.mp3`} hidden />

            <div className="fixed bottom-0 mr-5 mb-2 right-0 text-xl text-blue-800 z-50">
                {likeNotify.show && (
                    <div className="bg-white w-full py-1 px-4 text-black rounded-md  cursor-default border border-gray-400 relative">
                        <span>
                            <span className="text-blue-800 font-medium">
                                @{likeNotify.username}
                            </span>{' '}
                            thích bài đăng của bạn!
                        </span>
                        <span
                            className="absolute -mr-2 right-0 bottom-full -mb-4 bg-white text-red-500 border border-red-500 w-5 h-5 flex justify-center text-sm items-center rounded-full cursor-pointer"
                            onClick={() => setLikeNotify({ show: false, username: '' })}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </div>
                )}
                {commentNotify.show && (
                    <div className="mt-1 bg-white w-full py-1 px-4 text-black rounded-md  cursor-default border border-gray-400 relative z-50">
                        <span>
                            <span className="text-blue-800 font-medium">
                                @{commentNotify.username}
                            </span>{' '}
                            đã bình luận bài đăng của bạn!
                        </span>
                        <span
                            className="absolute -mr-2 right-0 bottom-full -mb-4 bg-white text-red-500 border border-red-500 w-5 h-5 flex justify-center text-sm items-center rounded-full cursor-pointer"
                            onClick={() => setCommentNotify({ show: false, username: '' })}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </div>
                )}
                {mentionNotify.show && (
                    <div className="mt-1 bg-white w-full py-1 px-4 text-black rounded-md  cursor-default border border-gray-400 relative z-50">
                        <span>
                            <span className="text-blue-800 font-medium">
                                @{mentionNotify.username}
                            </span>{' '}
                            đã nhắc đến bạn!
                        </span>
                        <span
                            className="absolute -mr-2 right-0 bottom-full -mb-4 bg-white text-red-500 border border-red-500 w-5 h-5 flex justify-center text-sm items-center rounded-full cursor-pointer"
                            onClick={() => setMentionNotify({ show: false, username: '' })}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </div>
                )}
            </div>

            {/* List notify */}

            <div
                className={cls(
                    'bg-white  hidden transition-all  absolute w-80 md:w-96 right-0  border rounded-lg p-2 text-[15px] z-20',
                    { '!block': status.open }
                )}
            >
                <div className="border-b text-lg text-center pb-2 font-medium">Thông báo</div>
                <ul className={cls('max-h-[450px] overflow-y-auto', style['notification-list'])}>
                    {notificationList.map((noti, index) => {
                        if (noti.type === MENTION)
                            return (
                                <MentionNotify key={index} noti={noti} onGoto={closeNotification} />
                            )
                        if (noti.type === LIKE)
                            return <LikeNotify key={index} noti={noti} onGoto={closeNotification} />
                    })}
                </ul>
            </div>
            {status.open && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setStatus({ ...status, open: false })}
                ></div>
            )}
            {status.newNotification && (
                <div className="absolute right-0 top-0 w-3 h-3 bg-red-300  text-white text-center rounded-full flex justify-center items-center"></div>
            )}
        </div>
    )
}

export default Notification
