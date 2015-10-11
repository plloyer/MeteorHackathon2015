Template.feedList.helpers({
    feed: function () {
        return Feed.find({}, { _id: 1, clientId: 0, sensorId: 0, feedType: 1 })
    },

    active: function () {
        doc = UserFeed.findOne({ 'feedId': this._id, 'userId': Meteor.userId()}, { _id: 0, feedId: 0, feedData: 0, active: 1 })
        if(doc){
            return doc.active ? "active" : "";
        }
        return "";
    },
    
    htmlIcon: function () {
        if (this.feedType == "P".charCodeAt(0)) {
            return '<i class="fa fa-lightbulb-o fa-3x"></i>';
        }
        else if (this.feedType == "T".charCodeAt(0)) {
            return '<img src="thermometer.svg" alt="Thermometer" style="align:middle" height="50" width="50">';
        }
        
        return 'None';
    }
});

Template.feedList.events({
    'click button.active': function (event) {
        Meteor.call("setUserFeedActive", this._id, false);
    },
    'click button:not(.active)': function (event) {
        Meteor.call("setUserFeedActive", this._id, true);
    }
});