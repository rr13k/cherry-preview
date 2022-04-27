export const __sleep = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms))

let __last_event: any = null

class CherryDriver {
    private iframeId = 'cherryDriver'
    private webApiAddr = 'http://localhost:8777/webApi'

    /**
     * @method 检查ifame是否存在
     */
    private checkIframe(): boolean {
        return null !== document.getElementById(this.iframeId)
    }

    /**
     * @method 创建iframe
     */
    private createIframe(): void {
        let iframe = document.createElement('iframe')
        iframe.id = this.iframeId
        // iframe.style.display = 'none'
        iframe.src = this.webApiAddr
        document.body.appendChild(iframe)
    }

    /**
     * @method 刷新driver-iframe页面
     */
    private refreshIframe(): void {
        let driver = document.getElementById(this.iframeId)
        ;(driver as HTMLIFrameElement).src = this.webApiAddr
    }

    /**
     * @method 向引擎传递数据
     */
    Post(cmd: any): void {
        let _this = this
        this.UsePromise()
            .then(() => {
                _this.__post(cmd)
            })
            .catch((e) => {
                console.log(e)
            })
    }

    private __post(cmd: any): void {
        let iframe = document.getElementById(this.iframeId)
        if (iframe == null) throw 'not find cherrydriver iframe,please check is alive!'
        ;(iframe as HTMLIFrameElement).contentWindow?.postMessage(cmd, '*')
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
    onMsg(msg: any): void {}

    private __onMsg(msg: any): void {
        if (msg.data.instruct !== 'recv-ping') {
            this.onMsg(msg)
        }
    }

    /**
     * @method 引擎可用承诺
     * @description 先检查服务是否启动，否则加载了iframe也要刷新。 首先检查iframe是否存在，存在后尝试iframe是否可用
     */
    private async UsePromise(): Promise<boolean> {
        return new Promise(async (res, rej) => {
            if (!(await this.checkServerPing())) {
                // 服务未启动唤醒服务
                this.checkCherryInstall().then((installed: boolean) => {
                    if (installed === false) {
                        alert('检查到未安装cherry-driver引擎,请前往安装。')
                    } else {
                        // this.rouseLocalCherry() // 检查安装时会自动呼起
                        rej('服务未启动,请稍后重试')
                        return
                    }
                })
            }

            if (!(await this.checkIframe())) {
                this.createIframe()
                await __sleep(300) // 初次加载需要延时
            }

            if (await this.checkDriverPing()) {
                res(true)
                if (__last_event !== null) {
                    // 记录last event 避免重复监听
                    window.removeEventListener('message', __last_event, false)
                }
                __last_event = this.__onMsg.bind(this)
                window.addEventListener('message', __last_event, false)
                return
            }

            rej('出现错误,无法感知服务状态!')
        })
    }

    /**
     * @method 检查是否安装了cherry引擎
     */
    checkCherryInstall(): Promise<boolean> {
        let urlProtocol = 'cherry://open'
        return new Promise((res) => {
            let target = document.createElement('input')
            target.style.width = '0'
            target.style.height = '0'
            target.style.position = 'fixed'
            target.style.top = '0'
            target.style.left = '0'
            document.body.appendChild(target)
            target.focus()

            let handler = this._registerEvent(target, 'blur', onBlur)
            function onBlur() {
                res(true)
                handler.remove()
                clearTimeout(timeout)
                document.body.removeChild(target)
            }

            //will trigger onblur
            location.href = urlProtocol
            // Note: timeout could vary as per the browser version, have a higher value
            let timeout = setTimeout(function () {
                res(false)
                handler.remove()
                document.body.removeChild(target)
            }, 1000)
        })
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    _registerEvent(target: any, eventType: string, cb: Function) {
        if (target.addEventListener) {
            target.addEventListener(eventType, cb)
            return {
                remove: function () {
                    target.removeEventListener(eventType, cb)
                }
            }
        } else {
            target.attachEvent(eventType, cb)
            return {
                remove: function () {
                    target.detachEvent(eventType, cb)
                }
            }
        }
    }

    /**
     * @method 检查driver-iframe是否正常通讯
     */
    private async checkDriverPing(): Promise<boolean> {
        return new Promise((res) => {
            let driver = document.getElementById(this.iframeId)
            if (driver == null) {
                res(false)
                return
            }
            // eslint-disable-next-line no-extra-semi
            ;(driver as HTMLIFrameElement).contentWindow?.postMessage(
                {
                    instruct: 'ping'
                },
                '*'
            )

            const timework = setTimeout(() => {
                res(false)
                window.removeEventListener('message', receiveMessage, false)
            }, 500)

            function receiveMessage() {
                clearTimeout(timework)
                window.removeEventListener('message', receiveMessage, false)
                res(true)
            }
            window.addEventListener('message', receiveMessage, false)
        })
    }

    /**
     * @method 检查服务是否启动
     */
    private async checkServerPing(): Promise<boolean> {
        return new Promise((res) => {
            let header = document.getElementsByTagName('head')[0]
            let a = document.createElement('script')
            a.setAttribute('type', 'text/javascript')
            a.setAttribute('src', 'http://localhost:777/webPing')
            header.appendChild(a)
            a.onload = function () {
                res(true)
            }
            a.onerror = function () {
                res(false)
            }

            setTimeout(() => {
                a.remove()
            }, 300)
        })
    }

    /**
     * @method 呼起本地driver程序
     */
    private rouseLocalCherry(): void {
        let a = document.createElement('a')
        a.setAttribute('href', 'cherry://open')
        a.click()
    }
}

export const cherryDriver = new CherryDriver()
