import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import UserService from '../../../../../services/UserService'
import AvatarImage from '../../../../AvatarImage'

const HOST = process.env.REACT_APP_IMAGE_HOST

function Search() {
    const inputRef = useRef(null)
    const [search, setSearch] = useState('')
    const [show, setShow] = useState(false)

    const navigate = useNavigate()

    const [userList, setUserList] = useState([])

    useEffect(() => {
        const id = setTimeout(() => {
            if(!search)
                setShow(false)
            if (search)
                (async () => {
                    try {
                        const res = await UserService.search(search)
                        console.log(res)
                        setUserList(res.data)
                        setShow(true)
                    } catch (error) {}
                })()
        }, 500)

        return () => {
            clearTimeout(id)
        }
    }, [search])

    const clearSearch = () => {
        setSearch('')
        setShow(false)
    }
    const handleGotoProfile = (username)=>{
        clearSearch()
        navigate(`/profile/${username}`)
    }

    return (
        <div className="transition-all duration-1000 ease-in-out hidden sm:block w-64 relative bg-gray-200 rounded-lg">
            <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                // onBlur={()=>setShow(false)}
                spellCheck="false"
                placeholder=" "
                className="peer w-full px-4 py-1 bg-transparent text-lg outline-0 text-gray-500 "
                name="search"
                autoComplete="off"
            />
            <div className="hidden  peer-placeholder-shown:flex absolute  items-center inset-0 px-4 py-1 bg-transparent pointer-events-none text-gray-400">
                <FontAwesomeIcon icon={faSearch} />
                <span className="pl-2">Search</span>
            </div>
            <div className="flex  peer-placeholder-shown:hidden absolute  items-center right-0 top-1/2 -translate-y-1/2 px-4 py-1 bg-transparent text-gray-400">
                <FontAwesomeIcon icon={faTimes} onClick={clearSearch} className="cursor-pointer"/>
            </div>
            {userList.length !== 0 && show && (
                <div className="peer-focus:block absolute  h-60 bg-white top-full left-0 right-0 -mx-14 shadow-2xl rounded-lg mt-4">
                    <ul className="p-3 cursor-pointer">
                        {userList.slice(0,5).map((user) => (
                            <li key={user.user_id} className="flex items-center border-b py-1"
                                onClick={()=>handleGotoProfile(user.user_name)}
                            >
                                <div className="mt-1.5 w-10 h-10">
                                <AvatarImage filename={user.user_avatar} />
                                </div>
                                <div className="flex flex-col w-3/5 ml-2 peer">
                                    <span
                                        className="useName text-base  cursor-pointer "
                                    >
                                        @{user.user_name}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Search
