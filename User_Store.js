const crypto = require('crypto')
const Cache= require('./Cache')

class UserStore{
    constructor(){
        this.users=new Map()
    }

    // new user
    setNewUser(name, password){
        const encryptedPass= crypto.createHash('sha256').update(password).digest('hex')
        this.users.set(name,{password:encryptedPass, cache: new Cache()})
    }

    // user exists
    isUserExisting(name){
        return this.users.has(name)
    }

    // check password
    isCorrPass(name, password){
        const inputPass= crypto.createHash('sha256').update(password).digest('hex')
        return this.users.get(name).password===inputPass
    }

    // get cache of user
    getCache(name){
        return this.users.get(name).cache
    }
}

module.exports=UserStore