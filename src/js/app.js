// Initialize Foundation javascript functionality
$(document).foundation();

// API Keys
var proRepApiKey = 'sHCEuVsfOi06N1Ltq7cIYA2D4J80qhMy7cOa1SWt',
    newsApiKey = '6ae0570e133347c9af205810da9ef7e1';



function enableArticleButtons() {

  $('.js-billArticles').on('click', function() {

    // clear modal content
    $("#js-modalBillArticles").html('');

    var sources = "the-new-york-times," +
                  "the-washington-post," +
                  "usa-today," +
                  "nbc-news," +
                  "reuters," +
                  "msnbc," +
                  "independant," +
                  "cnn," +
                  "cbs-news," +
                  "abc-news," +
                  "bbc-news"

    var billNumber = $(this).data("bill-number");
    var billSlug = $(this).data("bill-slug");
    var billDesc = $(this).data("bill-desc");

    var query = encodeURIComponent('"' + billSlug + '" OR "' + billNumber + '" ');

    console.log("sources: " + sources);
    console.log("query: " + query);

    var url = "https://newsapi.org/v2/everything?q=" + query + "&from=2017-01-01&sortBy=relevancy&sources=" + sources;

    console.log(url);

    // query NewsAPI for bill number
    $.ajax({
     url: url,
     type: "GET",
     dataType: 'json',
     headers: {'X-Api-Key': newsApiKey}
    })
    .done(function(dataJSON){ // function call when response is received, dataJSON is response from ajax call
      dataString = JSON.stringify(dataJSON,null,'\t'); // convert json object to string
      $('#js-modalBillArticles').html('<h4>Search by bill number</h4><p>API Call: ' + url + '</p>' + '<pre>' + dataString + '</pre>').foundation('open');

      query = encodeURIComponent(billDesc);
      url = "https://newsapi.org/v2/everything?q=" + query + "&from=2017-01-01&sortBy=relevancy&sources=" + sources;

      console.log(url);

      // query NewsAPI for bill name
      $.ajax({
       url: url,
       type: "GET",
       dataType: 'json',
       headers: {'X-Api-Key': newsApiKey}
      })
      .done(function(dataJSON){ // function call when response is received, dataJSON is response from ajax call
        dataString = JSON.stringify(dataJSON,null,'\t');
        $("#js-modalBillArticles").append('<hr><h4>Search by bill desc</h4><p>API Call: ' + url + '</p>' + '<pre>' + dataString + '</pre>');

      });

    });

  })

  $('.js-billOverview').on('click', function() {
      var billDesc = $(this).data("bill-desc");
      var billSlug = $(this).data("bill-slug");
      var apiUrl = 'https://api.propublica.org/congress/v1/115/bills/' + billSlug + '.json'
      console.log("prorepublica api: " + apiUrl);
      $.ajax({
       url: apiUrl,
       type: "GET",
       dataType: 'json',
       headers: {'X-API-Key': 'sHCEuVsfOi06N1Ltq7cIYA2D4J80qhMy7cOa1SWt'}
       //async: false
      })
      .done(function(dataJSON){ // function call when response is received, dataJSON is response from ajax call
        var dataString = JSON.stringify(dataJSON,null,'\t'); // convert json object to string
        $('#js-modalBillOverview').append('<hr><h5>' + billDesc + '</h5><h6>API Call: ' + apiUrl + '</h6>' + '<pre>' + dataString + '</pre>').foundation('open');
      });
    })

}


// AJAX call to get upcoming house bills
$.ajax({
 url: "https://api.propublica.org/congress/v1/bills/upcoming/house.json",
 type: "GET",
 dataType: 'json',
 headers: {'X-API-Key': proRepApiKey},
 async: true
})
.done(function(dataUpcomingHouseBills){ // function call when response is received, dataJSON is response from ajax call

  //var dataString = JSON.stringify(dataJSON,null,'\t'); // convert json object to string
  dataUpcomingHouseBills = dataUpcomingHouseBills.results[0].bills; // replace variable with
  var voteRowHTML; // string with HTML for display

  // loop through votes
  for (var i = 0; i < dataUpcomingHouseBills.length; i++) {
    // create HTML for current vote
      voteRowHTML =
        '<div class="cvContent_panel"> \n' +
          '<h6 class="light-text float-right">' + dataUpcomingHouseBills[i].bill_number + '</h6> \n' +
          '<h6 class="light-text">' + dataUpcomingHouseBills[i].chamber + '</h6> \n' +
          '<h4>' + dataUpcomingHouseBills[i].description + '</h4> \n' +
          '<div class="button-group secondary expanded small"> \n' +
            '<button class="button js-billOverview" data-bill-slug="'+ dataUpcomingHouseBills[i].bill_slug + '"' +
                  ' data-bill-desc="' + dataUpcomingHouseBills[i].description + '">Bill Overview</button> \n' +
            '<button class="button js-billArticles" data-bill-slug="'+ dataUpcomingHouseBills[i].bill_slug + '"' +
                  ' data-bill-desc="' + dataUpcomingHouseBills[i].description + '"' +
                  ' data-bill-number="' + dataUpcomingHouseBills[i].bill_number + '">News Articles</button> \n' +
          '</div> \n' +
        '</div> \n'

      $(".js-homeUpcoming").append(voteRowHTML); // append html to results div
  }

  enableArticleButtons();

});
