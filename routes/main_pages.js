const express = require('express')
const db = require('../config/dbconfig.js')

const router = express.Router()

router.get('/', (req, res) => {
    db.query('SELECT * FROM 2_target', (err, list_group) => {
        db.query('SELECT 4_histori_capaian.*, 3_rincian_target.* FROM 4_histori_capaian LEFT JOIN 3_rincian_target ON 4_histori_capaian.id_rincian_target = 3_rincian_target.id_rincian_target', (err, histori_capaian) => {
            db.query('SELECT * FROM 1_region', (err, region) => {
                if (err) {
                    res.status(404)
                } else {
                    res.render('main/landing', {
                        title: 'Map',
                        legend: list_group,
                        histori_capaian: histori_capaian,
                        region: region,
                        lang: 'eng'
                    })
                }
            })
        })
    })
})

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
                            all_region:all_region
                        })
                    }
                })
            })
        })
    })
})


module.exports = router