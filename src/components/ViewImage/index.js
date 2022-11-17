import ImageSlider from '../../pages/Comment/components/ImageSlider'
import Modal from '../Modal'
import cls from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import FirebaseImage from '../FirebaseImage'

const HOST = process.env.REACT_APP_IMAGE_HOST
const ASPECT_16_9 = 2
const ASPECT_1_1 = 0
const ASPECT_4_5 = 1
function ViewImage({ imageList, aspect, close }) {
    const [current, setCurrent] = useState(0)

    return (
        <Modal close={close} acceptCloseNotBtn>
            <div className="flex justify-center items-center bg-black/80 z-50 rounded-md overflow-hidden">
                <div
                    className={cls(' m-7 mb-0 relative', {
                        'max-w-[500px]': aspect === ASPECT_1_1,
                        'max-w-[450px]': aspect === ASPECT_4_5,
                        'w-[750px]': aspect === ASPECT_16_9,
                    })}
                >
                    {imageList.map((image, index) => (
                        <FirebaseImage key={image.image_id} filename={image.image_url} current={current} index={index}/>
                        // <img
                        //     key={index}
                        //     className={cls(
                        //         'w-full visible opacity-100 transition ease-in duration-300',
                        //         {
                        //             invisible: index !== current,
                        //             'h-0': index !== current,
                        //             'opacity-50': index !== current,
                        //         }
                        //     )}
                        //     src={`${HOST}${image.image_url}`}
                        //     alt=""
                        //     draggable={false}
                        // />
                    ))}

                    <div
                        className={cls(
                            'absolute left-0 top-1/2 -translate-x-1/2 text-3xl w-8 h-8 bg-slate-200 flex items-center justify-center rounded-full cursor-pointer',
                            {
                                hidden: current === 0,
                            }
                        )}
                        onClick={() => setCurrent(current - 1)}
                    >
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </div>
                    <div
                        className={cls(
                            'absolute right-0 top-1/2 translate-x-1/2 text-3xl w-8 h-8 bg-slate-200/80 flex items-center justify-center rounded-full cursor-pointer',
                            {
                                hidden: current === imageList.length - 1,
                            }
                        )}
                        onClick={() => setCurrent(current + 1)}
                    >
                        <FontAwesomeIcon icon={faAngleRight} />
                    </div>
                    <div className="flex justify-center items-center my-4 z-0 pointer-events-none">
                        {imageList.map((image, index) => (
                            <span
                                key={index}
                                className={cls('w-2 h-2 mx-[3px] rounded-full', {
                                    'bg-blue-500': index === current,
                                    'bg-gray-500': index !== current,
                                })}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ViewImage
