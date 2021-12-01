const db = require('../config/dbconfig.js')
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
            db.query('UPDATE 2_target SET ? WHERE id_target = ?', [newData, id], async (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    let newData1 = newData

                    let target1 = await translate(newData1['target'],{to: "en"})
                    let disp = await translate(newData1['display_name'],{to: "en"})
                    let des = await translate(newData1['deskripsi'],{to: "en"})
                    
                    newData1['target'] = target1.text
                    newData1['display_name'] = disp.text
                    newData1['deskripsi'] = des.text

                    db.query('UPDATE 22_target_en SET ? WHERE id_target = ?', [newData1, id], (err, results) => {
                        if (err) {
                            console.log(err)
                        } else {
                            req.flash('message', messageContent(`Target ID:${id} Berhasil di-edit!`, 'alert-success'))
                            res.redirect(`/admin/add_target`)
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

exports.edit_resources = async (req, res) => {
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
                let id = req.params.id_res
                db.query('SELECT * FROM 9_resources', (err, all_target) => {
                    db.query('SELECT * FROM 9_resources WHERE id_res = ?', id, (err, target_edit) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.render('admin/edit_resources', {
                                title: 'Edit Resources',
                                current_link: '/admin/edit_resources',
                                message: '',
                                res: all_target,
                                res_edit: target_edit[0],
                                admin: session,
                                id_region: id_region,
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

exports.update_resources = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let newData = req.body
            let id = req.params.id_res
            db.query('UPDATE 9_resources SET ? WHERE id_res = ?', [newData, id], async (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    let newData1 = newData

             
                    let nama_en = await translate(newData1['nama'],{to: "en"})
                    let kategori_en = await translate(newData1['kategori'],{to: "en"})
                   
                    
                    newData1['nama'] = nama_en.text
                    newData1['kategori'] = kategori_en.text

                    db.query('UPDATE 99_resources_en SET ? WHERE id_res = ?', [newData1, id], (err, results) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(newData1)
                            req.flash('message', messageContent(`Resources ID:${id} Berhasil di-edit!`, 'alert-success'))
                            res.redirect(`/admin/add_resources`)
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

exports.edit_group_data = async (req, res) => {
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
                let id = req.params.id_group_data
                db.query('SELECT * FROM 7_group_data', (err, all_group) => {
                    db.query('SELECT * FROM 7_group_data WHERE id_group_data = ?', id, (err, group_edit) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.render('admin/edit_group_data', {
                                title: 'Edit Target',
                                current_link: '/admin/add_group_data',
                                message: '',
                                all_group: all_group,
                                group_edit: group_edit[0],
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

exports.update_group_data = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let newData = req.body
            let id = req.params.id_group_data
            db.query('UPDATE 7_group_data SET ? WHERE id_group_data = ?', [newData, id], async (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    let newData1 = newData

                    let target1 = await translate(newData1['nama_group_data'],{to: "en"})
                    let disp = await translate(newData1['deskripsi_group'],{to: "en"})
                    
                    newData1['nama_group_data'] = target1.text
                    newData1['deskripsi_group'] = disp.text

                    db.query('UPDATE 77_group_data_en SET ? WHERE id_group_data = ?', [newData1, id], (err, results) => {
                        if (err) {
                            console.log(err)
                        } else {
                            req.flash('message', messageContent(`Group Data ID:${id} Berhasil di-edit!`, 'alert-success'))
                            res.redirect(`/admin/add_group_data`)
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

                    db.query('UPDATE 4_histori_capaian SET id_target = ? WHERE id_rincian_target = ?', [id_target, id], async (err, results1) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let newData1 = newData

                            let target1 = await translate(newData1['rincian_target'],{to: "en"})
                            let disp = await translate(newData1['satuan'],{to: "en"})
                            let disp2 = await translate(newData1['deskripsi'],{to: "en"})
                            
                            newData1['rincian_target'] = target1.text
                            newData1['satuan'] = disp.text
                            newData1['deskripsi'] = disp2.text

                            db.query('UPDATE 33_rincian_target_en SET ? WHERE id_rincian_target = ?', [newData1, id], (err, results) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    db.query('UPDATE 44_histori_capaian_en SET id_target = ? WHERE id_rincian_target = ?', [id_target, id], async (err, results1) => {
                                        if(err) {
                                            console.log(err)
                                        } else {
                                            req.flash('message', messageContent(`Rincian Target ID:${id} berhasil di-edit!`, 'alert-success'))
                                            res.redirect(`/admin/list_rincian_target`)
                                        }
                                    })
                                    
                                }
                            })
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
                    res.redirect('/admin/list_histori_capaian')
                }
            })
        }
    }
    if (confrim === true) {
        query();
    }
}

exports.update_style_data = async (req, res) => {
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
            let id = req.params.id_data

            db.query('UPDATE 8_list_data SET tipe_style = ?, style = ?, properti = ? WHERE id_data = ?', [kat, val, properti, id], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    res.redirect('/admin/list_data')
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
                db.query('UPDATE 4_histori_capaian SET ? WHERE id_histori_capaian = ?', [data, id], async (err, results) => {
                    if (err) {
                        console.log(err)
                    } else {
                        let newData1 = data

                        let target1 = await translate(newData1['status_verifikasi'],{to: "en"})
                        let disp = await translate(newData1['sumber_data'],{to: "en"})
                        
                        newData1['status_verifikasi'] = target1.text
                        newData1['sumber_data'] = disp.text

                        db.query('UPDATE 44_histori_capaian_en SET ? WHERE id_histori_capaian = ?', [newData1, id], (err, results) => {
                            if (err) {
                                console.log(err)
                            } else {
                                req.flash('message', messageContent(`Histori Capaian ID:${id} berhasil di-edit!`, 'alert-success'))
                                res.redirect(`/admin/list_histori_capaian`)
                            }
                        })
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

                    convertToObj['kinerja'] = convertToObj['target_tahunan'] - convertToObj['aktual'] 
                    updateQuery(convertToObj)

                    return false
                } else {
                    let final_path = Date.now() + '' + filename
                   
                    const fstream = fs.createWriteStream(path.join(uploadPath, final_path));
                    
                    // Pipe it trough
                    file.pipe(fstream);
             
                    fstream.on('close', () => {
                        delete convertToObj['ori_geojson']
                        convertToObj['kinerja'] = convertToObj['target_tahunan'] - convertToObj['aktual'] 

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

exports.edit_data = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let id = req.params.id_data
            db.query('SELECT 8_list_data.*, 7_group_data.* FROM 8_list_data LEFT JOIN 7_group_data ON 8_list_data.id_group_data = 7_group_data.id_group_data WHERE 8_list_data.id_data = ?', [id], (err, results) => {
                db.query('SELECT * FROM 7_group_data', (err, group_data) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('admin/edit_data', {
                            title: 'Edit Data',
                            menu: '',
                            page_name: 'edit Data',
                            current_link: '',
                            admin: session,
                            message: req.flash('message'),
                            data: results[0],
                            group_data:group_data,
                            id_region: id_region
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

exports.update_data = async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = async () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let updateQuery = (data) => {
                let id = req.params.id_data
                db.query('UPDATE 8_list_data SET ? WHERE id_data = ?', [data, id], async (err, results) => {
                    if (err) {
                        console.log(err)
                    } else {
                        let newData1 = data

                        let target1 = await translate(newData1['nama_data'],{to: "en"})
                        let disp = await translate(newData1['sumber_data'],{to: "en"})
                        let disp2 = await translate(newData1['status_data'],{to: "en"})
                        let disp3 = await translate(newData1['deskripsi_data'],{to: "en"})
                        
                        newData1['nama_data'] = target1.text
                        newData1['sumber_data'] = disp.text
                        newData1['status_data'] = disp2.text
                        newData1['deskripsi_data'] = disp3.text

                        db.query('UPDATE 88_list_data_en SET ? WHERE id_data = ?', [newData1, id], (err, results) => {
                            if (err) {
                                console.log(err)
                            } else {
                                req.flash('message', messageContent(`Data ID:${id} berhasil di-edit!`, 'alert-success'))
                                res.redirect(`/admin/list_data`)
                            }
                        })
                    }
                })
            }
            
            let form = new Map()
           
            const uploadPath = 'public/uploads/geojson/list_data/'

            let busboy = new Busboy({ headers: req.headers })

            busboy.on('field', (fieldname, val) => {
                form.set(fieldname, val)
            })
        
            busboy.on('file', async (fieldname, file, filename) => {
                let convertToObj = await Object.fromEntries(form)
                if(filename === '') {
                    convertToObj['geojson'] = await convertToObj['ori_geojson']
                    delete convertToObj['ori_geojson']
                    delete convertToObj['group_data_display']
                   
                    updateQuery(convertToObj)

                    return false
                } else {
                    let final_path = Date.now() + '' + filename
                   
                    const fstream = fs.createWriteStream(path.join(uploadPath, final_path));
                    
                    // Pipe it trough
                    file.pipe(fstream);
             
                    fstream.on('close', () => {
                        delete convertToObj['ori_geojson']
                        delete convertToObj['group_data_display']

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

















