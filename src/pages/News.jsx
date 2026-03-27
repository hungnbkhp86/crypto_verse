import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiNewspaper } from 'react-icons/hi';
import NewsCard from '../components/NewsCard';
import { NewsCardSkeleton } from '../components/LoadingSkeleton';
import { fetchCryptoNews } from '../services/api';
import './News.css';

const CATEGORIES = [
  { key: '', label: 'All' },
  { key: 'BTC', label: 'Bitcoin' },
  { key: 'ETH', label: 'Ethereum' },
  { key: 'Trading', label: 'Trading' },
  { key: 'Technology', label: 'Technology' },
  { key: 'Blockchain', label: 'Blockchain' },
  { key: 'Mining', label: 'Mining' },
  { key: 'Regulation', label: 'Regulation' },
  { key: 'Altcoin', label: 'Altcoin' },
];

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchCryptoNews(activeCategory, 30)
      .then(setNews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="section-title" style={{ fontSize: '2rem' }}>
            <HiNewspaper className="icon" style={{ color: '#8b5cf6' }} />
            Crypto News
          </h1>
          <p className="news-subtitle">
            Get the latest news from CoinDesk, CoinTelegraph, Decrypt and other trusted sources
          </p>

          {/* Category Filter */}
          <div className="news-categories">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.key}
                className={`news-category-btn ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>

          {loading ? (
            <NewsCardSkeleton count={9} />
          ) : news.length === 0 ? (
            <div className="news-empty">
              <p>No news found. Please try again later.</p>
            </div>
          ) : (
            <motion.div
              className="news-page-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Featured article (first) */}
              {news.length > 0 && (
                <motion.a
                  href={news[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-featured glass-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="news-featured__image-box">
                    <img
                      src={news[0].imageurl}
                      alt={news[0].title}
                      className="news-featured__image"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop';
                      }}
                    />
                    <div className="news-featured__overlay" />
                    <div className="news-featured__content">
                      <span className="news-featured__source">
                        {news[0].source_info?.name || news[0].source}
                      </span>
                      <h2 className="news-featured__title">{news[0].title}</h2>
                      <p className="news-featured__body">{news[0].body?.slice(0, 200)}...</p>
                    </div>
                  </div>
                </motion.a>
              )}

              {/* Rest of articles */}
              <div className="news-articles-grid">
                {news.slice(1).map((article, i) => (
                  <NewsCard key={article.id || i} article={article} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
