import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import PostService from '../../services/PostService'
import { removeImageFirebase } from '../../storage'
import Loading from '../Loading'

function DeleteModal({ postId, images, onClose, onRemoved }) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleRemove = async () => {
        try {
            setLoading(true)
            const res = await PostService.remove(postId)
            console.log('image to remove:', images)
            await removeImageFirebase(images)
            setLoading(false)
            setSuccess(true)
        } catch (error) {
            setLoading(false)
            setSuccess(false)
            console.log('Error remove post', error)
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-300/50 flex justify-center items-center z-50">
            <div className="text-lg text-center bg-white border-2 shadow-lg rounded-xl px-3 py-2 w-[415px]">
                <div>
                    <div className="border-b border-b-gray-500 mb-1 -mx-3 font-bold pb-2">
                        Cảnh báo
                    </div>
                    {!loading && !success && (
                        <div>
                            <span>
                                Xóa sẽ hết dữ liệu bao gồm <b>hình ảnh</b>, <b>bình luận</b>
                            </span>
                            <span className="block font-medium">Bạn đã chắc chắn ?</span>
                            <div className="flex gap-4 justify-center mt-2">
                                <span
                                    onClick={handleRemove}
                                    className="bg-blue-700 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-blue-500"
                                >
                                    <FontAwesomeIcon icon={faCheck} className="pr-1" />
                                    OK
                                </span>
                                <span
                                    className="bg-red-600 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-red-400"
                                    onClick={() => onClose()}
                                >
                                    <FontAwesomeIcon icon={faTimes} className="pr-1" />
                                    Hủy
                                </span>
                            </div>
                        </div>
                    )}
                    {success && !loading && (
                        <div>
                            <span className="block text-xl py-3">
                                <FontAwesomeIcon className="text-blue-500 pr-1" icon={faCheck} />
                                Đã xóa
                            </span>
                            <span className="block bg-blue-500 px-3 py-1 rounded-lg text-white" onClick={() => onRemoved()}>
                                OK
                            </span>
                        </div>
                    )}
                </div>
                {loading && <Loading />}
            </div>
        </div>
    )
}

export default DeleteModal
