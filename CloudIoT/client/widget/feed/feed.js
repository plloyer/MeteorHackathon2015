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
    return feedDataArray;
}
Template.feed.getFeedTimeArray = function (feedId) {
    var feedDataCursor = FeedData.find({ 'feedId': feedId });
    feedDataTimeArray = feedDataCursor.map(function (doc) { return doc.time; });
    return feedDataTimeArray;
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

    htmlIcon: function () {
        if (this.feedType == "F".charCodeAt(0) || this.feedType == "M".charCodeAt(0)) {
            return '<i class="fa fa-laptop"></i>';
        }
        else if (this.feedType == "P".charCodeAt(0)) {
            return '<i class="fa fa-lightbulb-o"></i>';
        }
        else if (this.feedType == "T".charCodeAt(0)) {
            return '<img src="thermometer.svg" alt="Thermometer" style="align:middle;height:1.5em;width:0.49em;">';
        }

        return 'None';
    },

    invokeAfterLoad: function () {
        Template.feed.reset(this._id);
        WorldResetAddAction("FeedEdit", this._id, Template.feed.reset);

        var feed = this;
        Meteor.setTimeout(function () {
            Tracker.autorun(function () {
                var feedDataArray = Template.feed.getFeedDataArray(feed._id);
                var feedTimeArray = Template.feed.getFeedTimeArray(feed._id);

                var dataList;
                var timeList;
                if (feedDataArray.length > 50) {
                    dataList = feedDataArray.slice(feedDataArray.length - 50);
                    timeList = feedTimeArray.slice(feedTimeArray.length - 50);
                }
                else{
                    dataList = feedDataArray;
                    timeList = feedTimeArray;
                }

                if (dataList.length > 0) {
                    var labelsTime = [];
                    var counter = 0;
                    timeList.forEach(function(secs){
                        if(counter % 15 === 0 )
                        {
                            var t = new Date(1970,0,1);
                            t.setSeconds(secs - 4 * 3600);
                            labelsTime.push(t.toLocaleTimeString());
                        }
                        else
                            labelsTime.push(null);
                        ++counter;
                    });

                    var data = {};
                    var options = {}
                    // Describe temparature data
                    if (feed.feedType === "T".charCodeAt(0)) {
                        data = {
                            labels: labelsTime,
                            series: [dataList]
                        };
                        options = {
                            showArea: true,
                            showLine: true,
                            showPoint: false,
                            high: 80,
                            low: -10,
                            axisX: {
                                labelOffset: {
                                  x: -10,
                                  y: 0
                                },
                            },
                        };
                    }
                    // Describe Light sensor data (Photoresistor)
                    else if (feed.feedType === "P".charCodeAt(0)) {
                        data = {
                            labels: labelsTime,
                            series: [dataList]
                        };
                        options = {
                            showArea: true,
                            showLine: true,
                            showPoint: false,
                            charPadding: { right: 40 },
                            high: 1100,
                            low: 0,
                            axisX: {
                                labelOffset: {
                                  x: -10,
                                  y: 0
                                },
                            },
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
                    } 
                    // Describe CPU data
                    else if (feed.feedType === "M".charCodeAt(0)) {
                        console.log('MMMMMMMMMMMMMMMM');
                        data = {
                            labels: labelsTime,
                            series: [dataList]
                        };
                        options = {
                            showArea: true,
                            showLine: true,
                            showPoint: false,
                            charPadding: { right: 40 },
                            high: 100,
                            low: 0,
                            axisX: {
                                labelOffset: {
                                  x: -10,
                                  y: 0
                                },
                            },
                        };
                    } else {
                        data = {
                            labels: labelsTime,
                            series: [dataList]
                        };
                        options = {
                            showArea: true,
                            showLine: true,
                            showPoint: false,
                            axisX: {
                                labelOffset: {
                                  x: -10,
                                  y: 0
                                },
                            },
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