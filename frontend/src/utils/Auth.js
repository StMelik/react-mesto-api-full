import { optionsApi } from './optionsApi'

export const signUp = ({ password, email }) => {
    return fetch(optionsApi.baseUrl + 'signup', {
        method: "POST",
        headers: optionsApi.headers,
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

export const signIn = ({ password, email }) => {
    return fetch(optionsApi.baseUrl + 'signin', {
        method: "POST",
        headers: optionsApi.headers,
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
            } else if (res.status === 401) {
                return Promise.reject(`Ошибка: пользователь с email не найден`)
            }
            return Promise.reject(`Ошибка: ${res.status}`)
        })
}

export const checkToken = (token) => {
    return fetch(optionsApi.baseUrl + 'users/me', {
        method: "GET",
        headers: {
            ...optionsApi.headers,
            "Authorization": 'Bearer ' + token
        }
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            if (res.status === 400) {
                return Promise.reject(`Ошибка: токен не передан или передан не в том формате`)
            } else if (res.status === 401) {
                return Promise.reject(`Ошибка: переданный токен некорректен`)
            }
            return Promise.reject(`Ошибка: ${res.status}`)
        })
}