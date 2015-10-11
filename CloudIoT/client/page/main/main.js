Template.main.helpers({
    activeFeed: function () {
        userFeedCursor = UserFeed.find(
            { 'userId': Meteor.userId(), 'active': true },
            { _id: 0, feedId: 1, userId: 0, active: 0 }
            );

        var activeFeedIdArray = [];
        userFeedCursor.forEach(function (userFeed) {
            activeFeedIdArray.push(userFeed.feedId);
        });

        return Feed.find({ '_id': { $in: activeFeedIdArray } });
    }
});