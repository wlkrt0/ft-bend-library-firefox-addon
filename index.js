//var self = require('sdk/self');
var data = require("sdk/self").data;

//get the api key from the add-on's user preferences
var simplePrefs = require("sdk/simple-prefs");
var prefGRAPIkey = simplePrefs.prefs.grAPIkey;

// Import the page-mod API
var pageMod = require("sdk/page-mod");
 
// pageMod will run a script whenever a URL matching the pattern is loaded
pageMod.PageMod({
  include: "http://catalog.fortbend.lib.tx.us/polaris/search/*",
  
  //simple test alert to show whether the extension is being triggered by the target URL
  //contentScript: 'window.alert("Page matches");'
  
  //note that the order of the js files listed below is very important!
  //also note that all resources such as js files, css files, images, everything must be declared in this index.js first, not in the content-script.js
  contentScriptFile: [data.url("jquery-1.11.3.min.js"), data.url("bootstrap/js/bootstrap.min.js"), data.url("content-script.js")],
  contentStyleFile: data.url("bootstrap/css/bootstrap.min.css"),
  contentScriptOptions: {
	g_iconURL: data.url("g_icon.png"),
	grAPIkey: prefGRAPIkey //get the api key from the add-on's user preferences
  }
});

