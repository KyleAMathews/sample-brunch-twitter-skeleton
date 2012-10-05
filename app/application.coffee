TweetsCollection = require 'models/tweets'

Application = initialize: ->
  HomeView = require('views/home_view')
  Router = require('lib/router')
  @homeView = new HomeView()
  @router = new Router()
  @collection = {}
  @collection.tweets = new TweetsCollection
  Object.freeze this if typeof Object.freeze is 'function'

module.exports = Application
