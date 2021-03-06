const { NjSuper } = require('njsuper')
const { readFileSync, statSync } = require('fs')

class NjFile extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)

        if (this.path.includes('/')) {
            this.dir = this.path.split('/')
            let pop = this.path.split('/')
            this.ext = pop.pop().split('.')[1]
            this.name = this.dir.pop().split('.')[0]
            
            
            this.dir = this.dir[this.dir.length - 1]
        }


        this.updateFile()
        if (this.string == true) {
            this.toString()
        }
        // this.stat = statSync(this.path)
        this.editedMs = statSync(this.path).ctimeMs
        this.edited = false
    }

    updateFile() {
        this.buffer = readFileSync(this.path)
    }

    toString() {
        this.content = this.buffer.toString()
    }

    get() {
        return this.content
    }

    updateTime() {
        this.editedMs = statSync(this.path).ctimeMs
        this.edited = false
    }

    isEdited() {
        if (!this.edited) {
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
}

module.exports = { NjFile }