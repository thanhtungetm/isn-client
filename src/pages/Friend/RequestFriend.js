import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import AvatarImage from '../../components/AvatarImage'

const HOST = process.env.REACT_APP_IMAGE_HOST
function RequestFriend({ info, onRefuse, onAccept }) {
    const navigate = useNavigate()
    const handleRefuse = () => {
        onRefuse(info.user_id, info.user_name)
    }
    const handleAccept = () => {
        onAccept(info.user_id, info.user_name)
    }

    const gotoProfile = () => {
        navigate(`/profile/${info.user_name}`)
    }

    return (
        <li className="">
            <div className="flex justify-between px-4 py-3">
                <div className="flex gap-2 items-center cursor-pointer" onClick={gotoProfile}>
                    <div className="w-14 h-14 flex-shrink-0">
                        <AvatarImage filename={info.user_avatar} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">@{info?.user_name}</span>
                        <span className="text-gray-400 text-xs">{info?.user_fullname}</span>
                    </div>
                </div>
                <div className="flex items-center justify-center text-sm gap-1">
                    <span
                        onClick={handleAccept}
                        className="px-3 py-1 bg-blue-400 text-white rounded-full border cursor-pointer hover:bg-blue-500 hover:text-white transition-all  "
                    >
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span
                        onClick={handleRefuse}
                        className="px-3 py-1 bg-red-500 text-white rounded-full border cursor-pointer hover:bg-blue-500 hover:text-white transition-all  "
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </div>
            </div>
        </li>
    )
}

export default RequestFriend
