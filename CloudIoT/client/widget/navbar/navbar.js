
Template.NavBar.onCreated(function () {
    Session.set("CurrentLanguage", i18n.getLanguage());
});

Template.NavBar.helpers({
    haveTitleTag: function () {
        var tag = i18n("NavbarTitleTag");
        return tag !== null && tag !== undefined && tag.length > 0;
    }
});
