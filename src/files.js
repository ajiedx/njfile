const { NjSuper } = require('njsuper')
const { readdirSync } = require('fs')
const { NjFile } = require('./file')

class NjFiles extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        if (this.construct == false) {
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
        for (const name in this.fls) {
            Object.defineProperty(this, [name], {
                value: this.resolveObject(name, { obj: NjFile, path: this.fls[name].path }),
                enumerable: true,
                writable: true,
                configurable: true
                }
            )

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
                    console.log(this.pathname)
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
                                    console.log(dirent)
                                    this.readDir(path+'/'+dirent.name, ext, rec, true)
                                }
                                
                                if (dirent.name.includes('.')) {
                                    if (dirent.name.endsWith(ext)) {
                                        const name = dirent.name.split('.')[0]
                                        const filepath = path+'/'+dirent.name
                                        console.log(dirent.isFile())
                                        if(dirent.isFile) {
  
                                            Object.assign(this.fls, {[name]: {path: filepath}})
                                        }
    
                                    } 
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