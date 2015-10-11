errorCodes = {
	403: "Forbidden: You don't have tha autorization to do this action",

    1000: "",

    2000: "Session: invalid user id",
    2001: "Session: invalid user secret",
    2002: "Session: Invalid session key",
    2003: "Session: Invalid user id or secret",
    2004: "Session: Invalid session key"
}

getErrorMessage = function(code) {
    return errorCodes[code];
}
