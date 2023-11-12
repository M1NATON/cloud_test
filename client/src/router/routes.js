import Disk from "../components/disk/Disk";
import Login from "../components/authorization/login/Login";
import Registration from "../components/authorization/registration/Registration";


export const privateRoutes = [
    {path: '/disk', element: Disk}
]

export const publicRoutes = [
    {path: '/login', element: Login},
    {path: '/registration', element: Registration},

]