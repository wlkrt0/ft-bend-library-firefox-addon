//loop through books, download goodreads rating, and append
function startGoodReads() {
    $("#loadVSloading").text("Loading");
    $("#badge_progress").text("0 of 0");
    var n = $(".nsm-short-item.nsm-e135").length;
    //var n = $("#riverlist_1xxx1 li").length; //use this one to search the homepage 
    var i = 0;
    var t = setTimeout(getGoodReads, 1000);
    function getGoodReads() {
        var progress = i + " of " + n;
        $("#badge_progress").text(progress);
        if (i == n) {
            //show the badge all the time to account for pages that load new content without a complete page refresh
            //$("#badge1").hide(800);
            $("#loadVSloading").text("Load");
            $("#badge_progress").text("");
            endGoodReads();
            throw new Error('This is not an error. This is just to abort javascript');
        }
        var li = $(".nsm-short-item.nsm-e135").eq(i);
        //var li = $("#riverlist_1xxx1 li").eq(i); //use this one to search the homepage
        var title = li.text();
        //var title = li.find("a").text(); //use this one to search the homepage
        console.log(title);
        //removed author from search criteria because we are getting good matches without it
        //var author = li.find("div").eq(1).text();
        //author = author.replace(title, "");
        //console.log(author);
		var url = "https://www.goodreads.com/book/title.xml?key=" + self.options.grAPIkey + "&title=" + title;
		console.log(url);
        $.get(url, function (data) {
            var avgRating = $(data).find("GoodreadsResponse book average_rating").first().text();
            console.log(avgRating);
            var link = $(data).find("GoodreadsResponse book url").first().text();
            console.log(link);
            var ratingHTML = "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span><a target='_blank' href='" + link + "'><span style='color:darkred; font-weight:bolder'><img src='" + self.options.g_iconURL + "' /></span> <span class='badge'>" + avgRating + "</span></a>";
            $(ratingHTML).hide().appendTo(li).show(200);
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

//window.onload = addGoodReads();
//window.onload = alert("loaded");