

const axios = require("axios");
const {JSDOM} = require("jsdom");
const categories = {
    "Estonia" : "https://rus.delfi.ee/kategorija/309647/novosti-estonii",
    "Ida-Virumaa" : "https://rus.delfi.ee/kategorija/35365823/novosti-ida-virumaa",
    "MK" : "https://rus.delfi.ee/kategorija/8324703/mk-estoniya",
    "CHP" : "https://rus.delfi.ee/kategorija/382418/chp-i-kriminal"
}



function getList(document){
    return  document.querySelectorAll('[data-dropzone="article-dropzone"]')
}



function getTitle(item){
    return item.querySelector(" h5 a").textContent
}

function getPriviosImage(item){
    return item.querySelector("div.C-lazy-image picture source").srcset
}

function getFullText(document){
    let text = ""
    return document.querySelector('.G-container').querySelectorAll("p").forEach(p => text += p.textContent)

}

function getHref(item){
    let href = item.querySelector(" h5 a").href
    if (href[0] === "/") {
        href = "https://rus.delfi.ee" + href
    }
    return href
}


module.exports = {
    getList,
    getHref,
    categories,
    getTitle,
    getPriviosImage,
    getFullText
}