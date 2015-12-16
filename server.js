var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
}

Storage.prototype.add = function(name) {
    
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;

}

Storage.prototype.delete = function(id) {
    
    var item = this.items[id].name, i = 0;
    
    i = id - 1;
    this.items.splice(i,1);
    return item;

}

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res){
   
   res.json(storage.items); 
    
});

app.post('/items', jsonParser, function(req,res){
   if(!req.body) {
       return res.sendStatus(400)
   }
   
   var item = storage.add(req.body.name);
   res.status(201).json(item); 
});

app.delete('/items/:id', function(req,res){
   
   var id = req.params.id, item = '';
   item = storage.delete(id);
   res.status(200).send(item); 

});

app.listen(8080);

