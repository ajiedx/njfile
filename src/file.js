const { NjSuper } = require('njsuper')
const { readFileSync, statSync } = require('fs')

class File extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        this.updateFile()
        // this.stat = statSync(this.path)
        this.editedMs = statSync(this.path).atimeMs
        this.edited = false
    }

    updateFile() {
        this.content = readFileSync(this.path)
    }

    updateTime() {
        this.editedMs = statSync(this.path).atimeMs
        this.edited = false
    }

    isEdited() {
        const editedMs = statSync(this.path).atimeMs
        if(this.editedMs === editedMs) {
            this.edited = false
            return false
        } else {
            this.edited = true
            return true
        }
    }
}

module.exports = { File }