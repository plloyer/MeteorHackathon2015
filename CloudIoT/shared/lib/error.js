errorCodes = {
	403: "Forbidden: You don't have tha autorization to do this action",

    1000: "Receiving feedType which is diffetent from the one already in the database",
    1001: "You must be owner of a feed to post in it",
    
    2000: "Session: invalid user id",
    2001: "Session: invalid user secret",
    2002: "Session: Invalid session key",
    2003: "Session: Invalid user id or secret",
    2004: "Session: Invalid session key",

    3000: "Feed : feed name can't be empty",
    3001: "Feed : internal error, wrong feed id"
}

getErrorMessage = function(code) {
    return errorCodes[code];
}
