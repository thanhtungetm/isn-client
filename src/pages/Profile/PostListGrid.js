import PostGridItem from "./PostGridItem"

function PostListGrid({list}) {
    return (
        <div className="overflow-hidden text-gray-700  ">
            <div className="container px-5 py-2 mx-auto lg:pt-5 lg:px-32">
                <div className="grid grid-cols-3 gap-1 -m-1 md:-m-2">
                    {list.map(item=>(
                        <PostGridItem  key={item.post_id} item={item}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PostListGrid
