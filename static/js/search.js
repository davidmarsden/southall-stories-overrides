// search.js
// from https://github.com/microdotblog/plugin-search-page
// amended for use with Microwave theme
// MIT License

// Copyright (c) 2020 Micro.blog

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

let archiveResults = {};

function runSearch(id, q) {
  var results_parent = document.getElementById(`${id}_parent_results`);
  var results_node = document.getElementById(`${id}_list_results`);

  // If the expected nodes aren't present on this page/layout, bail safely.
  if (!results_parent || !results_node) return;

  results_node.innerHTML = "";

  if (q.length > 0) {
    // If archiveResults hasn't loaded yet, don't error.
    if (!archiveResults || !archiveResults.items || !Array.isArray(archiveResults.items)) {
      results_parent.style.display = "none";
      return;
    }

    var count = 0;
    for (var i = 0; i < archiveResults.items.length; i++) {
      var item = archiveResults.items[i];
      var title_lower = (item.title || "").toLowerCase();
      var text_lower = (item.content_text || "").toLowerCase();

      if (title_lower.includes(q) || text_lower.includes(q)) {
        var link_node = document.createElement("a");
        link_node.className = "list-group-item list-group-item-action search-result";
        link_node.href = item.url;

        var date_s = "";
        try {
          date_s = new Date(Date.parse(item.date_published)).toISOString().substr(0, 10);
        } catch (e) {
          date_s = "";
        }

        var title = (item.title && item.title.length > 0) ? item.title : "Untitled";
        var content =
          (item.content_text && item.content_text.length > 200)
            ? item.content_text.substr(0, 200) + "..."
            : (item.content_text || "");

        link_node.innerHTML = date_s + ": <b>" + title + "</b> - " + content;

        results_node.appendChild(link_node);

        count++;

        // Break out of the loop if the desired number of results (5) is reached
        if (count >= 5) {
          break;
        }
      }
    }

    results_parent.style.display = "block";
  }
}

function submitSearch(id, q) {
  runSearch(id, q);

  const url = new URL(window.location.href);
  url.searchParams.set("q", q);
  history.pushState({}, "", url);
}

function clearQuery() {
  // Remove the query parameter 'q' from the URL
  var urlParams = new URLSearchParams(window.location.search);
  urlParams.delete("q");

  // Check if there are any remaining parameters
  var newUrl;
  if (urlParams.toString() === "") {
    // If no remaining parameters, remove the '?'
    newUrl = window.location.pathname;
  } else {
    newUrl = window.location.pathname + "?" + urlParams.toString();
  }
  window.history.replaceState({}, document.title, newUrl);
}

document.body.addEventListener("click", function (event) {
  var inputSearch = document.getElementById("sidemeta_input_search");
  var searchResults = document.getElementById("sidemeta_parent_results");

  var mobileInputSearch = document.getElementById("mobile_input_search");
  var mobileSearchResults = document.getElementById("mobile_parent_results");

  var midInputSearch = document.getElementById("mid_input_search");
  var midSearchResults = document.getElementById("mid_parent_results");

  // Helper: hide results if click is outside results + outside input.
  // Guard against nulls because these elements don't exist on every page/layout.
  function maybeHide(resultsEl, inputEl) {
    if (!resultsEl || !inputEl) return;

    var clickedInsideResults = resultsEl.contains(event.target);
    var clickedInsideInput = inputEl.contains(event.target);

    if (!clickedInsideResults && !clickedInsideInput) {
      resultsEl.style.display = "none";
      inputEl.value = "";
      clearQuery();
    }
  }

  maybeHide(searchResults, inputSearch);
  maybeHide(mobileSearchResults, mobileInputSearch);
  maybeHide(midSearchResults, midInputSearch);
});

function setupEscapeListener(inputId, resultsId) {
  var input = document.getElementById(inputId);
  var results = document.getElementById(resultsId);

  if (input && results) {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        results.style.display = "none";
        input.value = "";
        clearQuery();
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setupEscapeListener("sidemeta_input_search", "sidemeta_parent_results");
  setupEscapeListener("mobile_input_search", "mobile_parent_results");
  setupEscapeListener("mid_input_search", "mid_parent_results");
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("/archive/index.json")
    .then((response) => response.json())
    .then((data) => {
      archiveResults = data;

      const url = window.location.href;
      const params = new URLSearchParams(new URL(url).search);
      const q = params.get("q");
      if (q && q.length > 0) {
        var searchBars = document.querySelectorAll("[data-search-id]");

        searchBars.forEach(function (searchBar) {
          var inputSearch = searchBar.querySelector(".form-control");
          var searchId = searchBar.dataset.searchId;

          if (inputSearch) {
            inputSearch.value = q;
            runSearch(searchId, q);
          }
        });
      }
    })
    .catch(() => {
      // If the archive JSON can't be loaded (offline, missing, etc.),
      // fail silently so it doesn't break the rest of the page JS.
    });
});