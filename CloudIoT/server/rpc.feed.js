Meteor.methods({
    feed: function (sessionKey, sensorId, feedType) {
        check(sessionKey, Number);
        check(sensorId, Number);
        check(feedType, Number);

        console.log("'Feed()': sessionKey: ..., sensorId: " + sensorId + ", feedType: " + feedType);

        session = isSessionKeyValid(sessionKey);
        validateData(session !== null, 403);

        doc = Feed.findOne({ 'clientId': session.uuid, 'sensorId': sensorId });
        if (doc) {
            validateData(doc.feedType === feedType, 1000);
            validateData(doc.owner === session.userId, 1001);
        }
        else {
            doc = Feed.insert({
                'clientId': session.uuid,
                'owner': session.userId,
                'sensorId': sensorId,
                'feedType': feedType
            });

        }

        response = { "method": "feed", "sensorId": sensorId, "feedId": doc._id };
        console.log("Feed() return: " + JSON.stringify(response));
        return response;
    },

    feedData: function (sessionKey, feedId, feedData, timestamp) {
        check(sessionKey, Number);
        check(feedId, String);
        check(feedData, String);
        check(timestamp, Number);

        console.log("'FeedData()': sessionKey: ..., feedId: " + feedId + ", feedData: " + feedData);

        session = isSessionKeyValid(sessionKey);
        validateData(session !== null, 403);

        doc = Feed.findOne({ '_id': feedId }, { _id: 1, feedId: 0, feedData: 0, time: 0 });
        validateData((doc.owner === session.userId), 1001);
        if (doc) {
            FeedData.insert({
                'feedId': feedId,
                'feedData': feedData,
                'time': timestamp
            });
        }
        else {
            // Todo send a requestion for info
        }
    },

    setUserFeedActive: function (feedId, active) {
        check(feedId, String);
        check(active, Boolean);

        userFeed = UserFeed.findOne({ 'feedId': feedId, 'userId': Meteor.userId() });
        if (userFeed) {
            UserFeed.update(userFeed, { $set: { 'active': active } });
        }
        else {
            UserFeed.insert({
                'feedId': feedId,
                'userId': Meteor.userId(),
                'active': active
            });
        }
    }
});