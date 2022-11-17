import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openComment, setReload } from '../../../app/slices/modalSlice'
import { updateFriendPostList, updatePublicPostList } from '../../../app/slices/postSlice'
import PostItem from '../../../components/PostItem'
import ViewImage from '../../../components/ViewImage'
import PostService from '../../../services/PostService'
import Comment from '../../Comment'

const PUBLIC = 0
const FRIEND = 1

function PostList({ mode }) {
    // const comment = useSelector((state) => state.modal.comment)
    const reload = useSelector((state) => state.modal.reload)
    const socket = useSelector((state) => state.socket)
    const publicList = useSelector((state) => state.post.public)
    const firendList = useSelector((state) => state.post.friend)

    const dispatch = useDispatch()

    // const [list, setList] = useState([])
    const [current, setCurrent] = useState(null)

    const [openView, setOpenView] = useState(false)
    const [newPost, setNewPost] = useState(false)

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const getPosts = async () => {
        try {
            (publicList.length === 0 || firendList.length===0)&& setLoading(true)
            if (!publicList === 0) return

            if(mode=== PUBLIC){
                const res = await PostService.get()
                console.log('All post:', res)
                dispatch(updatePublicPostList(res.data))
            }
            if(mode=== FRIEND){
                const res = await PostService.getFriend()
                console.log('Friend post:', res)
                dispatch(updateFriendPostList(res.data))
            }
            

            
            
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setErrorMessage(error.message)
        }
    }
    useEffect(() => {
        getPosts()
    }, [mode])

    useEffect(() => {
        if (reload) {
            getPosts()
            dispatch(setReload())
        }
    }, [reload])

    const handleOpenView = (post) => {
        setCurrent(post)
        setOpenView(true)
    }
    const handleGetNewPostList = async () => {
        await getPosts()
        setNewPost(false)
    }

    useEffect(() => {
        if (!socket.current) return
        socket.current.on('notification:broadcast:create', (payload) => {
            setNewPost(true)
            setTimeout(() => setNewPost(false), 3000)
        })
    }, [socket])

    const handleRemoved = (postId) => {
        if (mode === PUBLIC) {
            const newList = publicList.filter((item) => item.post_id !== postId)
            dispatch(updatePublicPostList(newList))
        }
        if (mode === FRIEND) {
            const newList = firendList.filter((item) => item.post_id !== postId)
            dispatch(updateFriendPostList(newList))
        }
    }

    return (
        <>
            {!loading && (
                <ul className=" relative">
                    {newPost && (
                        <div className="fixed bottom-0 mb-2 left-1/2 text-xl text-blue-800 z-50">
                            <div
                                className="bg-blue-500 w-full py-1 px-4 text-white rounded-md cursor-pointer"
                                onClick={handleGetNewPostList}
                            >
                                Có bài đăng mới <FontAwesomeIcon icon={faRotateRight} />
                            </div>
                        </div>
                    )}

                    {mode === PUBLIC &&
                        publicList.map((post) => (
                            <PostItem
                                key={post['post_id']}
                                postData={post}
                                openView={() => handleOpenView(post)}
                                onRemoved={() => handleRemoved(post['post_id'])}
                            />
                        ))}
                    {mode === FRIEND &&
                        firendList.map((post) => (
                            <PostItem
                                key={post['post_id']}
                                postData={post}
                                openView={() => handleOpenView(post)}
                                onRemoved={() => handleRemoved(post['post_id'])}
                            />
                        ))}
                </ul>
            )}

            {loading && (
                <div className="w-full md:w-3/5  mx-auto relative flex justify-center items-center">
                    <div className="w-20 h-20 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {openView && (
                <ViewImage
                    imageList={current?.images}
                    aspect={current.aspect}
                    close={() => setOpenView(false)}
                />
            )}
        </>
    )
}

export default PostList
