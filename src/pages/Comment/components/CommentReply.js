import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AvatarImage from '../../../components/AvatarImage'

const HOST = process.env.REACT_APP_IMAGE_HOST
function CommentReply({ onReply, comment, gotoId }) {
    const replyBox = useRef(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (gotoId === comment.comment_id)
            replyBox.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, [gotoId])

    const handleClickMention = (e) => {
        // console.log(e.target);
        if (e.target.classList.contains('accessible')) {
            const link = e.target.getAttribute('data-link')
            console.log(link)
            navigate(link)
        }
    }

    return (
        <div className=" flex gap-1 my-3" ref={replyBox}>
            <div className="w-2/12 md:w-1/12 shrink-0">
                <div className="rounded-full w-9 h-9 overflow-hidden">
                    <AvatarImage filename={comment.user_avatar} />
                </div>
            </div>
            <div className="w-10/12 grow">
                <div>
                    <span className="font-bold pr-1">@{comment.user_name}</span>
                    <span
                        className="break-words"
                        onClick={handleClickMention}
                        dangerouslySetInnerHTML={{ __html: comment.comment_content }}
                    ></span>
                </div>
                <div className="mt-2 font-medium text-gray-400">
                    <span className="pr-3">{comment.time_distance}</span>
                    <span className="cursor-pointer" onClick={() => onReply(comment)}>
                        Reply
                    </span>
                </div>
            </div>
        </div>
    )
}

export default CommentReply
