const BASE_URL = 'https://auth.nomoreparties.co';

export const signUp = ({password, email}) => {
    return fetch(BASE_URL + '/signup', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password,
            email
        })
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            if (res.status === 400) {
                return Promise.reject(`Ошибка: некорректно заполнено одно из полей`)
            }
            return Promise.reject(`Ошибка: ${res.status}`)
        })
}

export const signIn = ({password, email}) => {
    return fetch(BASE_URL + '/signin', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password,
            email
        })
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            if (res.status === 400) {
                return Promise.reject(`Ошибка: не передано одно из полей`)
            } else if(res.status === 401) {
                return Promise.reject(`Ошибка: пользователь с email не найден`)
            }
            return Promise.reject(`Ошибка: ${res.status}`)
        })
}

export const getUserInfo = (token) => {
    return fetch(BASE_URL + '/users/me', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            "Authorization" : `Bearer ${token}`
        }
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            if (res.status === 400) {
                return Promise.reject(`Ошибка: токен не передан или передан не в том формате`)
            } else if(res.status === 401) {
                return Promise.reject(`Ошибка: переданный токен некорректен`)
            }
            return Promise.reject(`Ошибка: ${res.status}`)
        })
}