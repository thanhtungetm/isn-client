import { useSelector } from "react-redux"
import Create from "../../../pages/Create"
import Header from "./components/Header"

function DefaultLayout({children}) {
    const create = useSelector((state) => state.modal.create)
    return <div className="min-h-screen bg-gray-50">
        <Header/>
        <div className="pt-20 w-full">
            {children}
        </div>
        {create && <Create />}
        
    </div>
}

export default DefaultLayout
