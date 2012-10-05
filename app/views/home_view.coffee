Template = require('./templates/home')
#TweetsView = require('./tweets_view')

module.exports = class HomeView extends Backbone.View
  id: 'home-view'

  events:
    'click button': 'clickButton'
    'keypress input': 'typeInput'

  typeInput: (e) ->
    if e.which is 13 then @clickButton()

  clickButton: ->
    app.collections.tweets.query = @$('input.query').val()
    app.collections.tweets.fetch()

  render: ->
    @$el.html Template()

    # Add Tweets Subview
    #new TweetsView(
      #collection: @collection
      #el: @$('.tweets')
    #).render()
    @
