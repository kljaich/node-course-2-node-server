const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();
console.log(__dirname + '\\public');

hbs.registerPartials(__dirname + '\\views\\partials')
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '\\public'));

app.use((request, response, next) => {
  var now = new Date().toString();
  log = `${now}: ${request.method} ${request.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log')
    }
  });

  response.render('maintenance.hbs');
});

app.use((request, response, next) => {
  var now = new Date().toString();
  log = `${now}: ${request.method} ${request.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log')
    }
  });
  next();
});

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
})

app.get('/', (request, response) => {
  // response.send('<h1>Hello Express</h1>');
  // response.send({
  //   name: 'Jeff',
  //   likes: [
  //     'Rock Climbing',
  //     'Cooking',
  //     'Running'
  //   ]
  // })
  response.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to this website, I hope you enjoy your visit',
  });
});

app.get('/about', (request, response) => {
  response.render('about.hbs', {
    pageTitle: 'About Page',
    currentYear: new Date().getFullYear()
  });
});

app.get('/bad', (request, response) => {
  response.send({
    errorMessage: 'Unable to fulfull this request'
  })
});

app.listen(3000, () => {
  console.log('Server started on Port 3000');
});
