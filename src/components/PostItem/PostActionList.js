import { faCheck, faEllipsis, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import Modal from '../Modal'
import DeleteModal from './DeleteModal'

function PostActionList() {
    const [open, setOpen] = useState(false)
    const [openRemove, setOpenRemove] = useState(false)

    return (
        <div className="text-2xl  relative">
            <FontAwesomeIcon
                className="cursor-pointer"
                icon={faEllipsis}
                onClick={() => setOpen(true)}
            />

            {open && (
                <>
                    <ul className="absolute  top-full right-0 text-base z-20 bg-white px-3 py-2 rounded-lg w-24 border font-medium">
                        <li className="cursor-pointer border-b border-b-gray-300 py-1 hover:bg-gray-200 hover:-mx-3 hover:px-3 transition-all">
                            Báo cáo
                        </li>
                        <li
                            className="cursor-pointer border-b border-b-gray-300 py-1 hover:bg-gray-200 hover:-mx-3 hover:px-3 transition-all"
                            onClick={() => {
                                setOpenRemove(true)
                                setOpen(false)
                            }}
                        >
                            Xóa
                        </li>
                        <li className="cursor-pointer hover:bg-gray-200 hover:-mx-3 hover:px-3 transition-all py-1">
                            Ẩn
                        </li>
                    </ul>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
                </>
            )}

            {openRemove && <DeleteModal onClose={() => setOpenRemove(false)} />}
        </div>
    )
}

export default PostActionList
