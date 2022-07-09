import express from 'express';
import morgan from 'morgan';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import {engine} from 'express-handlebars';

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname)
const app = express()
app.use(morgan('dev'))

app.engine('hbs', engine({
        defaultLayout: 'main.hbs'
}
));
app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/bs4', function(req,res){
    res.sendFile(__dirname + '/bs4.html');
})
const port = 3000
app.listen(port, function (){
    console.log(`Example app listening at http://localhost:${port}`)
})