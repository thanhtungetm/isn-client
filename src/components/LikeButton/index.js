import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import cls from 'classnames'
import ReactionService from '../../services/ReactionService'
import { useSelector } from 'react-redux'

const LIKE  = 0
const UNLIKE = 1

function LikeButton({ likeStatus, postId, onUpdateLike, username, myself }) {
    // const [status, setStatus] = useState(likeStatus)
    const socket = useSelector(state=>state.socket)
    const [loading, setLoading] = useState(false)

    const like = async () => {
        if(loading) return
        try {
            setLoading(true)
            await ReactionService.like(postId)
            setLoading(false)
            onUpdateLike(1)
            socket.current.emit("notification:like",{postId, from: myself, to: username, type: LIKE})
        } catch (error) {
            console.log("Error Like", error);
        }
    }
    const unlike = async () => {
        if(loading) return
        try {
            setLoading(true)
            await ReactionService.unlike(postId)
            setLoading(false)
            onUpdateLike(-1)
            socket.current.emit("notification:like",{postId, from: myself, to: username, type: UNLIKE})
        } catch (error) {
            console.log("Error UnLike", error);
        }
    }

    const handleToogleLike = () => {
        likeStatus ? unlike() : like()
    }
    return (
        <FontAwesomeIcon
            onClick={handleToogleLike}
            className={cls('cursor-pointer', { 'text-red-600': likeStatus })}
            icon={faHeart}
        />
    )
}

export default LikeButton
