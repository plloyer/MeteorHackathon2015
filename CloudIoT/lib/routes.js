
Router.configure({
    layoutTemplate: 'AppLayout'
});

Router.route('/', {
    name: 'main',
    template: 'main',
    waitOn: function () {
        return [Meteor.subscribe('Feed'), Meteor.subscribe('FeedData'), Meteor.subscribe('UserFeed')];
    }
});

Router.route('/user/profile', {
    name: 'user.profile',
    template: 'pageUserProfile',
    data: function () {
	    return Meteor.user();
	},
});