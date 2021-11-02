const db = require('../config/dbconfig.js')
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


let check = (session, req, res) => {
    if (!session) {
        req.flash('message', messageContent('Upps, Mohon login terlebih dahulu!', 'alert-warning'))
        res.redirect('/admin/login')
    } else if (session[0].status === 0) {
        req.flash('message', messageContent('Akun belum aktif, pantau terus email Anda!', 'alert-warning'))
        res.redirect('/admin/login')
    } else if (session[0].id_region == null) {
        req.flash('message', messageContent('Buat profile anda sebelum mengakses menu lainnya!', 'alert-warning'))
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

exports.edit_target = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            fs.readFile('public/icon_list/fontawesome_list.txt', 'utf8' , (err, data) => {
                if (err) {
                  console.error(err)
                  return
                }
                let id = req.params.id_target
                db.query('SELECT * FROM 2_target', (err, all_target) => {
                    db.query('SELECT * FROM 2_target WHERE id_target = ?', id, (err, target_edit) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.render('admin/edit_target', {
                                title: 'Edit Target',
                                current_link: '/admin/add_target',
                                message: '',
                                all_target: all_target,
                                target_edit: target_edit[0],
                                admin: session,
                                id_region: id_region,
                                icon_list: data.split(",")
                            })
                        }
                    })
                })
            })
        }
    }
    if (confrim === true) {
        query();
    }
}

exports.update_target = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let newData = req.body
            let id = req.params.id_target
            db.query('UPDATE 2_target SET ? WHERE id_target = ?', [newData, id], (err, results) => {
                if (err) {
                    console.log(err)
                } else {

                    req.flash('message', messageContent(`Target ID:${id} Berhasil di-edit!`, 'alert-success'))
                    res.redirect(`/admin/add_target`)
                }
            })
        }
    }
    if (confrim === true) {
        query();
    }
}

exports.edit_rincian_target = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let id = req.params.id_rincian_target
            db.query('SELECT * FROM 2_target', (err, results) => {
                db.query('SELECT * FROM 3_rincian_target LIMIT 10', id, (err, rincian_target) => {
                    if (err) {
                        console.log(err)
                    } else {
                        db.query('SELECT * FROM 3_rincian_target WHERE id_rincian_target = ?', id, (err, rincian_target_edit) => {
                            if (err) {
                                console.log(err)
                            } else {
                                res.render('admin/edit_rincian_target', {
                                    title: 'Edit Rincian Target',
                                    menu: 'active',
                                    page_name: 'edit rincian target',
                                    current_link: '/admin/edit_rincian_target',
                                    message: '',
                                    admin: session,
                                    target: results,
                                    rincian_target: rincian_target,
                                    rincian_target_edit: rincian_target_edit[0],
                                    id_region: id_region
                                })
                            }
                        })
                    }
                })
            })
        }
    }
    if (confrim === true) {
        query();
    }
}

exports.update_rincian_target = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let newData = req.body
            delete newData['target']
           
            let id = req.params.id_rincian_target
            db.query('UPDATE 3_rincian_target SET ? WHERE id_rincian_target = ?', [newData, id], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    let id_target = newData.id_target

                    db.query('UPDATE 4_histori_capaian SET id_target = ? WHERE id_rincian_target = ?', [id_target, id], (err, results1) => {
                        if (err) {
                            console.log(err)
                        } else {
                            req.flash('message', messageContent(`Rincian Target ID:${id} berhasil di-edit!`, 'alert-success'))
                            res.redirect(`/admin/list_rincian_target`)
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

exports.update_style_layer = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let kat = req.body['kat']
            let val = req.body['val']
            let properti = req.body['properti']
            let id = req.params.id_histori_capaian

            db.query('UPDATE 4_histori_capaian SET tipe_style = ?, style = ?, properti = ? WHERE id_histori_capaian = ?', [kat, val, properti, id], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    res.redirect('/admin')
                }
            })
        }
    }
    if (confrim === true) {
        query();
    }
}

exports.edit_detail_region = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let id = req.params.id_region
            db.query('SELECT * FROM 1_region WHERE id_region = ?', [id], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('admin/detail_region', {
                        title: 'Detail Region',
                        menu: '',
                        page_name: 'edit region',
                        current_link: `/action/admin/detail_region/${id}`,
                        admin: session,
                        message: req.flash('message'),
                        detail_region: results[0],
                        id_region: id
                    })
                }
            })
        }
    }
    if (confrim === true) {
        query();
    }
}

exports.update_detail_region = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {

            let updateQuery = (data) => {
                let id = req.params.id_region
                db.query('UPDATE 1_region SET ? WHERE id_region = ?', [data, id], (err, results) => {
                    if (err) {
                        console.log(err)
                    } else {
                        req.flash('message', messageContent('Detail region berhasil di-edit!', 'alert-success'))
                        res.redirect(`/action/admin/detail_region/${id}`)
                    }
                })
            }
            
            let form = new Map()
           
            const uploadPath = 'public/uploads/geojson/'

            let busboy = new Busboy({ headers: req.headers })

            busboy.on('field', (fieldname, val) => {
                form.set(fieldname, val)
            })
        
            busboy.on('file', async (fieldname, file, filename) => {
                let convertToObj = await Object.fromEntries(form)
                if(filename === '') {
                    convertToObj['geojson'] = await convertToObj['ori_geojson']
                    delete convertToObj['ori_geojson']

                    updateQuery(convertToObj)

                    return false
                } else {
                    let final_path = Date.now() + '' + filename
                   
                    const fstream = fs.createWriteStream(path.join(uploadPath, final_path));
                    
                    // Pipe it trough
                    file.pipe(fstream);
             
                    fstream.on('close', () => {
                        delete convertToObj['ori_geojson']
                        convertToObj['geojson'] = (uploadPath + final_path).replace("public","")
                        
                        updateQuery(convertToObj)
                    })
                }
            })
            req.pipe(busboy)
        }
    }
    if (confrim === true) {
        query();
    }
}

exports.edit_histori_capaian = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let id = req.params.id_histori_capaian
            db.query('SELECT 4_histori_capaian.*, 3_rincian_target.id_rincian_target, 3_rincian_target.satuan FROM 4_histori_capaian LEFT JOIN 3_rincian_target ON 4_histori_capaian.id_rincian_target = 3_rincian_target.id_rincian_target WHERE 4_histori_capaian.id_histori_capaian = ?', [id], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('admin/edit_histori_capaian', {
                        title: 'Edit Histori Capaian',
                        menu: '',
                        page_name: 'edit histori capaian',
                        current_link: '',
                        admin: session,
                        message: req.flash('message'),
                        histori_capaian: results[0],
                        id_region: id_region
                    })
                }
            })
        }
    }
    if (confrim === true) {
        query();
    }
}

exports.update_histori_capaian = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = async () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let updateQuery = (data) => {
                let id = req.params.id_histori_capaian
                db.query('UPDATE 4_histori_capaian SET ? WHERE id_histori_capaian = ?', [data, id], (err, results) => {
                    if (err) {
                        console.log(err)
                    } else {
                        req.flash('message', messageContent(`Histori Capaian ID:${id} berhasil di-edit!`, 'alert-success'))
                        res.redirect(`/admin/list_histori_capaian`)
                    }
                })
            }
            
            let form = new Map()
           
            const uploadPath = 'public/uploads/geojson/'

            let busboy = new Busboy({ headers: req.headers })

            busboy.on('field', (fieldname, val) => {
                form.set(fieldname, val)
            })
        
            busboy.on('file', async (fieldname, file, filename) => {
                let convertToObj = await Object.fromEntries(form)
                if(filename === '') {
                    convertToObj['geojson'] = await convertToObj['ori_geojson']
                    delete convertToObj['ori_geojson']

                    updateQuery(convertToObj)

                    return false
                } else {
                    let final_path = Date.now() + '' + filename
                   
                    const fstream = fs.createWriteStream(path.join(uploadPath, final_path));
                    
                    // Pipe it trough
                    file.pipe(fstream);
             
                    fstream.on('close', () => {
                        delete convertToObj['ori_geojson']
                        convertToObj['geojson'] = (uploadPath + final_path).replace("public","")
                        
                        updateQuery(convertToObj)
                    })
                }
            })
            req.pipe(busboy)
        }
    }
    if (confrim === true) {
        query();
    }
}
















