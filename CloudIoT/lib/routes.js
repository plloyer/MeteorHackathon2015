
Router.configure({
    layoutTemplate: 'AppLayout'
});

Router.route('/', {
    name: 'main',
    template: 'main',
    waitOn: function () {
        return [Meteor.subscribe('Feed'), Meteor.subscribe('FeedData')];
    }
});