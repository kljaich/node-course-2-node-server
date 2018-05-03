const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// If executing on local laptop, port 3000 to be used.  If executing from
// heroku, then heroku assigns the port the client/requester will use.
const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

app.use((request, response, next) => {
  var now = new Date().toString();
  log = `${now}: ${request.method} ${request.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log')
    }
  });

  // response.render('maintenance.hbs');
  next();
});

// Order of app.use important, as don't want to support rendering of
// help.html when website is under maintenance.
app.use(express.static(__dirname + '/public'));

// Helpers are preferred before property data.  Helpers are called
// directly in html files.
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
})

// root route sets two properties to be passed to dynamic web pages for
// rendering/display.
app.get('/', (request, response) => {
  response.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to this website, I hope you enjoy your visit',
  });
});

app.get('/help', (request, response) => {
  response.sendFile(__dirname + '/public/help.html');
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

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
