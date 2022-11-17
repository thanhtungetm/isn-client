import {
    faArrowLeft,
    faChevronLeft,
    faChevronRight,
    faExpand,
    faMagnifyingGlassMinus,
    faMagnifyingGlassPlus,
    faRectangleTimes,
    faRotateLeft,
    faRotateRight,
    faSquare,
    faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cls from 'classnames'
import { useRef, useState } from 'react'
// import helper from '../../utils/helper'
import ImageCrop from './ImageCrop'

function CropProcess({ imageCropList, updateImage, openPreview, hidden, loadedImage, aspect,setAspect }) {
    const imgCropConatainer = useRef(null)

    const [currentImage, setCurrentImage] = useState(0)
    const [openAspect, setOpenAspect] = useState(false)
    // const [aspect, setAspect] = useState(1)

    const [pixelCropList, setPixelCropList] = useState(new Array(imageCropList.length))

    const handleComplete = (index, pixelCrop, image) => {
        const newCroppedState = { pixelCrop, image, ...imageCropList[index] }
        pixelCropList[index] = newCroppedState

        setPixelCropList([...pixelCropList])
    }

    const handleNextImage = () => {
        if (currentImage < imageCropList.length - 1) {
            setCurrentImage(currentImage + 1)
        }
    }

    const handlePrevImage = () => {
        if (currentImage > 0) {
            setCurrentImage(currentImage - 1)
        }
    }
    const zoomIn = () => {
        if (imageCropList[currentImage].scale < 3) {
            const newScale = imageCropList[currentImage].scale + 0.2
            const newCurrentImage = { ...imageCropList[currentImage], scale: newScale }
            updateImage(currentImage, newCurrentImage)
            handleChangeZoom()
        }
    }
    const zoomOut = () => {
        if (imageCropList[currentImage].scale > 0.5) {
            const newScale = imageCropList[currentImage].scale - 0.2
            const newCurrentImage = { ...imageCropList[currentImage], scale: newScale }
            updateImage(currentImage, newCurrentImage)
            handleChangeZoom()
        }
    }
    const handleChangeZoom = () => {
        const newPixelCrop = {
            ...pixelCropList[currentImage],
            scale: imageCropList[currentImage].scale,
        }
        pixelCropList[currentImage] = newPixelCrop
        setPixelCropList([...pixelCropList])
    }
    const handleRotate = (deg, original) => {
        const newRotate = original ? 0 : imageCropList[currentImage].rotate + deg
        const newCurrentImage = { ...imageCropList[currentImage], rotate: newRotate }
        updateImage(currentImage, newCurrentImage)
        handleChangeRotate()
    }

    const handleChangeRotate = () => {
        const newPixelCrop = {
            ...pixelCropList[currentImage],
            rotate: imageCropList[currentImage].rotate,
        }
        pixelCropList[currentImage] = newPixelCrop
        setPixelCropList([...pixelCropList])
    }

    const handleChangeCenterCrop = (index, image, crop) => {
        // console.log('crop' + index, crop)
        // const width = image.getBoundingClientRect().width
        // const height = image.getBoundingClientRect().height
        const width = image.width
        const height = image.height
        const newPixelCrop = {
            x: (crop.x / 100) * width,
            y: (crop.y / 100) * height,
            width: (crop.width / 100) * width,
            height: (crop.height / 100) * height,
            unit: 'px',
        }
        // console.log(`width: ${width} height: ${height}`)
        // console.log("New ",newPixelCrop);
        handleComplete(index, newPixelCrop, image)
    }
    const changeTransX = (transX) => {
        const newCurrentImage = { ...imageCropList[currentImage], transX }
        updateImage(currentImage, newCurrentImage)

        const newPixelCrop = {
            ...pixelCropList[currentImage],
            transX,
        }
        pixelCropList[currentImage] = newPixelCrop
        setPixelCropList([...pixelCropList])
    }
    
    const changeTransY = (transY) => {
        const newCurrentImage = { ...imageCropList[currentImage], transY }
        updateImage(currentImage, newCurrentImage)
        const newPixelCrop = {
            ...pixelCropList[currentImage],
            transY,
        }
        pixelCropList[currentImage] = newPixelCrop
        setPixelCropList([...pixelCropList])
    }

    const isLastList = currentImage === imageCropList.length - 1
    const isFirstList = currentImage === 0
    const marginleft = `-${currentImage * 430}px`
    return (
        <div className={cls(" w-[430px]  h-[550px] overflow-auto flex flex-col text-center relative", {hidden: hidden})}>
            <div className="flex-shrink-0 px-5 flex justify-between items-center py-2 font-medium border-b-gray-300 border-b-[1px]">
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Crop image</span>
                <button className="text-blue-600" onClick={() => openPreview(pixelCropList, aspect)}>
                    {/* {loadedImage ?  */}
                    Next
                    
                </button>
            </div>

            {/* Crop */}
            <div
                ref={imgCropConatainer}
                className="flex-grow flex flex-col justify-center  text-lg overflow-hidden"
            >
                <div className={cls('flex w-[10000px] ease-in duration-300')} style={{ marginLeft: marginleft }}>
                    {imageCropList?.map((image, index) => (
                        <ImageCrop
                            key={image.src}
                            image={image}
                            index={index}
                            aspect={aspect}
                            handleComplete={handleComplete}
                            handleChangeCenterCrop={handleChangeCenterCrop}
                            changeTransX={changeTransX}
                            changeTransY={changeTransY}
                        />
                    ))}
                </div>
            </div>

            {/* Tools */}
            <div className="flex-shrink-0 min-h-[60px] flex justify-between px-3 py-2 text-2xl">
                <div className="flex items-center">
                    <div className="relative">
                        <FontAwesomeIcon
                            onClick={() => setOpenAspect(!openAspect)}
                            className="mr-3 hover:text-blue-500 cursor-pointer"
                            icon={faExpand}
                        />
                        {openAspect && (
                            <div className="absolute bottom-full mb-3 bg-black/60  rounded-lg text-base font-medium text-white">
                                <ul>
                                    <li
                                        className="p-2 flex items-center gap-2 hover:text-gray-300 cursor-pointer"
                                        onClick={() => setAspect(1)}
                                    >
                                        <span>1:1</span>
                                        <FontAwesomeIcon icon={faSquare} />
                                    </li>
                                    <div className=" w-full h-[1px] bg-slate-200"></div>
                                    <li
                                        className="p-2 flex items-center gap-2 hover:text-gray-300 cursor-pointer"
                                        onClick={() => setAspect(16 / 9)}
                                    >
                                        <span>16:9</span>
                                        <FontAwesomeIcon icon={faRectangleTimes} />
                                    </li>
                                    <li
                                        className="p-2 flex items-center gap-2 hover:text-gray-300 cursor-pointer"
                                        onClick={() => setAspect(4 / 5)}
                                    >
                                        <span>4:5</span>
                                        <FontAwesomeIcon icon={faRectangleTimes} />
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <FontAwesomeIcon
                        onClick={zoomIn}
                        className="mr-3 hover:text-blue-500 cursor-pointer"
                        icon={faMagnifyingGlassPlus}
                    />
                    <FontAwesomeIcon
                        onClick={zoomOut}
                        className="mr-3 hover:text-blue-500 cursor-pointer"
                        icon={faMagnifyingGlassMinus}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                        onClick={() => handleRotate(-10)}
                        className="hover:text-blue-500 cursor-pointer"
                        icon={faRotateLeft}
                    />
                    <FontAwesomeIcon
                        onClick={() => handleRotate(10)}
                        className="hover:text-blue-500 cursor-pointer"
                        icon={faRotateRight}
                    />
                    <FontAwesomeIcon
                        onClick={() => handleRotate(0, true)}
                        className="hover:text-blue-500 cursor-pointer"
                        icon={faXmarkCircle}
                    />
                </div>
            </div>

            <div
                onClick={handlePrevImage}
                className="absolute p-2 top-1/2 text-3xl -translate-y-1/2 hover:text-blue-500 cursor-pointer"
            >
                <FontAwesomeIcon className={cls({ hidden: isFirstList })} icon={faChevronLeft} />
            </div>
            <div
                onClick={handleNextImage}
                className="absolute p-2 top-1/2 right-0 text-3xl -translate-y-1/2 hover:text-blue-500 cursor-pointer"
            >
                <FontAwesomeIcon className={cls({ hidden: isLastList })} icon={faChevronRight} />
            </div>
        </div>
    )
}

export default CropProcess
