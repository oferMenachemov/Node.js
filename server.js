var express = require('express');
var fileData = require("fs");
var parser = require("body-parser");
var jsonFile = "./users.json"
var app = express();
var port = 3000;

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(express.static("./Client"));


//Send html page to client -  http://localhost:3000
app.get('/', function (req, res) {
  res.sendFile(__dirname+"/Client/index.html")
  console.log("Send html page to client");
});

//Post request from client
app.post("/addUser", function (req, res) {
  var user = req.body;
  if (isUserExist(user)) {
    res.status(400);
  } else {
    res.status(201);
    addUserToData(user);
  }
  res.send();
});


//Get request from client
app.get('/api/users', (req, res) => {
  res.status(200);
  var jsonDB = getData();
  res.send(JSON.stringify(jsonDB));
});

/*** FUNCTIONS ***/

//Read json to file
function getData() {
  var file = fileData.readFileSync(jsonFile, "utf-8");
  var jsonDB = JSON.parse(file);
  return jsonDB;
}

//Add new user to a json file
function addUserToData(user) {
  var jsonDB = getData();
  jsonDB.users.push(user);
  fileData.writeFileSync(jsonFile, JSON.stringify(jsonDB));
}

//Check if user alrady exist
//If exist return false
function isUserExist(userToAdd) {
  var isExist = false;
  var jsonDB = getData();
  for (var user of jsonDB.users) {
    if (user.name.toLowerCase() == userToAdd.name.toLowerCase())
      isExist = true;
  }
  return isExist;
}
/*** FUNCTIONS ***/


app.listen(port);
console.log("Server listening on port: %s", port);