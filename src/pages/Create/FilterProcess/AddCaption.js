import { faSmile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FriendService from '../../../services/FriendService'
import HashtagService from '../../../services/HashtagService'
import AvatarImage from '../../../components/AvatarImage'

const icons = ['😀', '😂', '😅', '😆', '😈', '😍', '😎', '😛', '😨']
const HOST = process.env.REACT_APP_IMAGE_HOST

function AddCaption({ captionRef, control }) {
    const user = useSelector((state) => state.auth.user)

    const [getHashTag, setGetHashTag] = useState(false)
    const [searchHashtag, setSearchHashtag] = useState('')
    const [hashtagList, setHashtagList] = useState([])

    const [getMention, setGetMention] = useState(false)
    const [startPos, setStartPos] = useState(0)
    const [searchMention, setSearchMention] = useState('')
    const [mentionList, setMentionList] = useState([])

    function typeInTextarea(newText, el = document.activeElement) {
        const [start, end] = [el.selectionStart, el.selectionEnd]
        el.setRangeText(newText, start, end, 'end')
    }

    const handleOnChange = (e, el = document.activeElement) => {
        // console.log(e.target.value, el.selectionStart, el.selectionEnd)
        const currentPointer = el.selectionStart
        const value = e.target.value
        const lastChar = value[el.selectionStart - 1]
        handleTypingMention(value, lastChar, currentPointer)
        handleTypingHashTag(value, lastChar, currentPointer)
    }

    useEffect(() => {
        const searchData = searchMention.slice(1)

        const id = setTimeout(async () => {
            try {
                console.log(searchData)
                if (searchData && getMention) {
                    const res = await FriendService.getMention(searchData)
                    console.log(res.data)
                    setMentionList(res.data)
                }
            } catch (error) {}
        }, 300)

        return () => {
            clearTimeout(id)
        }
    }, [searchMention, getMention])

    const handleTypingMention = (value, lastChar, currentPointer) => {
        if (!getMention) {
            if (
                lastChar === '@' &&
                (currentPointer - 1 === 0 || value[currentPointer - 2] === ' ')
            ) {
                console.log('Get hashtag: ')
                setGetMention(true)
                setStartPos(currentPointer - 1)
            }
        } else {
            if (lastChar === ' ' || currentPointer <= startPos) {
                setGetMention(false)
                setMentionList([])
                return
            }

            const mention = value.substring(startPos, currentPointer)
            setSearchMention(mention)
        }
    }

    const handleAddMention = (userInfo) => {
        const user = userInfo.user_name
        typeInTextarea(user.slice(searchMention.length - 1) + ' ')
        setMentionList([])
        setGetMention(false)
        setSearchMention('')
        control.setAddedMentionList((preList) => {
            let ok = !preList.some((u) => u.user_name === user)
            if (ok) return [...preList, userInfo]
            return preList
        })
    }

    // -----------------------
    useEffect(() => {
        const searchData = searchHashtag.slice(1)

        const id = setTimeout(async () => {
            try {
                console.log(searchData)
                if (searchData && getHashTag) {
                    const res = await HashtagService.search(searchData)
                    console.log(res.data)
                    setHashtagList(res.data)
                }
            } catch (error) {}
        }, 300)

        return () => {
            clearTimeout(id)
        }
    }, [searchHashtag, getHashTag])

    const handleTypingHashTag = (value, lastChar, currentPointer) => {
        if (!getHashTag) {
            if (
                lastChar === '#' &&
                (currentPointer - 1 === 0 || value[currentPointer - 2] === ' ')
            ) {
                console.log('Get hashtag: ')
                setGetHashTag(true)
                setStartPos(currentPointer - 1)
            }
        } else {
            if (lastChar === ' ' || currentPointer <= startPos) {
                setGetHashTag(false)
                setHashtagList([])
                return
            }

            const hashtag = value.substring(startPos, currentPointer)
            setSearchHashtag(hashtag)
        }
    }
    const handleAddHashtag = (tag) => {
        const tagname = tag.hashtag_name
        typeInTextarea(tagname.slice(searchHashtag.length - 1) + ' ')
        setHashtagList([])
        setGetHashTag(false)
        setSearchHashtag('')
        control.setAddedHashtagList((preList) => {
            let ok = !preList.some((t) => t.hashtag_name === tagname)
            if (ok) return [...preList, tag]
            return preList
        })
    }

    return (
        <>
            <div className="flex p-3 font-medium">
                <div className="flex items-center">
                    <div className="w-10 h-10">
                        <AvatarImage filename={user.avatar} />
                        
                    </div>
                    <div className="flex flex-col justify-center px-2">
                        <span className="font-bold leading-none text-md text-left">
                            @{user.username}
                        </span>
                        <span className="leading-normal text-gray-400 text-sm">
                            {user.fullname}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex-grow p-3 h-[250px] relative flex flex-col text-left">
                <textarea
                    ref={captionRef}
                    onBlur={(e) => e.target.focus()}
                    onChange={handleOnChange}
                    placeholder="Write a caption"
                    className="w-full grow outline-none resize-none"
                    spellCheck={false}
                    autoFocus={true}
                    type="text"
                />
                <div className="text-xs text-gray-500">
                    <span className="block">
                        Gắn thẻ<b> @</b>
                        {'<'}tên người dùng{'>'}
                    </span>
                    <span>
                        Thêm hashtag <b>#</b>
                        {'<'}tên hashtag{'>'}
                    </span>
                </div>
                {/* Lookup mentions */}
                {mentionList.length !== 0 && (
                    <div className="absolute bottom-0 left-1 bg-white border border-gray-400 rounded-lg px-2 py-1 min-w-[50%] max-h-[145px] overflow-y-auto">
                        <ul>
                            {mentionList.map((user) => (
                                <li
                                    key={user.user_id}
                                    className="flex p-1 gap-1 cursor-pointer"
                                    onClick={() => handleAddMention(user)}
                                >
                                    <div className="w-6 h-6">
                                        <AvatarImage filename={user.user_avatar} />
                                    </div>
                                    <span>@{user.user_name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {hashtagList.length !== 0 && (
                    <div className="absolute bottom-0 bg-white left-1 border border-gray-400 rounded-lg px-2 py-1 min-w-[50%] max-h-[145px] overflow-y-auto">
                        <ul>
                            {hashtagList.map((tag) => (
                                <li
                                    key={tag.hashtag_id}
                                    className="flex p-1 gap-1 cursor-pointer"
                                    onClick={() => handleAddHashtag(tag)}
                                >
                                    <span>#{tag.hashtag_name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* <div
                    className="absolute bottom-0 left-1 border border-gray-400 rounded-lg px-2 py-1 min-w-[50%] max-h-[145px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: captionPreview }}
                ></div> */}
            </div>
            <div className="flex justify-between p-3 ">
                <div className="relative">
                    <FontAwesomeIcon className="peer" icon={faSmile} />
                    <div className="peer-hover:block bg-white -mb-2  hidden hover:block  absolute w-24 bottom-full border border-gray-200 p-1 text-lg">
                        {icons.map((icon) => (
                            <span key={icon} onClick={() => typeInTextarea(icon)}>
                                {icon}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="">
                    {/* <span>{captionRef.current.value.length}</span>/2000 */}
                    {/* <button onClick={test}>Test</button> */}
                </div>
            </div>
        </>
    )
}

export default AddCaption
