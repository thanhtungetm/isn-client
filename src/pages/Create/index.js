// import { disableBodyScroll, enableBodyScroll, } from 'body-scroll-lock'
import cls from 'classnames'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormData from 'form-data'

import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { close } from '../../app/slices/modalSlice'
import helper from '../../utils/helper'
import CropProcess from './CropProcess'
import UploadImage from './UploadImage'
import FilterProcess from './FilterProcess'
import PostService from '../../services/PostService'
import Notification from './Notification'
import { useNavigate } from 'react-router-dom'
import { setReload } from '../../app/slices/modalSlice'
import socketSlice from '../../app/slices/socketSlice'
import { uploadImageFirebase } from '../../storage'

const UPLOAD_MODE = 0
const CROP_MODE = 1
const FILTER_MODE = 2
const RESULT_MODE = 3

function Create() {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const socket = useSelector(state => state.socket)

    const [imageList, setImageList] = useState([])
    const [mode, setMode] = useState(UPLOAD_MODE)
    const [imageCroppedList, setImageCroppedList] = useState([])
    const [loadedImage, setLoadedImage] = useState(false)

    //Aspect
    const [aspect, setAspect] = useState(1)

    //Message
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        helper.disableScroll()
        return () => {
            helper.enableScroll()
        }
    }, [])

    const handleUploadImage = (srcList) => {
        const imgCropList = srcList.reduce((list, src) => {
            const newImageList = [...list]
            const image = {
                src,
                rotate: 0,
                scale: 1,
                transX: 0,
                transY: 0,
            }
            newImageList.push(image)

            return newImageList
        }, [])
        console.log('Upload number of image:', srcList.length)
        setImageList(imgCropList)
        setMode(CROP_MODE)
    }

    const updateImage = (currentIndex, image) => {
        const newImageList = [...imageList]
        newImageList[currentIndex] = image
        setImageList(newImageList)
    }

    const closeCreate = () => {
        openCropProcess()
        if(mode===RESULT_MODE){
            dispatch(setReload()) 
        }
            // navigate("/")
        dispatch(close())
    }

    const openFilter = async (pixelCropList,aspect) => {
        revokeImageList()

        const newImageCroppedList = []
        for (let item of pixelCropList) {
            const imgCropped = await helper.imgPreview(
                item.image,
                helper.optimizePixelCrop(item.pixelCrop,aspect),
                item.scale,
                item.rotate,
                item.transX,
                item.transY
            )
            newImageCroppedList.push(imgCropped)
        }
        setMode(FILTER_MODE)
        setImageCroppedList(newImageCroppedList)
    }

    const revokeImageList = () => {
        for (let image of imageCroppedList) {
            URL.revokeObjectURL(image)
        }
        setImageCroppedList([])
    }

    const openCropProcess = () => {
        setLoadedImage(false)
        setMode(CROP_MODE)
    }

    const createPost = async (captionData, imageList) => {
        try {
            setMode(RESULT_MODE)
            setLoading(true)
            console.log("IMAGE DATA", imageList);
            const fileNameList = await uploadImageFirebase(imageList)
            const data = { images: fileNameList, captionData, aspect }
            const res = await PostService.create(data)
            // socket.current.emit("notification:create", {from: "Anonymous"})
            console.log(res)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log('Loi', error)
            setErrorMessage(error.message)
        }
    }

    return (
        <div className="fixed flex justify-center items-center inset-0 z-50 select-none transition-all">
            {/* overplay */}
            <div className="flex justify-end bg-black/40 fixed items-start inset-0 z-40">
                <div className="p-4 text-2xl text-white cursor-pointer" onClick={closeCreate}>
                    <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
                </div>
            </div>

            {/* body */}
            <div className={cls('bg-white z-50 rounded-xl w-full overflow-auto xs:w-fit transition-all relative')}>
                {mode === UPLOAD_MODE && <UploadImage handleUploadImage={handleUploadImage} />}

                {/* {mode === CROP_MODE &&  */}
                <CropProcess
                    hidden={mode !== CROP_MODE}
                    imageCropList={imageList}
                    updateImage={updateImage}
                    openPreview={openFilter}
                    aspect={aspect}
                    setAspect={setAspect}
                />
                {/* } */}

                {mode === FILTER_MODE && (
                    <>
                        <FilterProcess
                            hidden={!loadedImage}
                            aspect={aspect}
                            imageCroppedList={imageCroppedList}
                            openCropProcess={openCropProcess}
                            setLoadedImage={setLoadedImage}
                            createPost={createPost}
                        />
                        {!loadedImage && (
                            <div className="w-40 h-40 flex items-center justify-center">
                                <span className="block w-10 h-10 rounded-full border-[3px] border-yellow-900 border-t-transparent  animate-spin"></span>
                            </div>
                        )}
                    </>
                )}

                {mode === RESULT_MODE && <Notification loading={loading} message={errorMessage} />}
            </div>
        </div>
    )
}

export default Create
