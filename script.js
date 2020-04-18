$(document).ready(function () {
  // U.S. DEPARTMENT OF AGRICULTURE
  // FoodData Central API

  // When a food ingredient button is clicked
  $(document).on("click", ".ingredient-button", function () {

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
      // Update HTML to display what was searched
      $("#ingredient-name").text("Nutrition info for: " + ingredientQuery);

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

  var userIngredients = "";
  // Set Click to Search button
  $("#search").on("click", function () {

    //Remove all content before rendering
    $(".is-3").remove();

    userIngredients = "";
    var userButtons = $(".new-ingredient-button");
    for (i = 0; i < userButtons.length; i++) {
      var button = userButtons[i]
      var str = button.innerHTML;

      userIngredients += str
      if (i < userButtons.length - 1) {
        userIngredients += ","
      }
    }
    var pageRandom = Math.floor(Math.random() * 10) + 1;
    var pageNumber = "&p=" + pageRandom;

    var settings = {
      "url": "https://recipe-puppy.p.rapidapi.com/?i=" + userIngredients + pageNumber,
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "recipe-puppy.p.rapidapi.com",
        "x-rapidapi-key": "d8b37011d5mshfdc852418e9e300p167785jsn0d94302f0b12"
      }
    }

    // AJAX Recipe Puppy
    $.ajax(settings).then(function (response) {
      var recipePuppyResponse = JSON.parse(response);
      console.log(recipePuppyResponse)

      // List all ingredients 
      for (i = 0; i < 4; i++) {

        // Get title and remove carriage returns
        var recipeTitle = recipePuppyResponse.results[i].title.replace(/[\n\r]/g, '');
        var recipeImage = recipePuppyResponse.results[i].thumbnail;
        if (recipePuppyResponse.results[i].thumbnail === "") {
          recipeImage = "./docs/loading-image.png"
        }
        var recipeLink = recipePuppyResponse.results[i].href;

        renderrecipe();
      }

      function renderrecipe() {

        //Create Column div for Card
        var recipeCardColumn = $("<div>");
        recipeCardColumn.addClass("column is-3");

        //Create anchor and assign recipe link to it 
        var recipeCardAnchor = $("<a target=_blank>");
        recipeCardAnchor.attr("href", recipeLink);

        //Create Card to place recipe image and name into it
        var recipeCard = $("<div>");
        recipeCard.addClass("card");
        var recipeCardImage = $("<div>");
        recipeCardImage.addClass("card-image");
        var recipeCardFigure = $("<figure>");
        recipeCardFigure.addClass("image is-4by3");
        var recipeFigureImage = $("<img>");
        recipeFigureImage.attr("src", recipeImage);
        //Append child class into parent
        recipeCardFigure.append(recipeFigureImage);
        recipeCardImage.append(recipeCardFigure);

        var recipeCardTitle = $("<div>");
        recipeCardTitle.addClass("card-content");
        recipeCardTitle.attr("data-name", recipeTitle);
        recipeCardTitle.attr("data-ingredients", recipePuppyResponse.results[i].ingredients);
        recipeCardTitle.text(recipeTitle);
        //Append child class into parent and into HTML
        recipeCard.append(recipeCardImage, recipeCardTitle)
        recipeCardAnchor.append(recipeCard);
        recipeCardColumn.append(recipeCardAnchor);
        $("#append-three-cards-here-1").append(recipeCardColumn);
        // Change the padding after you "search" is clicked 
        $("#recipe-cards-section").css("padding", "5%");
      }
    });

    // Onclick handler to display ingredients
    $(document).on("click", ".card", function () {
      $("#append-recipe-ingredients-here").html("");
      var ingredientList = $(this).children("div.card-content");
      console.log(ingredientList);
      ingredientList = ingredientList.data("ingredients");
      var ingredientListArray = ingredientList.split(', ');

      for (var i = 0; i < ingredientListArray.length; i++) {
        var ingredientName = ingredientListArray[i];

        var newButtonEl = $("<button>");
        newButtonEl.addClass("button ingredient-button");

        if (userIngredients.toLowerCase().includes(ingredientName)) {
          newButtonEl.addClass("is-primary");
        } else {
          newButtonEl.addClass("is-danger");
        }


        ingredientName = capitalizeFirstLetter(ingredientName);
        newButtonEl.text(ingredientName);
        $("#append-recipe-ingredients-here").append(newButtonEl);
      }

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    });
  });
});
