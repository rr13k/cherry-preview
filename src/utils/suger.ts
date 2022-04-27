/**
 * @method 将数字每隔3位添加一个空格，优化显示
 */
export function toThousands(num: number): string {
    let num_str = (num || 0).toString(),
        result = ''
    while (num_str.length > 3) {
        result = ' ' + num_str.slice(-3) + result
        num_str = num_str.slice(0, num_str.length - 3)
    }
    if (num_str) {
        result = num_str + result
    }
    return result
}

export function getCookie(cname: string): string {
    let name = cname + '='
    let ca = document.cookie.split(';')
    console.log('获取cookie,现在循环')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        console.log(c)
        while (c.charAt(0) === ' ') c = c.substring(1)
        if (c.indexOf(name) !== -1) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}

/**
 * @method 转化时间格式
 * @param time 2021-06-22T17:08:44Z
 * @returns "2021-06-23 01:08:44"
 */
export function formatTime(time: string): string {
    let json_date = new Date(time).toJSON()
    return new Date(+new Date(json_date) + 8 * 3600)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
}

export function formatTimeNumber(time: number): string {
    let dateee = new Date(time).toJSON()
    return new Date(+new Date(dateee) + 8 * 3600)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
}
