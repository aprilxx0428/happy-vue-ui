interface Promise<T> {
    /**
     * 确保Promise返回的是resolve状态
     * @param errorValue 如果是失败的状态，返回的值
     */
    tryResolve(errorValue): Promise<T>
}

Promise.prototype.tryResolve = tryResolve

async function mockAsync() {
    return 0
}

async function appendPromiseTryResoleve() {
    const e = mockAsync()
    e.constructor.prototype.tryResolve = tryResolve
}

appendPromiseTryResoleve()

function tryResolve(this: any, errorValue) {
    return new Promise(resolve => {
        this.then(data => resolve(data)).catch(() => resolve(errorValue))
    })
}
