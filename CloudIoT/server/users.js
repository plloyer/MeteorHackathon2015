Meteor.users.deny({ 
    update: function() {
        return true;
    }
});

// ----------------------------------------------------------------------------
var UsersProfileSchemaVersion = 1;
// ----------------------------------------------------------------------------

function createUserAndProfile(optionProfile, user) {
    // We still want the default hook's 'profile' behavior.
    user.profile = {};
    if (optionProfile)
        user.profile = optionProfile;

    // If you change the profiles, don't forget to increment UsersProfileSchemaVersion and write an
    // update procedure in validateUserProfile()
    user.profile.version = UsersProfileSchemaVersion;

    // Create a use secret key
    user.profile.secret = randomString(85);

    return user;
}

function updateUser(user, querySet) {
    Meteor.users.update({
        "_id": user._id
    }, {
        $set: querySet
    });
}

function validateUserProfile(user) {
    if (user.profile === null) {
        profile = createUserProfile(null, user);
        console.log(profile);
        updateUser(user, {
            'profile': profile
        });
    } else if (user.profile.version != UsersProfileSchemaVersion) {
        if (user.profile === null || user.profile === undefined || user.profile.version === null || user.profile.version === undefined) {
            // Fix schema pre-version 1
            user.profile.secret = randomString(85);
            updateUser(user, {
                'profile.secret': user.profile.secret,
                'profile.version': 1
            });
            user.profile.version = 1;
        } 

        // add other schema upgrade code here
    }
}

// ----------------------------------------------------------------------------
Accounts.onCreateUser(function(options, user) {
    user= createUserAndProfile(options.profile, user);
    return user;
});

// ----------------------------------------------------------------------------

Meteor.startup(function() {
    console.log("Validating user database schema and running upgrade script if necessary...");
    Meteor.users.find().forEach(function(user) {
        validateUserProfile(user);
    });
});
