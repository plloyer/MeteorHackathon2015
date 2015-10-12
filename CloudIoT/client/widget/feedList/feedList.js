Template.feedList.subscriptionList = {};

Template.feedList.onCreated(function () {
    feedCursor = Template.feedList.getFeed();
    feedCursor.forEach(function (feed) {
        if (Template.feedList.isFeedActiveForCurrentUser(feed._id)) {
            Template.feedList.subscribeFeedData(feed._id);
        }
    });
});


Template.feedList.onDestroyed(function () {
    for (var key in Template.feedList.subscriptionList) {
        Template.feedList.subscriptionList[key].stop();
    }
});

Template.feedList.helpers({
    feed: function () {
        return Template.feedList.getFeed();
    },

    active: function () {
        if (Template.feedList.isFeedActiveForCurrentUser(this._id)) {
            return "active";
        }
        return "";
    },

    htmlIcon: function () {
        if (this.feedType == "F".charCodeAt(0) || this.feedType == "M".charCodeAt(0)) {
            return '<i class="fa fa-laptop fa-3x"></i>';
        }
        else if (this.feedType == "P".charCodeAt(0)) {
            return '<i class="fa fa-lightbulb-o fa-3x"></i>';
        }
        else if (this.feedType == "T".charCodeAt(0)) {
            return '<img src="thermometer.svg" alt="Thermometer" style="align:middle" height="50">';
        }

        return 'None';
    }
});

Template.feedList.events({
    'click button.active': function (event) {
        Meteor.call("setUserFeedActive", this._id, false);
        
        Template.feedList.unsubscribeFeedData(this._id);
    },
    'click button:not(.active)': function (event) {
        Meteor.call("setUserFeedActive", this._id, true);

        Template.feedList.subscribeFeedData(this._id);
    }
});

Template.feedList.isFeedActiveForCurrentUser = function (feedId) {
    return UserFeed.findOne({ 'feedId': feedId, 'userId': Meteor.userId(), 'active': true }, { _id: 0, feedId: 0, feedData: 0, active: 1 })
}

Template.feedList.getFeed = function () {
    return Feed.find({}, { _id: 1, clientId: 0, sensorId: 0, feedType: 1 });
}

Template.feedList.subscribeFeedData = function (feedId) {
    //console.log("Suscribe to feed: " + feedId);
    Template.feedList.subscriptionList[feedId] = Meteor.subscribe("FeedData", feedId);
}

Template.feedList.unsubscribeFeedData = function (feedId) {
    //console.log("Unuscribe to feed: " + feedId);

    var handle = Template.feedList.subscriptionList[feedId];
    handle.stop();
    delete Template.feedList.subscriptionList[feedId];
}