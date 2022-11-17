import { useEffect, useRef, useState } from 'react'
import { getImageUrl } from '../../storage'
import cls from 'classnames'

function GalleryThumbnail({ filename }) {
    const imgRef = useRef(null)
    const [loading, setLoading] = useState(true)

    const loadImage = async (filename) => {
        console.log('Loading')
        try {
            const url = await getImageUrl(filename)
            imgRef.current.src = url
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (filename) {
            loadImage(filename)
        }
    }, [filename])

    return (
        <>
            <img
                ref={imgRef}
                alt="gallery"
                className={cls('object-cover object-center w-full h-full rounded-lg', {
                    hidden: loading,
                })}
                // className={cls(
                //     'w-full h-full visible opacity-100 transition ease-in duration-300 ',
                //     {
                //         invisible: index !== current,
                //         'h-0': index !== current,
                //         'opacity-50': index !== current,
                //         'cursor-zoom-in': !openView,
                //         hidden: loading,
                //     }
                // )}
                src={` `}
            />

            {loading && (
                <div className="">
                    <div className="w-20 h-20 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </>
    )
}

export default GalleryThumbnail
