const { NjSuper } = require('njsuper')
const { readFileSync, statSync } = require('fs')

class NjFile extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        this.updateFile()
        // this.stat = statSync(this.path)
        this.editedMs = statSync(this.path).ctimeMs
        this.edited = false
    }

    updateFile() {
        this.content = readFileSync(this.path)
    }

    updateTime() {
        this.editedMs = statSync(this.path).ctimeMs
        this.edited = false
    }

    isEdited() {
        const editedMs = statSync(this.path).ctimeMs
        if(this.editedMs === editedMs) {
            this.edited = false
            return false
        } else {
            this.edited = true
            return true
        }
    }
}

module.exports = { NjFile }