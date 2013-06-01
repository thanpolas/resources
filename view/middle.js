// view connect middleware

module['exports'] = function (options) {

  options.prefix = options.prefix || '';

  return function (req, res, next) {
    if (options.view) {
      //
      // If the view was mounted with a prefix and that prefix was not found in the incoming url,
      // do not attempt to use that view
      //
      if (options.prefix.length > 0 && req.url.search(options.prefix) === -1) {
        return next();
      }
      var _view = options.view;
      var parts = require('url').parse(req.url).pathname.replace(options.prefix, '').split('/');
      parts.shift();
      parts.forEach(function(part) {
        if(part.length > 0 && typeof _view !== 'undefined') {
          _view = _view[part];
        }
      });
      if (_view && _view['index']) {
        _view = _view['index'];
      }
      if(typeof _view === "undefined") {
        return next();
      }
      _view.present({
        request: req,
        response: res,
        data: req.big.params
        }, function (err, rendered) {
        res.end(rendered);
      });
    } else {
      //
      // No view was found, do not use middleware
      //
      next();
    }
  };

};