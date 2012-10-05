TweetsCollection = require 'models/tweets'

Application = initialize: ->
  HomeView = require('views/home_view')
  Router = require('lib/router')
  @collections = {}
  @collections.tweets = new TweetsCollection
  @homeView = new HomeView( collection: @collections.tweets )
  @router = new Router()
  Object.freeze this if typeof Object.freeze is 'function'

module.exports = Application
