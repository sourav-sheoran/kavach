const Parser = require('rss-parser');
const Inbox = require('../models/Inbox.model');

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'Mozilla/5.0' }
});

const SOURCES = [
  {
    name: 'PIB',
    url: 'https://feeds.feedburner.com/ndtvnews-india-news',
    category: 'Defence'
  },
  {
    name: 'MOD',
    url: 'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
    category: 'Defence'
  }
];

const fetchAndStore = async () => {
  console.log('📰 Fetching news from sources...');

  for (const source of SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);

      for (const item of feed.items) {
        await Inbox.findOneAndUpdate(
          { originalUrl: item.link },
          {
            source: source.name,
            title: item.title,
            content: item.contentSnippet || item.content || '',
            originalUrl: item.link,
            category: source.category,
            isVerified: true,
            publishedAt: item.pubDate
              ? new Date(item.pubDate)
              : new Date(),
            fetchedAt: new Date()
          },
          { upsert: true, new: true }
        );
      }

      console.log(`✅ Fetched from ${source.name}`);
    } catch (error) {
      console.log(`❌ Error fetching ${source.name}: ${error.message}`);
    }
  }

  console.log('✅ News fetch complete');
};

module.exports = { fetchAndStore };