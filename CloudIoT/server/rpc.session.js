ddpConnection = new Meteor.Collection("ddpConnection");

function randU32(strong) {
    return Math.floor(Math.random() * 0xFFFFFFFF);
}

function getCurrentMillis() {
    return (new Date()).getTime();
}

isSessionKeyValid = function (sessionKey) {
    var sessionDesc = ddpConnection.findOne({
        'session': sessionKey
    });
    if (sessionDesc !== null && sessionDesc !== undefined) {
        return sessionDesc.timeout > getCurrentMillis() ? sessionDesc : null;
    }
    return null;
}
var DDP_API_SESSION_MIN_KEEPALIVE = 60 * 1000; // 60sec

Meteor.startup(function () {
    // Remove all expired sessions
    Meteor.setInterval(function () {
        expiredSessions = ddpConnection.find({
            'timeout': {
                $lt: getCurrentMillis()
            }
        });
        sessionIdToDelete = [];
        expiredSessions.forEach(function (session) {
            sessionIdToDelete.push(session._id);
            console.log("[DDP] Removing expired session " + session._id);
        });
        ddpConnection.remove({
            _id: {
                $in: sessionIdToDelete
            }
        });
    }, DDP_API_SESSION_MIN_KEEPALIVE);
});

Meteor.methods({
    validateDDPSession: function (remoteUUID, userId, userSecret) {
        console.log("validateDDPSession(" + remoteUUID + ", " + userId + ", ... )")
        check(remoteUUID, Number);
        check(userId, String);
        validateData((userId.length !== 0), 2000);
        check(userSecret, String);
        validateData((userSecret.length !== 0), 2001);

        var id = this.connection.id;
        var user = Meteor.users.findOne({
            '_id': userId,
            'profile.secret': userSecret
        });
        validateData((user !== null && user !== undefined), 2003);

        console.log('[DDP] DDP connection authenticated for user ' + user._id);
        var sessionkey = randU32(false);

        var connectionId = ddpConnection.insert({
            'session': sessionkey,
            'uuid': remoteUUID,
            'userId': userId,
            'timeout': getCurrentMillis() + DDP_API_SESSION_MIN_KEEPALIVE
        });
        console.log('[DDP]  - [' + connectionId + '] ' + sessionkey);

        return {
            'method': "validateDDPSession",
            'sessionKey': sessionkey,
            'keepAlive': DDP_API_SESSION_MIN_KEEPALIVE / 2
        };
    },

    dropDDPSession: function (sessionKey) {
        check(sessionKey, Number);
        ddpConnection.remove({
            'session': sessionKey
        });
    },

    sessionDDPKeepAlive: function (remoteUUID, sessionKey) {
        console.log("sessionDDPKeepAlive(" + remoteUUID + ", " + sessionKey + ")")
        check(remoteUUID, Number);
        check(sessionKey, Number);

        var session = isSessionKeyValid(sessionKey);
        validateData((session !== null), 2004);
        console.log(JSON.stringify(session));
        validateData((session.uuid === remoteUUID), 2004);

        var nextTimeout = getCurrentMillis() + DDP_API_SESSION_MIN_KEEPALIVE;
        ddpConnection.update({
            "_id": session._id
        }, {
                $set: {
                    'timeout': nextTimeout
                }
            });
        return {
            status: true
        };
    }
});
