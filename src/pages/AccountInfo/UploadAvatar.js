import { useRef } from 'react'
import AvatarImage from '../../components/AvatarImage'
const HOST = process.env.REACT_APP_IMAGE_HOST
function UploadAvatar({ fileRef, username, avatar }) {
    const imgRef = useRef(null)
    const handleChangeAvatar = (e) => {
        console.log(e.target.files)
        const [file] = e.target.files

        if (file) {
            imgRef.current.src = URL.createObjectURL(file)
        }
    }

    return (
        <div className="flex justify-between mt-5 w-full">
            <div className="w-[40%] flex justify-end">
                <div className="w-16 h-16">
                    <AvatarImage imageRef={imgRef} filename={avatar ? avatar: 'avatar/avatar.png'} />
                </div>
            </div>
            <div className="flex flex-col justify-center w-[55%]  ml-2">
                <span className="text-xl font-bold">@{username}</span>
                <label htmlFor="file" className="text-cyan-600 cursor-pointer">
                    Cập nhật ảnh đại diện{' '}
                </label>
                <input
                    ref={fileRef}
                    name="avatar"
                    onChange={handleChangeAvatar}
                    id="file"
                    type="file"
                    hidden
                />
            </div>
        </div>
    )
}

export default UploadAvatar
