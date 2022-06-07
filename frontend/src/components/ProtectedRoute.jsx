import {Redirect, Route} from "react-router-dom";
import Preloader from "./Preloader";
import Header from "./Header";

function ProtectedRoute({isLoggedIn, isPreloader, onLoggOut, userEmail, component: Component, ...props}) {

    return (
        <Route>
            <Header
                path="/sign-in"
                name="Выйти"
                isLoggedIn={isLoggedIn}
                onLoggOut={onLoggOut}
                userEmail={userEmail}
            />
            {isLoggedIn ?
                isPreloader ?
                    <Preloader/> :
                    <Component {...props} /> :
                <Redirect to='/sign-in'/>
            }
        </Route>
    )
}

export default ProtectedRoute;