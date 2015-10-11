Meteor.publish("Feed", function () {
    //return Feed.find({}, { sort: { createdAt: -1 }, limit: 100 });
    return Feed.find({});
});

Meteor.publish("FeedData", function () {
    return FeedData.find({});
});