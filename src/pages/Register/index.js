import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.jpg'
import { useForm } from 'react-hook-form'
import UsernameInput from './UsernameInput'
import { useState } from 'react'
import UserService from '../../services/UserService'
import { useDispatch } from 'react-redux'
import {signup} from '../../app/slices/authSlice'

function Register() {
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
            const res = await UserService.register(data)
            console.log(res);
            setLoading(false)
            dispatch(signup(res))
            navigate('/')
        }
        catch(e){
            setLoading(false)
            setMessage(e.message)

        }
    }

    const validEmail = (text) => {
        const email = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
        // console.log('Email', text)
        return email.test(text)
    }

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center bg-blue-200">
            <div className=" flex flex-col bg-white ">
                <nav>
                    <div className="px-4 py-6 flex justify-center ">
                        <img className="w-20 md:w-28" src={logo} alt="logo" />
                    </div>
                </nav>
                <div className="flex flex-1 items-center justify-center">
                    <div className=" sm:border-t-2 px-5 lg:px-10 md:min-w-[480px] py-3 lg:max-w-xl sm:max-w-md w-full text-center">
                        <form className="text-center" onSubmit={handleSubmit(onSubmit)}>
                            <h1 className="font-bold tracking-wider text-3xl mb-2 w-full text-gray-600">
                                ????ng k??
                            </h1>

                            <UsernameInput register={register} error={errors.username} isCheckExist={true} />
                            <div className="py-2 text-left">
                                <input
                                    {...register('email', {
                                        validate: {
                                            email: (value) =>
                                                validEmail(value) || 'Email kh??ng h???p l???!',
                                        },
                                    })}
                                    className="bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 "
                                    placeholder="Email"
                                />
                                {errors.email && <span className="text-red-500 inline-block px-2">{errors.email?.message}</span>}
                            </div>
                            <div className="py-2 text-left">
                                <input
                                    {...register('password', {
                                        required: "M???t kh???u l?? b???t bu???c!",
                                        minLength: {
                                            value: 8,
                                            message: "M???t kh???u ph???i t??? 8 k?? t??? tr??? l??n!"
                                        },
                                        deps:['rePassword']
                                    })}
                                    type="password"
                                    className="bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 "
                                    placeholder="M???t kh???u"
                                />
                                {errors.password && <span className="text-red-500 inline-block px-2">{errors.password?.message}</span>}
                            </div>
                            <div className="py-2 text-left">
                                <input
                                    {...register('rePassword', {
                                        validate:{
                                            checkPasswordMatch: (value)=>{
                                                return value===watch("password") || "Nh???p l???i m???t kh???u kh??ng kh???p!"
                                            }
                                        },
                                    })}
                                    type="password"
                                    className="bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 "
                                    placeholder="Nh???p l???i m???t kh???u"
                                />
                                {errors.rePassword && <span className="text-red-500 inline-block px-2">{errors.rePassword?.message}</span>}
                            </div>
                            <div className="py-2">
                                {message&&<span className="text-red-500 inline-block px-2 py-2">???? c?? l???i x???y ra vui l??ng th??? l???i!</span>}
                                <button
                                    type="submit"
                                    className="border-2 border-gray-100 focus:outline-none bg-purple-600 text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-purple-700"
                                >
                                    {loading&&
                                    
                                    <div className='flex justify-center'><div className='border-2 border-white border-t-transparent w-5 h-5 animate-spin rounded-full'></div></div>}
                                    {!loading && <span>????ng k??</span>}
                                </button>
                            </div>
                            <div className="text-center mt-5">
                                <span>???? c?? t??i kho???n?</span>
                                <NavLink className="text-blue-500 ml-1" to={'/login'}>
                                    ????ng nh???p
                                </NavLink>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
