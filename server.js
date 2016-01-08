var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name, id) {
    
    var item = {name: name, id: parseInt((id || this.id))};
    this.items.push(item);
    this.id += 1;
    return item;

};

Storage.prototype.delete = function(id) {
    
    var item = '', idx = 0; 
    
    idx = this.findItem(id);
    item = this.items[idx].name;
    this.items.splice(idx,1);
    return {'id': id, 'name': item};

};

Storage.prototype.update = function(id, name) {
    
    var idx = 0;
    
    idx = this.findItem(id);
    
    if ( idx !== null) {
        this.items[idx].name = name;
    } else {
        this.add(name, id);
    }
    return;

};

Storage.prototype.findItem = function(id) {
    var length = this.items.length;
    
    for (var idx=0; idx < length; idx++) {
        if (this.items[idx].id === id){
            return idx;
        }
    } 
};

Storage.prototype.reset = function() {
    this.items = [];
    this.id = 0;

    this.add('Broad Beans');
    this.add('Tomatoes');
    this.add('Peppers');
};


var storage = new Storage();
storage.reset();

var app = express();
app.use(express.static('public'));


//Grab the list of items
app.get('/items', function(req, res){
   
    res.json(storage.items); 
    
});

// Add a new item
app.post('/items', jsonParser, function(req,res){
    if(!req.body) {
        return res.sendStatus(400);
    }
    
    var item = storage.add(req.body.name);
    res.status(201).json(item); 
});

// Delete an existing item
app.delete('/items/:id', function(req,res){
   
    var id = req.params.id, item = '';
    item = storage.delete(parseInt(id));
    res.status(200).json(item); 

});

// Edit an item 
app.put('/items/:id', jsonParser, function(req,res){
 
    if(!req.body) {
        return res.sendStatus(400).send('Nope');
    }
 
    storage.update(parseInt(req.params.id), req.body.name);
    res.status(200).json({'name': req.body.name}); 

});

// Express sets the port and listens for requests
app.listen(process.env.PORT || 8080, function(){
    console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env);
});

exports.app = app;
exports.storage = storage;