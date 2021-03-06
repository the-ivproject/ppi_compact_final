const express = require('express')
const db = require('../config/dbconfig.js')
const translate = require('@vitalets/google-translate-api');
// const cookieParser = require("cookie-parser");

const router = express.Router()
  
router.get('/main/about/:id_region', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT 2_target.*, COUNT(3_rincian_target.id_target) AS "total_rincian" FROM 2_target LEFT JOIN 3_rincian_target USING(id_target) WHERE 2_target.id_region = ? GROUP BY 2_target.id_target',[id_region], (err, list_target) => {
        db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
            if (err) {
                res.status(404)
            } else {
                console.log(region.id_region)
                res.render('main/about', {
                    title: 'About',
                    link: `/main/about_en/${id_region}`,
                    lang: 'eng',
                    list_target:list_target,
                    region: region,
                    desclaimer: 'Data dalam platform ini ditujukan sebatas untuk kebutuhan monitoring capaian pertumbuhan hijau dan tidak dapat dijadikan rujukan resmi penggunaan dalam bentuk apapun.',
                    alamat: 'Kantor BAPPEDA, Jl. Supadio, Sungai Raya, Kubu Raya District',
                })
            }
        })
    })
})

router.get('/main/about_en/:id_region', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT 22_target_en.*, COUNT(33_rincian_target_en.id_target) AS "total_rincian" FROM 22_target_en LEFT JOIN 33_rincian_target_en USING(id_target) WHERE 22_target_en.id_region = ? GROUP BY 22_target_en.id_target',[id_region], (err, list_target) => {
        db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
            if (err) {
                res.status(404)
            } else {
                console.log(region.id_region)
                res.render('main/about_en', {
                    title: 'About',
                    lang: 'ind',
                    list_target:list_target,
                    region: region,
                    link: `/main/about/${id_region}`,
                    desclaimer: 'Data on this platform is purposed for overseeing the green growth achievement progress only and can???t be used as an official reference in any form of usage.',
                    alamat: 'BAPPEDA Office, Supadio Street, Sungai Raya, Kubu Raya District'
                })
            }
        })
    })
})

router.get('/main/resources/:id_region', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT * FROM 9_resources WHERE id_region = ?', [id_region], (err, resources) => {
        db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
            if (err) {
                res.status(404)
            } else {
                res.render('main/resources', {
                    title: 'Resources',
                    lang: 'eng',
                    resources:resources,
                    link: `/main/resources_en/${id_region}`,
                    id_region: id_region,
                    region: region,
                    desclaimer: 'Data dalam platform ini ditujukan sebatas untuk kebutuhan monitoring capaian pertumbuhan hijau dan tidak dapat dijadikan rujukan resmi penggunaan dalam bentuk apapun.',
                    alamat: 'Kantor BAPPEDA, Jl. Supadio, Sungai Raya, Kubu Raya District'
                })
            }
        })
    })
})

router.get('/main/resources_en/:id_region', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT * FROM 99_resources_en WHERE id_region = ?', [id_region], (err, resources) => {
        db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
            if (err) {
                res.status(404)
            } else {
                res.render('main/resources_en', {
                    title: 'Resources',
                    lang: 'ind',
                    resources:resources,
                    link: `/main/resources/${id_region}`,
                    id_region: id_region,
                    region: region,
                    desclaimer: 'Data on this platform is purposed for overseeing the green growth achievement progress only and can???t be used as an official reference in any form of usage.',
                    alamat: 'BAPPEDA Office, Supadio Street, Sungai Raya, Kubu Raya District'
                })
            }
        })
    })
})

router.get('/main/contact/:id_region', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        res.render('main/contact', {
            title: 'Contact',
            lang: 'eng',
            region:region,
            link: `/main/contact_en/${id_region}`,
            desclaimer: 'Data dalam platform ini ditujukan sebatas untuk kebutuhan monitoring capaian pertumbuhan hijau dan tidak dapat dijadikan rujukan resmi penggunaan dalam bentuk apapun.',
            alamat: 'Kantor BAPPEDA, Jl. Supadio, Sungai Raya, Kubu Raya District'
        })
    })
})

router.get('/main/contact_en/:id_region', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        res.render('main/contact_en', {
            title: 'Contact',
            lang: 'ind',
            region:region,
            link: `/main/contact/${id_region}`,
            desclaimer: 'Data on this platform is purposed for overseeing the green growth achievement progress only and can???t be used as an official reference in any form of usage.',
            alamat: 'BAPPEDA Office, Supadio Street, Sungai Raya, Kubu Raya.'
        })
    })
})

router.get('/main/blog/:id_region', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        res.render('main/blog', {
            title: 'Blog',
            lang: 'eng',
            region:region
        })
    })
})

router.get('/main/resources/:id_region', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        res.render('main/resources', {
            title: 'Resouces',
            lang: 'eng',
            region:region
        })
    })
})

router.get('/main/detail_target_pph/:id_region', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        res.render('main/detail_target_pph', {
            title: 'Target Pertumbuhan Hijau Kubu Raya 2019 - 2025',
            lang: 'eng',
            region:region,
            link: `/main/detail_target_pph_en/${id_region}`,
            desclaimer: 'Data dalam platform ini ditujukan sebatas untuk kebutuhan monitoring capaian pertumbuhan hijau dan tidak dapat dijadikan rujukan resmi penggunaan dalam bentuk apapun.',
            alamat: 'Kantor BAPPEDA, Jl. Supadio, Sungai Raya, Kubu Raya District'

        })
    })
})

router.get('/main/detail_target_pph_en/:id_region', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        res.render('main/detail_target_pph_en', {
            title: 'Kubu Raya Green Growth Target 2019 - 2025',
            region:region,
            lang: 'ind',
            link: `/main/detail_target_pph/${id_region}`,
            desclaimer: 'Data on this platform is purposed for overseeing the green growth achievement progress only and can???t be used as an official reference in any form of usage.',
            alamat: 'BAPPEDA Office, Supadio Street, Sungai Raya, Kubu Raya.'
        })
    })
})

router.get('/main/blog_detail/:id_region', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        res.render('main/blog_detail', {
            title: 'Blog',
            lang: 'eng',
            region:region
        })
    })
})


router.get('/', (req, res) => {
    db.query('SELECT * FROM 2_target', (err, list_group) => {
        db.query('SELECT 4_histori_capaian.*, 3_rincian_target.* FROM 4_histori_capaian LEFT JOIN 3_rincian_target ON 4_histori_capaian.id_rincian_target = 3_rincian_target.id_rincian_target', (err, histori_capaian) => {
            db.query('SELECT * FROM 1_region', (err, region) => {
                if (err) {
                    res.status(404)
                } else {
                    res.render('main/select_region', {
                        title: 'Selamat Data',
                        legend: list_group,
                        histori_capaian: histori_capaian,
                        region: region,
                        lang: 'eng',
                    })
                }
            })
        })
    })
})

// router.post('/setcookie', (req, res, next) => {
//     const { choice } = req.body;
//     const value = parseInt(choice, 10);
//     const allowedValues = [0, 1];

//     if(!allowedValues.includes(value)) {
//         return res.sendStatus(403);
//     }
//     res.cookie('cookieAccepted', value, { maxAge: 60 * 60 * 24 * 365 * 1000 } ).json({ value });
// });


router.get('/main/map/:id_region', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        db.query('SELECT * FROM 2_target WHERE id_region = ?', [id_region], (err, list_group) => {
            db.query('SELECT 4_histori_capaian.*, 3_rincian_target.* FROM 4_histori_capaian LEFT JOIN 3_rincian_target ON 4_histori_capaian.id_rincian_target = 3_rincian_target.id_rincian_target WHERE 3_rincian_target.id_region = ?', [id_region], (err, histori_capaian) => {
                db.query('SELECT * FROM 1_region', (err, all_region) => {
                    if (err) {
                        res.status(404)
                    } else {
                        res.render('main/map', {
                            title: 'Map',
                            legend: list_group,
                            histori_capaian: histori_capaian,
                            lang: 'eng',
                            region: region[0],
                            all_region: all_region,
                        })
                    }
                })
            })
        })
    })
})

router.get('/main/map_active/:id_region/:id_target', (req, res) => {
    let id_region = req.params.id_region
    let id_target = req.params.id_target
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        db.query('SELECT * FROM 2_target WHERE id_region = ?', [id_region], (err, list_group) => {
            db.query('SELECT 4_histori_capaian.*, 3_rincian_target.* FROM 4_histori_capaian LEFT JOIN 3_rincian_target ON 4_histori_capaian.id_rincian_target = 3_rincian_target.id_rincian_target WHERE 3_rincian_target.id_region = ?', [id_region], (err, histori_capaian) => {
                db.query('SELECT * FROM 1_region', (err, all_region) => {
                    if (err) {
                        res.status(404)
                    } else {
                        let filter = list_group.filter(a => {
                            return a.id_target == id_target
                        })

                        res.render('main/map_active', {
                            title: 'Map',
                            legend: list_group,
                            histori_capaian: histori_capaian,
                            lang: 'eng',
                            region: region[0],
                            all_region: all_region,
                            id_target:id_target,
                            nama_target: filter[0].display_name
                        })
                    }
                })
            })
        })
    })
})

router.get('/main/dataset/:id_region', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT 7_group_data.*, COUNT(8_list_data.id_group_data) AS "total_data" FROM 7_group_data LEFT JOIN 8_list_data USING(id_group_data) WHERE 7_group_data.id_region = ? GROUP BY 7_group_data.id_group_data', [id_region], (err, group_data) => {
        db.query('SELECT * FROM 8_list_data WHERE id_region = ?', [id_region], (err, list_data) => {
            db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
                db.query('SELECT * FROM 1_region ', (err, all_region) => {
                    db.query('SELECT * FROM 2_target WHERE id_region = ?',[id_region], (err, target) => {
                        if (err) {
                            res.status(404)
                        } else {
                            res.render('main/dataset', {
                                title: 'Dataset',
                                lang: 'eng',
                                group_data: group_data,
                                list_data: list_data,
                                region: region[0],
                                list_target: target,
                                all_region: all_region
                            })
                        }
                    })
                })
            })
        })
    })
})

router.get('/main/data_selection/:id_region/:id_group_data', (req, res) => {
    let id_region = req.params.id_region
    let id_group = req.params.id_group_data
    db.query('SELECT 7_group_data.*, COUNT(8_list_data.id_group_data) AS "total_data" FROM 7_group_data LEFT JOIN 8_list_data USING(id_group_data) WHERE 7_group_data.id_region = ? GROUP BY 7_group_data.id_group_data', [id_region], (err, group_data) => {
        db.query('SELECT * FROM 8_list_data WHERE id_region = ? AND id_group_data = ?', [id_region, id_group], (err, list_data) => {
            db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
                db.query('SELECT * FROM 1_region ', async (err, all_region) => {
                    if (err) {
                        res.status(404)
                    } else {
                        let filter = group_data.filter(g => {
                            return g.id_group_data == id_group
                        })
                       
                        res.render('main/data_selection', {
                            title: 'Data Selection',
                            lang: 'eng',
                            nama_group: filter[0].nama_group_data,
                            group_data: group_data,
                            list_data: list_data,
                            region: region[0],
                            all_region: all_region,
                            id_group_data:id_group
                        })
                    }
                })
            })
        })
    })
})

// router.get('/main/resources/:id_region/:id_group_data', (req, res) => {
//     let id_region = req.params.id_region
//     let id_group = req.params.id_group_data
//     db.query('SELECT 7_group_data.*, COUNT(8_list_data.id_group_data) AS "total_data" FROM 7_group_data LEFT JOIN 8_list_data USING(id_group_data) WHERE 7_group_data.id_region = ? GROUP BY 7_group_data.id_group_data', [id_region], (err, group_data) => {
//         db.query('SELECT * FROM 8_list_data WHERE id_region = ? AND id_group_data = ?', [id_region, id_group], (err, list_data) => {
//             db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
//                 db.query('SELECT * FROM 1_region ', async (err, all_region) => {
//                     if (err) {
//                         res.status(404)
//                     } else {
//                         let filter = group_data.filter(g => {
//                             return g.id_group_data == id_group
//                         })
                       
//                         res.render('main/resources', {
//                             title: 'Resources',
//                             lang: 'eng',
//                             nama_group: filter[0].nama_group_data,
//                             group_data: group_data,
//                             list_data: list_data,
//                             region: region[0],
//                             all_region: all_region,
//                             id_group_data:id_group
//                         })
//                     }
//                 })
//             })
//         })
//     })
// })

router.get('/main/data_selection_search/:id_region/:search_content', (req, res) => {
    let id_region = req.params.id_region
    
    let content  = req.params.search_content

    db.query('SELECT 7_group_data.*, COUNT(8_list_data.id_group_data) AS "total_data" FROM 7_group_data LEFT JOIN 8_list_data USING(id_group_data) WHERE 7_group_data.id_region = ? GROUP BY 7_group_data.id_group_data', [id_region], (err, group_data) => {
        db.query(`SELECT * FROM 8_list_data WHERE id_region = ? AND nama_data LIKE '%${content}%'`, [id_region], (err, list_data) => {
            db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
                db.query('SELECT * FROM 1_region ', (err, all_region) => {
                    if (err) {
                        res.status(404)
                    } else {
                      
                        res.render('main/data_selection_search', {
                            title: 'Data Selection',
                            lang: 'eng',
                            nama_group: 'Hasil Pencarian',
                            group_data: group_data,
                            list_data: list_data,
                            region: region[0],
                            all_region: all_region,
                            content: content
                        })
                    }
                })
            })
        })
    })
})

router.get('/main/map_data/:id_region', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        db.query('SELECT * FROM 7_group_data WHERE id_region = ?', [id_region], (err, list_group) => {
            db.query('SELECT 8_list_data.*, 7_group_data.* FROM 8_list_data LEFT JOIN 7_group_data ON 8_list_data.id_group_data = 7_group_data.id_group_data WHERE 7_group_data.id_region = ?', [id_region], (err, list_data) => {
                db.query('SELECT * FROM 1_region', (err, all_region) => {
                    if (err) {
                        res.status(404)
                    } else {
                        res.render('main/map_data', {
                            title: 'Data Map',
                            legend: list_group,
                            list_data: list_data,
                            lang: 'eng',
                            region: region[0],
                            all_region: all_region,
                        })
                    }
                })
            })
        })
    })
})

router.get('/main/map_data_active/:id_region/:id_active/:id_data', (req, res) => {
    let id_region = req.params.id_region
    let id_active = req.params.id_active
    let id_data = req.params.id_data
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        db.query('SELECT * FROM 7_group_data WHERE id_region = ?', [id_region], (err, list_group) => {
            db.query('SELECT 8_list_data.*, 7_group_data.* FROM 8_list_data LEFT JOIN 7_group_data ON 8_list_data.id_group_data = 7_group_data.id_group_data WHERE 7_group_data.id_region = ?', [id_region], (err, list_data) => {
                db.query('SELECT * FROM 1_region', (err, all_region) => {
                    if (err) {
                        res.status(404)
                    } else {
                       
                        let group_name = list_group.filter(a => {
                            return a.id_group_data == list_data[0].id_group_data 
                        })

                        res.render('main/map_data_active', {
                            title: 'Data Map',
                            legend: list_group,
                            list_data: list_data,
                            lang: 'eng',
                            region: region[0],
                            all_region: all_region,
                            id_active:id_active,
                            id_data:id_data,
                            group_name: group_name[0].nama_group_data
                        })
                    }
                })
            })
        })
    })
})


router.get('/main/prevent_mobile', (req, res) => {
    res.render('main/prevent_mobile')
})

// eng ------------------------------------------------------------------------------------------------------------------------------

// // router.get('/eng', (req, res) => {
// //     db.query('SELECT * FROM 2_target', (err, list_group) => {
// //         db.query('SELECT 4_histori_capaian.*, 3_rincian_target.* FROM 4_histori_capaian LEFT JOIN 3_rincian_target ON 4_histori_capaian.id_rincian_target = 3_rincian_target.id_rincian_target', (err, histori_capaian) => {
// //             db.query('SELECT * FROM 1_region', (err, region) => {
// //                 if (err) {
// //                     res.status(404)
// //                 } else {
// //                     res.render('main/eng/select_region', {
// //                         title: 'Selamat Data',
// //                         legend: list_group,
// //                         histori_capaian: histori_capaian,
// //                         region: region,
// //                         lang: 'eng'
// //                     })
// //                 }
// //             })
// //         })
// //     })
// // })



router.get('/main/map_en/:id_region/en', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        db.query('SELECT * FROM 22_target_en WHERE id_region = ?', [id_region], (err, list_group) => {
            db.query('SELECT 44_histori_capaian_en.*, 33_rincian_target_en.* FROM 44_histori_capaian_en LEFT JOIN 33_rincian_target_en ON 44_histori_capaian_en.id_rincian_target = 33_rincian_target_en.id_rincian_target WHERE 33_rincian_target_en.id_region = ?', [id_region], (err, histori_capaian) => {
                db.query('SELECT * FROM 1_region', (err, all_region) => {
                    if (err) {
                        res.status(404)
                    } else {
                        res.render('main/map_en', {
                            title: 'Map',
                            legend: list_group,
                            histori_capaian: histori_capaian,
                            lang: 'ind',
                            region: region[0],
                            all_region: all_region,
                        })
                    }
                })
            })
        })  
    })
})

router.get('/main/map_en_active/:id_region/en/:id_target', (req, res) => {
    let id_region = req.params.id_region
    let id_target = req.params.id_target
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        db.query('SELECT * FROM 22_target_en WHERE id_region = ?', [id_region], (err, list_group) => {
            db.query('SELECT 44_histori_capaian_en.*, 33_rincian_target_en.* FROM 44_histori_capaian_en LEFT JOIN 33_rincian_target_en ON 44_histori_capaian_en.id_rincian_target = 33_rincian_target_en.id_rincian_target WHERE 33_rincian_target_en.id_region = ?', [id_region], (err, histori_capaian) => {
                db.query('SELECT * FROM 1_region', (err, all_region) => {
                    if (err) {
                        res.status(404)
                    } else {
                        res.render('main/map_en_active', {
                            title: 'Map',
                            legend: list_group,
                            histori_capaian: histori_capaian,
                            lang: 'ind',
                            region: region[0],
                            all_region: all_region,
                            id_target:id_target
                        })
                    }
                })
            })
        })
    })
})

router.get('/main/dataset_en/:id_region/en', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT 77_group_data_en.*, COUNT(88_list_data_en.id_group_data) AS "total_data" FROM 77_group_data_en LEFT JOIN 88_list_data_en USING(id_group_data) WHERE 77_group_data_en.id_region = ? GROUP BY 77_group_data_en.id_group_data', [id_region], (err, group_data) => {
        db.query('SELECT * FROM 88_list_data_en WHERE id_region = ?', [id_region], (err, list_data) => {
            db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
                db.query('SELECT * FROM 1_region ', (err, all_region) => {
                    db.query('SELECT * FROM 22_target_en WHERE id_region = ?',[id_region], (err, target) => {
                        if (err) {
                            res.status(404)
                        } else {
                            res.render('main/dataset_en', {
                                title: 'Dataset',
                                lang: 'ind',
                                group_data: group_data,
                                list_data: list_data,
                                region: region[0],
                                all_region: all_region,
                                list_target:target
                            })
                        }
                    })
                })
            })
        })
    })
})

router.get('/main/data_selection_en/:id_region/:id_group_data/en', (req, res) => {
    let id_region = req.params.id_region
    let id_group = req.params.id_group_data
    db.query('SELECT 77_group_data_en.*, COUNT(88_list_data_en.id_group_data) AS "total_data" FROM 77_group_data_en LEFT JOIN 88_list_data_en USING(id_group_data) WHERE 77_group_data_en.id_region = ? GROUP BY 77_group_data_en.id_group_data', [id_region], (err, group_data) => {
        db.query('SELECT * FROM 88_list_data_en WHERE id_region = ? AND id_group_data = ?', [id_region, id_group], (err, list_data) => {
            db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
                db.query('SELECT * FROM 1_region ', (err, all_region) => {
                    if (err) {
                        res.status(404)
                    } else {
                        let filter = group_data.filter(g => {
                            return g.id_group_data == id_group
                        })
                        res.render('main/data_selection_en', {
                            title: 'Data Selection',
                            lang: 'in',
                            nama_group: filter[0].nama_group_data,
                            group_data: group_data,
                            list_data: list_data,
                            region: region[0],
                            all_region: all_region,
                            id_group_data:id_group
                        })
                    }
                })
            })
        })
    })
})

router.get('/main/data_selection_search_en/:id_region/:search_content', (req, res) => {
    let id_region = req.params.id_region
    
    let content  = req.params.search_content

    db.query('SELECT 77_group_data_en.*, COUNT(88_list_data_en.id_group_data) AS "total_data" FROM 77_group_data_en LEFT JOIN 88_list_data_en USING(id_group_data) WHERE 77_group_data_en.id_region = ? GROUP BY 77_group_data_en.id_group_data', [id_region], (err, group_data) => {
        db.query(`SELECT * FROM 88_list_data_en WHERE id_region = ? AND nama_data LIKE '%${content}%'`, [id_region], (err, list_data) => {
            db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
                db.query('SELECT * FROM 1_region ', (err, all_region) => {
                    if (err) {
                        res.status(404)
                    } else {
                       
                        res.render('main/data_selection_search_en', {
                            title: 'Data Selection',
                            lang: 'ind',
                            nama_group: 'Search Result',
                            group_data: group_data,
                            list_data: list_data,
                            region: region[0],
                            all_region: all_region,
                            content: content
                        })
                    }
                })
            })
        })
    })
})

router.get('/main/map_data_en/:id_region/en', (req, res) => {
    let id_region = req.params.id_region
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        db.query('SELECT * FROM 77_group_data_en WHERE id_region = ?', [id_region], (err, list_group) => {
            db.query('SELECT 88_list_data_en.*, 77_group_data_en.* FROM 88_list_data_en LEFT JOIN 77_group_data_en ON 88_list_data_en.id_group_data = 77_group_data_en.id_group_data WHERE 77_group_data_en.id_region = ?', [id_region], (err, list_data) => {
                db.query('SELECT * FROM 1_region', (err, all_region) => {
                    if (err) {
                        res.status(404)
                    } else {
                        res.render('main/map_data_en', {
                            title: 'Data Map',
                            legend: list_group,
                            list_data: list_data,
                            lang: 'ind',
                            region: region[0],
                            all_region: all_region,
                        })
                    }
                })
            })
        })
    })
})

router.get('/main/map_data_active_en/:id_region/:id_active/:id_data/en', (req, res) => {
    let id_region = req.params.id_region
    let id_active = req.params.id_active
    let id_data = req.params.id_data
    db.query('SELECT * FROM 1_region WHERE id_region = ?', [id_region], (err, region) => {
        db.query('SELECT * FROM 77_group_data_en WHERE id_region = ?', [id_region], (err, list_group) => {
            db.query('SELECT 88_list_data_en.*, 77_group_data_en.* FROM 88_list_data_en LEFT JOIN 77_group_data_en ON 88_list_data_en.id_group_data = 77_group_data_en.id_group_data WHERE 77_group_data_en.id_region = ?', [id_region], (err, list_data) => {
                db.query('SELECT * FROM 1_region', (err, all_region) => {
                    if (err) {
                        res.status(404)
                    } else {
                        let group_name = list_group.filter(a => {
                            return a.id_group_data == list_data[0].id_group_data 
                        })
                        res.render('main/map_data_active_en', {
                            title: 'Data Map',
                            legend: list_group,
                            list_data: list_data,
                            lang: 'ind',
                            region: region[0],
                            all_region: all_region,
                            id_active:id_active,
                            id_data:id_data,
                            group_name: group_name[0].nama_group_data
                        })
                    }
                })
            })
        })
    })
})

router.get('/main/prevent_mobile', (req, res) => {
    res.render('main/prevent_mobile')
})

module.exports = router