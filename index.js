const express = require("express");
const app = express();
const {wrap} = require('co');
const {join} = require('path');
const handlebars = require('handlebars');
const thunkify = require('thunkify');
const read = thunkify(require('fs').readFile);
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
var uuid = require('uuid');
var filename = uuid.v4() + '.pdf'
const pdf_options = {format: 'A4', quality: 150, orientation: "portrait",  zoomFactor: "0.5"};


app.get('/', (req, res)=>{
    res.send('Welcome to PDF Generator App...');
})
app.post('/generatePdf',function(req,res){

    //PDF
    const generatePDF = wrap(function * (c,b) {
    
        const data = {	
            student: {
                date: '22nd March',
                year: '2018'
            },
            employee: {
                name: 'Hari Prasad',
                designation: 'Block Chain Digital Lync'
            }
        };
        
        const source = yield read(join(`${__dirname}/PdfTemplate.html`), 'utf-8');
        const template = handlebars.compile(source);
        const html = template(data);
        const p = pdf.create(html, pdf_options);
        p.toFile = thunkify(p.toFile);
        const file = yield p.toFile(`${join(__dirname+'/Bills/', filename )}`);
    });

    if(res){
        res.send('Pdf generated successfully');
    }
    generatePDF();

});  


app.listen(8080);
console.log("Server is running at port 8080");