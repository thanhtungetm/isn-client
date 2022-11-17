import { faArrowLeft, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cls from 'classnames'
import { useRef, useState } from 'react'
import helper from '../../../utils/helper'
import AddCaption from './AddCaption'
import FilterImage from './FilterImage'

import './instagram.min.css'

const CAPTION_MODAL = 'CAPTION'
const FILTER_MODAL = 'FILTER'

function FilterProcess(props) {
    const { createPost, aspect, imageCroppedList, openCropProcess, setLoadedImage, hidden } = props

    const [currentImage, setCurrentImage] = useState(0)
    const [imageLoadedList, setImageLoadedList] = useState(
        Array(imageCroppedList.length).fill(false)
    )
    const [imageFilterList, setImageFilterList] = useState(
        Array(imageCroppedList.length).fill('original')
    )

    // Caption
    const captionRef = useRef(null)
    const [addedMetionList, setAddedMentionList] = useState([])
    const [addedHashtagList, setAddedHashtagList] = useState([])

    const imgRef = useRef(Array(imageCroppedList.length))

    const [currentModal, setCurrentModal] = useState(FILTER_MODAL)

    const handleNextImage = () => {
        if (currentImage < imageCroppedList.length - 1) {
            setCurrentImage(currentImage + 1)
        }
    }

    const handlePrevImage = () => {
        if (currentImage > 0) {
            setCurrentImage(currentImage - 1)
        }
    }
    const handleChangeFilter = (filter) => {
        imageFilterList[currentImage] = filter
        setImageFilterList([...imageFilterList])
    }

    const onloadedImage = (index, e) => {
        //Add img source to list
        //Check image is already loaded
        imageLoadedList[index] = true
        setImageLoadedList([...imageLoadedList])
        setLoadedImage(true)
    }

    const handleBack = () => {
        if (currentModal === FILTER_MODAL) openCropProcess()
        if (currentModal === CAPTION_MODAL) setCurrentModal(FILTER_MODAL)
    }

    const handleFinalUpload = async () => {
        console.log('LIST OBJ', imgRef.current)
        const imgObjList = imgRef.current
        const imageFilteredList = []
        for (let index = 0; index < imgObjList.length; index++) {
            const image = imgObjList[index]
            const filteredImage = await helper.imgFilteredPreview(
                image,
                imageFilterList[index],
                aspect
            )
            imageFilteredList.push(filteredImage)
        }

        //handleCaption

        const caption = captionRef.current.value
        const [mentions, captionWithMention] = getMentionOrHashTagList(
            addedMetionList,
            caption,
            '@'
        )
        const [hashtags, captionFinal] = getMentionOrHashTagList(
            addedHashtagList,
            captionWithMention,
            '#'
        )
        // console.log("FilteredList", imageFilteredList);
        console.log('Mentions:', mentions)
        console.log('Hashtags:', hashtags)
        console.log('Caption:', captionFinal)

        const captionData = {
            content: captionFinal,
            mentions,
            hashtags,
        }

        createPost(captionData, imageFilteredList)
    }

    const getMentionOrHashTagList = (array, caption, signalChar) => {
        const lists = []
        let newCaption = caption

        const uri = signalChar==="@" ? '/profile/' : '/hashtags/'

        array.forEach((tag) => {
            const value = tag.user_name || tag.hashtag_name
            if (caption.indexOf(value) !== -1) {
                newCaption = newCaption.replace(
                    signalChar + value + ' ',
                    `<span class="accessible cursor-pointer font-medium ${
                        signalChar === '@' ? 'text-blue-500' : ''
                    }" data-link='${uri}${value}'>${signalChar}${value} </span>`
                )
                lists.push(tag.user_id||tag.hashtag_id)
            }
        })
        return [lists, newCaption]
    }

    const marginleft = `-${currentImage * 350}px`
    const isLastList = currentImage === imageCroppedList.length - 1
    const isFirstList = currentImage === 0

    return (
        <div
            className={cls('flex flex-col text-center h-full relative bg-white rounded-lg', {
                hidden,
            })}
        >
            <div className="flex-shrink-0 px-5 flex justify-between items-center py-2 font-medium border-b-gray-300 border-b-[1px]">
                <FontAwesomeIcon
                    className="p-2 pl-0 cursor-pointer"
                    icon={faArrowLeft}
                    onClick={handleBack}
                />

                {currentModal === FILTER_MODAL && (
                    <>
                        <span>Image Filters</span>
                        <button
                            className="text-blue-600"
                            onClick={() => setCurrentModal(CAPTION_MODAL)}
                        >
                            Next
                        </button>
                    </>
                )}
                {currentModal === CAPTION_MODAL && (
                    <>
                        <span>Create new post</span>
                        <button className="text-blue-600" onClick={handleFinalUpload}>
                            Share
                        </button>
                    </>
                )}
            </div>

            <div className="flex">
                {/* Image Preview*/}
                <div className="w-[350px] relative">
                    <div className="flex-grow  flex flex-col justify-center h-full  text-lg overflow-hidden">
                        <div
                            className={cls('flex w-[10000px] ease-in duration-300')}
                            style={{ marginLeft: marginleft }}
                        >
                            {imageCroppedList?.map((image, index) => (
                                <figure
                                    className={`filter-${imageFilterList[currentImage]}`}
                                    key={image}
                                >
                                    <img
                                        // className={cls({hidden: !isAllLoadedImage})}
                                        ref={(img) => (imgRef.current[index] = img)}
                                        style={{ width: '350px' }}
                                        key={image}
                                        src={image}
                                        alt="img_preview"
                                        draggable="false"
                                        onLoad={(e) => onloadedImage(index, e)}
                                    />
                                </figure>
                            ))}
                        </div>
                    </div>

                    <div
                        onClick={handlePrevImage}
                        className="absolute p-2 top-1/2 text-3xl -translate-y-1/2 hover:text-blue-500 cursor-pointer"
                    >
                        <FontAwesomeIcon
                            className={cls({ hidden: isFirstList })}
                            icon={faChevronLeft}
                        />
                    </div>
                    <div
                        onClick={handleNextImage}
                        className="absolute p-2 top-1/2 right-0 text-3xl -translate-y-1/2 hover:text-blue-500 cursor-pointer"
                    >
                        <FontAwesomeIcon
                            className={cls({ hidden: isLastList })}
                            icon={faChevronRight}
                        />
                    </div>
                </div>

                {/* Filter handle */}
                <div className="flex flex-col min-w-[288px] w-[288px] border-l border-l-gray-300">
                    {/* Options */}
                    {currentModal === FILTER_MODAL && (
                        <FilterImage
                            currentImage={currentImage}
                            imageFilterList={imageFilterList}
                            handleChangeFilter={handleChangeFilter}
                        />
                    )}
                    {currentModal === CAPTION_MODAL && (
                        <AddCaption
                            captionRef={captionRef}
                            control={{ setAddedMentionList, setAddedHashtagList }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default FilterProcess

//Filters
// original
// clarendon
// gingham
// filter-juno
// filter-lark
// Slumber
// Reyes
// filter-crema
// filter-moon
