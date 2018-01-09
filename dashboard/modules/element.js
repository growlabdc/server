/* global window, document, Element */
(function(root, factory) {

  root.Elem = factory(root);

})(this, function() {

  'use strict';

  return {
    create: function(opts) {
      opts = opts || {};
      var el, a, i, d;

      el = document.createElement(opts.tag || 'div');

      if (opts.className) {
	el.className = opts.className;
      }

      if (opts.id) {
	el.id = opts.id;
      }
      
      if (opts.attributes) {
	for (a in opts.attributes) {
	  el.setAttribute(a, opts.attributes[a]);
	}
      }
      
      if (opts.html !== undefined) {
	el.innerHTML = opts.html;
      }
      
      if (opts.text) {
	el.appendChild(document.createTextNode(opts.text));
      }

      // IE 8 doesn"t have HTMLElement
      if (window.HTMLElement === undefined) {
	window.HTMLElement = Element;
      }
      
      if (opts.childs && opts.childs.length) {
	for (i = 0; i < opts.childs.length; i++) {
	  el.appendChild(opts.childs[i] instanceof window.HTMLElement ? opts.childs[i] : this.create(opts.childs[i]));
	}
      }

      if (opts.parent) {
	opts.parent.appendChild(el);
      }

      if (opts.onclick) {
	el.onclick = opts.onclick;
      }

      if (opts.dataset) {
	for (d in opts.dataset) {
	  el.dataset[d] = opts.dataset[d];
	}
      }

      return el;
    },

    getClosest: function(elem, selector) {

      var firstChar = selector.charAt(0);

      for ( ; elem && elem !== document; elem = elem.parentNode ) {

	if (firstChar === '.')
	  if (elem.classList.contains(selector.substr(1)))
	    return elem;

	if (firstChar === '#')
	  if (elem.id === selector.substr(1))
	    return elem;

	if (firstChar === '[')
	  if (elem.hasAttribute(selector.substr(1, selector.length - 2)))
	    return elem;

	if (elem.tagName.toLowerCase() === selector) return elem;

      }

      return false;

    },

    getOffX: function(o) {
      // http://www.xs4all.nl/~ppk/js/findpos.html
      var curleft = 0;
      if (o.offsetParent) {
	while (o.offsetParent) {
	  curleft += o.offsetLeft;
	  o = o.offsetParent;
	}
      } else if (o.x) {
	curleft += o.x;
      }
      return curleft;
    },

    getTheDamnTarget: function(e) {
      return (e.target || (window.event ? window.event.srcElement : null));
    },
    
    isChildOfClass : function (oChild, oClass) {
      if (!oChild || !oClass) return false;

      while (oChild.parentNode && !oChild.classList.contains(oClass)) {
	oChild = oChild.parentNode;
      }
      return oChild.classList.contains(oClass);
    },

    text: function(o) {
      return o.innerText || o.textContent;
    },

    each: function (array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
	callback.call(scope, array[i], i);
      }
    }
  };
});
