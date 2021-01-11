const inputSearch = document.getElementById('search');
const submit = document.getElementById('submit');
const btnRandom = document.getElementById('random');
const meals_El = document.getElementById('meals');
const resultHeading = document.getElementById('result__heading');
const singleMeal_El = document.getElementById('single__meal');

// Fetch from API and search meals
const searchMeal = function (e) {
  e.preventDefault();

  // Clear single meal
  singleMeal_El.innerHTML = '';

  // Get search term
  const term = inputSearch.value;

  // Get data
  const getData = async function () {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
    );
    const data = await res.json();
    console.log(data);
    resultHeading.innerHTML = `<h2>Search result for '${term}':</h2>`;

    if (data.meals === null) {
      resultHeading.innerHTML = `<p>There are no search resultm, try again!</p>`;
    } else {
      meals_El.innerHTML = data.meals
        .map(
          (meal) => `
        <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal} "/>
            <div class="meal__info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
            </div>
        </div>
    `
        )
        .join('');
    }
    // Clear search value
    inputSearch.value = '';
  };

  // Check for empty
  term.trim() ? getData() : alert('Please enter a search term');
};

// Fetch random meal from API and show
const showRandomMeal = async function () {
  // Clear meals and heading
  meals_El.innerHTML = '';
  resultHeading.innerHTML = '';

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
  const data = await res.json();
  const meal = data.meals[0];

  addMealToDOM(meal);
};

// Function add meal to DOM
const addMealToDOM = function (meal) {
  const ingredients = [];

  for (let i = 1; i < 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]}: ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMeal_El.innerHTML = `
  <div class="single__meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" art="${meal.strMeal}" />
        <div class="single__meal__info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''} 
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''} 
        </div> 
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
             <ul>
             ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
             </ul>
        </div> 
   </div>
   `;
};

// Fetch meal by ID
const getMealByID = async function (mealID) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  const data = await res.json();
  const meal = data.meals[0];
  console.log(meal);
  addMealToDOM(meal);
};

// Event listener
submit.addEventListener('submit', searchMeal);
btnRandom.addEventListener('click', showRandomMeal);

meals_El.addEventListener('click', (e) => {
  if (!e.target.classList.contains('meal__info')) return;

  const mealInfo = e.path.find((item) => item.classList.contains('meal__info'));

  const mealID = mealInfo.getAttribute('data-mealid');
  getMealByID(mealID);
});
