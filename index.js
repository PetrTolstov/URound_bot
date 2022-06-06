const axios = require('axios');
const {JSDOM} = require("jsdom");

const delfi = require("./delfi")
const postimees = require("./postimees")
const err = require("./err")

const { MongoClient } = require('mongodb');

const URL = "mongodb+srv://uround-app:1qaz2wsx3edc@cluster0.2u3vn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(URL);
const database = client.db("URound");

const autoPostsCollection = database.collection("posts");

const listOfResources = [ err, delfi, postimees]
const categories = ["estonia", "ida-virumaa", "tallinn", "mk", "chp", "economic"]


async function connectToDB() {

     await client.connect(async err => {
        if (err) {
            console.log(`Something went wrong ${err}`);

        } else {
            console.log("Successfully connected to MongoDB")
            for (let cat of Object.values(categories)){
                console.log(cat)
                await getNewsFromOneResource()

            }

        }

    })
}


async function addElement(element) {
    try {
        await autoPostsCollection.insertOne(element);
    } catch (err) {
        console.log(err);
    }
}


async function getNews(resource, category, categoryStr) {
    try {
        const resp = await axios.get(category)

        const dom = new JSDOM(resp.data)
        const listOfNews = []

        const list = resource.getList(dom.window.document)

        for (let i = list.length - 1; i >= 0; i--){
            let href = resource.getHref(list[i])


            if (await isInBD(href, categoryStr)){
                continue
            }
            listOfNews.push(await newsItems(list[i], category, resource, categoryStr));
        }


        return listOfNews

    } catch (err) {
        console.log(err)
    }
}


async function newsItems(news, cat, resource, categoryStr) {
    const title = resource.getTitle(news)
    const href = resource.getHref(news)
    let previosImage = resource.getPriviosImage(news)

    if (previosImage[0] == "/"){
        previosImage = previosImage.slice(1)
    }
    if (previosImage[0] == "/"){
        previosImage = previosImage.slice(1)
    }
    if (previosImage[0] != "h"){
        previosImage = "https://" + previosImage
    }
    console.log(previosImage)

    let item = {
        categories: [categoryStr],
        title: title ? title : "",
        href: href ? href : "",
        images: [previosImage ? previosImage : ""],
        videos: [],
        shortText: "",
        fullText : "",
        date :  new Date().toLocaleString()
    }

    let fullNew = await fullNews(item.href, resource)

    item.shortText = fullNew[0] ? fullNew[0] : ""
    item.fullText = fullNew[1] ? fullNew[1] : ""
    fullNew[2].forEach(photo => {
        if (photo[0] != "h"){
            photo.unshift("https://")
        }

        item.images.push(photo ? photo : "")
    })
    item.videos.concat(fullNew[3] ? fullNew[1] : "")
    item.date = fullNew[4] ? fullNew[4] : ""
    console.log(item.images)
    return item
}

async function fullNews(href, resource){
    try {
        return axios.get(href).then(resp => {
            const dom = new JSDOM(resp.data)

            return [resource.getShortText(dom.window.document), resource.getFullText(dom.window.document), resource.getImages(dom.window.document), resource.getVideos(dom.window.document), resource.getDate(dom.window.document)]
        })
    }catch (err){
        console.log(err)
    }

}

async function isInBD(href, categoryStr) {


    let item = await autoPostsCollection.findOne({href: href })

    if (item == undefined){
        return false
    }



    let isInItem = false
    for (let i = 0; i < item.categories.length; i++){
        if (item.categories[i] == categoryStr){
            isInItem = true
            break
        }
    }


    if (!isInItem){
        item.categories.push(categoryStr)
        await autoPostsCollection.updateOne({_id : item._id}, {$set : {
                categories : item.categories
            }})
        console.log("Added category")
    }

    return true
}



async function getNewsFromOneResource(){
    for (let resource of listOfResources){
        for (let category of categories){
            if (resource.categories[category] == undefined){
                continue
            }
            let listsPosts = undefined
            while (listsPosts == undefined) {
                listsPosts = await getNews(resource, resource.categories[category], category)
            }
            console.log(listsPosts.length)
            for (let i of listsPosts){
                console.log("")
                await addElement(i)
            }

            console.log("Done\n\n")
        }

    }
}







((async () => {

    await connectToDB()



} )())



