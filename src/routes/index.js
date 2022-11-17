import Home from "../pages/Home"
import Gallery from "../pages/Gallery"
import Profile from "../pages/Profile"
import Login from "../pages/Login"
import Register from "../pages/Register/index"
import DefaultLayout from "../components/layouts/DefautLayout"
import ItemDetail from "../pages/ItemDetail"
import Friend from "../pages/Friend"

const publicRoutes = [
    {path: '/login', component: Login, layout: EmptyLayout},
    {path: '/register', component: Register, layout: EmptyLayout},
    
]

const privateRoutes = [
    {path: '/', component: Home, layout: DefaultLayout},    
    {path: '/gallery', component: Gallery, layout: DefaultLayout},
    {path: '/friend', component: Friend, layout: DefaultLayout},
    {path: '/detail/:id', component: ItemDetail, layout: DefaultLayout},
    {path: '/profile/:username', component: Profile, layout: DefaultLayout},
    
]
const routes = {publicRoutes, privateRoutes}
export default routes

function EmptyLayout({children}){
    return <>{children}</>
}