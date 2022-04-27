import { getCookie } from './suger'
import request from './request'

const linkUrl = 'http://cherry.jd.com'

export function checkLogin(): void {
    const token = getCookie('sso.jd.com')
    console.log(token, verifyAuth(token))
    if (token === '') goLogin()
    verifyAuth(token).then((ok) => {
        if (!ok) goLogin()
        // 登陆成功
    })
}

function goLogin() {
    location.href = `http://ssa.jd.com/sso/login?returnUrl=${linkUrl}`
}

function verifyAuth(ticket: string): Promise<boolean> {
    return new Promise((res) => {
        request
            .post('/login', {
                ticket
            })
            .then((data) => {
                console.log('verifyAuth', data)
                res(true)
            })
            .catch(() => {
                res(false)
            })
    })
}
