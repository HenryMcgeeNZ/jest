var register = function(Handlebars) {
    var helpers = { // add all helpers as key: value pairs
        // an example of listfood helper to iterate over
        // food items and display these in the page
        listfood: function (foods) { 
          var ret = "<ul>";

          for (var i = 0, j = foods.length; i < j; i++) {
            ret = ret + "<li> " +
              "<img class=\"browsePage\" src=\"https://source.unsplash.com/" 
              + foods[i].photo + "\">" +
              "<a href=\"/foods/" + foods[i]._id + "\">" + foods[i].name + "</a></li>"
          }

          return ret + "</ul>";
		    },
        
    };
  
    if (Handlebars && typeof Handlebars.registerHelper === "function") {
      // register helpers
      // for each helper defined above (we have only one, listfood)
      for (var prop in helpers) {
          // we register helper using the registerHelper method
          Handlebars.registerHelper(prop, helpers[prop]);
      }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }
  
  };
  
  // export helpers to be used in our express app
  module.exports.register = register;
  module.exports.helpers = register(null);    
  