

const axios = require("axios");
const {JSDOM} = require("jsdom");
const categories = {
    "estonia" : "https://rus.delfi.ee/kategorija/309647/novosti-estonii",
    "ida-virumaa" : "https://rus.delfi.ee/kategorija/35365823/novosti-ida-virumaa",
    "mk" : "https://rus.delfi.ee/kategorija/8324703/mk-estoniya",
    "chp" : "https://rus.delfi.ee/kategorija/382418/chp-i-kriminal"
}



function getList(document){
    return  document.querySelectorAll('[data-dropzone="article-dropzone"]')
}



function getTitle(item){
    console.log(item.querySelector(" h5 a").textContent)
    return item.querySelector(" h5 a").textContent
}


function getShortText(document){
    return document.querySelector('.G-container').querySelectorAll("p")[0]?.textContent
}

function getPriviosImage(item){
    return item.querySelector("div.C-lazy-image picture source")?.srcset
}

function getFullText(document){
    let text = ""
    document.querySelector('.G-container').querySelectorAll("p").forEach(p => text += p.textContent)
    return text

}

function getHref(item){
    let href = item.querySelector(" h5 a").href
    if (href[0] === "/") {
        href = "https://rus.delfi.ee" + href
    }
    return href
}

function getImages(document){
    let list = []
    document.querySelector('.G-container').querySelectorAll("img").forEach(image=> list.push(image.src))
    if (list.length >= 1){
        list.shift()
    }
    return list
}

function getVideos(document){
    return []
}

function getDate(document){
    const dateStr = document.querySelector('.C-article-info__publish-date').textContent.split(", ")//.replace(/\./g, "-").replace(/,/g, "").replace(" ", "T")+":00"
    const [day, month, year] = dateStr[0].split(".")
    const [hours, minutes] = dateStr[1].split(":")
    const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`).toString()

    return date
}

module.exports = {
    getList,
    getHref,
    categories,
    getTitle,
    getPriviosImage,
    getFullText,
    getShortText,
    getImages,
    getVideos,
    getDate
}