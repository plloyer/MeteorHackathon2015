var WorldResetActions = [];

WorldResetAddAction = function(group, name, action){
  var actionGroup = null;
  WorldResetActions.forEach(function(groupIter){
    if(group === groupIter.name)
      actionGroup = groupIter;
  });

  if(!actionGroup){
    actionGroup = {'name':group, actions:[]};
    WorldResetActions.push(actionGroup);
  }

  var found = false;
  actionGroup.actions.forEach(function(actionIter){
    if(name === actionIter.name)
      found = true;
  });
  if(!found){
    actionGroup.actions.push({'name':name, 'action':action});
  }
};

WorldResetAll = function(){

  WorldResetActions.forEach(function(group){
    group.actions.forEach(function(action){
      action.action();
    });
  });
};

WorldResetGroup = function(groupName){
  WorldResetActions.forEach(function(group){
    if(groupName === group.name){
      group.actions.forEach(function(action){
        action.action(action.name);
      });
    }
  });
};