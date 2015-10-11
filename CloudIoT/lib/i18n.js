/* global Meteor */
/* global i18n */
//Doc: https://atmospherejs.com/anti/i18n

i18n.setDefaultLanguage('en');

//HTML : {{i18n 'AppName'}}
//JS :   i18n("AppName")

Meteor.startup(function () {
    if ( Meteor.isClient ) {
      var lang = localStorage.getItem("lang");
      if(lang){
        i18n.setLanguage(lang);
      }
      else{
        i18n.setLanguage("en");
        localStorage.setItem("lang", "en");
      }
    }
});

setLanguage = function(lang){
  localStorage.setItem("lang", lang);
  i18n.setLanguage(lang);
};

i18n.map('en', {
  AppName: 'Cloud IoT',
  NavbarTitleTag: 'alpha',
  SupportEmail: 'info@notdone.com',
  AppDescription: 'Monitor all you connected devices !',
  
});
