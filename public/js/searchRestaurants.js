const displayInput = require('./userInput');

const inputLocation = document.getElementById("inputLocation");
const inputCuisine = document.getElementById("inputCuisine");

console.log(inputLocation);
console.log(inputCuisine);

const getRestaurants = (location, cuisineType) => {
  console.log("clicked");
  let restaurants;
  //call zomato api and get list of restaurants with location and cuisine type parameters. 
  var requestUrl = `https://developers.zomato.com/api/v2.1/ocations?query=${inputLocation}`;
  var headers = {
    "Accept": 'application/json',
    "user-key": "b83a37834a49f80599c5c0c7e56a4977"
  }
  $.ajax({
    url: requestUrl,
    headers: headers,
    complete: (response) => {
      console.log(response.responseJSON.restaurants);
      restaurants = response.responseJSON.restaurants;
      getRandomRestaurant(restaurants);
    }
  })
  
  return restaurants;
};

$("#btnSearch").on("click", getRestaurants);

const getRandomRestaurant = (restaurants) => {
  // console.log(restaurants)
  return restaurants[Math.floor(Math.random()*restaurants.length)];
// choose a restaurant at random... 
  //  return randomRestaurant; 
}


// $(document).ready(() => {

  // testing the function on our end 
  // console.log(getRandomRestaurant("Perth", "Mexican"));
  // });



// Start fresh

// function createEntry(data, ind) {
//   let elementId = `restaurant-${ind}`
//   let html = `
//   <div class="col-lg-4 col-12 mb-2 mb-lg-0">
//     <div id="${elementId}" class="card">
//       ${data.thumb && `<img class="card-img-top" src="${data.thumb}" alt="${data.name} image" style="max-height: 120px; object-fit:cover"/>`}
//       <div class="card-body">
//         <h5 class="card-title city-data" id="city-name">${data.name}</h3>
//         <p class="card-text city-data" id="city-address"><strong>Address:</strong> ${data.location.address}</p>
//         <p class="card-text city-data" id="city-phone-number"><strong>Phone Number:</strong> ${data.phone_numbers}</p>
//         <p class="card-text city-data" id="city-opening-hours"><strong>Opening Hours:</strong> ${data.timings}</p>
//         <a href="${data.url}" class="card-link">View Restaurant</a>
//       </div>
//     </div>
//   </div>
//   `
//   $('#recommended-restaurants').append(html);
// }




function userCuisineSearch() {
  console.log('test');
  event.preventDefault();

  userCuisineChoice = ($("#cuisine-ID").val());

  const selectedCuisineIds = getCuisineId(userCuisineChoice);

  if (selectedCuisineIds !== undefined) {

    var requestUrl = "https://developers.zomato.com/api/v2.1/search?entity_id=296&entity_type=city&q=BYO&cuisines=" + selectedCuisineIds;
    var headers = {
      "Accept": 'application/json',
      "user-key": "b83a37834a49f80599c5c0c7e56a4977"
    }
    $.ajax({
      url: requestUrl,
      headers: headers,
      complete: function (response) {
        $('#output').html(response.responseText);
        // also declare j = 1
        // this lets you use i to go through everything starting from the start, and use j to give them a unique number for id
        for (var i = 0, j = 1; i < response.responseJSON.restaurants.length; i++) {

          //shorter name to use!
          let data = response.responseJSON.restaurants[i].restaurant;

          // put all this into a bootstrap card
          // give each card an id, don't really need to give all the divs inside an id
          let card = $('<div/>').addClass('card').attr('id', 'restaurant-' + j);

          let cityName = $('<div>' + data.name + '</div>').addClass('city-data');
          let cityPhoneNumber = $('<div>' + data.phone_numbers + '</div>').addClass('city-data');
          let cityAddress = $('<div>' + data.location.address + '</div>').addClass('city-data');
          let cityOpeningHours = $('<div>' + data.timings + '</div>').addClass('city-data');

          // add these into the card
          card.append(cityName, cityPhoneNumber, cityAddress, cityOpeningHours)

          // add the card to the container
          $('#recommended-restaurants').append(card);

          //increment j at the end
          j++

        }
      },
      error: function () {
        $('#output').html('Bummer: there was an error!');
      },


    });


  }

}
