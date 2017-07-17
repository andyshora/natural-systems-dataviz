/* eslint no-console: 0 */
'use strict';

let path = require('path');
let history = require('connect-history-api-fallback');
let express = require('express');
let compress = require('compression');

const port = process.env.PORT || 3000;
let app = express();

console.log('==> ⚪️ Production Mode set');

app.use(compress());
app.use(history());

// serve static files
app.use('/dist', express.static('dist'));
app.use('/assets', express.static('assets'));

// serve index.html for all requests
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, (err) => {
  if (err) {
    console.error('==> 🔴 ', err);
  }
  console.info('==> ✅ Listening on port ' + port);
});
