const displayInput = () => {
  const inputLocation = document.getElementById("inputLocation");
  const inputCuisine = document.getElementById("inputCuisine");
  const userLocation = $("<div>" + inputLocation.toLowerCase() + "</div>");
  const userCuisine = $("<div>" + inputCuisine.toLowerCase() + "</div>");
  console.log(userLocation);
  console.log(userCuisine);
};

displayInput();

module.exports = displayInput;
