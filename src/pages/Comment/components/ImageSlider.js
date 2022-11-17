import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import cls from 'classnames'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import FirebaseImage from '../../../components/FirebaseImage'

const HOST = process.env.REACT_APP_IMAGE_HOST

function ImageSlider({ imageList }) {
    const [current, setCurrent] = useState(0)
    
    return (
        <div className="hidden sm:flex w-2/5 items-center bg-black">
            <div className="relative w-full">
                <div className="relative">
                    {imageList.map((image, index) => (
                        <FirebaseImage key={image.image_id} filename={image.image_url} current={current} index={index}/>

                        // <img
                        // key={image.image_id}
                        //     className={cls(
                        //         'w-full h-full visible opacity-100 transition ease-in duration-300 cursor-zoom-in',
                        //         {
                        //             invisible: index !== current,
                        //             'h-0': index !== current,
                        //             'opacity-50': index !== current,
                        //         }
                        //     )}
                        //     src={`${HOST}${image.image_url}`}
                        //     alt="imge of new"
                        // />
                    ))}
                    <div className="flex gap-2 justify-center items-center absolute bottom-3 left-1/2 -translate-x-1/2">
                        {imageList.map((image, index) => (
                            <span
                                key={index}
                                className={cls('w-2 h-2 bg-slate-50 rounded-full', {
                                    'bg-blue-800': index === current,
                                })}
                            ></span>
                        ))}
                    </div>
                </div>

                <div
                    className={cls(
                        'absolute mx-2 top-1/2 -translate-y-1/2 text-xl  w-7 h-7 flex justify-center items-center text-center rounded-full bg-gray-100 cursor-pointer',
                        { hidden: current === 0 }
                    )}
                    onClick={() => setCurrent(current - 1)}
                >
                    <FontAwesomeIcon icon={faAngleLeft} />
                </div>
                <div
                    className={cls(
                        'absolute mx-2 top-1/2 -translate-y-1/2 text-xl  w-7 h-7 flex justify-center items-center text-center rounded-full bg-gray-100 right-0 cursor-pointer',
                        { hidden: current === imageList.length - 1 }
                    )}
                    onClick={() => setCurrent(current + 1)}
                >
                    <FontAwesomeIcon icon={faAngleRight} />
                </div>
            </div>
        </div>
    )
}

export default ImageSlider
