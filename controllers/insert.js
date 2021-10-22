const db = require('../config/dbconfig.js')
const md5 = require('md5')
const multer = require("multer")
const path = require("path")
const Busboy = require('busboy')
const inspect = require('util').inspect
const fs = require('fs');

let messageContent = (information, alert_class) => {
    return `<div class="alert ${alert_class} alert-dismissible fade show" role="alert"> 
         ${information}
        <a href="#" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
    </a>
 </div>`
}

let messageAlertLogin = (information) => {
    return `<div class="alert alert-warning alert-dismissible fade show" role="alert"> 
        ${information}
        <a href="#" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
    </a>
 </div>`
}

let check = (session, req, res) => {
    if (!session) {
        req.flash('message', messageAlertLogin('Upps, Mohon login terlebih dahulu!'))
        res.redirect('/admin/login')
    } else if (session[0].status === 0) {
        req.flash('message', messageAlertLogin('Akun belum aktif, pantau terus email Anda!'))
        res.redirect('/admin/login')
    } else if (session[0].id_region == null) {
        req.flash('message', messageAlertLogin('Buat profile anda sebelum mengakses menu lainnya!'))
        res.render('admin/add_region', {
            id_admin: session[0].id_admin,
            title: 'Tambah Region',
            menu: 'active',
            page_name: 'add region',
            current_link: '',
            message: req.flash('message'),
        })
    } else {
        return true
    }
}


const imgStorage = "public/uploads/"
const geojsonStorage = "public/uploads/geojson"

const storageImg = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imgStorage)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
})

const storageGeojson = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, geojsonStorage)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
})
// const uploadGeoJson = multer({ storage: storage })

const uploadGeojson = multer({
    storage: storageGeojson,
    limits: { fieldSize: 50 * 1024 * 1024 * 1024 }
}).single('geojson')

const uploadLogo = multer({
    storage: storageImg,
}).single('logo')

exports.post_user = (req, res) => {
    const {
        username,
        password
    } = req.body

    db.query('SELECT * FROM 0_admin WHERE username = ? AND password = ?', [username, md5(password)], (err, valid_user) => {
        if (err) {
            console.log(err)
        } else if (valid_user.length == 0) {
            req.flash('message', messageContent('Username atau password salah!', 'alert-danger'))
            res.redirect('/admin/login')
        } else if (valid_user[0].id_region === null) {
            req.session.user = valid_user
            res.redirect('/admin/add_region')
        } else {
            req.session.user = valid_user
            res.redirect('/admin')
        }
    })
}

exports.insert_account = (req, res) => {
    uploadLogo(req, res, (err) => {
        const {
            first_name,
            last_name,
            institusi,
            email,
            username,
            password,
        } = req.body

        let logo;

        if (req.file === undefined) {
            logo = ''
        } else {
            logo = req.file.destination + req.file.filename
        }

        db.query('SELECT * FROM 0_admin WHERE email = ?', [email], (err, check) => {
            if (err) {
                console.log(err)
            } else if (check.length === 0) {
                db.query('INSERT INTO 0_admin SET ?', {
                    first_name,
                    last_name,
                    institusi,
                    email,
                    username,
                    password: md5(password),
                    logo: logo
                }, async (err, results) => {
                    if (err) {
                        console.log(err)
                    } else {
                        req.flash('message', messageContent('Akun akan segera diaktifkan, pantau terus email Anda!', 'alert-success'))
                        res.redirect('/admin/sign_up')
                    }
                })
            } else {
                let message_content = email
                req.flash('message', messageContent('Maaf, email sudah digunakan!', 'alert-danger'))
                res.redirect('/admin/sign_up')
            }
        })

    })
}

exports.insert_region = (req, res) => {
    const {
        pj,
        level,
        nama_region,
        provinsi,
        geojson,
        id_admin
    } = req.body
    db.query('INSERT INTO 1_region SET ?', {
        pj: pj,
        level: level,
        nama_region: nama_region,
        provinsi: provinsi,
        geojson: geojson,
        id_admin: id_admin
    }, async (err, results) => {
        if (err) {
            console.log(err)
        } else {
            db.query('UPDATE 0_admin SET id_region = ? WHERE id_admin = ?', [results.insertId, id_admin], (err, update) => {
                req.flash('message', messageContent('Region anda berhasil ditambahkan!', 'alert-success'))
                res.redirect('/admin/thank_region_regist')
            })
        }
    })
}

exports.insert_target = (req, res) => {
    const {
        id_region,
        target,
        display_name,
        deskripsi,
        icon
    } = req.body
    db.query('INSERT INTO 2_target SET ?', {
        id_region,
        target,
        display_name,
        deskripsi,
        icon
    }, async (err, results) => {
        if (err) {
            console.log(err)
        } else {
            req.flash('message', messageContent('Target baru berhasil ditambahkan', 'alert-success'))
            res.redirect('/admin/add_target')
        }
    })
}

exports.insert_rincian_target = (req, res) => {
    const date = Date.now()
    const last_update = new Date(date)
    const {
        id_target,
        id_region,
        rincian_target,
        baseline,
        satuan,
        target_tahunan,
        rule
    } = req.body
    db.query('INSERT INTO 3_rincian_target SET ?', {
        id_target,
        id_region,
        rincian_target,
        baseline,
        satuan,
        target_tahunan,
        rule,
        last_update
    }, async (err, results) => {
        if (err) {
            console.log(err)
        } else {
            req.flash('message', messageContent('Rincian target baru berhasil ditambahkan!', 'alert-success'))
            res.redirect('/admin/add_rincian_target')
        }
    })
}

exports.insert_histori_capaian = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            const uploadPath = 'public/uploads/geojson/'

            let form = new Map()
            let busboy = new Busboy({ headers: req.headers })

            busboy.on('field', (fieldname, val) => {
                form.set(fieldname, val)
            })

            busboy.on('file', async (fieldname, file, filename) => {

                let final_path = Date.now() + '' + filename
                // Create a write stream of the new file
                const fstream = fs.createWriteStream(path.join(uploadPath, final_path));
                // Pipe it trough
                file.pipe(fstream);

                // On finish of the upload
                fstream.on('close', () => {
                    db.query('INSERT INTO 4_histori_capaian SET ?', {
                        id_target: form.get('id_target'),
                        id_region: form.get('id_region'),
                        id_rincian_target: form.get('id_rincian_target'),
                        tahun_data: form.get('tahun_data'),
                        geojson: (uploadPath + final_path).replace("public",""),
                        status_verifikasi: form.get('status_verifikasi'),
                        sumber_data: form.get('sumber_data'),
                        target_tahunan: form.get('target_tahunan'),
                        aktual: form.get('aktual')
                    }, async (err, insert) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let id = form.get('id_rincian_target')
                            let date = Date.now()
                            const last_update = new Date(date)
                            db.query('UPDATE 3_rincian_target SET last_update = ? WHERE id_rincian_target = ?', [last_update, id], (err, update) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    req.flash('message', messageContent('Histori capaian baru berhasil ditambahkan!', 'alert-success'))
                                    res.redirect('/admin/list_histori_capaian')
                                }
                            })
                        }
                    })
                })
            })

            req.pipe(busboy)
        }
    }

    if (confrim === true) {
        query();
    }
}


