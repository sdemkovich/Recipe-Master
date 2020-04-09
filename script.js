$(document).ready(function(){ 

  // U.S. DEPARTMENT OF AGRICULTURE 
  // FoodData Central API 

  // When a food ingredient button is clicked
  $(".button").on("click", function() {

    // The button title will be the query food
    var ingredientQuery = $(this).text();

    // Settings for AJAX call
    var fdc_api_key = "RlTgUNeWpu2FIFPDd0AmRrHssiC7e96O5TKQSGEc";
    var dataType = "Branded"
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=" + fdc_api_key + "&query=" + ingredientQuery + "&dataType=" + dataType,
      "method": "GET",
    }

    // Ajax call
    $.ajax(settings).done(function (response) {

      // Update HTML to display what was searched
      var firstFoodReturned = response.foods[0].description;
      $("#ingredient-name").text("API called for: " + firstFoodReturned);

      var nutrientValue = "";

      // Information for 5 nutrients that will be displayed
      var nutrientsArray = [
        {"nutrientName": "Energy",
        "nutrientHTML": "#calories-tag",
        "nutrientDisplay": "Calories: ",
        "nutrientExists": "false"},
        {"nutrientName": "Protein",
        "nutrientHTML": "#protein-tag",
        "nutrientDisplay": "Protein: ",
        "nutrientExists": "false"},
        {"nutrientName": "Carbohydrate, by difference",
        "nutrientHTML": "#carbs-tag",
        "nutrientDisplay": "Carbs: ",
        "nutrientExists": "false"},
        {"nutrientName": "Sugars, total including NLEA",
        "nutrientHTML": "#sugars-tag",
        "nutrientDisplay": "Sugar: ",
        "nutrientExists": "false"},
        {"nutrientName": "Total lipid (fat)",
        "nutrientHTML": "#fat-tag",
        "nutrientDisplay": "Fat: ",
        "nutrientExists": "false"},
        {"nutrientName": "Fiber, total dietary",
        "nutrientHTML": "#fiber-tag",
        "nutrientDisplay": "Fiber: ",
        "nutrientExists": "false"},
        {"nutrientName": "Cholesterol",
        "nutrientHTML": "#cholesterol-tag",
        "nutrientDisplay": "Cholesterol: ",
        "nutrientExists": "false"}
      ];


      // Loop through food nutrients array for the first food item from the response
      for (var i = 0; i < response.foods[0].foodNutrients.length; i++) {
        updateNutrient();
      } 

      // Updates the HTML tags for each nutrient
      function updateNutrient() {
        for (var j = 0; j < nutrientsArray.length; j++) {
          var currentNutrientName = nutrientsArray[j].nutrientName;
          var currentNutrientDisplay = nutrientsArray[j].nutrientDisplay;
          var currentNutrientHTML = nutrientsArray[j].nutrientHTML;
  
          // Update the corresponding HTML with the current nutrient info
          if (response.foods[0].foodNutrients[i].nutrientName === currentNutrientName) {
            nutrientValue = response.foods[0].foodNutrients[i].value;
            nutrientsArray[j].nutrientExists = "true";

            // Add units if the nutrient is not calories
            if (currentNutrientName === "Energy") {
              $(currentNutrientHTML).text(currentNutrientDisplay + nutrientValue + " kcal");
            } else if (currentNutrientName === "Cholesterol") {
              $(currentNutrientHTML).text(currentNutrientDisplay + nutrientValue + " mg");
            } else {
              $(currentNutrientHTML).text(currentNutrientDisplay + nutrientValue + " g");
            }

            // Display N/A if nutrient is not found in API response
          } else if (nutrientsArray[j].nutrientExists === "false") {
            $(currentNutrientHTML).text(currentNutrientDisplay + "N/A");
          }
        }
      }

    });

  })

});

// // Recipe puppy
// var urlIngredients = "onions, garlic, chicken legs";
// var pageNumber = "&p=1";

// var settings = {
// 	"url": "https://recipe-puppy.p.rapidapi.com/?i=" + urlIngredients + pageNumber,
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "recipe-puppy.p.rapidapi.com",
// 		"x-rapidapi-key": "d8b37011d5mshfdc852418e9e300p167785jsn0d94302f0b12"
// 	}
// }

// // AJAX Recipe Puppy
// $.ajax(settings).then(function (response) {
//   var recipePuppyResponse = JSON.parse(response);
//   console.log(recipePuppyResponse);

//   // List all ingredients 
//   for (var i = 0; i < recipePuppyResponse.results.length; i++) {

//     // Get title and remove carriage returns
//     var recipeTitle = recipePuppyResponse.results[i].title.replace(/[\n\r]/g, '');
//     console.log(recipeTitle);
//   }

// });
