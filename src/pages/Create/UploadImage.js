import { faImages } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function UploadImage({ handleUploadImage }) {
    const handleChangeImage = (e) => {
        // console.log(e.target.files[0])
        const files = e.target.files
        createImageObject(files)
    }
    const handleDragOver = (e) => {
        e.preventDefault()
    }
    const handleDragLeave = (e) => {
        e.preventDefault()
    }
    const handleDrop = (e) => {
        e.preventDefault()
        const files = e.dataTransfer.files
        createImageObject(files)
    }

    const createImageObject = (files) => {
        const imgSrcList = []
        // console.log(files);
        for (let image of files) {
            imgSrcList.push(URL.createObjectURL(image))
        }

        // console.log(imgSrcList)
        handleUploadImage(imgSrcList)
    }

    

    return (
        <div
            className="w-80 h-[300px] md:w-[430px] md:h-[550px] flex flex-col text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="px-1 py-2 font-medium border-b-gray-300 border-b-[1px]">
                Create new post
            </div>

            {/* Dragover */}
            <div className="flex-grow flex flex-col justify-center items-center text-lg">
                <div className="text-5xl">
                    <FontAwesomeIcon icon={faImages} />
                </div>
                <span className="inline-block my-5 text-xl text-gray-600 font-light">
                    Drag photos here
                </span>
                <label
                    className="px-3 py-1 bg-blue-500 font-medium text-white rounded-lg cursor-pointer"
                    htmlFor="image"
                >
                    Select from computer
                </label>
            </div>

            {/* form upload */}
            <form className="hidden">
                <input id="image" type="file" onChange={handleChangeImage} multiple></input>
            </form>
        </div>
    )
}

export default UploadImage
