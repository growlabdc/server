/* global ActiveXObject, XMLHttpRequest */

(function (root, factory) {

  root.Request = factory(root);

})(this, function (root) {

  'use strict';

  function buildParams(prefix, obj, add) {
    var name, i, l, rbracket;
    rbracket = /\[\]$/;
    if (obj instanceof Array) {
      for (i = 0, l = obj.length; i < l; i++) {
	if (rbracket.test(prefix)) {
	  add(prefix, obj[i]);
	} else {
	  buildParams(prefix + ( typeof obj[i] === 'object' ? ('[' + i + ']') : '' ), obj[i], add);
	}
      }
    } else if (typeof obj == 'object') {
      // Serialize object item.
      for (name in obj) {
	buildParams(prefix + '[' + name + ']', obj[ name ], add);
      }
    } else {
      // Serialize scalar item.
      add(prefix, obj);
    }
  }

  var objectToQueryString = function (a) {
    var prefix, s, add, name, r20, output;
    s = [];
    r20 = /%20/g;
    add = function (key, value) {
      // If value is a function, invoke it and return its value
      value = ( typeof value == 'function' ) ? value() : ( value == null ? '' : value );
      s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
    };
    if (a instanceof Array) {
      for (name in a) {
	add(name, a[name]);
      }
    } else {
      for (prefix in a) {
	buildParams(prefix, a[ prefix ], add);
      }
    }
    output = s.join('&').replace(r20, '+');
    return output;
  };

  var parse = function (req) {
    var result;
    try {
      result = JSON.parse(req.responseText);
      result.status = req.status;
    } catch (e) {
      result = { text: req.responseText, status: req.status, url: req._url };
    }
    return [result, req];
  };

  var getXHR = function() {
    if (root.XMLHttpRequest
	&& (!root.location || 'file:' !== root.location.protocol
	    || !root.ActiveXObject)) {
      return new XMLHttpRequest();
    } else {
      try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
      try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
      try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
      try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
    }
    return false;
  };

  var xhr = function (type, url, data) {
    var methods = {
      success: function () {},
      error: function () {}
    };
    var request = getXHR();
    request._url = url;

    if (!request) throw new Error('unable to detect XHR');

    request.open(type, url, true);
    request.setRequestHeader('Content-type', 'application/json');
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
	if (request.status === 200) {
	  methods.success.apply(methods, parse(request));
	} else {
	  methods.error.apply(methods, parse(request));
	}
      }
    };

    request.send(JSON.stringify(data));
    return {
      success: function (callback) {
	methods.success = callback;
	return this;
      },
      error: function (callback) {
	methods.error = callback;
	return this;
      }
    };
  };

  return {
    head: function(url) {
      return xhr('HEAD', url);
    },
    get: function(url, data) {
      if (data) url += '?' + objectToQueryString(data);
      return xhr('GET', url);
    },
    put: function(url, data) {
      return xhr('PUT', url, data);
    },
    post: function(url, data) {
      return xhr('POST', url, data);
    },
    del: function(url, data) {
      if (data) url += '?' + objectToQueryString(data);
      return xhr('DELETE', url);
    }
  };

});
