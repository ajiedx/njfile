const { NjSuper } = require('njsuper')
const { readdirSync } = require('fs')
const { NjFile } = require('./file')

class NjFiles extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        if (this.construct === false) {
            this.dirs = {}
        } else {
            this.scanned = []
            for (const i in this.dirs) {
                const folder = this.dirs[i].split('/').pop()

                if(!this.scanned.includes(folder)) {
                    this[folder] = new NjFiles(folder, {entity: folder, construct: false})
                    this[folder].setDir(this.dirs[i], {name: folder})
                    for (const l in this.ext) {
                        this[folder].setExt(this.ext[l], folder, this.rec)
                    }
                    this.scanned.push(folder)
                }
            }
        }
    }

    readFiles() {
        for (const name in this.files) {
            Object.defineProperty(this, [name], {
                value: this.resolveObject(name, { obj: NjFile, path: this.files[name].path }),
                enumerable: true,
                writable: true,
                configurable: true
                }
            )

        }
    }
    
    readDir(name, ext, rec) {
        try {
            var path
            if (this.dirs[name] === undefined) {
                path = name
            } else {
                path = this.dirs[name].path
                if (name !== undefined) {
                    this.pathname = name
                }
                
            }

            if (!this.files) {
                this.files = {}
            }
            
            if (!ext) {
                if (this.pathname) {
                    Object.defineProperty(this, this.pathname, {
                        
                        value: this.resolveObject(this.entites, this.files),
                        enumerable: true,
                        writable: true,
                        configurable: true
                    })
                    delete this.pathname
                }
                

            } else {
                const dir = readdirSync(path)
                for (let i = 0; i <= 1; i++) {
                    if (i === 0) {
                        for (const dirent of dir) {
                            if (dirent.includes('.')) {
                                if (dirent.includes(ext)) {
                                    const name = dirent.split('.')[0]
                                    const filepath = path+'/'+dirent

                                    Object.assign(this.files, {[name]: {path: filepath}})
                                    
                                } 
                            } else if (rec === true) {
                                this.readDir(path+'/'+dirent, ext, false)
                                
                            } else if (!dirent.includes('.')) {
                                if (!dirent.includes(ext)) {
                                    if (this.rec === true) {
                                        this.readDir(path+'/'+dirent, ext, true)
                                    }
                                }
                            } 
            
                        }
                    } else {
                        this.readDir(undefined, false, false)
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
        }
        Object.assign(this.dirs, {[opt.name]: {path}})
        
        this.dir = opt.name
        return opt.name
    }
}

module.exports = { NjFiles, NjFile }