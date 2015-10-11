// ----------------------------------------------------------------------------
var UsersProfileSchemaVersion = 1;
// ----------------------------------------------------------------------------

function createUserProfile(optionProfile, user) {
    // We still want the default hook's 'profile' behavior.
    var profile = {};
    if (optionProfile)
        profile = optionProfile;

    // If you change the profiles, don't forget to increment UsersProfileSchemaVersion and write an
    // update procedure in validateUserProfile()
    profile.version = UsersProfileSchemaVersion;

    // If no avatar is specified, query Gravatar
    if (profile.secret === null) {
        profile.secret = randomString(85);
    }

    return profile;
}

function updateProfile(user, querySet) {
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
        updateProfile(user, {
            'profile': profile
        });
    } else if (user.profile.version != UsersProfileSchemaVersion) {
        if (user.profile === null || user.profile === undefined || user.profile.version === null || user.profile.version === undefined) {
            // Fix schema pre-version 1
            user.profile.secret = randomString(85);
            updateProfile(user, {
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
    user.profile = createUserProfile(options.profile, user);
    return user;
});

// ----------------------------------------------------------------------------

Meteor.startup(function() {
    console.log("Validating user database schema and running upgrade script if necessary...");
    Meteor.users.find().forEach(function(user) {
        validateUserProfile(user);
    });
});
