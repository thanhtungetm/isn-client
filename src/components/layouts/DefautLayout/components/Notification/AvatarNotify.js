import AvatarImage from '../../../../AvatarImage'

function AvatarNotify({imageUrl}) {
    return <div className="w-10 h-10 flex-shrink-0">
        <AvatarImage filename={imageUrl} />
    </div>
}

export default AvatarNotify
