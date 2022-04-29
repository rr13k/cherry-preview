interface Case {
    id:number;
    name:string;
}

enum CaseState {
    SUCCESS, RUNING, ERROR , UNKNOWN
}

export class WebDb {
    db?:IDBDatabase
    request:IDBOpenDBRequest

    constructor(request:IDBOpenDBRequest) {
        this.request = request

        request.onerror = function (event) {
            console.error('web db error!', event);
        };

        request.onsuccess =  (event) => {
            const db = request.result
            this.db = db
            console.log('web db open!');

        };

        request.onupgradeneeded = function(event) {
            console.log('web db update!')
            var db = request.result
            var objectStore;
            if (!db.objectStoreNames.contains('cases')) {
                objectStore = db.createObjectStore('cases', { autoIncrement: true });
            }
        }

    }

    addCase(_case :Case) {
        if(!this.db) throw new Error('not find web db!')
        var request = this.db.transaction(['cases'], 'readwrite') //新建事务，readwrite, readonly(默认), versionchange 
            .objectStore('cases') //拿到IDBObjectStore 对象
            .add({  // 插入记录
                name: _case.name,
                date:'2020-04-27',
                script:'await page.to("https://baidu.com")',
                status: CaseState.UNKNOWN
        });
        
        request.onsuccess = function(event) {
            console.log('数据写入成功');
        }
        request.onerror = function(event) {
            console.log('数据写入失败');
        }
    }

}