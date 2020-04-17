$(document).ready(function () {
  // U.S. DEPARTMENT OF AGRICULTURE
  // FoodData Central API

  // When a food ingredient button is clicked
  $(".button").on("click", function () {
    // The button title will be the query food
    var ingredientQuery = $(this).text();

    // Settings for AJAX call
    var fdc_api_key = "RlTgUNeWpu2FIFPDd0AmRrHssiC7e96O5TKQSGEc";
    var dataType = "Branded";
    var settings = {
      async: true,
      crossDomain: true,
      url:
        "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=" +
        fdc_api_key +
        "&query=" +
        ingredientQuery +
        "&dataType=" +
        dataType,
      method: "GET",
    };

    // Ajax call
    $.ajax(settings).done(function (response) {
      console.log(response);
      // Update HTML to display what was searched
      // var firstFoodReturned = response.foods[0].description;
      // $("#ingredient-name").text("Nutrition info for: " + firstFoodReturned);

      var nutrientValue = "";

      // Information for nutrients that will be displayed
      var nutrientsArray = [
        {
          nutrientName: "Energy",
          nutrientHTML: "#calories-tag",
          nutrientDisplay: "Calories: ",
          nutrientExists: "false",
        },
        {
          nutrientName: "Protein",
          nutrientHTML: "#protein-tag",
          nutrientDisplay: "Protein: ",
          nutrientExists: "false",
        },
        {
          nutrientName: "Carbohydrate, by difference",
          nutrientHTML: "#carbs-tag",
          nutrientDisplay: "Carbs: ",
          nutrientExists: "false",
        },
        {
          nutrientName: "Sugars, total including NLEA",
          nutrientHTML: "#sugars-tag",
          nutrientDisplay: "Sugar: ",
          nutrientExists: "false",
        },
        {
          nutrientName: "Total lipid (fat)",
          nutrientHTML: "#fat-tag",
          nutrientDisplay: "Fat: ",
          nutrientExists: "false",
        },
        {
          nutrientName: "Fiber, total dietary",
          nutrientHTML: "#fiber-tag",
          nutrientDisplay: "Fiber: ",
          nutrientExists: "false",
        },
        {
          nutrientName: "Cholesterol",
          nutrientHTML: "#cholesterol-tag",
          nutrientDisplay: "Cholesterol: ",
          nutrientExists: "false",
        },
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
          if (
            response.foods[0].foodNutrients[i].nutrientName ===
            currentNutrientName
          ) {
            nutrientValue = response.foods[0].foodNutrients[i].value;
            nutrientsArray[j].nutrientExists = "true";

            // Add units if the nutrient is not calories
            if (currentNutrientName === "Energy") {
              $(currentNutrientHTML).text(
                currentNutrientDisplay + nutrientValue + " kcal"
              );
            } else if (currentNutrientName === "Cholesterol") {
              $(currentNutrientHTML).text(
                currentNutrientDisplay + nutrientValue + " mg"
              );
            } else {
              $(currentNutrientHTML).text(
                currentNutrientDisplay + nutrientValue + " g"
              );
            }

            // Display N/A if nutrient is not found in API response
          } else if (nutrientsArray[j].nutrientExists === "false") {
            $(currentNutrientHTML).text(currentNutrientDisplay + "N/A");
          }
        }
      }
    });
  });
});

// Created button that will display into pantry list box when a user submits
// an ingredient.
$("#pantrySearchBtn").on("click", function createBtn() {
  var userInput = document.getElementById("pantryText");
  if (userInput.value == "" || userInput.value == null) {
    alert("Please submit an ingredient");
    return false;
  } else {
    var pantryInput = document.createElement("button");
    pantryInput.setAttribute(
      "class",
      "button new-ingredient-button is-danger is-light is-rounded"
    );
    pantryInput.setAttribute("id", "pantryListBtn");
    pantryInput.textContent = userInput.value;
    document
      .getElementById("prepend-ingredients-here")
      .appendChild(pantryInput);
    $("#pantryText").val("");
  }
});
// Created event handler for clear all button that will clear all ingredients buttons
// from pantry list
$("#clearAllBtn").on("click", function () {
  var clearBtn = document.getElementById("pantryListBtn");
  clearBtn.remove();
});

// Recipe puppy

// Set Click to Search button
$("#search").on("click", function () {
  //Remove all content before rendering
  $(".card-content,.card-image").remove();

  var userIngredients = "";
  var userButtons = $(".new-ingredient-button");
  for (i = 0; i < userButtons.length; i++) {
    var button = userButtons[i];
    var str = button.innerHTML;

    userIngredients += str;
    if (i < userButtons.length - 1) {
      userIngredients += ",";
    }
  }
  var pageRandom = Math.floor(Math.random() * 10) + 1;
  var pageNumber = "&p=" + pageRandom;

  var settings = {
    url:
      "https://recipe-puppy.p.rapidapi.com/?i=" + userIngredients + pageNumber,
    method: "GET",
    headers: {
      "x-rapidapi-host": "recipe-puppy.p.rapidapi.com",
      "x-rapidapi-key": "d8b37011d5mshfdc852418e9e300p167785jsn0d94302f0b12",
    },
  };

  // AJAX Recipe Puppy
  $.ajax(settings).then(function (response) {
    var recipePuppyResponse = JSON.parse(response);
    console.log(recipePuppyResponse);

    // List all ingredients
    for (i = 0; i < 5; i++) {
      // Get title and remove carriage returns
      var recipeTitle = recipePuppyResponse.results[i].title.replace(
        /[\n\r]/g,
        ""
      );
      console.log(recipeTitle);
      var recipeImage = recipePuppyResponse.results[i].thumbnail;
      console.log(recipeImage);
      var recipeLink = recipePuppyResponse.results[i].href;
      console.log(recipeLink);

      renderrecipe();
    }
    function renderrecipe() {
      // var recipeCardContaner = $("<div>");
      // recipeCardContaner.addClass("is-9 content-column");
      // var recipeCardColumn = $("<div>");
      // recipeCardColumn.addClass("has-text-centered");
      var recipeCardColumn = $("<div>");
      recipeCardColumn.addClass("column is-4 is-three-quarters-mobile");

      // var recipeCardAnchor = $("<a>");
      // recipeCardAnchor.attr("a href", recipeLink);

      // recipeCard.append(recipeCardAnchor);

      var recipeCard = $("<div>");
      recipeCard.addClass("card");

      var recipeCardTitle = $("<div>");
      recipeCardTitle.addClass("card-content");
      recipeCardTitle.attr("data-name", recipeTitle);
      recipeCardTitle.text(recipeTitle);

      recipeCard.append(recipeCardTitle);

      var recipeCardImage = $("<img>");
      recipeCardImage.addClass("card-image");
      recipeCardImage.attr("src", recipeImage);

      recipeCard.prepend(recipeCardImage);

      recipeCardColumn.append(recipeCard);
      $("#recipe-cards-section").append(recipeCardColumn);
    }
  });
});
