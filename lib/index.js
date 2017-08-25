module.exports = function(options) {
  
  return (req, res, next) => {

    const http = require('http');
    const querystring = require('querystring');
    const {URL} = require('url');

    let url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);

    if(url.searchParams.has('_escaped_fragment_')) {
      let fragment = url.searchParams.get('_escaped_fragment_');
      url.searchParams.delete('_escaped_fragment_');

      if(fragment.length) url.hash = '!' + fragment;

      let options = {
        host: 'localhost',
        port: 3000,
        path: '/render?url=' + querystring.escape(url),
        method: 'GET'
      };

       let callback = (response) => {
          var content = '';

          response.on('data', (chunk) => {
            content += chunk;
          });

          response.on('end', () => {
            res.send(content);
          });
        };

        http.request(options, callback).end();
    } else {
      next();
    }
  };

};