Template = require('./templates/tweets')

module.exports = class TweetsView extends Backbone.View
  id: 'tweets'

  initialize: ->
    @collection.on 'change', @render

  render: =>
    @$el.empty()
    @$el.append "<br /><ul>"
    for tweet in @collection.models
      @$el.append("<li><img src='#{ tweet.get('profileImageUrl') }' />  <strong>#{ tweet.get('user') }:</strong>  #{ tweet.get('text') }</li>")
    @$el.append "</ul>"
    @

