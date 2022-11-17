import avt from '../../assets/avt_thai.jpg'
import Modal from '../../components/Modal'

import {
    faComment,
    faHeart,
    faSave,
    faShare,
    faTimes,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cls from 'classnames'
import styles from './Comment.module.css'
// import j1 from '../../assets/images/j_1.jpg'

import { useDispatch, useSelector } from 'react-redux'
import CommentInput from '../../components/CommentInput'
import CommentItem from './components/CommentItem'
import ImageSlider from './components/ImageSlider'
import { useEffect, useRef, useState } from 'react'
import CommentService from '../../services/CommentService'
import LikeButton from '../../components/LikeButton'
import AvatarImage from '../../components/AvatarImage'

const HOST = process.env.REACT_APP_IMAGE_HOST
function Comment({ postInfo, closeComment, likeStatus, onUpdateLike, gotoId }) {
    const { images: imageList, post_id: postId, user_avatar: avatar } = postInfo

    const user = useSelector((state) => state.auth.user)
    const socket = useSelector((state) => state.socket.current)

    const commentBox = useRef(null)

    const [replyData, setReplyData] = useState(null)
    const [commentList, setCommentList] = useState([])
    const [loading, setLoading] = useState(false)

    const handleOnReply = (data) => {
        setReplyData(data)
    }

    const handleUpdateCommentList = (comment) => {
        setCommentList((preList) => {
            if (comment.reply_comment_id) {
                const commentAddReply = preList.find(
                    (cmt) => cmt.comment_id === comment.reply_comment_id
                )
                commentAddReply.new = true
                commentAddReply.replies = [comment, ...commentAddReply.replies]
                return [...preList]
            }
            return [comment, ...preList]
        })
        setReplyData(null)
        if (!comment.reply_comment_id) commentBox.current.scrollTop = 0
    }
    const handleUpdateRealtime = (comment) => {
        setCommentList((preList) => {
            if (comment.reply_comment_id) {
                const commentAddReply = preList.find(
                    (cmt) => cmt.comment_id === comment.reply_comment_id
                )
                commentAddReply.replies = [comment, ...commentAddReply.replies]
                return [...preList]
            }
            return [comment, ...preList]
        })
    }

    const fetchCommentList = async () => {
        try {
            setLoading(true)
            const res = await CommentService.get(postId)
            setLoading(false)
            console.log('Comment List:', res.data)
            setCommentList(res.data)
        } catch (error) {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCommentList()
    }, [])

    useEffect(() => {
        if (socket) {
            socket.on('notification:broadcast:comment', (payload) => {
                console.log('Broadcast comment:', payload, postId)
                if (payload.postId !== postId) return
                handleUpdateRealtime(payload.data)
            })
        }
        return () => {
            socket.off('notification:broadcast:comment')
        }
    }, [socket])

    return (
        <Modal close={() => closeComment()}>
            <div className="flex bg-white z-50 w-full h-[540px] mx-5 md:mx-32 lg:mx-48 rounded-xl overflow-hidden">
                <ImageSlider imageList={imageList} />

                <div className="w-full sm:w-3/5 p-3 flex flex-col">
                    {/* Header info */}
                    <div className="h-14 flex items-center gap-3 font-medium border-b -mx-3 px-3 pb-3 flex-shrink-0">
                        <div className="w-10 h-10 ">
                            <AvatarImage filename={avatar} />
                        </div>
                        <div className="flex flex-col justify-center px-2">
                            <span className="font-bold leading-none text-md">
                                @{postInfo.user_name}
                            </span>
                            <span className="leading-normal text-gray-400 text-sm">
                                {postInfo.user_fullname}
                            </span>
                        </div>
                    </div>

                    <div
                        ref={commentBox}
                        className={cls(
                            'grow overflow-hidden overflow-y-auto',
                            styles['comment_list']
                        )}
                    >
                        {/* Comment list */}
                        {!loading && (
                            <div className="pr-[17px] box-content">
                                <ul className="w-full">
                                    {commentList.map((comment) => (
                                        <CommentItem
                                            key={comment.comment_id}
                                            comment={comment}
                                            onReply={handleOnReply}
                                            gotoId={gotoId}
                                        />
                                    ))}
                                </ul>
                            </div>
                        )}
                        {loading && (
                            <div className="flex justify-center h-full items-center">
                                <span className="block w-16 h-16 border-2 border-t-transparent animate-spin rounded-full"></span>
                            </div>
                        )}
                    </div>
                    <div className="-mx-3">
                        <div className="border-y  p-3">
                            <div className="flex justify-between items-center text-2xl pb-1">
                                <div className="flex gap-5">
                                    <LikeButton
                                        likeStatus={likeStatus}
                                        postId={postId}
                                        onUpdateLike={onUpdateLike}
                                        myself={user.username}
                                        username={postInfo.user_name}
                                    />
                                    {/* <FontAwesomeIcon icon={faComment} /> */}
                                    <FontAwesomeIcon className="cursor-pointer" icon={faShare} />
                                </div>
                                <div className="">
                                    <FontAwesomeIcon className="cursor-pointer" icon={faSave} />{' '}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-medium">{postInfo.likeData.total} likes</p>
                                <p className="text-xs text-gray-500">{postInfo.time_distance}</p>
                            </div>
                        </div>
                        {replyData && (
                            <div className="px-3 text-violet-400 font-medium flex items-center">
                                <span>
                                    Trả lời{' '}
                                    <span className="text-violet-600">
                                        {replyData.user_name === user.username
                                            ? 'chính bạn'
                                            : `@${replyData.user_name}`}
                                    </span>
                                </span>
                                <span
                                    className="pl-1 cursor-pointer text-gray-700 "
                                    onClick={() => setReplyData(null)}
                                >
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </span>
                            </div>
                        )}
                        <div className="p-3 pb-0 flex justify-between items-center">
                            <CommentInput
                                postId={postId}
                                replyData={replyData}
                                username={postInfo.user_name}
                                onUpdateCommentList={handleUpdateCommentList}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default Comment
