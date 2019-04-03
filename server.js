const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/family', {
  useNewUrlParser: true
});


app.listen(3000, () => console.log('Server listening on port 3000!'));

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  }
});

// Create a scheme for items in the museum: a title and a path to an image.
const petSchema = new mongoose.Schema({
  name: String,
  path: String,
  description: String,
  age: String,
});

// Create a model for items in the museum.
const Pet = mongoose.model('Pet', petSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/pets', async (req, res) => {
  const pet = new Pet({
    name: req.body.name,
    path: req.body.path,
    description: req.body.description,
    age: req.body.age,
  });
  try {
    await pet.save();
    res.send(pet);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the museum.
app.get('/api/pets', async (req, res) => {
  try {
    let pets = await Pet.find();
    res.send(pets);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete selected item
app.delete('/api/pets/:id', async (req, res) => {
  try {
    await Pet.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Update selected item
app.put('/api/pets/:id', async (req, res) => {
  try {
    let pet = await Pet.findOne({
      _id: req.params.id
    });
    pet.name = req.body.name;
    pet.description = req.body.description;
    pet.age = req.body.age;
    await pet.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
