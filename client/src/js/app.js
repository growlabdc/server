(function(root, factory) {

  root.App = factory(root)

})(this, function() {

  'use strict'

  return {
    api: function(path) {
      path = 'https://growlab.space/api' + path
      return {
	get: function(params) {
	  params = params || {}
	  return Request.get(path, params)
	},
	put: function(params) {
	  return Request.put(path, params)
	},
	post: function(params) {
	  return Request.post(path, params)
	},
	del: function(params) {
	  params = params || {}
	  return Request.del(path, params)
	}
      }
    },
    status: function(value) {
      return value ? 'On' : 'Off'
    },
    log: function(type, meta, message) {
      var parent = document.getElementById('log')

      Elem.create({
	parent: parent,
	childs: [{
	  tag: 'span',
	  className: type,
	  text: type
	}, {
	  tag: 'span',
	  text: meta
	}, {
	  tag: 'span',
	  text: message
	}]
      })

      parent.scrollTop = parent.scrollHeight
    }
  }
})
