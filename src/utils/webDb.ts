import { scriptExamples } from "./example";

interface Case {
    id: number
    name: string
    state: CaseState
    script: string
    config: any
    preCase:number[]
    /**
     * 需要很多的配置
     * 主要为执行模式的配置，可以单独执行也可以串联执行，他们都需要返回执行结果
     */
}

export enum CaseState {
    UNKNOWN, RUNING, SUCCESS, ERROR
}

export class WebDb {
    db?: IDBDatabase
    frist: boolean = false

    async init(request: IDBOpenDBRequest): Promise<void> {
        const _this = this
        return new Promise((resolve, reject) => {
            request.onerror = function (event) {
                console.error('web db error!', event);
            };

            request.onsuccess = (event) => {
                const db = request.result
                this.db = db
                console.log('web db open!');
                // 需要在这里判断是否为第一次
                if (this.frist) {
                    // 首次使用添加示例脚本
                    for (let example of scriptExamples) {
                        _this.addCase(example)
                    }
                }
                resolve()
            };

            request.onupgradeneeded = function (event) {
                _this.frist = true
                console.log('web db update!')
                var db = request.result
                var objectStore;
                if (!db.objectStoreNames.contains('cases')) {
                    objectStore = db.createObjectStore('cases', { keyPath: 'id' });
                    objectStore.createIndex('name','name',{ unique:false })
                }
            }
        })
    }

    async deleteCase(id:number){
        if (!this.db) throw new Error('not find web db!')
        const store = this.db.transaction(['cases'], 'readwrite').objectStore('cases')
        store.delete(id)
    }

    async UpdateCase(_case:any):Promise<void>{
        return  new Promise((resolve, reject) => {
            this.getCaseById(_case.id).then((result)=>{
                if (!this.db) throw new Error('not find web db!')
                let store = this.db.transaction(['cases'], 'readwrite').objectStore('cases')
                _case = Object.assign(result,_case)
                const request = store.put(_case)
                request.onsuccess = ()=>{
                    resolve()
                }
                request.onerror = (event)=>{
                    reject()
                    console.log('UpdateCase error:',event)
                }
            })
        })
    }

    async getCaseList(page: number = 1, pageSize: number = 10) {
        return new Promise((resolve, reject) => {
            if (!this.db) throw new Error('not find web db!')
            let data: Case[] = []
            let store = this.db.transaction(['cases'], 'readonly').objectStore('cases')
            let requeset = store.openCursor(null, 'prev')
            let count = store.count()
            let index: any = null
            requeset.onsuccess = function (event) {
                let res = requeset.result;
                if (res) {
                    if (index === pageSize - 1) {
                        data.push(res.value);
                        return resolve({
                            count: count.result,
                            data
                        })
                    }
                    if (index === null && page !== 1) {
                        index = 0
                        res.advance((page - 1) * pageSize)
                    } else {
                        index++
                        data.push(res.value);
                        res.continue();
                    }
                } else {
                    resolve({
                        count: count.result,
                        data
                    })
                }
            }
            requeset.onerror = function () {
                console.log('读取数据失败')
            }
        })

    }

    async getCaseById(id: number): Promise<Case> {
        return new Promise((resolve, reject) => {
            if (!this.db) throw new Error('not find web db!')
            var request = this.db.transaction(['cases']) //新建事务，readwrite, readonly(默认), versionchange 
                .objectStore('cases') //拿到IDBObjectStore 对象
                .get(id);

            request.onsuccess = function (event) {
                resolve(request.result)
            }
            request.onerror = function (error) {
                reject(error)
            }
        })
    }
    
    async getCaseByName(name:string) :Promise<Case[]>{
        return new Promise((resolve, reject) => {
            if (!this.db) throw new Error('not find web db!')
            var store = this.db.transaction(['cases'])
            .objectStore('cases')
            let requeset = store.index('name').openCursor()
            const list :Case[] = []
            let index: any = null
            requeset.onsuccess = (event)=>{
                let result = requeset.result;
                if (result) {
                    if (result.value.name.includes(name)) {
                        list.push(result.value)
                    }
                    result.continue()
                } else {
                    resolve(list)
                }
            }
        })
    }

    addCase(_case: { name: string, script: string,id?:number,preCase?:number[] }) :Promise<void>{
       return new Promise((resolve,reject)=>{
        if (!this.db) throw new Error('not find web db!')
        const store = this.db.transaction(['cases'], 'readwrite').objectStore('cases') //拿到IDBObjectStore 对象
        var countRequest = store.count()
        countRequest.onsuccess = function (res) {
            // store.getKey
            var request = store.add({
                id: _case.id || countRequest.result + 1,
                name: _case.name,
                createdDate: new Date().getTime(),
                script: _case.script,
                preCase:_case.preCase || [],
                state: CaseState.UNKNOWN
            });

            request.onsuccess = function (event) {
                resolve()
            }

            request.onerror = function (event) {
                reject()
                console.error('addCase error:', event);
            }
        }
       })
    }

}