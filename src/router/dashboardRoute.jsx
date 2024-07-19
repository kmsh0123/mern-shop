import AuthGuard from "../Guard/AuthGuard";
import Main from "../layout/Main";
import AddProducts from "../pages/AddProducts";
import ChangePassword from "../pages/ChangePassword";
import ForgotPassword from "../pages/ForgotPassword";
import GoogleRedirect from "../pages/GoogleRedirect";
import Index from "../pages/Index";
import Information from "../pages/Information";
import Login from "../pages/Login";
import Notifications from "../pages/Notifications";
import Products from "../pages/Products";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";

export const dashboardRoute = [
    {
        path : "/login",
        element : <Login/>
    },
    {
        path : "/register",
        element : <Register/>
    },
    {
        path : "/forgot-password",
        element : <ForgotPassword/>
    },
    {
        path : "/reset/:token",
        element : <ResetPassword/>
    },
        {
        path : "/",
        element :  <AuthGuard><Main/></AuthGuard>,
        children : [
            {
                index : true,
                element : <Index/>
            }, 
            {
                path : "/products",
                element : <Products/>
            },
            {
                path : "/addProducts",
                element : <AddProducts/>
            },
            {
                path : "/notifications",
                element : <Notifications/>
            },
            {
                path : "/profile/changePassword",
                element : <ChangePassword/>
            },
            {
                path : "/profile/information",
                element : <Information/>
            },
            {
                path : "/auth/google/callback",
                element : <GoogleRedirect/>
            },
        ] 
    }    
]