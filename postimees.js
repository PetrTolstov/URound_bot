const axios = require("axios");
const {JSDOM} = require("jsdom");
const categories = {
    "Estonia" : "https://rus.postimees.ee/section/456",
    "Ida-Virumaa" : "https://rus.postimees.ee/section/664",
    "Tallinn" : "https://rus.postimees.ee/section/457",
    "CHP" : "https://rus.postimees.ee/section/460",
    "Economic" : "https://rus.postimees.ee/section/461"
}



function getList(document){
    return  document.querySelectorAll('.list-article')
}



function getTitle(item){
    return item.querySelector(".list-article__headline").textContent
}


function getShortText(document){
    return document.querySelector('.article-body').querySelectorAll("p")[0]?.textContent
}

function getPriviosImage(item){
    const image = item.querySelector(".list-article__image")
    return image.getAttribute("content")
}

function getFullText(document){
    let text = getShortText(document)
    document.querySelectorAll('.article-body')[1].querySelectorAll("p").forEach(p => text += p.textContent)
    return text

}

function getHref(item){
    let href = item.querySelector("a").href
    return href
}

function getImages(document){
    let list = []
    document.querySelector('.gallery__tiles')?.querySelectorAll(".gallery__image-container").forEach(image=> list.push(image.getAttribute("style").slice(25,-3)))
    return list
}

function getVideos(document){
    return []
}

function getDate(document){
    const dateStr = document.querySelector('.article__publish-date').getAttribute("content")//.replace(/\./g, "-").replace(/,/g, "").replace(" ", "T")+":00"
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