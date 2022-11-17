import cls from 'classnames'

const filters = [
    { name: 'Original', filter: 'original' },
    { name: 'Clarendon', filter: 'clarendon' },
    { name: 'Gingham', filter: 'gingham' },
    { name: 'Juno', filter: 'juno' },
    { name: 'Lark', filter: 'lark' },
    { name: 'Slumber', filter: 'slumber' },
    { name: 'Reyes', filter: 'reyes' },
    { name: 'Crema', filter: 'crema' },
    { name: 'Moon', filter: 'moon' },
]
function FilterImage({imageFilterList, handleChangeFilter, currentImage}) {
    return (
        <>
            <div className="flex font-medium">
                <span className="w-1/2 inline-block py-2 border-b border-b-slate-600">Filters</span>
                <span className="w-1/2 inline-block py-2 border-b border-b-slate-200">
                    Ajustment
                </span>
            </div>
            <div className="flex-grow">
                <div className="flex flex-wrap items-center h-full">
                    {filters.map((filter) => (
                        <div key={filter.name} className="w-1/3 p-1 h-1/3">
                            <div
                                className="text-sm font-medium cursor-pointer"
                                onClick={() => handleChangeFilter(filter.filter)}
                            >
                                <img
                                    draggable="false"
                                    className={cls({
                                        'border-[3px] border-blue-700':
                                            imageFilterList[currentImage] === filter.filter,
                                    })}
                                    src="https://hinhanhdephd.com/wp-content/uploads/2015/12/hinh-anh-dep-girl-xinh-hinh-nen-dep-gai-xinh.jpg"
                                    alt="icon"
                                />
                                <span>{filter.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <div>Adjustment</div> */}
            </div>
        </>
    )
}

export default FilterImage
