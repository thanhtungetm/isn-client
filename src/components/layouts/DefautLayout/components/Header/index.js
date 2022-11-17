import { faCirclePlus, faComment, faHouse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cls from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import { open } from '../../../../../app/slices/modalSlice'

import logo from '../../../../../assets/logo.jpg'
import AccountNav from '../AccountNav'
import FriendshipNav from '../FriendshipNav'
import Notification from '../Notification'
import Search from '../Search'

function Header() {
    const create = useSelector((state) => state.modal.create)
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()

    const openCreate = (e) => {
        e.preventDefault()
        dispatch(open())
    }

    return (
        <header className="inset-0  h-16 fixed z-10 border bg-white border-b-gray-300">
            <div className="flex justify-between items-center w-full md:w-4/5 mx-auto px-1 sm:px-5 md:px-10 text-black h-full">
                <div className="flex-shrink-0 grow ">
                    <div className="w-16">
                        <NavLink to="/">
                            {' '}
                            <img src={logo} alt="logo" />
                        </NavLink>
                    </div>
                </div>
                {/* <div className="transition-all duration-1000 ease-in-out hidden sm:block w-64 relative bg-gray-200 rounded-lg">
                    <input
                        spellCheck="false"
                        placeholder=" "
                        className="peer w-full px-4 py-1 bg-transparent text-lg outline-0 text-gray-500 "
                        name="search"
                    />
                    <div className="hidden  peer-placeholder-shown:flex absolute  items-center inset-0 px-4 py-1 bg-transparent pointer-events-none text-gray-400">
                        <FontAwesomeIcon icon={faSearch} />
                        <span className="pl-2">Search</span>
                    </div>
                    <div className="peer-focus:block hidden absolute  h-60 bg-white top-full left-0 right-0 -mx-14 shadow-2xl rounded-lg mt-4"></div>
                </div> */}
                <Search />
                <nav className="grow text-black">
                    <ul className="flex gap-x-4   md:gap-x-5 justify-end text-2xl">
                        <li>
                            <NavLink
                                className={({ isActive }) => {
                                    return cls({ 'text-blue-500': isActive })
                                }}
                                to={'/'}
                            >
                                <FontAwesomeIcon icon={faHouse} />
                            </NavLink>
                        </li>
                        <li>
                            {/* <NavLink
                                to={'/'}
                                className={({ isActive }) => {
                                    return cls({ 'text-blue-500': isActive })
                                }}
                            > */}
                            <FontAwesomeIcon icon={faComment} />
                            {/* </NavLink> */}
                        </li>
                        <li onClick={openCreate}>
                            <a href="/#" className={cls({ 'text-blue-400': create })}>
                                <FontAwesomeIcon icon={faCirclePlus} />
                            </a>
                        </li>
                        <li>
                            <FriendshipNav />
                        </li>
                        <li>
                            <Notification />
                        </li>
                        <li>
                            <AccountNav user={user} />
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header
