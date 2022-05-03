const axios = require('axios');
const {JSDOM} = require("jsdom");

const delfi = require("./delfi")
const postimees = require("./postimees")

const { MongoClient } = require('mongodb');

const URL = "mongodb+srv://uround-app:1qaz2wsx3edc@cluster0.2u3vn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(URL);
const database = client.db("URound");

const autoPostsCollection = database.collection("autoposts");

const listOfResources = [postimees, delfi]
const categories = ["Estonia", "Ida-Virumaa", "Tallinn", "MK", "CHP", "Economic"]


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


async function getNews(resource, category) {
    try {
        const resp = await axios.get(category)

        const dom = new JSDOM(resp.data)
        const listOfNews = []

        const list = resource.getList(dom.window.document)

        for (let i = list.length - 1; i >= 0; i--){
            let href = resource.getHref(list[i])


            if (await isInBD(href, category)){
                continue
            }
            listOfNews.push(await newsItems(list[i], category, resource));
        }


        return listOfNews

    } catch (err) {
        console.log(err)
    }
}


async function newsItems(news, cat, resource) {
    let item = {
        category: [cat],
        title: resource.getTitle(news),
        href: resource.getHref(news),
        images: [resource.getPriviosImage(news)],
        videos: [],
        shortText: "",
        fullText : "",
        date :  new Date().toLocaleString()
    }

    let fullNew = await fullNews(item.href, resource)

    item.shortText = fullNew[0]
    item.fullText = fullNew[1]
    fullNew[2].forEach(photo => item.images.push(photo))
    item.videos.concat(fullNew[3])
    item.date = fullNew[4]
    console.log(item)
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

async function isInBD(href, cat) {


    let item = await autoPostsCollection.findOne({href: href })

    if (item == undefined){
        return false
    }



    let isInItem = false
    for (let i = 0; i < item.category.length; i++){
        if (item.category[i] == cat){
            isInItem = true
            break
        }
    }


    if (!isInItem){
        item.category.push(cat)
        const result = autoPostsCollection.updateOne({_id : item._id}, {$set : {
                category : item.category
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

            const listsPosts = await getNews(resource, resource.categories[category])

            for (let i of listsPosts){

                await addElement(i)
            }

            console.log(listsPosts.length)
        }

    }
}






((async () => {

    await connectToDB()



} )())


