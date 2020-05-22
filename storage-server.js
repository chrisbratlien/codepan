var express = require('express')
var app = express()
//app.use(express.json()) // for parsing application/json
//app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())



var fs = require('fs')


const DATA_PATH = './data';

//let [readToken, writeToken] = [randString(), randString()];

// GET
app.get('/', function (req, res) {

	console.log('GET');
	res
	.status(201)
		.set({
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'contenttype',
			'Allow-origin': '*',
		})	
	.send("OK");
})


app.get('/:readToken', function (req, res) {

	console.log('GET /r');

	readToken = req.params.readToken;

	let data = readDocument(readToken);
	res
	.status(201)
		.set({
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'contenttype, Content-Type, ContentType',
			'Allow-origin': '*',
			'Content-Type': 'application/json'
		})	
	//TODO: need to grab the events from storage and emit back as JSON
	.send(data);
})

// OPTIONS
app.options('/', function (req, res) {
	console.log('OPTIONS /',req.headers);
		res
		.status(204)
		.set({
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'contenttype, Content-Type, ContentType',
			'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT',
			'Allow-origin': '*',
		})
  		.send('I heard OPTIONS');
})
// OPTIONS /:read/:write
app.options('/:readToken/:writeToken', function (req, res) {
	console.log('OPTIONS /r/w',req.headers);
		res
		.status(204)
		.set({
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'contenttype, Content-Type, ContentType',
			'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT',
			'Allow-origin': '*',
		})
  		.send('I heard OPTIONS');
})



function randString() {
	return Math.random().toString(36).replace(/.*\./,'');
}

function saveDocument(readToken,writeToken,obj) {

	console.log('SAVE','read',readToken,'write',writeToken,obj);

	var dir = DATA_PATH;
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}
	dir = `${DATA_PATH}/${readToken}`;
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}

	let filename =`${dir}/document.json`; 

	fs.writeFile(filename, JSON.stringify(obj,null,4), function (err) {
	  if (err) throw err;
	  console.log('Saved!');
	});
}

function readDocument(readToken,obj) {

	var dir = `${DATA_PATH}/${readToken}`;
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}
	let filename =`${dir}/document.json`; 
	let data = fs.readFileSync(filename);
	return data;
}

//POST
app.post('/', function (req, res) {
	console.log('POST /',req.headers,req.body,req);
	
	let [readToken, writeToken, body ] = [ randString(), randString(), req.body ];
	console.log('BODY?', body);
	saveDocument(readToken, writeToken, body);

	res
		.status(201)
		.set({
			'Access-Control-Allow-Origin': req.headers.origin,
			'Access-Control-Allow-Headers': '*',
			'Access-Control-Allow-Headers': 'contenttype, Content-Type, ContentType',
			'Allow-origin': '*',
		})	
	.send({ 
		readToken: readToken,
		writeToken: writeToken
	});
})

//PUT
app.put('/:readToken/:writeToken', function (req, res) {
	console.log('PUT /r/w',req.headers,'req.body',req.body);
	let [readToken,writeToken] = [req.params.readToken,req.params.writeToken];
	saveDocument(readToken,writeToken,req.body);

	res
		.status(201)
		.set({
			'Access-Control-Allow-Origin': req.headers.origin,
			'Access-Control-Allow-Headers': 'contenttype, Content-Type, ContentType',
			'Allow-Origin': '*',
		})	
  
  .send('Updated');
  ////console.log('RES',res)
})




app.listen(4000, function () {
		console.log('app listening on port ' + 4000);
		
})

