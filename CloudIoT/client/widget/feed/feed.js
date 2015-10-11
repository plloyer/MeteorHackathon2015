Template.feed.generateSequence = function (start, size, step) {
    labelArray = new Array(size);
    for (var i = start; i < size; i += step) {
        labelArray[i] = (i).toString();
    }
    return labelArray;
}

Template.feed.getFeedDataArray = function (feedId) {
    var feedDataCursor = FeedData.find({ 'feedId': feedId });
    feedDataArray = feedDataCursor.map(function (doc) { return doc.feedData; });
    //console.log('FeedDataArray for feedId: ' + feedId);
    //console.log('[' + feedDataArray.join(', ') + ']');
    return feedDataArray;
}

Template.feed.reset = function (name) {
    var inputBox = document.getElementById("inputEditFeed_" + name);
    if (inputBox)
        inputBox.value = "";
    Session.set("feedIsEditing_" + name, false);
};

Template.feed.created = function () {
};

Template.feed.helpers({
    getName: function () {
        var name = this.name;
        if (name === undefined || name === null || name.length === 0) {
            name = "Feed";
        }
        return name;
    },

    isOwner: function () {
        return this.owner === Meteor.userId();
    },

    isEditMode: function () {
        return Session.get("feedIsEditing_" + this._id);
    },

    data: function () {
        var feedDataArray = Template.feed.getFeedDataArray(this._id);
        return '[' + feedDataArray.join(', ') + ']'
    },

    invokeAfterLoad: function () {
        Template.feed.reset(this._id);
        WorldResetAddAction("FeedEdit", this._id, Template.feed.reset);

        var feed = this;
        Meteor.setTimeout(function () {
            Tracker.autorun(function () {
                var feedDataArray = Template.feed.getFeedDataArray(feed._id);

                var dataList;
                if (feedDataArray.length > 50)
                    dataList = feedDataArray.slice(feedDataArray.length - 50);
                else
                    dataList = feedDataArray;

                if (dataList.length > 0) {

                    var data = {};
                    var options = {}
                    var labelArray = Template.feed.generateSequence(0, 50, 5);
                    if (feed.feedType == "P".charCodeAt(0)) {
                        data = {
                            labels: labelArray,
                            series: [dataList]
                        };
                        options = {
                            showArea: true,
                            showLine: true,
                            showPoint: false,
                            charPadding: { right: 40 },
                            high: 1100,
                            low: 0,
                            axisY: {
                                labelInterpolationFnc: function (value) {
                                    if (value == 0) return "Dark";
                                    if (value == 250) return "Moonlight";
                                    if (value == 500) return "Dark Room";
                                    if (value == 750) return "Bright Room";
                                    if (value == 1000) return "Overcast Light Clouds";

                                    return null;
                                },
                            }
                        };
                    } else {
                        data = {
                            labels: labelArray,
                            series: [dataList]
                        };
                        options = {
                            showArea: true,
                            showLine: true,
                            showPoint: false,
                            charPadding: { right: 40 }
                        };
                    }

                    if (feed._myTestChart) {
                        feed._myTestChart.update(data);
                    }
                    else {
                        feed._myTestChart = new Chartist.Line('#' + feed._id, data, options);
                    }
                }
            }, 15);
        });
    }
});

Template.feed.doEdit = function (feedId) {
    var name = document.getElementById("inputEditFeed_" + feedId).value;
    Meteor.call("feedUpdateName", feedId, name, function (error, id) {
        if (!error) {
            Template.feed.reset(feedId);
        }
        else {
            Template.messagesList.clearMessage('FeedErrors');
            Template.messagesList.pushMessage('FeedErrors', 'Error', 'label-warning', error.message);
        }
    });

}

Template.feed.events({
    'click button.editFeed': function (event) {
        WorldResetGroup("FeedEdit"); // Close all the other feed edits (if any)
        Session.set("feedIsEditing_" + this._id, true);
    },
    'click button.doEditFeed': function (event) {
        Template.feed.doEdit(this._id);
    },
    'keypress input.doEditFeed': function (evt, template) {
        if (evt.which === 13) {
            Template.feed.doEdit(this._id);
        }
    },
    'click button.cancelEditFeed': function (event) {
        WorldResetGroup("FeedEdit"); // Close all the other feed edits (if any)        
    }
});

Template.feed.created = function () {
    Session.set("FeedErrors", []);
};

Template.FeedErrors.helpers({
    errors: function () {
        return Session.get('FeedErrors');
    },
});