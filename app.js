const express = require('express')
const bodyParser = require('body-parser')
const urlShortener = require('node-url-shortener')
const db = require('./models/index')
const exphbs = require('express-handlebars')

const port = process.env.PORT || 3000
const path = require('path')
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.urlencoded())

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.post('/url', function (req, res) {
    const url = req.body.url

    urlShortener.short(url, function (err, shortUrl) {
        db.Url.findOrCreate({where: {url: url, shortUrl: shortUrl}})
            .then(([urlObj, created]) => {
                res.send(shortUrl)
            })
    })
})

app.listen(port, () => console.log(`url-shortener listening on port ${port}`))