(function(module) {
  function Article(opts) {
    this.author = opts.author;
    this.authorUrl = opts.authorUrl;
    this.title = opts.title;
    this.category = opts.category;
    this.body = opts.body;
    this.publishedOn = opts.publishedOn;
  }

  Article.all = [];

  Article.prototype.toHtml = function() {
    var template = Handlebars.compile($('#article-template').text());

    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
    this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
    this.body = marked(this.body);

    return template(this);
  };

  Article.loadAll = function(rawData) {
    rawData.sort(function(a,b) {
      return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
    });

    Article.all = rawData.map(function(ele) {
      return new Article(ele);
    });
  };

  Article.fetchAll = function(next) {
    if (localStorage.rawData) {
      Article.loadAll(JSON.parse(localStorage.rawData));
      next();
    } else {
      $.getJSON('/data/hackerIpsum.json', function(rawData) {
        Article.loadAll(rawData);
        localStorage.rawData = JSON.stringify(rawData); // Cache the json, so we don't need to request it next time.
        next();
      });
    }
  };

  Article.numWordsAll = function() {
    return Article.all.map(function(article) {
      return article.body.split(' ').length;
    })
    .reduce(function(a, b) {
      return a + b;
    });
  };

  Article.allAuthors = function() {
    return Article.all.map(function(article) {
      return article.author;
    })
    .reduce(function(authorNames, authorName) {
      if (authorNames.indexOf(authorName) === -1) {
        authorNames.push(authorName);
      }
      return authorNames;
    }, []);
  };

  Article.numWordsByAuthor = function() {
    return Article.allAuthors().map(function(author) {
      return {
        name: author,
        numWords: Article.all.filter(function(article) {
          return article.author === author;
        })
        .map(function(article) {
          return article.body.split(' ').length;
        })
        .reduce(function(a, b) {
          return a + b;
        })
      };
    });
  };
  module.Article = Article;
})(window);
