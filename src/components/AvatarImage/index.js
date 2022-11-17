import { useEffect, useRef, useState } from 'react'
import { getImageUrl } from '../../storage'
import cls from 'classnames'

function AvatarImage({ filename, imageRef }) {
    const imgRef = useRef(null)
    const [loading, setLoading] = useState(true)

    const loadImage = async (filename) => {
        console.log('Loading')
        try {
            const url = await getImageUrl(filename)
            imgRef.current.src = url
            imageRef && (imageRef.current = imgRef.current)
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
                className={cls('rounded-full h-full w-full object-cover', {
                    hidden: loading,
                })}
                src={` `}
                alt=""
                draggable={false}
            />

            {loading && (
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-9 h-9 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </>
    )
}

export default AvatarImage
