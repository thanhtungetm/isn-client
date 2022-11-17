import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'
import helper from '../../utils/helper'

function Modal({ close, children, acceptCloseNotBtn }) {

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])

    return (
        <div className="fixed flex justify-center items-center inset-0 z-50 select-none transition-all overflow-y-scroll ">
            {/* overplay */}
            <div
                className="flex justify-end bg-black/40 fixed items-start inset-0 z-40"
                onClick={() => {
                    if (acceptCloseNotBtn) close()
                }}
            >
                <div className="p-4 text-2xl text-white cursor-pointer" onClick={close}>
                    <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
                </div>
            </div>
            {children}
        </div>
    )
}

export default Modal
