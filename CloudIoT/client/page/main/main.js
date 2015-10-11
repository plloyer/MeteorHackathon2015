Template.main.helpers({
    feeds: function() {
        return Feed.find({}, {_id:1, clientId:0, sensorId:0, feedType:0})
    }
});