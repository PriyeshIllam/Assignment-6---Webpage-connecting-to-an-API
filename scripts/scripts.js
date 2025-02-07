let mealsPerPage = 3;
let currentPage = 1;
let meals = [];

$(document).ready(function() {
    $(".search-meal").click(function() {
        let mealName = $(".input-field").val().trim();
        if (!mealName) {
            $(".meal-container").html("<p style='color:yellow;'>Please enter a meal name.</p>");
            return;
        }
        
        let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
        
        $(".meal-container").html("<p style='color:blue;'>Searching for meal...</p>");
        $(".welcome-message").hide();
        
        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            success: function(data) {
                if (!data.meals) {
                    $(".meal-container").html("<p style='color:red;'>Meal not found</p>");
                    return;
                }
                meals = data.meals;
                currentPage = 1;
                displayMeals();
            },
            error: function() {
                $(".meal-container").html("<p style='color:red;'>Error fetching meal data. Please try again later.</p>");
            }
        });
    });
    
    function displayMeals() {
        let startIndex = (currentPage - 1) * mealsPerPage;
        let endIndex = startIndex + mealsPerPage;
        let mealsHtml = "";
        
        for (let i = startIndex; i < endIndex && i < meals.length; i++) {
            let meal = meals[i];
            let shortInstructions = meal.strInstructions.slice(0, 200);
            mealsHtml += `
                <div class='meal-item'>
                    <h2>${meal.strMeal}</h2>
                    <p><strong>Category:</strong> ${meal.strCategory}</p>
                    <p><strong>Area:</strong> ${meal.strArea}</p>
                    <img class='meal-image' src="${meal.strMealThumb}" alt="Meal Image">
                    <p class='meal-instructions'>
                        <strong>Instructions:</strong> <span class='short-text'>${shortInstructions}...</span>
                        <span class='full-text' style='display: none;'>${meal.strInstructions}</span>
                        <button class='btn read-more'>Read More</button>
                    </p>
                </div>
            `;
        }
        
        $(".meal-container").html(mealsHtml);
        $(".page-info").text(`Page ${currentPage} of ${Math.ceil(meals.length / mealsPerPage)}`);
    }
    
    $(document).on("click", ".read-more", function() {
        let parent = $(this).closest(".meal-instructions");
        parent.find(".short-text").toggle();
        parent.find(".full-text").toggle();
        $(this).text($(this).text() === "Read More" ? "Read Less" : "Read More");
    });
    
    $(".prev").click(function() {
        if (currentPage > 1) {
            currentPage--;
            displayMeals();
        }
    });
    
    $(".next").click(function() {
        if (currentPage < Math.ceil(meals.length / mealsPerPage)) {
            currentPage++;
            displayMeals();
        }
    });
});
