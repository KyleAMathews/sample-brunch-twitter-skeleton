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
      this.collections = {};
      this.collections.tweets = new TweetsCollection;
      this.homeView = new HomeView({
        collection: this.collections.tweets
      });
      this.router = new Router();
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
        url: this.url(),
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
  var HomeView, Template, TweetsView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Template = require('./templates/home');

  TweetsView = require('./tweets_view');

  module.exports = HomeView = (function(_super) {

    __extends(HomeView, _super);

    function HomeView() {
      return HomeView.__super__.constructor.apply(this, arguments);
    }

    HomeView.prototype.id = 'home-view';

    HomeView.prototype.events = {
      'click button': 'clickButton',
      'keypress input': 'typeInput'
    };

    HomeView.prototype.typeInput = function(e) {
      if (e.which === 13) {
        return this.clickButton();
      }
    };

    HomeView.prototype.clickButton = function() {
      app.collections.tweets.query = this.$('input.query').val();
      return app.collections.tweets.fetch();
    };

    HomeView.prototype.render = function() {
      this.$el.html(Template());
      new TweetsView({
        collection: this.collection,
        el: this.$('.tweets')
      }).render();
      return this;
    };

    return HomeView;

  })(Backbone.View);
  
}});

window.require.define({"views/templates/home": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="content"><h2>Twitter Search!</h2><input type="text" class="query"/><button>Search</button><div class="tweets"></div></div>');
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

window.require.define({"views/templates/tweets": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="tweets"></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/tweets_view": function(exports, require, module) {
  var Template, TweetsView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Template = require('./templates/tweets');

  module.exports = TweetsView = (function(_super) {

    __extends(TweetsView, _super);

    function TweetsView() {
      this.render = __bind(this.render, this);
      return TweetsView.__super__.constructor.apply(this, arguments);
    }

    TweetsView.prototype.id = 'tweets';

    TweetsView.prototype.initialize = function() {
      return this.collection.on('change', this.render);
    };

    TweetsView.prototype.render = function() {
      var tweet, _i, _len, _ref;
      this.$el.empty();
      this.$el.append("<br /><ul>");
      _ref = this.collection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tweet = _ref[_i];
        this.$el.append("<li><img src='" + (tweet.get('profileImageUrl')) + "' />  <strong>" + (tweet.get('user')) + ":</strong>  " + (tweet.get('text')) + "</li>");
      }
      this.$el.append("</ul>");
      return this;
    };

    return TweetsView;

  })(Backbone.View);
  
}});

