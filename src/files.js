const { NjSuper } = require('njsuper')
const { readdirSync } = require('fs')
const { NjFile } = require('./file')

class NjFiles extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        if (this.construct == false) {
            this.dirs = {}
        } else if (this.dirs) {
            this.scanned = []
            if (this.typeof(this.dirs) === 'array') {
                for (const i in this.dirs) {
                    const folder = this.dirs[i].split('/').pop()
                    
                    if(!this.scanned.includes(folder)) {
                        this[folder] = new NjFiles(folder, {entity: folder, construct: false})
                        this[folder].setDir(this.dirs[i], {name: folder})
                        for (const l in this.ext) {
                            this[folder].setExt(this.ext[l], folder, this.recursive)
                        }
                        this.scanned.push(folder)
                    }
                }
            } else if (this.dt.includes('/')) {
                const folder = this.dt.split('/').pop()
                if (!this.ext) {
                    this.setDir(this.dt, {name: folder})
                    this.readDir(folder, 'all', this.recursive)
                    this.readFiles()
                } else {
                    for (const l in this.ext) {
                        this[this.ext[l]] = new NjFiles(this.ext[l], {entity: folder, construct: false})
                        this[this.ext[l]].setDir(this.dt, {name: folder})
                        this[this.ext[l]].setExt(this.ext[l], folder, this.recursive)
                    }
                } 
            }
        }

    }



    toSring() {
        for (const i in this) {
            if (this[i] instanceof NjFile) {
                this[i].toSring()
            }
        }
    }

    defineFile(name, value) {
        Object.assign(value, {obj: NjFile})
        Object.defineProperty(this, [name], {
            value: this.resolveObject(name, value),
            enumerable: true,
            writable: true,
            configurable: true
            }
        )
    }

    readFiles() {
        for (const name in this.fls) {
            const value = {obj: NjFile}
            Object.assign(value, this.fls[name])
            this.defineFile(name, value)
        }
    }

    assignFiles(file, ext, path) {
        const filepath = path+'/'+file.name
        const name = file.name.split('.')[0]
        if (this.decimal) {
            if (this.last) Object.assign(this.fls, {[this.last + 1]: {path: filepath, name, ext}}), this.last = this.last + 1
            else {
                let number = 0
                for (const i in this) {
                    if (!isNaN(i)) if (number < Number(i)) number = Number(i)
                }
                this.last = number;  Object.assign(this.fls, {[this.last + 1]: {path: filepath, name, ext}}), this.last = this.last + 1
            }
        } else {
        
            if (this.fls[name]) {
                console.log(name + ' file is already defined')
            } else {
                Object.assign(this.fls, {[name]: {path: filepath, name, ext}})
            }
        }
    }

    readDir(name, ext, rec, loop) {
        try {
            var path
            if (loop) {
                path = name
            } else {
                if (this.dirs[name] === undefined) {
                    path = name
                } else {
                    path = this.dirs[name].path
                    if (name !== undefined) {
                        this.pathname = name
                    }

                }

                if (!this.fls) {
                    this.fls = {}
                }
            }

            if (!ext) {
                if (this.pathname) {
                    Object.defineProperty(this, this.pathname, {

                        value: this.resolveObject(this.entites, this.fls),
                        enumerable: true,
                        writable: true,
                        configurable: true
                    })
                    delete this.pathname
                }


            } else {

                if (rec === false) {
                    this.readDir(undefined, false, false)
                } else {
                    const dir = readdirSync(path, {withFileTypes: true})
                    for (let i = 0; i <= 1; i++) {
                        if (i === 0) {
                            for (const dirent of dir) {
                                if(!dirent.isFile()) {
                                    this.readDir(path+'/'+dirent.name, ext, rec, true)
                                } else if (dirent.name.includes('.') && ext !== 'all') {
                                    if (dirent.name.endsWith(ext) ) {
                                        this.assignFiles(dirent, ext, path)
                                    }
                                } else if (ext === 'all') {
                                    this.assignFiles(dirent, ext, path)
                                }
                            }
                        } else {
                            this.readDir(undefined, false, false)
                        }
                    }

                }


            }

        } catch (err) {
            console.error(err);
        }
    }

    setExt(ext, name, rec) {
        this.rec = rec

        try {
            this.readDir(name, ext, rec)

            this.readFiles()
        } catch (err) {
            console.error(err);
        }
    }

    setDir(path, opt) {
        if(!opt.name) {
            opt.name = path.split('/').pop()
        }

        if (opt.entity) {
            if (this.entites) {
                for (const i in this.entites) {
                    if(this.entites[i] !== opt.entity) {
                        this.entites.push(opt.entity)
                    }
                }
            } else {
                this.entites = [opt.entity]
            }
        } else {
            this.entites = [opt.name]
        }

        Object.assign(this.dirs, {[opt.name]: {path}})

        this.dir = opt.name
        return opt.name
    }
}

module.exports = { NjFiles, NjFile }
