(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  var Application, TweetsCollection;

  TweetsCollection = require('models/tweets');

  Application = {
    initialize: function() {
      var HomeView, Router;
      HomeView = require('views/home_view');
      Router = require('lib/router');
      this.homeView = new HomeView();
      this.router = new Router();
      this.collection = {};
      this.collection.tweets = new TweetsCollection;
      if (typeof Object.freeze === 'function') {
        return Object.freeze(this);
      }
    }
  };

  module.exports = Application;
  
}});

window.require.define({"initialize": function(exports, require, module) {
  
  window.app = require('application');

  $(function() {
    app.initialize();
    return Backbone.history.start();
  });
  
}});

window.require.define({"lib/router": function(exports, require, module) {
  var application;

  application = require('application');

  module.exports = Backbone.Router.extend({
    routes: {
      '': 'home'
    },
    home: function() {
      return $('body').html(application.homeView.render().el);
    }
  });
  
}});

window.require.define({"models/collection": function(exports, require, module) {
  
  module.exports = Backbone.Collection.extend({});
  
}});

window.require.define({"models/model": function(exports, require, module) {
  
  module.exports = Backbone.Model.extend({});
  
}});

window.require.define({"models/tweets": function(exports, require, module) {
  var Tweet, TweetsCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tweet = (function(_super) {

    __extends(Tweet, _super);

    function Tweet() {
      return Tweet.__super__.constructor.apply(this, arguments);
    }

    return Tweet;

  })(Backbone.Model);

  module.exports = TweetsCollection = (function(_super) {

    __extends(TweetsCollection, _super);

    function TweetsCollection() {
      return TweetsCollection.__super__.constructor.apply(this, arguments);
    }

    TweetsCollection.prototype.model = Tweet;

    TweetsCollection.prototype.queryPageSize = 25;

    TweetsCollection.prototype.query = '';

    TweetsCollection.prototype.fetch = function(options) {
      var _this = this;
      return $.ajax({
        url: "http://search.twitter.com/search.json?&q=hello&rpp=25&callback=",
        data: {
          rpp: this.queryPageSize,
          q: this.get('query')
        },
        success: function(response) {
          return _this.fetchCallback(response);
        },
        dataType: 'jsonp'
      });
    };

    TweetsCollection.prototype.fetchCallback = function(response) {
      var i, tweet, _i, _len, _ref;
      this.reset();
      _ref = response.results;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        tweet = _ref[i];
        this.add({
          'id': tweet.id,
          'createdAt': tweet.created_at,
          'profileImageUrl': tweet.profile_image_url,
          'user': tweet.from_user,
          'text': tweet.text
        }, {
          silent: true
        });
      }
      return this.trigger('change');
    };

    TweetsCollection.prototype.url = function() {
      return ("http://search.twitter.com/search.json?&q=" + this.query + "&rpp=") + this.queryPageSize + "&callback=?";
    };

    TweetsCollection.prototype.maxId = function() {
      return this.max(function(tweet) {
        return tweet.id;
      });
    };

    return TweetsCollection;

  })(Backbone.Collection);
  
}});

window.require.define({"views/home_view": function(exports, require, module) {
  var View, template;

  View = require('./view');

  template = require('./templates/home');

  module.exports = View.extend({
    id: 'home-view',
    template: template
  });
  
}});

window.require.define({"views/templates/home": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="content"><h1>Brunch<img src="http://brunch.io/images/brunch.png"/></h1><h2>Welcome!</h2><ul><li><a href="http://brunch.readthedocs.org/">Documentation</a></li><li><a href="https://github.com/brunch/brunch/issues">Github Issues</a></li><li><a href="https://github.com/brunch/twitter">Twitter Example App</a></li><li><a href="https://github.com/brunch/todos">Todos Example App</a></li></ul></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/index": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="content"><h1>brunch<h2>Welcome!</h2><ul><li><a href="http://brunch.readthedocs.org/">Documentation</a></li><li><a href="https://github.com/brunch/brunch/issues">Github Issues</a></li><li><a href="https://github.com/brunch/twitter">Twitter Example App</a></li><li><a href="https://github.com/brunch/todos">Todos Example App</a></li></ul></h1></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/layout": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><title>UI</title><link rel="stylesheet" href="/stylesheets/app.css"></head><body>');
  var __val__ = body
  buf.push(null == __val__ ? "" : __val__);
  buf.push('<script src="/javascripts/vendor.js"></script><script src="/javascripts/app.js"></script></body></html>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/view": function(exports, require, module) {
  
  module.exports = Backbone.View.extend({
    initialize: function() {
      return this.render = _.bind(this.render, this);
    },
    template: function() {},
    getRenderData: function() {},
    render: function() {
      this.$el.html(this.template(this.getRenderData()));
      this.afterRender();
      return this;
    },
    afterRender: function() {}
  });
  
}});

