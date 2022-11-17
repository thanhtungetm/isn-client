import { useNavigate } from "react-router-dom"
import GalleryThumbnail from "./GalleryThumbnail"
const HOST = process.env.REACT_APP_IMAGE_HOST
function PostGridItem({item}) {
    const navigate = useNavigate()

    const gotoDetailItem = ()=> {
        navigate(`/detail/${item.post_id}`)
    }
    return (
        <div className="flex flex-wrap w-full relative border rounded-lg shadow-lg shadow-gray-600">
            <div className="w-full peer h-auto md:h-[230px]">
                <div className="block object-cover object-center w-full h-full rounded-lg">
                    {/* <img
                        alt="gallery"
                        className="object-cover object-center w-full h-full rounded-lg"
                        src={`${HOST}${item.image.image_url}`}
                    /> */}
                    <GalleryThumbnail filename={item.image.image_url} />
                </div>
            </div>
            <div className="absolute inset-0 hidden peer-hover:flex justify-center items-center hover:flex bg-gray-500/30 rounded-lg">
                <span onClick={gotoDetailItem} className="text-sm md:text-base inline-block px-1 py-1 md:px-3 md:py-2 bg-white cursor-pointer rounded-md">Xem</span>
            </div>
        </div>
    )
}

export default PostGridItem
