const url = "https://randomuser.me/api/?results=12&nat=us&exc=gender,registered,phone,id,nat&callback=?";
// creates HTML elements for search bar
const $searchHTML = $(`
  <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
`);

// append search bar
$(".search-container").append($searchHTML);

// retrieves data from the random user API
$.getJSON(url, (data) => {
  for (let i = 0; i < data.results.length; i++) {
    // creates HTML elements for basic employee cards
    const $userHTML = $(`
      <div id=${[i]} class="card">
        <div class="card-img-container">
          <img class="card-img" src="${data.results[i].picture.medium}" alt="profile picture">
        </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${data.results[i].name.first} ${data.results[i].name.last}</h3>
          <p class="card-text">${data.results[i].email}</p>
          <p class="card-text cap">${data.results[i].location.city}, ${data.results[i].location.state}</p>
        </div>
      </div>
    `);
    // creates HTML elements for modal windows
    const $modalHTML = $(`
      <div class="modal-container">
        <div class="modal modal${[i]}">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
            <img class="modal-img" src="${data.results[i].picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${data.results[i].name.first} ${data.results[i].name.last}</h3>
            <p class="modal-text">${data.results[i].email}</p>
            <p class="modal-text cap">${data.results[i].location.city}</p>
            <hr>
            <p class="modal-text">${data.results[i].cell.slice(0, 5)} ${data.results[i].cell.slice(6)}</p>
            <p class="modal-text cap">${data.results[i].location.street.number} ${data.results[i].location.street.name}, ${data.results[i].location.city}, ${data.results[i].location.state}, ${data.results[i].location.postcode}</p>
            <p class="modal-text">Birthday: ${data.results[i].dob.date.slice(5, 7)}/${data.results[i].dob.date.slice(8, 10)}/${data.results[i].dob.date.slice(0, 4)}</p>
          </div>
        </div> 
      </div>
    `);
    // append/insert above elements
    $("#gallery").append($userHTML);
    $($modalHTML).insertAfter("#gallery");
  }

  $(".card").click( (event) => {
    // gets id of click target
    const index = event.currentTarget.id;
    // adds active class to corresponding .modal.container and .modal elements
    $(`.modal${index}`).addClass("active");
    $(`.modal${index}`).parent().addClass("active");
  });

  // adds listener to close button on active modal window
  $(".modal > button").click( () => {
    $(".modal").parent().removeClass("active");
    $(".modal").removeClass("active");
  });

  // creates a keyup event handler on the input field
  $("#search-input").keyup(function () {
    // stores the user's search criteria in a variable
    const $searchValue = $("#search-input").val().toLowerCase();
    // will be set to true if search term matches employee list
    let match = false;

    // removes element with a class of message
    $(".message").remove();

    // loops through children of .user-section
    for (let i = 0; i < $("#gallery").children().length; i++) {
      // stores employee names and usernames in variables
      const $name = $("#gallery #name").eq(i).text();

      // adds class of true to .user if search term is detected or removes it if it isn't
      if ($name.toLowerCase().includes($searchValue)) {
        match = true;
        $("#gallery #name").eq(i).closest(".card").addClass("true");
      } else {
        $("#gallery #name").eq(i).closest(".card").removeClass("true");
      }
    }

    // Checks search results and responds based on the outcome
    if (match === true) {
      // hides elements that do not match search term
      $("#gallery .card").not(".true").hide();
    }
    if (match === false) {
      // creates a message and adds it to the DOM
      const $message = $(`<p class="message">No employees were found with that name or username.</p>`);

      // hides user section and appends message
      $("#gallery .card").hide();
      $("#gallery").append($message).show();
    }
    if ($searchValue === "") {
      // removes element with a class of message
      $(".message").remove();
      // shows original employee list
      $("#gallery .card").show();
    }
  });
});