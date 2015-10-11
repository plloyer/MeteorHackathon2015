Meteor.methods({
    feed: function (clientId, sensorId, feedType) {
        check(clientId, Number);
        check(sensorId, Number);
        check(feedType, Number);

        console.log("'Feed()': clientId: " + clientId + ", sensorId: " + sensorId + ", feedType: " + feedType);

        doc = Feed.findOne({ 'clientId': clientId, 'sensorId': sensorId });
        if (doc) {
            validateData(doc.feedType === feedType, 1000);
        }
        else {
            doc = Feed.insert({
                'clientId': clientId,
                'sensorId': sensorId,
                'feedType': feedType
            });

        }

        response = { "method": "feed", "sensorId": sensorId, "feedId": doc._id };
        console.log("Feed() return: " + JSON.stringify(response));
        return response;
    },

    feedData: function (feedId, feedData) {
        check(feedId, String);
        check(feedData, String);

        console.log("'FeedData()': feedId: " + feedId + ", feedData: " + feedData);

        doc = Feed.findOne({ '_id': feedId }, { _id: 1, feedId: 0, feedData: 0, time: 0 });
        if (doc) {
            FeedData.insert({
                'feedId': feedId,
                'feedData': feedData,
                'time': Date.now()
            });
        }
        else {
            // Todo send a requestion for info
        }
    }
});