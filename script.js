const html = String.raw;

const createProduct = (
  productImage,
  productTitle,
  productDescription,
  productPrice
) => {
  const productCard = document.createElement("div");
  productCard.classList.add("product-card");
  productCard.innerHTML = html`
    <img src="${productImage}" alt="${productTitle}" />
    <h3>${productTitle}</h3>
    <p>${productDescription}</p>
    <p>Price: ${productPrice}</p>
    <button>Add to Cart</button>
  `;

  const allProducts = document.querySelector(".all-products");

  allProducts.append(productCard);
};

async function showMeal(query) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
      query
    )}`
  );
  const { meals } = await res.json();

  document.querySelector(".all-products").innerHTML = "";
  meals.forEach((meal) => {
    const mealPrice = meal.idMeal;
    const mealName = meal.strMeal;
    const mealDescription = meal.strInstructions;
    const mealImage = meal.strMealThumb;

    createProduct(mealImage, mealName, mealDescription, mealPrice);
  });
}

const mealSearchForm = document.querySelector("#mealSearchForm");

mealSearchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchInput = document.querySelector("#search").value;

  document.querySelector("#search").value = "";
  document.querySelector(".all-products").innerHTML = "<h1>Loading...</h1>";
  //   showMeal(searchInput);

  //code
  const categorySelection = document.querySelector("#selectCategory");

  const allProductByCatRes = await fetch(
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=" +
      categorySelection.value
  );
  const { meals } = await allProductByCatRes.json();
  const filteredMeals = meals.filter((meal) =>
    meal.strMeal.toLowerCase().startsWith(searchInput.toLowerCase())
  );

  document.querySelector(".all-products").innerHTML = "";
  filteredMeals.forEach(async (meal) => {
    const image = meal.strMealThumb;
    const title = meal.strMeal;
    const price = meal.idMeal;

    //get description
    const mealDeatailsRes = await fetch(
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + price
    );
    const mealDeatails = await mealDeatailsRes.json();
    const description = mealDeatails.meals[0].strInstructions;
    createProduct(image, title, description, price);
  });
});

async function showAllCategoriesOptions() {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const { categories } = await res.json();

  const categoriesName = [];

  categories.forEach((category) => {
    categoriesName.push(category.strCategory);
  });

  const selectTag = document.querySelector("#selectCategory");

  categoriesName.forEach((catName) => {
    const option = document.createElement("option");
    option.innerText = catName;
    option.setAttribute("value", catName);
    selectTag.append(option);
  });
}

showAllCategoriesOptions();