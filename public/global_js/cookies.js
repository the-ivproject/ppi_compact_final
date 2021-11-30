function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    let name = getCookie("name");
    if (name != "") {
        document.getElementById('cookie_card').style.display = 'none'
    } else {
        let card = document.getElementById('cookie_card')
        card.style.display = 'block'

        let val = ''
        let acc = document.getElementById('acc')
        let rjt = document.getElementById('rjt')

        acc.onclick = function () {
            val = 'entative'
            card.style.display = 'none'
            setCookie("name", val, 30);
        }

        rjt.onclick = function () {
            val = rjt.innerHTML
            card.style.display = 'none'
            return;
        }
    }
}