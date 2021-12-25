function MoveToMap() {
    window.location.href = `/main/map/<%= region.id_region %>`
}

async function MoveToMapId(id) {
    let id_region = await document.getElementById('id_region')
    window.location.href = `/main/map_active/${id_region}/${id}`
}

function filterByRegion() {
    let selected = document.getElementById('region-selection')
    window.location.href = `/main/dataset/${selected.value}`
}

function getMap(map_id, map_url) {
    let map = L.map(map_id).setView([39.74739, -105], 13);
    map.removeControl(map.zoomControl);
    L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/light-v9',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(map);

    let data_style = {
        fillColor: '#EA3D2F',
        color: '',
        opacity: 0,
        fillOpacity: 1
    }

    let geo = $.ajax({
        url: map_url,
        dataType: "json",
        success: console.log("County data successfully loaded."),
        error: function (xhr) {
            console.log(xhr.statusText)
        }
    })

    let emp_geo = L.geoJSON()

    $.when(geo).done(function () {

        emp_geo.addData(geo.responseJSON)
        emp_geo.setStyle(data_style)

        map.fitBounds(emp_geo.getBounds())
        map.addLayer(emp_geo)
    })
}

async function initMap() {
    let list_data = await document.querySelectorAll('.map-frame')
    let geo_path = await document.querySelectorAll('.map-frame input')

    list_data.forEach((l, i) => {
        let id = l.id
        let url = geo_path[i].value
        getMap(id, url)
    })
}

initMap()

function cariData() {
    let content = document.getElementById('search-content')

    window.location.href = `/main/data_selection_search_en/<%= region.id_region %>/${content.value}`

}

let general_loader = document.getElementById('overlay-preload')
let btn_section = document.querySelectorAll('#btn-sec button')

btn_section[0].style.backgroundColor = '#2ec551'
btn_section[0].style.color = '#fff'
// btn_section[1].style.backgroundColor = '#2ec551'
// btn_section[1].style.color = '#fff'

let span_selector = document.querySelectorAll('#btn-sec span')

// if (btn_section.length === 1) {
//     span_selector[0].style.visibility = 'hidden'
// } else {
//     span_selector[span_selector.length - 1].remove()
// }

function MovePage(el) {
    let id = el.id.replaceAll("btn-hov", "")
    window.location.href = `/main/dataset/${id}`
    // el.style.width = '32%'
    // document.getElementById(`spinner${id}`).style.visibility = 'visible'
}

let body_load = document.getElementById('checkCookie')

function setLoad() {
    general_loader.style.visibility = 'hidden'

    let cookie = document.getElementById('cookie_card')
    cookie.style.visibility = 'visible'
    cookie.style.opacity = '1'
}

body_load.addEventListener('load', setLoad()) 

if (localStorage.getItem('cookieSeen') != 'shown') {
    $('.cookie').delay(2000).fadeIn();
    localStorage.setItem('cookieSeen', 'shown')
};

$('.accept').click(function () {
    $('.cookie').fadeOut();
})
