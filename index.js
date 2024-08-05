const express = require("express");
const path = require('path')
const app = express();
const cookieParser = require('cookie-parser')

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
// app.set('views', path.resolve('./public'))

const PORT = process.env.PORT || 8080;

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    res.render(`index`)
})

app.listen(PORT, () => {
    console.log(`App is listening on PORT: ${PORT}`)
})