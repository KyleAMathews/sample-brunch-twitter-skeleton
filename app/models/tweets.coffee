class Tweet extends Backbone.Model

module.exports = class TweetsCollection extends Backbone.Collection

  model: Tweet
  queryPageSize: 25
  query: ''

  fetch: (options) ->
    $.ajax(
      url: @url()
      data:
        rpp: @queryPageSize,
        q: @get('query')
      success: (response) =>
        @fetchCallback(response)
      dataType: 'jsonp'
    )

  fetchCallback: (response) ->
    @reset()

    for tweet, i in response.results
      @add {
            'id': tweet.id,
            'createdAt': tweet.created_at,
            'profileImageUrl': tweet.profile_image_url,
            'user': tweet.from_user,
            'text': tweet.text
        }, { silent: true }

    @trigger('change')

  url: ->
    return "http://search.twitter.com/search.json?&q=#{ this.query }&rpp=" +
    this.queryPageSize + "&callback=?"

  maxId: ->
    return @max((tweet) -> return tweet.id)
