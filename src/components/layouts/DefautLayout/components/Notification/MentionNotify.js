import cls from 'classnames'
import { useNavigate } from 'react-router-dom'
import NotificationService from '../../../../../services/NotificationService'
import AvatarNotify from './AvatarNotify'

function MentionNotify({ noti, onGoto }) {
    const navigate = useNavigate()

    const updateNotifyStatus = async () => {
        try {
            const data = { type: noti.type, commentId: noti.comment_id }
            // console.log("Data", data);
            const res = await NotificationService.updateNotifyStatus(data)
            console.log('Update notify status', res)
        } catch (error) {}
    }

    const gotoDetailPage = async () => {
        await updateNotifyStatus()
        onGoto()
        navigate(`/detail/${noti.post_id}`, { state: { commentId: noti.comment_id } })
    }

    return (
        <li
            className={cls(
                'text-md leading-normal bg-gray-200 py-2 hover:bg-gray-100 cursor-pointer px-1 border-r-4 border-r-purple-500',
                {
                    '!bg-white': !noti.is_seen,
                }
            )}
        >
            <div className="flex items-center gap-1" onClick={onGoto}>
                <AvatarNotify imageUrl={noti.user_avatar} />
                <span onClick={gotoDetailPage}>
                    Bạn được <span className="font-medium">@{noti.user_name}</span> nhắc đến trong
                    một bình luận.
                </span>
            </div>
        </li>
    )
}

export default MentionNotify
