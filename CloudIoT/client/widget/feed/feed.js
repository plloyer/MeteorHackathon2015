Template.feed.helpers({
    invokeAfterLoad: function () {
        var feed = this;
        Meteor.defer(function () {
            Tracker.autorun(function () {
                console.log("showGraph for: " + feed._id);
                var feedDataCursor = FeedData.find({ 'feedId': feed._id }/*, { sort: { createdAt: -1 }, limit: 50 }*/);
                feedDataArray = feedDataCursor.map(function (doc) { return doc.feedData; });

                var dataList;
                if (feedDataArray.length > 50)
                    dataList = feedDataArray.slice(feedDataArray.length - 50);
                else
                    dataList = feedDataArray;

                if (dataList.length > 0) {
                    labelArray = new Array(dataList.length);
                    for (var i = 0; i < labelArray.length; ++i) {
                        labelArray[i] = (i + 1).toString();
                    }

                    var data = {
                        labels: labelArray,
                        series: [dataList]
                    };

                    if (feed._myTestChart) {
                        feed._myTestChart.update(data);
                    }
                    else {

                        var options = {
                            fullWidth: true,
                            charPadding: { right: 40 }
                        };
                        feed._myTestChart = new Chartist.Line('#' + feed._id, data, options);
                    }
                }
            });
        });
    }
});
