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


// Get upcoming house bills
$.ajax({
 url: "https://api.propublica.org/congress/v1/bills/upcoming/house.json",
 type: "GET",
 dataType: 'json',
 headers: {'X-API-Key': proRepApiKey},
 async: true
})
.done(function(dataUpcomingBills){ // function call when response is received, dataJSON is response from ajax call

  //var dataString = JSON.stringify(dataJSON,null,'\t'); // convert json object to string
  dataUpcomingBills = dataUpcomingBills.results[0].bills; // replace variable with just bills data (eliminating response info)
  var billRowHTML; // string with HTML for display

  // loop through votes
  for (var i = 0; i < dataUpcomingBills.length; i++) {
    // create HTML for current vote
      billRowHTML =
        '<div class="cvPanel"> \n' +
          '<h6 class="light-text float-right">' + dataUpcomingBills[i].bill_number + '</h6> \n' +
          '<h6 class="light-text">' + dataUpcomingBills[i].chamber + '</h6> \n' +
          '<h4>' + dataUpcomingBills[i].description + '</h4> \n' +
          '<div class="button-group secondary expanded small"> \n' +
            '<button class="button js-billOverview" data-bill-slug="'+ dataUpcomingBills[i].bill_slug + '"' +
                  ' data-bill-desc="' + dataUpcomingBills[i].description + '">Bill Overview</button> \n' +
            '<button class="button js-billArticles" data-bill-slug="'+ dataUpcomingBills[i].bill_slug + '"' +
                  ' data-bill-desc="' + dataUpcomingBills[i].description + '"' +
                  ' data-bill-number="' + dataUpcomingBills[i].bill_number + '">News Articles</button> \n' +
          '</div> \n' +
        '</div> \n'

      $(".js-homeUpcoming").append(billRowHTML); // append html to results div
  }

  enableArticleButtons();

});


// AJAX call to get upcoming house bills
$.ajax({
 url: "https://api.propublica.org/congress/v1/house/votes/recent.json",
 type: "GET",
 dataType: 'json',
 headers: {'X-API-Key': proRepApiKey},
 async: true
})
.done(function(dataRecentVotes){ // function call when response is received, dataJSON is response from ajax call

  console.log(dataRecentVotes);

  //var dataString = JSON.stringify(dataJSON,null,'\t'); // convert json object to string
  dataRecentVotes = dataRecentVotes.results.votes; // replace variable with just bills data (eliminating response info)
  var voteRowHTML; // string with HTML for display

  console.log(dataRecentVotes);

  for (var i = 0; i < dataRecentVotes.length; i++) {

    console.log(dataRecentVotes[i]);

    var voteRowHTML;

    //$(".js-homeRecentVotes").append('<pre>' + JSON.stringify(dataRecentVotes[i],null,'\t'); + '</pre>'); // append html to results div

    // create HTML for current vote
      /*voterowHTML =
        '<div class="cvContent_panel"> \n' +
          '<h6 class="light-text float-right">' + dataUpcomingBills[i].bill_number + '</h6> \n' +
          '<h6 class="light-text">' + dataUpcomingBills[i].chamber + '</h6> \n' +
          '<h4>' + dataUpcomingBills[i].description + '</h4> \n' +
          '<div class="button-group secondary expanded small"> \n' +
            '<button class="button js-billOverview" data-bill-slug="'+ dataUpcomingBills[i].bill_slug + '"' +
                  ' data-bill-desc="' + dataUpcomingBills[i].description + '">Bill Overview</button> \n' +
            '<button class="button js-billArticles" data-bill-slug="'+ dataUpcomingBills[i].bill_slug + '"' +
                  ' data-bill-desc="' + dataUpcomingBills[i].description + '"' +
                  ' data-bill-number="' + dataUpcomingBills[i].bill_number + '">News Articles</button> \n' +
          '</div> \n' +
        '</div> \n'
        */

    var resultStyleClass = dataRecentVotes[i].result.toLowerCase();

    var totalVotes = dataRecentVotes[i].total.yes + dataRecentVotes[i].total.no,
        totalYes = dataRecentVotes[i].total.yes,
        totalNo = dataRecentVotes[i].total.no,
        totalNotVoting = dataRecentVotes[i].total.not_voting;

    var percentYes = Math.floor((dataRecentVotes[i].total.yes / totalVotes) * 100),
        percentNo = Math.floor((dataRecentVotes[i].total.no / totalVotes) * 100),
        percentNotVoting = Math.floor((dataRecentVotes[i].total.not_voting / totalVotes) * 100);

    var republicanYes = dataRecentVotes[i].republican.yes,
        republicanNo = dataRecentVotes[i].republican.no,
        republicanNotVoting = dataRecentVotes[i].republican.not_voting;

    var democratYes = dataRecentVotes[i].democratic.yes,
        democratNo = dataRecentVotes[i].democratic.no,
        democratNotVoting = dataRecentVotes[i].democratic.not_voting;

    voteRowHTML = '<div class="cvRecentVote"> \n' +
      '<h6 class="cvRecentVote_date">' + dataRecentVotes[i].date + '</h6> \n' +
      '<h6 class="cvRecentVote_question">' + dataRecentVotes[i].question + '</h6> \n' +
      '<h4><a href="#" style="color:white;text-decoration:underline;">' + dataRecentVotes[i].description + '</a></h4> \n' +
      '<!--number-title--><p>' + dataRecentVotes[i].bill.number + ' - ' + dataRecentVotes[i].bill.title + '</p> \n' +
      '<!--latest action--><p><strong>' + dataRecentVotes[i].bill.latest_action + '</strong></p> \n' +
      '<hr> \n' +

      '<div class="grid-x grid-padding-x"> \n' +
        '<div class="cell large-3"> \n' +
          '<h3><small>Result:</small><br> \n' +
          '<span class="'+ resultStyleClass + '">' + dataRecentVotes[i].result + '</span></h3> \n' +
        '</div> \n' +
        '<div class="cell large-9"> \n' +

          '<table class="cvVoteTable"> \n' +
            '<tr> \n' +
              '<td class="cvVoteTable_rowLabel">Yea</td> \n' +
              '<td class="cvVoteTable_voteCount cvVoteTable_voteCount--percent">' + percentYes + '%</td> \n' +
              '<td class="cvVoteTable_voteCount cvVoteTable_voteCount--"graph>' + totalYes + ' \n' +
                '<div class="cvVoteTable_lineGraph cvVoteTable_lineGraph--republican" style="width:' + (republicanYes * .75) + 'px;"></div> \n' +
                '<div class="cvVoteTable_lineGraph cvVoteTable_lineGraph--democrat" style="width:' + (democratYes * .75) + 'px;"></div> \n' +
              '</td> \n' +
              '<td class="cvVoteTable_voteCount"><span class="label republican">' + republicanYes + '</span></td> \n' +
              '<td class="cvVoteTable_voteCount"><span class="label democrat">' + democratYes + '</span></td> \n' +
            '</tr> \n' +
            '<tr> \n' +
              '<td class="cvVoteTable_rowLabel">Nay</td> \n' +
              '<td class="cvVoteTable_voteCount cvVoteTable_voteCount--percent">' + percentNo + '%</td> \n' +
              '<td class="cvVoteTable_voteCount cvVoteTable_voteCount--graph">' + totalNo + ' \n' +
                '<div class="cvVoteTable_lineGraph cvVoteTable_lineGraph--republican" style="width:' + (republicanNo * .75) + 'px;"></div> \n' +
                '<div class="cvVoteTable_lineGraph cvVoteTable_lineGraph--democrat" style="width:' + (democratNo * .75) + 'px;"></div> \n' +
              '</td> \n' +
              '<td class="cvVoteTable_voteCount"><span class="label republican">' + republicanNo + '</span></td> \n' +
              '<td class="cvVoteTable_voteCount"><span class="label democrat">' + democratNo + '</span></td> \n' +
            '</tr> \n' +
            '<tr> \n' +
              '<td class="cvVoteTable_rowLabel">Not Voting</td> \n' +
              '<td class="cvVoteTable_voteCount cvVoteTable_voteCount--percent">' + percentNotVoting + '%</td> \n' +
              '<td class="cvVoteTable_voteCount cvVoteTable_voteCount--graph">' + totalNotVoting + ' \n' +
                '<div class="cvVoteTable_lineGraph cvVoteTable_lineGraph--republican" style="width:' + (republicanNotVoting * .75) + 'px;"></div> \n' +
                '<div class="cvVoteTable_lineGraph cvVoteTable_lineGraph--democrat" style="width:' + (democratNotVoting * .75) + 'px;"></div> \n' +
              '</td> \n' +
              '<td class="cvVoteTable_voteCount"><span class="label republican">' + republicanNotVoting + '</span></td> \n' +
              '<td class="cvVoteTable_voteCount"><span class="label democrat">' + democratNotVoting + '</span></td> \n' +
            '</tr> \n' +
          '</table> \n' +

        '</div> \n' +


        /*
        '<div class="cell small-3"> \n' +
          '<h4><small>Yes - ' + percentYes + '%</small></h4> \n' +
          '<span class="label democrat">' + dataRecentVotes[i].democratic.yes + '</span> \n' +
          '<span class="label republican">' + dataRecentVotes[i].republican.yes + '</span> \n' +
        '</div> \n' +
        '<div class="cell small-3"> \n' +
          '<h4><small>No - ' + percentNo + '%</small></h4> \n' +
          '<span class="label democrat">' + dataRecentVotes[i].democratic.no + '</span> \n' +
          '<span class="label republican">' + dataRecentVotes[i].republican.no + '</span> \n' +
        '</div> \n' +
        '<div class="cell small-3"> \n' +
          '<h4><small>Not Voting - ' + percentNotVoting + '%</small></h4> \n' +
          '<span class="label democrat">' + dataRecentVotes[i].democratic.not_voting + '</span> \n' +
          '<span class="label republican">' + dataRecentVotes[i].republican.not_voting + '</span> \n' +
        '</div> \n' +
      '</div> \n' +
*/
    '</div>'

    $(".js-homeRecentVotes").append(voteRowHTML); // append html to results div
  }

});
