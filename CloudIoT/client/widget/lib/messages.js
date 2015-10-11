
var messageId = 0;

Template.messagesList.clearMessage = function (key){
  Session.set(key, []);
};

Template.messagesList.pushMessage = function (key, headerTxt, classTxt, messageTxt){
  var list = Session.get(key);
  if (list === null)
    list = [];

  currId = messageId;
  messageId += 1;

  list.push({_id: currId, header: headerTxt, classId: classTxt, message: messageTxt});
  Session.set(key, list);

  // Remove the message in 3s
  Meteor.setTimeout(function(){
    var list = Session.get(key);

    var index = 0;
    while(index < list.length && list[index]._id != currId)
      index += 1;

    if(index < list.length)
      list.splice(index,1);

    Session.set(key, list);
  },3000);

  return currId;
};