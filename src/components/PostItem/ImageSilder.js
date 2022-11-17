import { useEffect, useRef, useState } from 'react'
import cls from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { getImageUrl } from '../../storage'
import FirebaseImage from '../FirebaseImage'

const HOST = process.env.REACT_APP_IMAGE_HOST

function PostItemSlider({ imageList, openView }) {
    const [current, setCurrent] = useState(0)

    return (
        <div className="post__img relative z-0">
            <div className="transition ease-in duration-300 ">
                {imageList.map((image, index) => (
                    <FirebaseImage key={image.image_id} filename={image.image_url} current={current} index={index} openView={openView}/>
                ))}
            </div>

            <div
                className={cls(
                    'w-6 bg-slate-50 absolute top-1/2 -translate-y-1/2 mx-1 text-center rounded-full cursor-pointer',
                    { hidden: current === 0 }
                )}
                onClick={() => setCurrent(current - 1)}
            >
                <FontAwesomeIcon icon={faAngleLeft} />
            </div>
            <div
                className={cls(
                    'w-6 bg-slate-50 absolute top-1/2 -translate-y-1/2 mx-1 text-center rounded-full right-0 cursor-pointer',
                    { hidden: current === imageList.length - 1 }
                )}
                onClick={() => setCurrent(current + 1)}
            >
                <FontAwesomeIcon icon={faAngleRight} />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center my-4 z-0 pointer-events-none">
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
    )
}

export default PostItemSlider
