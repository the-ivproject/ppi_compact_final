const db = require('../config/dbconfig.js')

let messageContent = (information, alert_class) => {
    return `<div class="alert ${alert_class} alert-dismissible fade show" role="alert"> 
         ${information}
        <a href="#" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
    </a>
 </div>`
}

exports.delete_target = (req, res) => {
    let id = req.params.id_target
    
    db.query('DELETE FROM 2_target WHERE id_target = ?', [id], (err, results) => {
        if (err) {
            console.log(err)
        } else {
            db.query('UPDATE 3_rincian_target SET id_target = ? WHERE id_target = ?', [null,id], (err, results1) => {
                if (err) {
                    console.log(err)
                } else {
                    db.query('UPDATE 4_histori_capaian SET id_target = ? WHERE id_target = ?', [null,id], (err, results1) => {
                        req.flash('message', messageContent(`Target ID:${id} berhasil dihapus!`, 'alert-success'))
                        res.redirect('/admin/list_target')
                    })
                }
            })
        }
    })
}

exports.delete_rincian_target = (req, res) => {
    let id = req.params.id_rincian_target
 
    db.query('DELETE FROM 3_rincian_target WHERE id_rincian_target = ?', [id], (err, results) => {
        if (err) {
            console.log(err)
        } else {
            db.query('DELETE FROM 4_histori_capaian WHERE id_rincian_target = ?', [id], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    req.flash('message', messageContent(`Rincian target ID:${id} berhasil dihapus!`, 'alert-success'))
                    res.redirect('/admin/list_rincian_target')
                }
            })
        }
    })
}

exports.delete_histori_capaian = (req, res) => {
    let id = req.params.id_histori_capaian
 
    db.query('DELETE FROM 4_histori_capaian WHERE id_histori_capaian = ?', [id], (err, results) => {
        if (err) {
            console.log(err)
        } else {
            req.flash('message', messageContent(`Histori capaian ID:${id} berhasil dihapus!`, 'alert-success'))
            res.redirect('/admin/list_histori_capaian')
        }
    })
}

exports.delete_group_data = (req, res) => {
    let id = req.params.id_group_data
 
    db.query('DELETE FROM 7_group_data WHERE id_group_data = ?', [id], (err, results) => {
        if (err) {
            console.log(err)
        } else {
            db.query('UPDATE 8_list_data SET id_group_data = ? WHERE id_group_data = ?', [null,id], (err, results1) => {
                if (err) {
                    console.log(err)
                } else {
                    req.flash('message', messageContent(`Group Data ID:${id} berhasil dihapus!`, 'alert-success'))
                    res.redirect('/admin/add_group_data')
                }
            })
        }
    })
}

exports.delete_data = (req, res) => {
    let id = req.params.id_data
 
    db.query('DELETE FROM 8_list_data WHERE id_data = ?', [id], (err, results) => {
        if (err) {
            console.log(err)
        } else {
            req.flash('message', messageContent(`Data ID:${id} berhasil dihapus!`, 'alert-success'))
            res.redirect('/admin/list_data')
        }
    })
}
