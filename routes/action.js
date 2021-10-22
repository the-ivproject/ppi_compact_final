const express = require('express')
const router = express.Router()

const insert = require('../controllers/insert')
const update = require('../controllers/update')
const delete1 = require('../controllers/delete')

// insert
router.post('/admin/login', insert.post_user)
router.post('/admin/add_region', insert.insert_region)
router.post('/admin/add_target', insert.insert_target)
router.post('/admin/add_rincian_target', insert.insert_rincian_target)
router.post('/admin/add_capaian_id',insert.insert_histori_capaian)

router.post('/admin/sign_up', insert.insert_account)

// edit
router.get('/admin/edit_target/:id_target', update.edit_target)
router.post('/admin/edit_target/:id_target', update.update_target)
router.get('/admin/edit_rincian_target/:id_rincian_target', update.edit_rincian_target)
router.post('/admin/edit_rincian_target/:id_rincian_target', update.update_rincian_target)

router.post('/admin/update_style/:id_histori_capaian', update.update_style_layer)
router.get('/admin/detail_region/:id_region', update.edit_detail_region)
router.post('/admin/detail_region/:id_region', update.update_detail_region)

router.get('/admin/edit_histori_capaian/:id_histori_capaian', update.edit_histori_capaian)
router.post('/admin/edit_histori_capaian/:id_histori_capaian', update.update_histori_capaian)
// delete
router.get('/admin/delete_target/:id_target', delete1.delete_target)
router.get('/admin/delete_rincian_target/:id_rincian_target', delete1.delete_rincian_target)
router.get('/admin/delete_histori_capaian/:id_histori_capaian', delete1.delete_histori_capaian)

module.exports = router





