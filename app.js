var express = require("express");
var excelToJson = require("convert-excel-to-json");
var bodyParser = require("body-parser");
var multer = require("multer");
var mongoose = require("mongoose");
var path = require("path");
var petsModel = require("./petsModel");
var fs = require('fs');

var app = express();
//set the template engine


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
var uploads = multer({ storage: storage });


mongoose.connect("mongodb://localhost:27017/petsDB", { useNewUrlParser: true })
//useNewUrlParser: true, so that it does not throw error in console during runtime.
//init app 


app.set("view engine", "ejs");


//fetch data from the request
app.use(bodyParser.urlencoded({ extended: false }));

//static folder
app.use(express.static(path.resolve(__dirname, 'public')));


//route for Home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


// Upload excel file and import to mongodb
app.post("/uploadfile", uploads.single("uploadfile"), (req, res) => {
  importExcelData2MongoDB(__dirname + "/public/uploads/" + req.file.filename);
});


app.get("/pets", function(req, res){
    Pets.find(function(err, foundPets){
        if(!err){
            res.send(foundPets);
        }else {
            res.send(err);
        }
    });
});



//chained route handling
app.route("/pets/:petID")
.get(function(req,res){
  Pets.findOne({_id: req.params.petID}, function(err, foundPets){
    if(foundPets){
      res.send(foundPets);
    }else{
      res.send("No matching pets in the list found.");
    }
  });
});

app.route("/pets/:petID")
.delete(function(req, res){
  Pets.deleteOne({_id: req.params.petID}, function(err){
    if(!err){
      res.send("Successfully deleted");
    }else{
      res.send(err);
    }
  });
});

app.route("/pets/:petID")
.patch(function(req, res){
  Pets.update(
    {_id: req.params.petID},
    {$set: req.body},
    function(err){
      if(!err){
      res.send("Successfully updated")
    }else{
      res.send(err);
    }
  }
  );
});



// Importing Excel File to MongoDB database
function importExcelData2MongoDB(filePath) {
  // -> Read Excel File to Json Data
  const excelData = excelToJson({
    sourceFile: filePath,
    sheets: [
      {
        // Excel Sheet Name to be provided
        name: "Sheet1",
        // Header Row == be skipped and will not be present at our result object.
        header: {
          rows: 1,
        },
        // Mapping the columns to keys
        columnToKey: {
         // A: "_id",
          A: "Name",
          B: "Type",
          C: "Breed",
          D: "Age"
        },
      },
    ],
  });
  console.log(excelData);


  petsModel.insertMany(excelData, (err, data) => {
    if(err){  
      console.log(err);  
      }else{
        app.get('', (req, res) => {
          res.redirect('/');
        });   
      }  
     });
  fs.unlinkSync(filePath);
}
//assigning port
var port = process.env.PORT || 3000;
app.listen(port, () => console.log("server run at port " + port));
