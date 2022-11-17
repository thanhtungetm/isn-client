import UserService from '../../services/UserService'

function UsernameInput({ register, error, isCheckExist, }) {
    const checkuserName = async (username) => {
        let message
        try {
            await UserService.checkExistUsername(username)
            return true
        } catch (error) {
            message = `Tên người dùng đã tồn tại`
            return message
        }
        // return true
    }

    function valid_username(username) {
        const regex = /^[a-z0-9_]+$/
        return regex.test(username)
    }
    return (
        <div className="py-2 text-left">
            <input
                {...register('username', {
                    required: 'Tên người dùng là bắt buộc',
                    minLength: {
                        value: 5,
                        message: 'Từ 5 kí tự trở lên!',
                    },
                    validate:  {
                        // you can do asynchronous validation as well
                        valid: async (value) => valid_username(value) || "Tên gồm in thường, số, '-' , '_'",
                        checkExist: isCheckExist ? async(value) => await checkuserName(value): ()=>true,
                    },
                })}
                autoComplete="off"
                className="bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 "
                placeholder="Tên người dùng"
            />
            {error && <span className="text-red-500 inline-block px-2">{error.message}</span>}
            {!error && isCheckExist&& <span className="text-blue-800 inline-block px-2">Ví dụ: lttung2301, q_toan, nq-thai,...</span>}
        </div>
    )
}

export default UsernameInput
