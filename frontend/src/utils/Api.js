export default class Api {
    constructor(options) {
        this._baseUrl = options.baseUrl
        this._headers = options.headers
    }

    _fetch(path, method, addBody) {
        const url = this._baseUrl + path
        return fetch(url, {
            method,
            headers: this._headers,
            body: addBody ? addBody() : null
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`)
            })
    }

    _likeCard(cardId, method) {
        return this._fetch(`cards/${cardId}/likes`, method)
    }

    getUserInfo() {
        return this._fetch('users/me', 'GET')
    }

    getInitialCards() {
        return this._fetch('cards', 'GET')
    }

    editUserInfo({ name, about }) {
        const addBody = () => {
            return JSON.stringify({
                name,
                about
            })
        }
        return this._fetch('users/me', 'PATCH', addBody)
    }

    addCard({ name, link }) {
        const addBody = () => {
            return JSON.stringify({
                name,
                link
            })
        }
        return this._fetch('cards', 'POST', addBody)
    }

    deleteCard(cardId) {
        return this._fetch(`cards/${cardId}`, 'DELETE')
    }

    editUserAvatar({ avatar }) {
        const addBody = () => {
            return JSON.stringify({
                avatar
            })
        }
        return this._fetch('users/me/avatar', 'PATCH', addBody)
    }

    changeLikeCardStatus(cardId, isLiked) {
        return isLiked ?
            this._likeCard(cardId, 'PUT') :
            this._likeCard(cardId, 'DELETE')
    }
}
