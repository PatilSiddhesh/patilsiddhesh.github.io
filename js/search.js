let pagesIndex, searchIndex;
const MAX_SUMMARY_LENGTH = 100;
const SENTENCE_BOUNDARY_REGEX = /\b\.\s/gm;
const WORD_REGEX = /\b(\w*)[\W|\s|\b]?/gm;


async function initSearchIndex() {
  try {
    const response = await fetch("/index.json");
    pagesIndex = await response.json();
    searchIndex = lunr(function () {
      this.field("title");
      this.field("categories");
      this.field("content");
      this.ref("href");
      pagesIndex.forEach((page) => this.add(page));
    });
  } catch (e) {
    console.log(e);
  }
}


function handleSearchQuery(event) {
  event.preventDefault();
  const query = document.getElementById("search").value.trim().toLowerCase();
  if (!query) {
    displayErrorMessage("Hey! Looks like you forgot to enter something in the search box");
    clearSearchResults();
    ga('send', 'event', 'Search', "no query");
    return;
  }
  const results = searchSite(query);
  if (!results.length) {
    displayErrorMessage("No results found for " + query);
    clearSearchResults();
    ga('send', 'event', 'Search', query);
    return;
  }
  document.getElementById("search-msg").innerHTML = ""
  renderSearchResults(query, results);
  ga('send', 'event', 'Search', query);
}

function displayErrorMessage(message) {
  document.getElementById("search-msg").innerHTML = message;
}

function removeAnimation() {
  this.classList.remove("fade");
  this.classList.add("hide-element");
}

function searchSite(query) {
  const originalQuery = query;
  query = getLunrSearchQuery(query);
  let results = getSearchResults(query);
  return results.length
    ? results
    : query !== originalQuery
    ? getSearchResults(originalQuery)
    : [];
}

function getSearchResults(query) {
  return searchIndex.search(query).flatMap((hit) => {
    if (hit.ref == "undefined") return [];
    let pageMatch = pagesIndex.filter((page) => page.href === hit.ref)[0];
    pageMatch.score = hit.score;
    return [pageMatch];
  });
}

function getLunrSearchQuery(query) {
  const searchTerms = query.split(" ");
  if (searchTerms.length === 1) {
    return query;
  }
  query = "";
  for (const term of searchTerms) {
    query += `+${term} `;
  }
  return query.trim();
}

function renderSearchResults(query, results) {
  clearSearchResults();
  updateSearchResults(query, results);
  showSearchResults();
}

function clearSearchResults() {
    document.getElementById("query").innerHTML = ""
    document.getElementById("results-count").innerHTML = ""
    document.getElementById("results-count-text").innerHTML = ""

  const results = document.querySelector(".search-results div");
  while (results.firstChild) results.removeChild(results.firstChild);
}

function updateSearchResults(query, results) {
  document.getElementById("query").innerHTML = query;
  document.querySelector(".search-results div").innerHTML = results
    .map(
      (hit) => `
      <a href="${hit.href}" style="text-decoration:none;color:#a5a5a5">

    <div class="card" style="padding:1rem;margin-bottom:2rem" data-score="${hit.score.toFixed(2)}">
      <h3>${hit.title}</h3>
      
      <p style="font-size:80%;width:100%;overflow:hidden;color:var(--color-text-l2)">${createSearchResultBlurb(query, hit.content)}</p>
    </div>
    </a>
    `
    )
    .join("");
  const searchResultListItems = document.querySelectorAll(".search-results div");
  document.getElementById("results-count").innerHTML = searchResultListItems.length - 1;
  document.getElementById("results-count-text").innerHTML = searchResultListItems.length > 1 ? " results for " : " result for ";
}

function createSearchResultBlurb(query, pageContent) {
  const searchQueryRegex = new RegExp(createQueryStringRegex(query), "gmi");
  const searchQueryHits = Array.from(
    pageContent.matchAll(searchQueryRegex),
    (m) => m.index
  );
  const sentenceBoundaries = Array.from(
    pageContent.matchAll(SENTENCE_BOUNDARY_REGEX),
    (m) => m.index
  );
  let searchResultText = "";
  let lastEndOfSentence = 0;
  for (const hitLocation of searchQueryHits) {
    if (hitLocation > lastEndOfSentence) {
      for (let i = 0; i < sentenceBoundaries.length; i++) {
        if (sentenceBoundaries[i] > hitLocation) {
          const startOfSentence = i > 0 ? sentenceBoundaries[i - 1] + 1 : 0;
          const endOfSentence = sentenceBoundaries[i];
          lastEndOfSentence = endOfSentence;
          parsedSentence = pageContent.slice(startOfSentence, endOfSentence).trim();
          searchResultText += `${parsedSentence} ... `;
          break;
        }
      }
    }
    const searchResultWords = tokenize(searchResultText);
    const pageBreakers = searchResultWords.filter((word) => word.length > 50);
    if (pageBreakers.length > 0) {
      searchResultText = fixPageBreakers(searchResultText, pageBreakers);
    }
    if (searchResultWords.length >= MAX_SUMMARY_LENGTH) break;
  }
  return ellipsize(searchResultText, MAX_SUMMARY_LENGTH).replace(
    searchQueryRegex,
    '<strong style ="color:var(--color-accent)">$&</strong>'
  );
}

function createQueryStringRegex(query) {
  const searchTerms = query.split(" ");
  if (searchTerms.length == 1) {
    return query;
  }
  query = "";
  for (const term of searchTerms) {
    query += `${term}|`;
  }
  query = query.slice(0, -1);
  return `(${query})`;
}

function tokenize(input) {
  const wordMatches = Array.from(input.matchAll(WORD_REGEX), (m) => m);
  return wordMatches.map((m) => ({
    word: m[0],
    start: m.index,
    end: m.index + m[0].length,
    length: m[0].length,
  }));
}

function fixPageBreakers(input, largeWords) {
  largeWords.forEach((word) => {
    const chunked = chunkify(word.word, 20);
    input = input.replace(word.word, chunked);
  });
  return input;
}

function chunkify(input, chunkSize) {
  let output = "";
  let totalChunks = (input.length / chunkSize) | 0;
  let lastChunkIsUneven = input.length % chunkSize > 0;
  if (lastChunkIsUneven) {
    totalChunks += 1;
  }
  for (let i = 0; i < totalChunks; i++) {
    let start = i * chunkSize;
    let end = start + chunkSize;
    if (lastChunkIsUneven && i === totalChunks - 1) {
      end = input.length;
    }
    output += input.slice(start, end) + " ";
  }
  return output;
}

function ellipsize(input, maxLength) {
  const words = tokenize(input);
  if (words.length <= maxLength) {
    return input;
  }
  return input.slice(0, words[maxLength].end) + "...";
}

function showSearchResults() {
  document.querySelector(".primary").classList.add("hide-element");
  document.querySelector(".search-results").classList.remove("hide-element");
  document.getElementById("site-search").classList.add("expanded");
  document.getElementById("clear-search-results-sidebar").classList.remove("hide-element");
}



function handleClearSearchButtonClicked() {
  hideSearchResults();
  clearSearchResults();
  document.getElementById("search").value = "";
}

function hideSearchResults() {
  document.getElementById("clear-search-results-sidebar").classList.add("hide-element");
  document.getElementById("site-search").classList.remove("expanded");
  document.querySelector(".search-results").classList.add("hide-element");
  document.querySelector(".primary").classList.remove("hide-element");
}

initSearchIndex();
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("search-form") != null) {
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("keydown", (event) => {
      if (event.keyCode == 13) handleSearchQuery(event);
    });
    document
      .querySelector(".search-error")
      .addEventListener("animationend", removeAnimation);
    document
      .querySelector(".fa-search")
      .addEventListener("click", (event) => handleSearchQuery(event));
  }
  document
    .querySelectorAll(".clear-search-results")
    .forEach((button) =>
      button.addEventListener("click", () => handleClearSearchButtonClicked())
    );
});

if (!String.prototype.matchAll) {
  String.prototype.matchAll = function (regex) {
    "use strict";
    function ensureFlag(flags, flag) {
      return flags.includes(flag) ? flags : flags + flag;
    }
    function* matchAll(str, regex) {
      const localCopy = new RegExp(regex, ensureFlag(regex.flags, "g"));
      let match;
      while ((match = localCopy.exec(str))) {
        match.index = localCopy.lastIndex - match[0].length;
        yield match;
      }
    }
    return matchAll(this, regex);
  };
}
