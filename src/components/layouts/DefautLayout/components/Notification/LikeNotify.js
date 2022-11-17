import { NavLink, useNavigate } from 'react-router-dom'
import AvatarNotify from './AvatarNotify'
import cls from 'classnames'
import NotificationService from '../../../../../services/NotificationService'
function LikeNotify({ noti, onGoto }) {
    const navigate = useNavigate()

    const updateNotifyStatus = async () => {
        try {
            const data = { type: noti.type, userId: noti.user_id, postId: noti.post_id }
            // console.log("Data", data);
            const res = await NotificationService.updateNotifyStatus(data)
            console.log('Update notify status', res)
        } catch (error) {}
    }

    const gotoDetailPage = async () => {
        await updateNotifyStatus()
        onGoto()
        // navigate(`/detail/${noti.post_id}`)
        navigate(`/detail/${noti.post_id}`, {state: null})
    }
    return (
        <li
            className={cls(
                'bg-gray-200 text-md leading-normal py-2 hover:bg-gray-100 cursor-pointer px-1 border-r-4 border-r-yellow-400',
                {
                    '!bg-white': !noti.is_seen,
                }
            )}
        >
            <div className="flex items-center gap-1">
                <AvatarNotify imageUrl={noti.user_avatar} />
                <span onClick={gotoDetailPage}>
                    <span className="font-medium">@{noti.user_name}</span> đã thích một bài đăng của
                    bạn!
                </span>
            </div>
        </li>
    )
}

export default LikeNotify
