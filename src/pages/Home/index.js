import Sidebar from '../../components/Sidebar'
import PostList from './PostList'

function Home() {
    // const comment = useSelector((state) => state.modal.comment)
    return (
        <div className="w-full md:w-4/5 mx-auto px-1 md:px-5 flex lg:w-3/5 relative gap-1">
            <PostList />
            <div className="w-2/5 hidden sm:block">
                <Sidebar />
            </div>
        </div>
    )
}

export default Home
