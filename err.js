

const axios = require("axios");
const {JSDOM} = require("jsdom");
const categories = {
    "estonia" : "https://rus.err.ee/k/estonia",
    "ida-virumaa" : "https://rus.err.ee/k/ida-virumaa",
    "chp" : "https://rus.err.ee/k/proisshestvija",
    "economic":"https://rus.err.ee/k/ekonomika"
}



function getList(document){
    return  document.querySelectorAll('.category-item')
}



function getTitle(item){
    console.log(item.querySelector(".category-news-header").textContent.replace(/\t/g, "").replace(/\n/g, ""))
    return item.querySelector(".category-news-header").textContent.replace(/\t/g, "").replace(/\n/g, "")
}


function getShortText(document){
    return document.querySelector('.text').querySelectorAll("p")[0]?.textContent
}

function getPriviosImage(item){
    return item.querySelector("img").src
}

function getFullText(document){
    let text = ""
    document.querySelector('.text').querySelectorAll("p").forEach(p => text += p.textContent)
    return text

}

function getHref(item){
    return item.querySelector(".category-news-header a").href
}

function getImages(document){
    let list = []
    document.querySelector('.body').querySelectorAll("img").forEach(image=> list.push(image.src))
    if (list.length >= 1){
        list.shift()
    }
    return list
}

function getVideos(document){
    return []
}

function getDate(document){
    const dateStr = document.querySelector('.pubdate').getAttribute("datetime")
    const date = new Date(dateStr).toString()
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