//loop through books, download goodreads rating and link, and append
function startGoodReads() {
    $("#loadVSloading").text("Loading");
    $("#badge_progress").text("0 of 0");
	
    var n = $(".nsm-short-item.nsm-e135").length;
	//use the following line (1 of 3) to add ratings to the library's homepage instead of the search results page
    //var n = $("#riverlist_1xxx1 li").length;
    
	var i = 0;
    var t = setTimeout(getGoodReads, 1000); //set delay in ms between requests to GR API (note 1 per second limit per API key)
	
    function getGoodReads() {
        var progress = i + " of " + n;
        $("#badge_progress").text(progress);
        if (i == n) {
            //$("#badge1").hide(800); //show the badge all the time to account for pages that load new content without a complete page refresh
            $("#loadVSloading").text("Load");
            $("#badge_progress").text("");
            endGoodReads();
            throw new Error('This is not an error. This is just to abort javascript execution.');
        }
		
        var li = $(".nsm-short-item.nsm-e135").eq(i);
        //use the following line (2 of 3) to add ratings to the library's homepage instead of the search results page
		//var li = $("#riverlist_1xxx1 li").eq(i);
        
		var title = li.text();
		//use the following line (3 of 3) to add ratings to the library's homepage instead of the search results page
        //var title = li.find("a").text();
		
        //commented out following 2 lines to remove author from search criteria because we are getting good matches without it
        //var author = li.find("div").eq(1).text();
        //author = author.replace(title, "");

		//build the URL for the goodreads API request
		var url = "https://www.goodreads.com/book/title.xml?key=" + self.options.grAPIkey + "&title=" + title;

		//submit the request to the goodreads API and parse the results
        $.get(url, function (data) {
			//search the API response for the average rating of the book
            var avgRating = $(data).find("GoodreadsResponse book average_rating").first().text();
            //search the API response for the link to the goodreads page for the book
            var link = $(data).find("GoodreadsResponse book url").first().text();
			
            //build the HTML to be appended inline on the library's search results page
            //append the HTML inline at var 'li'
			
			//the following 2 lines work but are insecure.
			//var ratingHTML = "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span><a target='_blank' href='" + link + "'><span style='color:darkred; font-weight:bolder'><img src='" + self.options.g_iconURL + "' /></span> <span class='badge'>" + avgRating + "</span></a>";
			//$(ratingHTML).hide().appendTo(li).show(200); this works but is insecure
			
			//secure version of the above two lines
			li.append(
				$("<span>").html("&nbsp;&nbsp;&nbsp;&nbsp;").append(
					$("<a>").attr({target: "_blank", href: link}).append(
						$("<span>").css({color: "darkred", "font-weight": "bolder"}).append(
							$("<img>").attr("src", self.options.g_iconURL)
						).append(
							$("<span>").attr("class", "badge").text(avgRating)
						)
					)
				)
			).hide().show(200);
			
            i++;
            t = setTimeout(getGoodReads, 1000);
        });
    }
    function endGoodReads() {
        clearTimeout(t);
    }
}


$(document).ready(function () {
    //note that jquery. bootstrap js, and bootstrap css must be loaded via the add-on's index.js and not here
    //even though you can add them to the DOM using jquery in this file, and the DOM will show that they have been added, they will not be usable

    //display a box to prepare to show progress of the goodreads lookup
    $("<button class='btn btn-primary' id='badge1' type='button' style='position:fixed; top: 0px; right: 0px'><span id='loadVSloading'>Load</span> <img height='18' width='18' src='" + self.options.g_iconURL + "' /> Ratings <span class='badge' id='badge_progress'></span></button>").hide().appendTo($("body")).show(800);
    $("#badge1").click(startGoodReads);
    
	//notify the user if he hasn't provided a goodreads API key yet
	if (self.options.grAPIkey == "none") {
		$("#loadVSloading").text("No API key. Go to Add-on options.");
	}
});