Meteor.publish("Feed", function () {
    //return Feed.find({}, { sort: { createdAt: -1 }, limit: 100 });
    return Feed.find({});
});

Meteor.publish("FeedData", function (feedId) {
    return FeedData.find({ 'feedId': feedId }, { sort: { time: -1 }, limit: 100 });
});

Meteor.publish("UserFeed", function () {
    return UserFeed.find({ 'userId': this.userId });
});