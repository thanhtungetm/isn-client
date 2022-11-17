import { useNavigate } from "react-router-dom"
import AvatarImage from '../../components/AvatarImage'

const HOST = process.env.REACT_APP_IMAGE_HOST
function FriendItem({userInfo, onRemoveFriend}) {

    const navigate = useNavigate()

    const handleRemoveFriend = ()=>{
        onRemoveFriend(userInfo.user_id, userInfo.user_name)
    }

    const gotoProfile =  ()=>{
        navigate(`/profile/${userInfo.user_name}`)
    }

    return (
        <li className=""
            
        >
            <div className="flex justify-between px-4 py-3">
                <div className="flex gap-2 items-center cursor-pointer"
                onClick={gotoProfile}
                >
                    <div className="w-14 h-14 ">
                        <AvatarImage filename={userInfo.user_avatar} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">@{userInfo?.user_name}</span>
                        <span className="text-gray-400">{userInfo?.user_fullname}</span>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <span 
                    onClick={handleRemoveFriend}
                    className="px-3 py-1 bg-white rounded-lg border cursor-pointer hover:bg-blue-500 hover:text-white transition-all  ">
                        Xoá bạn
                    </span>
                </div>
            </div>
        </li>
    )
}

export default FriendItem
