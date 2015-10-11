
Meteor.methods({
    feedUpdateName: function (feedId, name) {
        check(feedId, String);
        check(name, String);

      	validateData(name.length > 0, 3000);

        doc = Feed.findOne({ '_id': feedId });
      	validateNotNull(doc, 3001);

      	Feed.update({'_id': feedId}, {$set:{'name':name}});
        return true;
    }
});
