import logo from '../../assets/logo.jpg'

import { NavLink, useNavigate } from 'react-router-dom'
import UsernameInput from '../Register/UsernameInput'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { login } from '../../app/slices/authSlice'
import UserService from '../../services/UserService'

function Login() {
    const dispatch = useDispatch()
    const  navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const onSubmit = async (data) => {
        console.log(data);
        try{
            setLoading(true)
            const res = await UserService.login(data)
            console.log(res);
            setLoading(false)
            dispatch(login(res))
            navigate('/')
        }
        catch(e){
            setLoading(false)
            setMessage(e.message)

        }
    }

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center bg-blue-200">
            <div className=" flex flex-col bg-white">
                <nav>
                    <div className="px-4 py-6 flex justify-center">
                        <img src={logo} alt="logo" />
                    </div>
                </nav>
                <div className="flex flex-1 items-center justify-center">
                    <div className=" sm:border-2 px-4 lg:px-24 py-10 lg:max-w-xl sm:max-w-md w-full text-center">
                        <form className="text-center px-3" onSubmit={handleSubmit(onSubmit)}>
                            <h1 className="font-bold tracking-wider text-3xl mb-8 w-full text-gray-600">
                                Đăng nhập
                            </h1>
                            <UsernameInput register={register} error={errors.username} isCheckExist={false} />
                            <div className="py-2 text-left">
                                <input
                                    {...register('password', {
                                        required: "Mật khẩu là bắt buộc!",
                                        minLength: {
                                            value: 8,
                                            message: "Mật khẩu phải từ 8 ký tự trở lên!"
                                        },
                                    })}
                                    type="password"
                                    className="bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 "
                                    placeholder="Mật khẩu"
                                />
                                {errors.password && <span className="text-red-500 inline-block px-2">{errors.password?.message}</span>}
                            </div>
                            <div className="py-2">
                                <button
                                    type="submit"
                                    className="border-2 border-gray-100 focus:outline-none bg-purple-600 text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-purple-700"
                                >
                                    {loading&&
                                    
                                    <div className='flex justify-center'><div className='border-2 border-white border-t-transparent w-5 h-5 animate-spin rounded-full'></div></div>}
                                    {!loading && <span>Đăng nhập</span>}
                                </button>
                                {message && <span className="text-red-500 inline-block px-2">Tài khoản không chính xác</span>}
                            </div>
                        </form>

                        <div className="text-center mt-12">
                            <span>Không có tài khoản?</span>
                            <NavLink className="text-blue-500 ml-1" to={'/register'}>
                                Đăng ký
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
