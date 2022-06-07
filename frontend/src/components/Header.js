import logo from '../images/logo.svg';
import {Link} from "react-router-dom";

function Header({onLoggOut, isLoggedIn, userEmail, name, path}) {
    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="Логотип"/>
            <div className="header__info-box">
                {isLoggedIn ? <p className="header__email">{userEmail}</p> : null}
                {isLoggedIn ?
                    <span
                        className="header__link header__link_type_exit"
                        onClick={onLoggOut}
                    >{name}</span> :
                    <Link
                        to={path}
                        className="header__link"
                    >
                        {name}
                    </Link>}
            </div>
        </header>
    )
}

export default Header