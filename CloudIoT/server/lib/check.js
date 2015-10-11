validateData = function(test, errorCode) {
    check(errorCode, Number);
    if (!test) throw new Meteor.Error(errorCode, getErrorMessage(errorCode));
};

validateNotNull = function(data, errorCode) {
    validateData((data !== undefined && data !== null), errorCode);
};

validateCurrentUser = function(userId, errorCode) {
    validateData((userId === Meteor.userId()), errorCode);
};
