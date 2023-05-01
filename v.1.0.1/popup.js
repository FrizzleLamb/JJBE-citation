chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  var tab = tabs[0];
  var url = tab.url;

  // Make a request to fetch the webpage's HTML code
  fetch(url)
    .then(response => response.text())
    .then(html => {
      // Parse the HTML code using a DOMParser
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');

      // Look for meta tags that contain information about the webpage
      var metaTags = doc.querySelectorAll('meta');
      var titleTag = doc.querySelector('title');

      // Extract the date, title, and publisher from the meta tags
      var date = '';
      var title = '';
      var publisher = '';
      metaTags.forEach(function(tag) {
        var name = tag.getAttribute('name');
        var property = tag.getAttribute('property');
        var content = tag.getAttribute('content');
        if ((name === 'article:published_time' || property === 'article:published_time') && !date) {
          date = new Date(content).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } else if ((name === 'article:modified_time' || property === 'article:modified_time') && !date) {
          date = new Date(content).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } else if (name === 'og:title' || property === 'og:title') {
          title = content;
        } else if (name === 'og:site_name' || property === 'og:site_name') {
          publisher = content;
        }
      });

      // Use the title tag if no og:title tag is present
      if (title === '' && titleTag !== null) {
        title = titleTag.textContent;
      }

      // Extract the author's name from the webpage, if available
      var authorTag = doc.querySelector('meta[name="author"]');
      var author = authorTag ? authorTag.getAttribute('content') : '';

      // Construct the citation text with the extracted information
      var citationText = `{{Citation |author = ${author} |handle = |url = ${url} |title = ${title} |date = ${date} |publisher = ${publisher} |platform = |archived = }}`;

      // Copy the citation text to the clipboard
      navigator.clipboard.writeText(citationText);
    });
});
