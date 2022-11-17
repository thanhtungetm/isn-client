import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cls from 'classnames'

function Notification({ loading, message }) {
    return (
        <div className={cls('w-[430px]  h-[550px] flex flex-col')}>
            <div className="flex-shrink-0 px-5 flex justify-center items-center py-2 font-medium border-b-gray-300 border-b-[1px]">
                <span>Đăng ảnh</span>
            </div>

            <div className="grow  flex justify-center items-center">
                {loading ? (
                    <div className="text-2xl flex flex-col items-center">
                        <div className="mb-2 border-2 border-blue-600 border-t-transparent animate-spin w-28 h-28 flex items-center justify-center text-4xl rounded-full">
                            
                        </div>
                        <p></p>
                    </div>
                ) : (
                    <>
                        {!message && (
                            <div className="text-2xl flex flex-col items-center">
                                <div className="mb-2 border-2 border-blue-600 w-28 h-28 flex items-center justify-center text-4xl rounded-full">
                                    <FontAwesomeIcon className="text-blue-600" icon={faCheck} />
                                </div>
                                <p>Bạn đã đăng thành công!</p>
                            </div>
                        )}
                        {message && (
                            <div className="text-2xl flex flex-col items-center">
                                <div className="mb-2 border-2 border-red-600 w-28 h-28 flex items-center justify-center text-4xl rounded-full">
                                    <FontAwesomeIcon className="text-red-600" icon={faTimes} />
                                </div>
                                <p>Có lỗi xảy ra vui lòng thử lại!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Notification
