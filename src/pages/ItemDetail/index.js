import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import PostItem from '../../components/PostItem'
import ViewImage from '../../components/ViewImage'
import PostService from '../../services/PostService'
import Comment from '../Comment'

// const post = {
//     "post_id": 39,
//     "user_name": "lttung2301",
//     "user_fullname": "Thanh Tung",
//     "aspect": 1,
//     "created_at": "2022-10-08T12:41:50.000Z",
//     "total_comments": 0,
//     "comments": [],
//     "total_likes": 0,
//     "likes": [],
//     "images": [
//         {
//             "image_id": 73,
//             "image_url": "/static/8-10-2022/1665232910528.png"
//         },
//         {
//             "image_id": 74,
//             "image_url": "/static/8-10-2022/1665232910532.png"
//         }
//     ]
// }

function ItemDetail() {
    const [openView, setOpenView] = useState(false)
    const [commentId, setCommentId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const { id } = useParams()

    const location = useLocation()

    const [post, setPost] = useState(null)

    const handleOpenView = () => {
        setOpenView(true)
    }

    useEffect(()=>{
        if(location.state)
            setCommentId(location.state.commentId)
        else
            setCommentId(null)
    },[location])

    const fetchPost = async (postId) => {
        try {
            setLoading(true)
            const res = await PostService.getById(postId)
            console.log(res)
            setLoading(false)
            setError(false)
            setPost(res.data)
        } catch (error) {
            setLoading(false)
            setError(true)
        }
    }

    useEffect(() => {
        fetchPost(id)
    }, [id])

    return (
        <div className="w-4/5 md:w-1/2 lg:w-1/3 mx-auto ">
            {!loading &&
                (error ? (
                    <div className='text-red-500'>Khong tim thay bai post</div>
                ) : (
                    <>
                        {post && (
                            <PostItem
                                postData={post}
                                openView={() => handleOpenView(post)}
                                gotoId = {commentId}
                            />
                        )}

                        
                        {openView && (
                            <ViewImage
                                imageList={post?.images}
                                aspect={post.aspect}
                                close={() => setOpenView(false)}
                            />
                        )}
                    </>
                ))}
            {loading && (
                <div className="flex justify-center">
                    <span className="block w-24 h-24 border-2 border-t-transparent rounded-full animate-spin"></span>
                </div>
            )}
        </div>
    )
}

export default ItemDetail
