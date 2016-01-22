// Configure a view object, to hold all our functions for dynamic updates and article-related event handlers.
var articleView = {};

articleView.populateFilters = function() {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      var val = $(this).find('address a').text();
      var optionTag = '<option value="' + val + '">' + val + '</option>';
      $('#author-filter').append(optionTag);

      val = $(this).attr('data-category');
      optionTag = '<option value="' + val + '">' + val + '</option>';
      if ($('#category-filter option[value="' + val + '"]').length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = function() {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-author="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = function() {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-category="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = function() {
  $('.main-nav').on('click', '.tab', function(e) {
    $('.tab-content').hide();
    $('#' + $(this).data('content')).fadeIn();
  });

  $('.main-nav .tab:first').click(); // Let's now trigger a click on the first .tab element, to set up the page.
};

articleView.setTeasers = function() {
  $('.article-body *:nth-of-type(n+2)').hide(); // Hide elements beyond the first 2 in any artcile body.
  $('#articles').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    $(this).parent().find('*').fadeIn();
    $(this).hide();
  });
};

articleView.initNewArticlePage = function() {
  // TODO: Ensure the main .tab-content area is revealed. We might add more tabs later.
  articleView.handleMainNav();
  $('.tab-content').show();
  // TODO: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.

  // TODO: Add an event handler to update the preview and the export field if any inputs change.
  $('#new-form').on('change', 'input, textarea', articleView.create());
};

articleView.create = function() {
  // TODO: Set up a var to hold the new article we are creating.
  // Clear out the #articles element, so we can put in the updated preview
  $('#articles').empty();
  // TODO: Instantiate an article based on what's in the form fields:
  var newPost = new Article();
  newPost.title = $('#article-title').val();
  newPost.body = $('#article-body').val();
  newPost.author = $('article-author').val();
  newPost.authorUrl = $('article-author-url').val();
  newPost.category = $('article-category').val();
  newPost.published = $('article-published').val();
  // TODO: Use our interface to the Handblebars template to put this new article into the DOM:
  $('#articles').append(newPost.toHtml());
  // TODO: Activate the highlighting of any code blocks:
  $('#article-body').each(function(i, block) {
    hljs.highlightBlock(block);
  });
  // TODO: Export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
  $('#export-field').show();
  $('#article-json').val(',\n' + JSON.stringify(newPost));
};


articleView.initIndexPage = function() {
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};
