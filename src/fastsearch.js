import Fuse from 'fuse.js'
import $ from 'cash-dom'

let fuse;
let searchVisible = false;
let firstRun = true;
let list = $('#searchResults .list-unstyled').get(0);
let first = list.firstChild; 
let last = list.lastChild;
let maininput = $('#searchInput').get(0);
let resultsAvailable = false;

$(() => {
    console.log('dom ready!');
});

// ==========================================
// The main keyboard event listener running the show
//
document.addEventListener('keydown', function (event) {
    // CMD-/ to show / hide Search
    if (event.metaKey && event.which === 191) {
        // Load json search index if first time invoking search
        // Means we don't load json unless searches are going to happen; keep user payload small unless needed
        if (firstRun) {
            loadSearch(); // loads our json data and builds fuse.js search index
            firstRun = false; // let's never do this again
        }

        // Toggle visibility of search box
        if (!searchVisible) {
            document.getElementById("fastSearch").style.visibility = "visible"; // show search box
            document.getElementById("searchInput").focus(); // put focus in input box so you can just start typing
            searchVisible = true; // search visible
        }
        else {
            document.getElementById("fastSearch").style.visibility = "hidden"; // hide search box
            document.activeElement.blur(); // remove focus from search box 
            searchVisible = false; // search not visible
        }
    }

    // Allow ESC (27) to close search box
    if (event.keyCode == 27) {
        if (searchVisible) {
            document.getElementById("fastSearch").style.visibility = "hidden";
            document.activeElement.blur();
            searchVisible = false;
        }
    }

    // DOWN (40) arrow
    if (event.keyCode == 40) {
        if (searchVisible && resultsAvailable) {
            // console.log("down");
            event.preventDefault(); // stop window from scrolling
            if (document.activeElement == maininput) { first.focus(); } // if the currently focused element is the main input --> focus the first <li>
            else if (document.activeElement == last) { last.focus(); } // if we're at the bottom, stay there
            else { document.activeElement.parentElement.nextSibling.firstElementChild.focus(); } // otherwise select the next search result
        }
    }

    // UP (38) arrow
    if (event.keyCode == 38) {
        if (searchVisible && resultsAvailable) {
            event.preventDefault(); // stop window from scrolling
            if (document.activeElement == maininput) { maininput.focus(); } // If we're in the input box, do nothing
            else if (document.activeElement == first) { maininput.focus(); } // If we're at the first item, go to input box
            else { document.activeElement.parentElement.previousSibling.firstElementChild.focus(); } // Otherwise, select the search result above the current active one
        }
    }
});


// ==========================================
// execute search as each character is typed
//
document.getElementById("searchInput").onkeyup = function (e) {
    executeSearch(this.value);
}


// ==========================================
// fetch some json without jquery
//
function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}


// ==========================================
// load our search index, only executed once
// on first call of search box (CMD-/)
//
function loadSearch() {
    fetchJSONFile('/index.json', function (data) {

        var options = { // fuse.js options; check fuse.js website for details
            shouldSort: true,
            location: 0,
            distance: 100,
            threshold: 0.4,
            minMatchCharLength: 2,
            keys: [
                'title',
                'permalink',
                'content'
            ]
        };
        fuse = new Fuse(data, options); // build the index from the json file
    });
}

function executeSearch(term) {
    let results = fuse.search(term)
    let searchitems = ''

    if (results.length === 0) {
        resultsAvailable = false;
        searchitems = '';
    } else { 
        for ( let item in results) {
            searchitems += '<li>'
                + '<a href="' + results[item]['item'].permalink + '" tabindex="0">'
                + '<span class="title">'
                + results[item]['item'].title
                + '</span><br />'
                + '<span class="year-client">'
                + '2012, 아트선재센터'
                + '</span></a></li>'
        }
        resultsAvailable = true
    }
    
    $('#search-term').text(term)
    list.innerHTML = searchitems
    $('#searchResults').css('visibility', 'visible')
    
    if (results.length > 0) {
        first = list.firstChild.firstElementChild
        last = list.lastChild.firstElementChild
    }
}

$('#search-click').on('click', event => {
    if (firstRun) {
        loadSearch()
        firstRun = false
    }
    if (!searchVisible) {
        $('#fastSearch').css('visibility', 'visible')
        $('#searchInput').get(0).focus()
        searchVisible = true
    }
    else {
        $('#fastSearch').css({visibility: "hidden"});
        document.activeElement.blur()
        searchVisible = false
    }
})
