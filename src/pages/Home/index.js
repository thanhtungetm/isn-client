import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import PostList from './PostList'
import cls from 'classnames'

const PUBLIC = 0
const FRIEND = 1

function Home() {
    // const comment = useSelector((state) => state.modal.comment)

    const [mode, setMode] = useState(PUBLIC)

    return (
        <div className="w-full md:w-4/5 mx-auto px-1 md:px-5 flex lg:w-3/5 relative gap-1">
            <div className="w-full md:w-3/5 mx-5">
                <div className="flex text-blue-500 gap-2 justify-center border-b-2 z-0 mb-2">
                    <div
                        className={cls('cursor-pointer px-3', {
                            'font-bold border-2 border-b-0 bg-white -mb-[2px] rounded-t-md':
                                mode === PUBLIC,
                        })}
                        onClick={()=>setMode(PUBLIC)}
                    >
                        Tất cả
                    </div>
                    <div
                        className={cls('cursor-pointer px-3', {
                            'font-bold border-2 border-b-0 bg-white -mb-[2px] rounded-t-md':
                                mode === FRIEND,
                        })}
                        onClick={()=>setMode(FRIEND)}
                    >
                        Bạn bè
                    </div>
                </div>
                <PostList mode={mode} />
            </div>
            <div className="w-2/5 hidden sm:block">
                <Sidebar />
            </div>
        </div>
    )
}

export default Home
