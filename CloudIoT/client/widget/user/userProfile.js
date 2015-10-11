
Template.userProfile.created = function(){
    Session.set("userProfileShowSecret", false);
};

Template.userProfile.helpers({
	valid: function(){
		return this !== null && this._id !== null && this._id !== undefined && this.profile !== null && this.profile !== undefined;
	},
	userName: function(){
		var name = this.profile.name;
		if(!name){
			if(this.emails !== undefined && this.emails.length > 0)
			name = this.emails[0].address;
		}
		return name;
	},
	userId: function(){
		return this._id;
	},
	secret: function(){
		return this.profile.secret;
	},
	showSecret: function(){
    	return Session.get("userProfileShowSecret");
	}
});

Template.userProfile.events({
	'click .showSecret': function(event){
    	Session.set("userProfileShowSecret", true);
	}
});