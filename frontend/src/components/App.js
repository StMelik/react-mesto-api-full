import {useState, useEffect} from 'react'
import {Route, Switch, useHistory} from "react-router-dom";
import {CurrentUserContext} from '../contexts/CurrentUserContext';

import Api from "../utils/Api"
import {optionsApi} from "../utils/optionsApi"
import * as auth from "../utils/Auth";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import ImagePopup from './ImagePopup'
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeletePopup from './ComfirmDeletePopup';

const api = new Api(optionsApi)

function App() {
    const history = useHistory()

    // Статус выполненого входа
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // Статус для попапа подтверждения
    const [isSuccessfully, setIsSuccessfully] = useState(false)

    // E-mail пользовотеля
    const [userEmail, setUserEmail] = useState("Your email")

    // Состояние попапов
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
    const [isComfirmDeletePopupOpen, setIsComfirmDeletePopupOpen] = useState(false)
    const [selectedCard, setSelectedCard] = useState({isOpen: false})
    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false)

    // Состояние загрузчиков
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [isPreloader, setIsPreloader] = useState(true)

    // Данные пользовотеля и карточек
    const [currentUser, setCurrentUser] = useState({})
    const [cards, setCards] = useState([])

    // ID Карточки
    const [cardId, setCardId] = useState('')

    // Запрос данных пользователя и карточек с сервера
    useEffect(() => {
        if (isLoggedIn) {
            Promise.all([api.getUserInfo(), api.getInitialCards()])
                .then(([user, cards]) => {
                    setCurrentUser(user)
                    setCards(cards)
                    setIsPreloader(false)
                })
                .catch(err => console.log("Не удалось загрузить страницу:", err))
        }
    }, [isLoggedIn])

    // Вход по токену при загрузке страницы
    useEffect(() => {
        handleSignInProfileToken()
    }, [])

    // Управление состоянием попапов (открыть)
    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true)
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true)
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true)
    }

    function handleComfirmDeleteClick(card) {
        setIsComfirmDeletePopupOpen(true)
        setCardId(card._id)
    }

    function handleConfirmRegisterClick() {
        setIsConfirmPopupOpen(true)
    }

    function handleConfirmLoginClick() {
        setIsSuccessfully(false)
        setIsConfirmPopupOpen(true)
    }

    // (закрыть)
    function closeAllPopups() {
        setIsEditProfilePopupOpen(false)
        setIsAddPlacePopupOpen(false)
        setIsEditAvatarPopupOpen(false)
        setIsComfirmDeletePopupOpen(false)
        setSelectedCard({isOpen: false})
        setIsConfirmPopupOpen(false)
    }

    // Открыть большую карточку
    function handleCardClick(card) {
        setSelectedCard({
            isOpen: true,
            ...card
        })
    }

    // Обновить данные пользователя
    function handleUpdateUser(data) {
        setIsLoadingButton(true)

        api.editUserInfo(data)
            .then(res => {
                setCurrentUser(res)
                closeAllPopups()
            })
            .catch(err => console.log("Не удалось изменить данные профиля:", err))
            .finally(() => setIsLoadingButton(false))
    }

    // Обновить аватар пользователя
    function handleUpdateAvatar(data) {
        setIsLoadingButton(true)

        api.editUserAvatar(data)
            .then(res => {
                setCurrentUser(res)
                closeAllPopups()
            })
            .catch(err => console.log("Не удалось сменить аватар:", err))
            .finally(() => setIsLoadingButton(false))
    }

    // Управление лайком карточки
    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        api.changeLikeCardStatus(card._id, !isLiked)
            .then(newCard => {
                setCards(state => state.map(c => c._id === card._id ? newCard : c));
            })
            .catch(err => console.log("Не удалось изменить лайк:", err))
    }

    // Управление удалением карточки
    function handleCardDelete() {
        setIsLoadingButton(true)

        api.deleteCard(cardId)
            .then(() => {
                setCards(cards.filter(c => c._id !== cardId))
                closeAllPopups()
            })
            .catch(err => console.log("Не удалось удалить карточку:", err))
            .finally(() => setIsLoadingButton(false))
    }

    // Управление добовлением карточки
    function handleAddPlaceSubmit(data) {
        setIsLoadingButton(true)

        api.addCard(data)
            .then(newCard => {
                setCards([newCard, ...cards]);
                closeAllPopups()
            })
            .catch(err => console.log("Не удалось добавить карточку:", err))
            .finally(() => setIsLoadingButton(false))
    }

    // Регистрация
    function handleRegisterProfile({password, email}) {
        setIsLoadingButton(true)

        auth.signUp({password, email})
            .then(() => {
                setIsSuccessfully(true)
                handleConfirmRegisterClick()
                history.push('/sign-in')
            })
            .catch(err => {
                console.log(err)
                setIsSuccessfully(false)
                handleConfirmRegisterClick()
            })
            .finally(() => setIsLoadingButton(false))
    }

    // Вход в профиль
    function handleSignInProfile({password, email}) {
        setIsLoadingButton(true)

        auth.signIn({password, email})
            .then(res => {
                setIsLoggedIn(true)
                setUserEmail(email)
                localStorage.setItem('jwt', JSON.stringify(res.token))
                history.push('/')
            })
            .catch(err => {
                console.log(err)
                handleConfirmLoginClick()
            })
            .finally(() => setIsLoadingButton(false))
    }

    // Выход из профиля
    function handleSignOutProfile() {
        setIsLoggedIn(false)
        localStorage.removeItem('jwt')
        setUserEmail("Your email")
        history.push('/sign-in')
    }

    // Вход в профиль по токену
    function handleSignInProfileToken() {
        if (localStorage.getItem('jwt')) {
            const token = JSON.parse(localStorage.getItem('jwt'))

            auth.getUserInfo(token)
                .then(res => {
                    setIsLoggedIn(true)
                    setUserEmail(res.data.email)
                    history.push('/')
                })
                .catch(e => {
                    console.log(e)
                    handleConfirmLoginClick()
                })
        }
    }

    return (
        <div className="page__content">
            <CurrentUserContext.Provider value={currentUser}>
                <Switch>
                    <Route path='/sign-in'>
                        <Header
                            path="/sign-up"
                            name="Регистрация"
                            isLoggedIn={isLoggedIn}
                        />
                        <Login
                            onLogin={handleSignInProfile}
                            loader={isLoadingButton}
                        />
                    </Route>
                    <Route path='/sign-up'>
                        <Header
                            path="/sign-in"
                            name="Войти"
                            isLoggedIn={isLoggedIn}
                        />
                        <Register
                            onRegister={handleRegisterProfile}
                            loader={isLoadingButton}
                        />
                    </Route>
                    <ProtectedRoute
                        path='/'
                        isLoggedIn={isLoggedIn}
                        isPreloader={isPreloader}
                        onLoggOut={handleSignOutProfile}
                        userEmail={userEmail}
                        component={Main}
                        onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}
                        onEditAvatar={handleEditAvatarClick}
                        onCardClick={handleCardClick}
                        cards={cards}
                        onCardLike={handleCardLike}
                        onCardDelete={handleComfirmDeleteClick}
                    />
                </Switch>
                <Footer/>

                <InfoTooltip
                    isOpen={isConfirmPopupOpen}
                    onClose={closeAllPopups}
                    isSuccessfully={isSuccessfully}
                />

                {/* Редактировать профиль */}
                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                    loader={isLoadingButton}
                />

                {/* Аватар */}
                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                    loader={isLoadingButton}
                />

                {/* Новое место */}
                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddPlaceSubmit}
                    loader={isLoadingButton}
                />

                {/* Подтверждение удаления */}
                <ConfirmDeletePopup
                    isOpen={isComfirmDeletePopupOpen}
                    onClose={closeAllPopups}
                    onDelete={handleCardDelete}
                    loader={isLoadingButton}
                />

                {/* Большая картинка */}
                <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
            </CurrentUserContext.Provider>
        </div>
    );
}

export default App;
