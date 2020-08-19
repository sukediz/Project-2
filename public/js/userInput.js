


const displayInput = () => {
    const inputLocation = document.getElementById("inputLocation");
    const inputCuisine = document.getElementById("inputCuisine");
    let userLocation = $('<div>' + inputLocation.toLowerCase() + '</div>');
    let userCuisine = $('<div>' + inputCuisine.toLowerCase() + '</div>');
    console.log(userLocation);
    console.log(userCuisine);
};

displayInput();

module.exports = displayInput;