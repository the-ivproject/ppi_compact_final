const db = require('../config/dbconfig.js')
const md5 = require('md5')
const multer = require("multer")
const path = require("path")
const Busboy = require('busboy')
const inspect = require('util').inspect
const fs = require('fs');
const translate = require('@vitalets/google-translate-api');

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
    limits: {
        fieldSize: 50 * 1024 * 1024 * 1024
    }
}).single('geojson')

const uploadLogo = multer({
    storage: storageImg,
}).single('logo')


// let trText = async (text) => {
//     let x = await translate(text, {to: "en"})
//     return x
// }

exports.post_user = (req, res) => {
    const {
        email,
        password
    } = req.body

    db.query('SELECT * FROM 0_admin WHERE email = ? AND password = ?', [email, md5(password)], (err, valid_user) => {
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

        if (req.file === undefined || req.file === ' ') {
            logo = '/default/image/avatar-1.jpg'
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

    const uploadPath = 'public/uploads/geojson/'

    let form = new Map()
    let busboy = new Busboy({
        headers: req.headers
    })

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
            db.query('INSERT INTO 1_region SET ?', {
                pj: form.get('pj'),
                level: form.get('pj'),
                nama_region: form.get('nama_region'),
                provinsi: form.get('provinsi'),
                geojson: (uploadPath + final_path).replace("public", ""),
                id_admin: form.get('id_admin')
            }, async (err, insert) => {
                if (err) {
                    console.log(err)
                } else {
                    db.query('UPDATE 0_admin SET id_region = ? WHERE id_admin = ?', [insert.insertId, form.get('id_admin')], (err, update) => {
                        req.flash('message', messageContent('Region anda berhasil ditambahkan!', 'alert-success'))
                        res.redirect('/admin/thank_region_regist')
                    })
                }
            })
        })
    })
    req.pipe(busboy)
}

exports.insert_target = async (req, res) => {
    const {
        id_region,
        target,
        display_name,
        deskripsi,
        icon
    } = req.body

    // trText
    db.query('INSERT INTO 2_target SET ?', {
        id_region,
        target,
        display_name,
        deskripsi,
        icon
    }, async (err, results) => {
        
        const target_en = await translate(target, {to: "en"})
        const display_name_en = await translate(display_name, {to: "en"})
        const deskripsi_en = await translate(deskripsi, {to: "en"})

        db.query('INSERT INTO 22_target_en SET ?', {
            id_region,
            target: target_en.text,
            display_name: display_name_en.text,
            deskripsi:deskripsi_en.text,
            icon
        }, async (err, results) => {
            if (err) {
                console.log(err)
            } else {
                req.flash('message', messageContent('Target baru berhasil ditambahkan', 'alert-success'))
                res.redirect('/admin/add_target')
            }
        })
    })
}

exports.insert_resources = async (req, res) => {
    const {
        id_region,
        nama,
        kategori,
        link_gd,
    } = req.body

    // trText
    db.query('INSERT INTO 9_resources SET ?', {
        id_region,
        nama,
        kategori,
        link_gd,
    }, async (err, results) => {
        
        const nama_en = await translate(nama, {to: "en"})
        const kategori_en = await translate(kategori, {to: "en"})


        db.query('INSERT INTO 99_resources_en SET ?', {
            id_region,
            nama: nama_en.text,
            kategori:kategori_en.text,
            link_gd
        }, async (err, results) => {
            if (err) {
                console.log(err)
            } else {
                req.flash('message', messageContent('Resources baru berhasil ditambahkan', 'alert-success'))
                res.redirect('/admin/add_resources')
            }
        })
    })
}

exports.insert_group_data = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = async () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            const {
                nama_group_data,
                icon_group_data,
                deskripsi_group
            } = req.body

            db.query('INSERT INTO 7_group_data SET ?', {
                id_region,
                nama_group_data,
                icon_group_data,
                deskripsi_group,
            }, async (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    const nama_group_data_en = await translate(nama_group_data, {to: "en"})
                    const deskripsi_group_en = await translate(deskripsi_group, {to: "en"})

                    db.query('INSERT INTO 77_group_data_en SET ?', {
                        id_region,
                        nama_group_data:nama_group_data_en.text,
                        icon_group_data,
                        deskripsi_group:deskripsi_group_en.text,
                    }, async (err, results) => {
                        if (err) {
                            console.log(err)
                        } else {
                            req.flash('message', messageContent('Group data baru berhasil ditambahkan', 'alert-success'))
                            res.redirect('/admin/add_group_data')
                        }
                    })
                }
            })
        }
    }
    if (confrim === true) {
        query();
    }
}

exports.insert_rincian_target = async (req, res) => {
    const date = Date.now()
    const last_update = new Date(date)
    const {
        id_target,
        id_region,
        rincian_target,
        baseline,
        satuan,
        deskripsi,
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
        deskripsi,
        rule,
        last_update
    }, async (err, results) => {
        if (err) {
            console.log(err)
        } else {
            const rincian_target_en = await translate(rincian_target, {to: "en"})
            const satuan_en = await translate(satuan, {to: "en"})
            const deskripsi_en = await translate(deskripsi, {to: "en"})
        
            db.query('INSERT INTO 33_rincian_target_en SET ?', {
                id_target,
                id_region,
                rincian_target:rincian_target_en.text,
                baseline,
                satuan:satuan_en.text,
                target_tahunan,
                deskripsi:deskripsi_en.text,
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
    })
}

exports.insert_histori_capaian = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = async () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            const uploadPath = 'public/uploads/geojson/'

            let form = new Map()
            let busboy = new Busboy({
                headers: req.headers
            })

            busboy.on('field', (fieldname, val) => {
                form.set(fieldname, val)
            })

            busboy.on('file', (fieldname, file, filename) => {

                let final_path = Date.now() + '' + filename
                // Create a write stream of the new file
                const fstream = fs.createWriteStream(path.join(uploadPath, final_path));
                // Pipe it trough
                file.pipe(fstream);

                // On finish of the upload
                fstream.on('close', async () => {
                    db.query('INSERT INTO 4_histori_capaian SET ?', {
                        id_target: form.get('id_target'),
                        id_region: form.get('id_region'),
                        id_rincian_target: form.get('id_rincian_target'),
                        tahun_data: form.get('tahun_data'),
                        geojson: (uploadPath + final_path).replace("public", ""),
                        status_verifikasi: form.get('status_verifikasi'),
                        sumber_data: form.get('sumber_data'),
                        target_tahunan: form.get('target_tahunan'),
                        aktual: form.get('aktual'),
                        kinerja: form.get('target_tahunan') - form.get('aktual')
                    }, async (err, insert) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let status_verifikasi_en = await translate(form.get('status_verifikasi'), {to: "en"})
                            let sumber_data_en = await translate(form.get('sumber_data'), {to: "en"})
        
                            db.query('INSERT INTO 44_histori_capaian_en SET ?', {
                                id_target: form.get('id_target'),
                                id_region: form.get('id_region'),
                                id_rincian_target: form.get('id_rincian_target'),
                                tahun_data: form.get('tahun_data'),
                                geojson: (uploadPath + final_path).replace("public", ""),
                                status_verifikasi: status_verifikasi_en.text,
                                sumber_data: sumber_data_en.text,
                                target_tahunan: form.get('target_tahunan'),
                                aktual: form.get('aktual'),
                                kinerja: form.get('target_tahunan') - form.get('aktual')
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
                                            db.query('UPDATE 33_rincian_target_en SET last_update = ? WHERE id_rincian_target = ?', [last_update, id], (err, update) => {
                                                if (err) {
                                                    console.log(err)
                                                } else {
                                                    req.flash('message', messageContent('Histori capaian baru berhasil ditambahkan!', 'alert-success'))
                                                    res.redirect('/admin/list_histori_capaian')
                                                }
                                            })
                                        }
                                    })
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

exports.insert_data = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            const uploadPath = 'public/uploads/geojson/list_data/'

            let form = new Map()
            let busboy = new Busboy({
                headers: req.headers
            })

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
                fstream.on('close', async () => {
                    db.query('INSERT INTO 8_list_data SET ?', {
                        id_group_data:  form.get('id_group_data'),
                        id_region: id_region,
                        nama_data: form.get('nama_data'),
                        tahun_data: form.get('tahun_data'),
                        sumber_data: form.get('sumber_data'),
                        status_data: form.get('status_data'),
                        geojson:(uploadPath + final_path).replace("public", ""),
                        deskripsi_data: form.get('deskripsi_data')
                    }, async (err, insert) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let nama_data_en = await translate(form.get('nama_data'),{to: "en"})
                            let sumber_data_en = await translate(form.get('sumber_data'),{to: "en"})
                            let status_data_en = await translate(form.get('status_data'),{to: "en"})
                            let des_data = await translate(form.get('deskripsi_data'),{to: "en"})

                            db.query('INSERT INTO 88_list_data_en SET ?', {
                                id_group_data:  form.get('id_group_data'),
                                id_region: id_region,
                                nama_data: nama_data_en.text,
                                tahun_data: form.get('tahun_data'),
                                sumber_data: sumber_data_en.text,
                                status_data: status_data_en.text,
                                geojson:(uploadPath + final_path).replace("public", ""),
                                deskripsi_data: des_data.text
                            }, async (err, insert) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    let id = form.get('id_group_data')
                                    let date = Date.now()
                                    const last_update = new Date(date)
                                    db.query('UPDATE 7_group_data SET last_update = ? WHERE id_group_data = ?', [last_update, id], (err, update) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            req.flash('message', messageContent('Data baru berhasil ditambahkan!', 'alert-success'))
                                            res.redirect('/admin/add_data')
                                        }
                                    })
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
