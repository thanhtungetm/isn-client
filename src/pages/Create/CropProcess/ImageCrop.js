import {
    faArrowAltCircleDown,
    faArrowAltCircleLeft,
    faArrowAltCircleRight,
    faArrowAltCircleUp,
} from '@fortawesome/free-solid-svg-icons'
import cls from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

function ImageCrop(props) {
    const {index,aspect, handleComplete, handleChangeCenterCrop, image, changeTransX, changeTransY } =
        props
    const {  src, scale, rotate, transX, transY} = image
    const imgRef = useRef(null)

    const [crop, setCrop] = useState({
        // unit: '%', // Can be 'px' or '%'
        // x: 25,
        // y: 25,
        // width: 50,
        // height: 50,
    })

    // const [rotate, setRotate] = useState(0)
    const [size, setSize] = useState({})

    useEffect(() => {
        if (Object.keys(size).length>0) {
            const crop = getCenterCrop(size.width, size.height)
            setCrop(crop)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aspect])

    const onImageLoad = (e) => {
        const { naturalWidth: width, naturalHeight: height } = e.currentTarget
        setSize({ width, height })
        const crop = getCenterCrop(width, height)

        setCrop(crop)
    }

    const getCenterCrop = (width, height) => {
        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 100,
                },
                aspect,
                width,
                height
            ),
            width,
            height
        )
        // console.log(crop)
        handleChangeCenterCrop(index,imgRef.current, crop)
        return crop
    }



    // const setDefaultTrans = () => {
    //     changeTransX(0)
    //     changeTransY(0)
    // }

    
    return (
        <div className={cls('relative w-[430px] self-center',)}>
            <ReactCrop
                className="max-h-[410px] max-w-[430px] select-none"
                minHeight={50}
                minWidth={50}
                aspect={aspect}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(pixelCrop) => handleComplete(index, pixelCrop, imgRef.current)}
                ruleOfThirds
            >
                <img
                    ref={imgRef}
                    src={src}
                    alt="img"
                    onLoad={onImageLoad}
                    style={{
                        transform: `scale(${scale}) translate(${transX}px, ${transY}px) rotate(${rotate}deg)`,
                    }}
                />
            </ReactCrop>

            {(scale !== 1 || transX !== 0 || transY !== 0) && (
                <div className="absolute opacity-60 w-28 flex justify-center items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl select-none">
                    <div>
                        {/* <div> */}
                        <FontAwesomeIcon
                            onClick={() => changeTransY(transY + 5)}
                            className="hover:text-blue-500 cursor-pointer"
                            icon={faArrowAltCircleUp}
                        />
                        {/* </div> */}
                        <div className="flex items-center gap-2 w-16 justify-between">
                            <FontAwesomeIcon
                                onClick={() => changeTransX(transX + 5)}
                                className="hover:text-blue-500 cursor-pointer"
                                icon={faArrowAltCircleLeft}
                            />
                            <FontAwesomeIcon
                                onClick={() => changeTransX(transX - 5)}
                                className="hover:text-blue-500 cursor-pointer"
                                icon={faArrowAltCircleRight}
                            />
                        </div>
                        {/* <div> */}
                        <FontAwesomeIcon
                            onClick={() => changeTransY(transY - 5)}
                            className="hover:text-blue-500 cursor-pointer"
                            icon={faArrowAltCircleDown}
                        />
                        {/* </div> */}
                    </div>
                    {/* <div className="ml-5">
                        <FontAwesomeIcon
                            onClick={setDefaultTrans}
                            className="hover:text-blue-500 cursor-pointer"
                            icon={faRotate}
                        />
                    </div> */}
                </div>
            )}
        </div>
    )
}

export default ImageCrop
