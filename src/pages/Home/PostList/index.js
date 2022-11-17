import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openComment, setReload } from '../../../app/slices/modalSlice'
import PostItem from '../../../components/PostItem'
import ViewImage from '../../../components/ViewImage'
import PostService from '../../../services/PostService'
import Comment from '../../Comment'

function PostList() {
    // const comment = useSelector((state) => state.modal.comment)
    const reload = useSelector((state) => state.modal.reload)
    const socket = useSelector(state => state.socket)

    const dispatch = useDispatch()

    const [list, setList] = useState([])
    const [current, setCurrent] = useState(null)

    const [openView, setOpenView] = useState(false)
    const [newPost, setNewPost] = useState(false)

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const getPosts = async () => {
        try {
            setLoading(true)
            const res = await PostService.get()
            console.log('All post:', res)
            setList(res.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setErrorMessage(error.message)
        }
    }
    useEffect(() => {
        getPosts()
    }, [])

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

    useEffect(()=>{
        if(!socket.current) return
        socket.current.on("notification:broadcast:create", (payload)=>{
            setNewPost(true)
            setTimeout(()=>setNewPost(false), 3000)
        })
    },[socket])

    return (
        <>
            {!loading&&<ul className="w-full md:w-3/5  mx-5 relative">
                {newPost&&<div className="fixed bottom-0 mb-2 left-1/2 text-xl text-blue-800 z-50">
                    <div className="bg-blue-500 w-full py-1 px-4 text-white rounded-md cursor-pointer"
                    onClick={handleGetNewPostList}>
                        Có bài đăng mới <FontAwesomeIcon icon={faRotateRight} />
                    </div>
                </div>}

                {list.map((post) => (
                    <PostItem
                        key={post['post_id']}
                        postData={post}
                        openView={() => handleOpenView(post)}
                    />
                ))}
            </ul>}

            {loading && (
                <div className="w-full md:w-3/5  mx-5 relative flex justify-center items-center">
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
