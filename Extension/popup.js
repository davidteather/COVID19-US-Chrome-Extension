// Function to update recovered
function updateRecovered() {
  $.ajax({
    // AJAX request for the total recovered in US
    url: "https://covid19.mathdro.id/api/countries/USA/recovered",
    context: document.body,
    success: function (result) {
      var recovered = 0;

      // Adds all locations to the variable recovered
      for (x in result) {
        recovered += result[x]["recovered"];
      }

      // Sets recovered html
      $("#recovered").html(recovered);
    }
  })
}


// This function takes the acronym and converts it to the full state name
function acronymToFullName(acronym) {
  json = {
    AZ: 'Arizona',
    AL: 'Alabama',
    AK: 'Alaska',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DC: 'District of Columbia',
    DE: 'Delaware',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming',
    AS: "American Samoa",
    GU: "Guam",
    MP: "Northern Mariana Islands",
    PR: "Puerto Rico",
    VI: "U.S. Virgin Islands",
    UM: "U.S. Minor Outlying Islands",
  }
  if (json[acronym] != null) {
    return json[acronym];
  }
  return acronym;
}

// This function updates the table with the filter provided
function updateTable() {
  // AJAX request to get the state data
  $.ajax({
    url: "https://covidtracking.com/api/states",
    context: document.body,
    success: function (result) {

      // Creates the html to go into the table with the headers
      var tableHtml = "<table class='table table-striped'> <thead> <tr> <th>State</th> <th>Positive</th>  <th>Negative</th>  <th>Pending</th>  <th>Hospitalized</th>  <th>Deaths</th>  <th>Total</th>  </tr> </thead> <tbody>";


      // Initializes the counts for the total
      var totalInfections = 0;
      var totalDeaths = 0;

      // Convert state acronym to full name before sorting
      for (x in result) {
        result[x]["state"] = acronymToFullName(result[x]["state"]);
      }

      // Gets the value of the input textarea
      var search = $("#input").val();
      var category = $("#category").val();
      var ascension = $("#highLow").val();

      // Sort Result
      if (category != "state") {
        // numerical sorts
        // Low to High Sort
        if (ascension == 0) {
          result.sort(function (a, b) {
            return a[category] - b[category];
          });
        } else {
          // High to low sort
          result.sort(function (a, b) {
            return b[category] - a[category];
          });
        }
      } else {
        // alphabetical sorts
        if (ascension == 1) {
          // A-Z sort
          result.sort(function (a, b) {
            if (a.state < b.state) {
              return 1;
            }
            if (a.state > b.state) {
              return -1;
            }
            return 0;
          });
        } else {
          // Z-A sort
          result.sort(function (a, b) {
            if (a.state < b.state) {
              return -1;
            }
            if (a.state > b.state) {
              return 1;
            }
            return 0;
          });
        }

      }

      // Iterate over all states
      for (x in result) {

        // declare json to be the state json
        var json = result[x];


        // Logic to add infection and death counts if reported
        if (json["positive"] != null) {
          totalInfections += json["positive"];
        }

        if (json["death"] != null) {
          totalDeaths += json["death"];
        }

        // Iterates over all values and if null it reassigns the value to be N/A instead of null
        for (var key in json) {
          if (json.hasOwnProperty(key)) {
            if (json[key] == null) {
              json[key] = "N/A";
            }
          }
        }

        // Checks if the search term in the searchbox is in the state acronym
        if (json["state"].toLowerCase().includes(search.toLowerCase()) || search == "") {
          // Adds a new row to the table HTML with the state's stats
          tableHtml = tableHtml + `<tr> <td><b>${json["state"]}</b></td> <td>${json["positive"]}</td> <td>${json["negative"]}</td> <td>${json["pending"]}</td> <td>${json["hospitalized"]}</td> <td>${json["death"]}</td> <td>${json["total"]}</td> </tr>`;
        }
      }

      // Adds closing tags for the bootstrap table
      tableHtml = tableHtml + "</tbody></table>"

      // Sets the HTML in the table to be the HTML just compiled
      $("#table").html(tableHtml);

      // Sets the total infections and deaths divisions
      $("#positive").html(totalInfections);
      $("#deaths").html(totalDeaths);
    }
  });
}

// Initial call of update table
updateRecovered();
updateTable();

// Initial call of update recovered


// Calls update table every 200ms to check the search box value and apply any new filters
// There's better ways to do this, but since google chrome extensions are very limited with
// the ability to call JS from HTML I think this is the best and most convienent way
setInterval(updateTable, 200);

// Code to update recovered every minute
// Comment out the line below to make less requests to the api
setInterval(updateRecovered, 60000);