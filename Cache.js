class Cache{
    constructor(){
        this.data=new Map()
    }

    // set key val
    set(key, val){
        this.data.set(key, val)
        return null
    }

    // get val
    get(key){
        return this.data.get(key)
    }

    // has key
    has(key){
        return this.data.has(key)
    }

    // update key val
    update(key, newVal){
         this.data.set(key, newVal)
        return null
    }

    // delete key
    delete(key){
        return this.data.delete(key)
    }
}

module.exports=Cache