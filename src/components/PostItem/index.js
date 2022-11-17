import {
    faAngleLeft,
    faAngleRight,
    faComment,
    faEllipsis,
    faHeart,
    faSave,
    faShare,
    faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cls from 'classnames'
import { useEffect, useState } from 'react'
import avtThai from '../../assets/avt_thai.jpg'

import { useDispatch, useSelector } from 'react-redux'
import { openComment } from '../../app/slices/modalSlice'
import CommentInput from '../CommentInput'
import PostItemSlider from './ImageSilder'
import LikeButton from '../LikeButton'
import Comment from '../../pages/Comment'
import PostActionList from './PostActionList'
import { NavLink } from 'react-router-dom'
import AvatarImage from '../AvatarImage'
import DeleteModal from './DeleteModal'

function PostItem({ postData, openView, gotoId, onRemoved }) {
    const user = useSelector((state) => state.auth.user)
    const socket = useSelector((state) => state.socket)

    const [post, setPost] = useState(postData)
    const { images: imageList, comment, user_avatar: avatar, post_id: postId, likeData } = post
    // console.log(imageList)
    const dispatch = useDispatch()

    useEffect(() => {
        setPost(postData)
    }, [postData])

    const [openComment, setOpenComment] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const handleOpenComment = (post) => {
        setOpenComment(true)
    }
    const handleCloseComment = (post) => {
        setOpenComment(false)
    }

    const handleClickMention = (e) => {
        // console.log(e.target);
        if (e.target.classList.contains('accessible')) {
            const link = e.target.getAttribute('data-link')
            console.log(link)
        }
    }

    const handleUpdateLike = (number, anyone) => {
        setPost((prePost) => ({
            ...prePost,
            likeData: {
                hasLike: anyone ? prePost.likeData.hasLike : number === -1 ? false : true,
                total: prePost.likeData.total + number,
            },
        }))
    }

    useEffect(() => {
        socket.current.on('notification:broadcast:like', (payload) => {
            if (payload.postId === postId) {

                handleUpdateLike(payload.number, true)
            }
        })
    }, [])

    useEffect(()=>{
        if(gotoId)
            setOpenComment(true)
    },[gotoId])

    const handleRemove = ()=>{
        setOpenDeleteModal(true)
    }
    const handleOnRemoved = ()=>{
        onRemoved()
    }

    return (
        <div className="mb-3 bg-white">
            <div className="m-0 rounded-md  border">
                <div className="flex justify-between p-2 items-center">
                    <NavLink to={`/profile/${post?.user_name}`}>
                        <div className="flex items-center">
                            <div className={cls("w-10 h-10 ",{"border-2 border-blue-600 rounded-full": post?.user_name==='admin'})}>
                                <AvatarImage filename={avatar}/>
                            </div>
                            <div className="flex flex-col justify-center px-2">
                                <span className="font-bold leading-none text-md">
                                    @{postData.user_name}
                                </span>
                                <span className="leading-normal text-gray-400 text-sm">
                                    {postData.user_fullname}
                                </span>
                            </div>
                        </div>
                    </NavLink>
                    <PostActionList />
                </div>

                {/* ImageSilder */}
                <PostItemSlider imageList={imageList} openView={openView} />

                <div className="px-3 py-2 z-50">
                    <div className="flex items-center justify-between gap-5 text-2xl z-50">
                        <div className="flex gap-5 items-center">
                            <div>
                                <LikeButton
                                    likeStatus={likeData.hasLike}
                                    postId={postId}
                                    onUpdateLike={handleUpdateLike}
                                    myself={user.username}
                                    username={post.user_name}
                                />
                            </div>
                            <FontAwesomeIcon
                                className="cursor-pointer"
                                icon={faComment}
                                onClick={handleOpenComment}
                            />
                            <FontAwesomeIcon className="cursor-pointer" icon={faShare} />
                        </div>
                        <div className="flex items-center gap-4">
                            {/* <FontAwesomeIcon
                                className="cursor-pointer text-purple-600"
                                icon={faSave}
                            /> */}
                            {user.username === postData.user_name && (
                                <FontAwesomeIcon
                                    className="cursor-pointer text-red-500 text-xl"
                                    icon={faTrash}
                                    onClick={handleRemove}
                                />
                            )}
                        </div>
                    </div>

                    <div className="">
                        <div className="font-bold">
                            <span>{likeData.total}</span>
                            <span className="m-2 font-normal text-gray-500">Lượt thích</span>
                        </div>
                        {comment && (
                            <div>
                                <span className="font-bold">@{comment.user_name}</span>
                                <span
                                    className="m-2"
                                    onClick={handleClickMention}
                                    dangerouslySetInnerHTML={{ __html: comment.comment_content }}
                                ></span>
                            </div>
                        )}
                        <div className="text-gray-500">
                            <span className="cursor-pointer" onClick={handleOpenComment}>
                                Xem bình luận
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center border-t p-3">
                    <CommentInput postId={postId} username={post.user_name}/>
                </div>
            </div>

            {openDeleteModal && <DeleteModal postId={postId} images={imageList} onRemoved={handleOnRemoved} onClose={()=>setOpenDeleteModal(false)} />}

            {openComment && (
                <Comment
                    postInfo={post}
                    closeComment={handleCloseComment}
                    likeStatus={likeData.hasLike}
                    onUpdateLike={handleUpdateLike}
                    gotoId={gotoId}
                />
            )}
        </div>
    )
}

export default PostItem
