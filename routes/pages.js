const express = require('express')
const db = require('../config/dbconfig.js')
const fs = require('fs')

const router = express.Router()

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

router.get('/admin', async (req, res) => {

    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            db.query('SELECT 0_admin.*, 1_region.nama_region,1_region.provinsi, 1_region.id_region FROM 0_admin LEFT JOIN 1_region ON 0_admin.id_region = 1_region.id_region WHERE 0_admin.id_region = ?', [id_region], (err, admin) => {
                db.query('SELECT 4_histori_capaian.*, 3_rincian_target.rincian_target, 3_rincian_target.id_rincian_target, 3_rincian_target.satuan FROM 4_histori_capaian LEFT JOIN 3_rincian_target ON 4_histori_capaian.id_rincian_target = 3_rincian_target.id_rincian_target WHERE 4_histori_capaian.id_region = ?', [id_region], (err, histori_capaian) => {
                    db.query('SELECT * FROM 2_target WHERE id_region = ?', [id_region], (err, target) => {
                        if (err) {
                            console.log(err)
                        } else {
                       
                            res.render('admin/index', {
                                title: `Selamat Datang`,
                                menu: 'active',
                                page_name: 'dashboard',
                                current_link: '/admin',
                                admin: admin,
                                message: '',
                                histori_capaian: histori_capaian,
                                id_region: id_region,
                                target: target
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
})

router.get('/admin/add_region', async (req, res) => {
    let session = await req.session.user
    let confirm = await check(session, req, res)
})

router.get('/admin/login', (req, res) => {
    res.render('admin/login', {
        title: 'Login',
        wrong_confirm: '',
        message: req.flash('message') || '',
    })
})

router.get('/admin/logout', (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/admin/login'); //Inside a callback… bulletproof!
    });
})

router.get('/admin/sign_up', (req, res) => {
    db.query('SELECT * FROM 1_region', (err, region) => {
        if (err) {
            console.log(err)
        } else {
            res.render('admin/sign_up', {
                title: 'Sign Up',
                region: region,
                message: req.flash('message'),
            })
        }
    })
})

router.get('/admin/thank_region_regist', (req, res) => {
    res.render('admin/thank_region_regist', {
        title: 'Thank You',
        message: ''
    })
})

router.get('/admin/add_target', async (req, res) => {
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

                db.query('SELECT * FROM 2_target WHERE id_region = ?', [id_region], (err, results) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('admin/add_target', {
                            title: 'Tambah Target',
                            menu: 'active',
                            page_name: 'add target',
                            current_link: '/admin/add_target',
                            message: req.flash('message'),
                            target: results,
                            admin: session,
                            id_region: id_region,
                            icon_list: data.split(",")
                        })
                    }
                })
            })
        }
    }
    if (confrim === true) {
        query();
    }
})

router.get('/admin/add_rincian_target', async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            db.query('SELECT * FROM 2_target WHERE id_region = ?', [id_region], (err, results) => {
                db.query('SELECT * FROM 3_rincian_target WHERE id_region = ? LIMIT 10 ', [id_region], (err, rincian_target) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('admin/add_rincian_target', {
                            title: 'Tambah Rincian Target',
                            menu: 'active',
                            page_name: 'add rincian',
                            current_link: '/admin/add_rincian_target',
                            message: req.flash('message'),
                            target: results,
                            admin: session,
                            rincian_target: rincian_target,
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
})

router.get('/admin/add_capaian', async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            db.query('SELECT 3_rincian_target.*, 2_target.* FROM 3_rincian_target LEFT JOIN 2_target ON 3_rincian_target.id_target = 2_target.id_target WHERE 3_rincian_target.id_region = ?', [id_region], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('admin/add_capaian', {
                        title: 'Tambah Capaian',
                        menu: 'active',
                        page_name: 'add capaian',
                        current_link: '/admin/add_capaian',
                        message: req.flash('message'),
                        rincian_target: results,
                        id_region: id_region,
                        admin: session,
                        // for handling type of page undefined 
                        param_check: results[0]
                    })
                }
            })
        }
    }
    if (confrim === true) {
        query();
    }
})

router.get('/admin/add_capaian_id/:id_rincian_target', async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let id = req.params.id_rincian_target
            db.query('SELECT * FROM 3_rincian_target WHERE 3_rincian_target.id_rincian_target = ? AND 3_rincian_target.id_region = ?', [id, id_region], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('admin/add_capaian_id', {
                        title: results[0].rincian_target.toUpperCase(),
                        menu: 'active',
                        page_name: 'add capaian',
                        current_link: '/admin/add_capaian_id/:id_rincian_target',
                        message: req.flash('message'),
                        admin: session,
                        rincian_target: results[0],
                        id_region: id_region
                    })
                }
            })
        }
    }
    if (confrim === true) {
        query();
    }
})

router.get('/admin/list_rincian_target', async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            db.query('SELECT 3_rincian_target.*, 2_target.* FROM 3_rincian_target LEFT JOIN 2_target ON 3_rincian_target.id_target = 2_target.id_target WHERE 3_rincian_target.id_region = ?', [id_region], (err, results) => {
                db.query('SELECT * FROM 2_target WHERE id_region = ?', [id_region], (err, target) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('admin/list_rincian_target', {
                            title: 'List Rincian Target',
                            menu: 'active',
                            page_name: 'list rincian target',
                            current_link: '/admin/list_rincian_target',
                            message: req.flash('message'),
                            admin: session,
                            target: target,
                            rincian_target: results,
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
})

router.get('/admin/list_rincian_target_filtered/:id_target', async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let id_target = req.params.id_target
            db.query('SELECT 2_target.*, 3_rincian_target.* FROM 2_target LEFT JOIN 3_rincian_target ON 2_target.id_target = 3_rincian_target.id_target WHERE 3_rincian_target.id_target = ? AND 3_rincian_target.id_region = ?', [id_target, id_region], (err, results) => {
                db.query('SELECT * FROM 2_target', (err, target) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('admin/list_rincian_target_filtered', {
                            title: 'List Rincian Target',
                            menu: 'active',
                            page_name: 'list rincian target',
                            current_link: '/admin/list_rincian_target',
                            message: '',
                            admin: session,
                            target: target,
                            id_target: 'opt' + id_target,
                            rincian_target: results,
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
})

router.get('/admin/list_target', async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            db.query('SELECT 2_target.*, COUNT(3_rincian_target.id_target) AS "total_rincian" FROM 2_target LEFT JOIN 3_rincian_target USING(id_target) WHERE 2_target.id_region = ? GROUP BY 2_target.id_target', [id_region], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('admin/list_target', {
                        title: 'List Target',
                        menu: 'active',
                        page_name: 'list target',
                        current_link: '/admin/list_target',
                        message: req.flash('message'),
                        target: results,
                        admin: session,
                        id_region: id_region
                    })
                }
            })
        }
    }
    if (confrim === true) {
        query();
    }
})

router.get('/admin/detail_list_target/:id_target', async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let id = req.params.id_target
            db.query('SELECT * FROM 3_rincian_target WHERE id_target = ? AND id_region = ?', [id, id_region], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('admin/detail_list_target', {
                        title: 'List Target',
                        menu: 'active',
                        admin: session,
                        page_name: 'detail list target',
                        current_link: '/admin/detail_list_target',
                        message: req.flash('message'),
                        rincian_target: results,
                        id_region: id_region
                    })
                }
            })
        }
    }
    if (confrim === true) {
        query();
    }
})
router.get('/admin/list_histori_capaian', async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            db.query('SELECT 4_histori_capaian.*, 3_rincian_target.rincian_target, 3_rincian_target.id_rincian_target, 3_rincian_target.satuan FROM 4_histori_capaian LEFT JOIN 3_rincian_target ON 4_histori_capaian.id_rincian_target = 3_rincian_target.id_rincian_target WHERE 4_histori_capaian.id_region = ?', [id_region], (err, results) => {
                db.query('SELECT * FROM 3_rincian_target WHERE id_region = ?', [id_region], (err, target) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('admin/list_histori_capaian', {
                            title: 'List Histori Capaian',
                            menu: 'active',
                            page_name: 'list Histori Capaian',
                            current_link: '/admin/list_histori_capaian',
                            message: req.flash('message'),
                            histori_capaian: results,
                            target: target,
                            admin: session,
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
})

router.get('/admin/list_histori_capaian_filtered/:id_rincian_target', async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let id = req.params.id_rincian_target
            db.query('SELECT 4_histori_capaian.*, 3_rincian_target.rincian_target, 3_rincian_target.id_rincian_target, 3_rincian_target.satuan FROM 4_histori_capaian LEFT JOIN 3_rincian_target ON 4_histori_capaian.id_rincian_target = 3_rincian_target.id_rincian_target WHERE 4_histori_capaian.id_rincian_target = ? AND 4_histori_capaian.id_region = ?', [id, id_region], (err, results) => {
                db.query('SELECT * FROM 3_rincian_target WHERE id_region = ?', [id_region], (err, target) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('admin/list_histori_capaian_filtered', {
                            title: 'List Histori Capaian',
                            menu: 'active',
                            page_name: 'list Histori Capaian',
                            current_link: '/admin/list_histori_capaian',
                            message: req.flash('message'),
                            histori_capaian: results,
                            target: target,
                            admin: session,
                            id_target: 'opt' + id,
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
})


router.get('/admin/list_histori_capaian_filtered/:id_rincian_target', async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let id = req.params.id_rincian_target
            db.query('SELECT 4_histori_capaian.*, 3_rincian_target.rincian_target, 3_rincian_target.id_rincian_target, 3_rincian_target.satuan FROM 4_histori_capaian LEFT JOIN 3_rincian_target ON 4_histori_capaian.id_rincian_target = 3_rincian_target.id_rincian_target WHERE 4_histori_capaian.id_rincian_target = ? AND 4_histori_capaian.id_region = ?', [id, id_region], (err, results) => {
                db.query('SELECT * FROM 3_rincian_target', (err, target) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('admin/list_histori_capaian_filtered', {
                            title: 'List Histori Capaian',
                            menu: 'active',
                            page_name: 'list Histori Capaian',
                            current_link: '/admin/list_histori_capaian',
                            message: req.flash('message'),
                            histori_capaian: results,
                            target: target,
                            admin: session,
                            id_target: 'opt' + id,
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
})

router.get('/admin/fitur_styling_layer/:id_histori_capaian', async (req, res) => {
    let session = await req.session.user
    let confrim = await check(session, req, res)
    let query = () => {
        let id_region = session[0].id_region
        if (id_region === null) {
            return;
        } else {
            let id = req.params.id_histori_capaian
            db.query('SELECT * FROM 4_histori_capaian WHERE id_histori_capaian = ? AND id_region = ?', [id, id_region], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('admin/fitur_styling_layer', {
                        title: 'Styling Layer',
                        menu: 'active',
                        page_name: 'Styling Layer',
                        current_link: '',
                        message: req.flash('message'),
                        histori_capaian: results,
                        id_histori_capaian: id,
                        admin: session,
                        id_region: id_region
                    })
                }
            })
        }
    }
    if (confrim === true) {
        query();
    }
})


module.exports = router