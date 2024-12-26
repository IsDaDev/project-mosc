// **********************************************************************************************************
// INFROMATIONS ABOUT THE PROJECT
// school-project-1 aka projectmosc is a schoolproject that showcases cars with unique media designs crearted
// by us paul mond (isdadev) & phillip schlichting (philrico)
// **********************************************************************************************************

// **********************************************************************************************************
// IMPORT SECTION
// **********************************************************************************************************

// require env file for secret data that should not be in a github commit
require('dotenv').config({ path: '../.env' });

// import necessary modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const emailjs = require('@emailjs/nodejs');

// **********************************************************************************************************
// VARIABLE SECTION
// **********************************************************************************************************

let captchaCode; // keeps track of the current right captcha

// **********************************************************************************************************
// SERVER SECTION
// **********************************************************************************************************

// create an instance of Express
const app = express();

// middleware to serve static files and set the view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// middleware to parse the body of files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// **********************************************************************************************************
// CONFIGURATION FOR EMAILJS
// **********************************************************************************************************

// setting up emailjs with private and publickey
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
  blockHeadless: true,
  limitRate: {
    id: 'app',
    throttle: 10000,
  },
});

// **********************************************************************************************************
// DATABASE QUERY ALL SECTION
// **********************************************************************************************************

// connect to the SQLite database
const db = new sqlite3.Database(
  // filepath
  path.join(__dirname, 'prod.db'),
  // method
  sqlite3.OPEN_READWRITE,
  // error handling
  (err) => {
    if (err) {
      console.error('Could not connect to the database', err);
    } else {
      console.log('Connected to the SQLite database.');
    }
  }
);

// function to load stuff from database
const loadFromDatabase = async (query) => {
  // empty array for the result
  let arr = [];

  // query the database
  return new Promise((resolve, reject) => {
    db.all(query, (error, data) => {
      // sends error message and rejects promise when error
      if (error) {
        console.error('Error fetching data from the database:', error);
        reject(error);
      } else {
        // returns data in the form of an array if successful
        data.forEach((element) => {
          arr.push(element);
        });
        resolve(arr);
      }
    });
  });
};

const fetchCarOfTheDay = async () => {
  // this query selects specific elements from the 2 important tables
  // from carGalleryListing: UID and display_name
  // from carData: name, class, brand
  let query = `
    SELECT 
      carGalleryListing.UID, 
      carGalleryListing.display_name, 
      carData.name AS main_car_name, 
      carData.class, 
      carData.brand, 
      carImages.image_link
    FROM carGalleryListing
    JOIN carData ON carGalleryListing.main_car = carData.UID
    JOIN carImages ON carGalleryListing.UID = carImages.main_car;
  `;

  // this promise thing again, like in lines 88-103, only difference is its not
  // put into an array when resolving
  return new Promise((resolve, reject) => {
    db.all(query, (error, data) => {
      if (error) {
        console.error('Error fetching data from the database:', error);
        reject(error);
      } else {
        console.log(data);
        resolve(data);
      }
    });
  });
};

// **********************************************************************************************************
// ROUTES SECTION
// **********************************************************************************************************

// route to the homepage
app.get('/', async (req, res) => {
  try {
    // Fetch all cars
    const data = await fetchCarOfTheDay();

    // Select a random car (with math yeah)
    const randomCar = data[Math.floor(Math.random() * data.length)];

    // array containg filepaths for each element on the start-page
    const mediaArray = [
      '/assets/start_1.webp',
      '/assets/start_2.webp',
      '/assets/start_3.webp',
    ];

    // Render the homepage and pass the car and all the images for the start
    res.render('homepage', { randomCar, mediaArray });
  } catch (error) {
    // error handling
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// route to get to the contact section
app.get('/contact', (req, res) => {
  // renders contact page
  res.render('contact');
});

// post route to get the submitted form
app.post('/contact/contactform', (req, res) => {
  // extracts all necessary information from the post request and saves it
  const params = {
    name: req.body['name'],
    email: req.body['email'],
    subject: req.body['subject'],
    message: req.body['message'],
    captcha: req.body['captcha'],
  };

  // checks if the captcha is correct
  if (params.captcha == captchaCode) {
    // if thats the case it tries to send the email with the data
    // param1: emailjs_service_id, param2: emailjs_template_id, param3: data
    emailjs
      .send(process.env.EMAILJS_SERVICE, process.env.EMAILJS_TEMPLATE, params)
      .then((response) => {
        // if there is no error it returns code 2 and the right message
        res.json({ responseCode: 2, message: 'Contact form submitted' });
      })
      .catch((error) => {
        // if there is an error it console logs it and returns code 3
        console.log('FAILED...', error);
        res.json({ responseCode: 3, message: 'Error submitting form' });
      });
  } else {
    // if the captcha is not correct it sends back code 1
    // the code on the next line is only there for testing if it works
    // console.log(params.captcha + ' == ' + captchaCode);
    res.json({ responseCode: 1, message: 'Wrong Captcha, try again' });
  }
});

// route to get a fresh captcha
app.post('/contact/refreshCaptcha', (req, res) => {
  // generates 2 random numbers between 1 and 20 and saves them in a variable
  const num1 = Math.ceil(Math.random() * 20);
  const num2 = Math.ceil(Math.random() * 20);

  // the result is just both of the numbers combined
  const result = num1 + num2;

  // returns the 3 variables in json format
  res.json({ code1: num1, code2: num2, result: result });
});

// only issue is that its server-side, so if multiple people access,
// they have to reload the captcha
// route to update captcha server-side
app.post('/contact/updateCaptchaCode', (req, res) => {
  // updates captchaCode to the code being sent via the post request
  captchaCode = req.body.result;
  // returns status code 200
  res.status(200).send('updated');
});

// route for the impressum
app.get('/impressum', (req, res) => {
  // renders impressum page
  res.render('impressum');
});

// route for the privacy-agreement
app.get('/privacy', (req, res) => {
  // renders privacy page
  res.render('privacy');
});

// route leading to the gallery
app.get('/gallery', async (req, res) => {
  try {
    // sql statement
    // selects specific elements, then returns only one unique combination
    // also only selects the "smallest" image in the image_link,
    // basically just gets the first one
    const sqlStatement = `SELECT 
          carGalleryListing.UID, 
          carGalleryListing.display_name, 
          carData.name AS main_car_name, 
          carData.class, 
          carData.brand, 
          MIN(carImages.image_link) AS car_image
          FROM carGalleryListing
          JOIN carData ON carGalleryListing.main_car = carData.UID
          JOIN carImages ON carGalleryListing.UID = carImages.main_car
      GROUP BY 
          carGalleryListing.UID, 
          carGalleryListing.display_name, 
          carData.name, 
          carData.class, 
          carData.brand;`;
    // gets the data from the database
    const carData = await loadFromDatabase(sqlStatement);

    // Pass carData to the template
    res.render('gallery', { carData });
  } catch (error) {
    // error handling
    console.error('Error loading carData:', error);
    res.status(500).send('Internal Server Error');
  }
});

// dynamic routes for each car inside the gallery
app.get('/gallery/:carName', async (req, res) => {
  // gets the carname from the request parameters
  const carName = req.params.carName;
  let images = [];

  // searches for the car in the database via SQL
  const requestedCar = await loadFromDatabase(
    `SELECT * FROM carData WHERE uid = ${carName}`
  );
  // finds the images for the selected car
  const carImages = await loadFromDatabase(
    `SELECT * FROM carImages WHERE main_car = ${carName}`
  );

  carImages.forEach((element) => {
    images.push(element['image_link']);
  });

  if (!requestedCar) {
    // if the car is not found it leads to the 404 page
    res.render('404', { message: 'This car could not be found' });
  } else {
    // if the car is found and no error it renders the carpage with the dynamic route
    // and passes the data for that selected car to the ejs template
    res.render('carpage', { carData: sanitize(requestedCar[0]), images });
  }
});

// **********************************************************************************************************
// ERROR HANDLING SECTION
// **********************************************************************************************************

// renders the 404 not found page if the page doesn't exist
app.use((req, res) => {
  res
    .status(404)
    .render('404', { message: 'The requested page could not be found' });
});

// **********************************************************************************************************
// MISC SECTION
// **********************************************************************************************************

// function to sanitize the data
// in this case it only checks that UID is not displayed on the page
const sanitize = (rowOfData) => {
  // creates a new Object
  let dict = new Object();
  // loops through all the entries in original Object, being the input
  Object.entries(rowOfData).forEach(([key, value]) => {
    // checks if the key is UID, then it skips it
    if (key === 'UID') {
      return;
    }
    // then returns the key and value to the new Object
    dict[key] = value;
  });
  // returns the new Object
  return dict;
};
