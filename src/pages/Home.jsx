import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiTrendingUp, HiNewspaper, HiFire, HiChartBar } from 'react-icons/hi';
import { FaArrowRight, FaGlobeAmericas, FaChartLine, FaExchangeAlt } from 'react-icons/fa';
import CoinCard from '../components/CoinCard';
import NewsCard from '../components/NewsCard';
import { CoinCardSkeleton, NewsCardSkeleton } from '../components/LoadingSkeleton';
import {
  fetchTopCoins,
  fetchCryptoNews,
  fetchTrendingCoins,
  fetchGlobalData,
  formatMarketCap,
  formatPercent,
} from '../services/api';
import './Home.css';

export default function Home() {
  const [topCoins, setTopCoins] = useState([]);
  const [news, setNews] = useState([]);
  const [trending, setTrending] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [coins, articles, trends, global] = await Promise.allSettled([
          fetchTopCoins(1, 8),
          fetchCryptoNews('', 6),
          fetchTrendingCoins(),
          fetchGlobalData(),
        ]);
        if (coins.status === 'fulfilled') setTopCoins(coins.value);
        if (articles.status === 'fulfilled') setNews(articles.value);
        if (trends.status === 'fulfilled') setTrending(trends.value);
        if (global.status === 'fulfilled') setGlobalData(global.value);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg-orbs">
          <motion.div
            className="hero__orb hero__orb--1"
            animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="hero__orb hero__orb--2"
            animate={{ y: [0, 20, 0], x: [0, -30, 0], scale: [1, 0.9, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="hero__orb hero__orb--3"
            animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>
        <div className="container hero__content">
          <motion.div
            className="hero__text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="hero__badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <HiFire /> LIVE MARKET DATA
            </motion.span>
            <h1 className="hero__title">
              The <span className="gradient-text">Crypto</span> World
              <br />
              At Your Fingertips
            </h1>
            <p className="hero__subtitle">
              Get the latest news, real-time prices, and cryptocurrency market analysis
              from top trusted sources worldwide
            </p>
            <div className="hero__actions">
              <Link to="/market" className="hero__btn hero__btn--primary">
                <HiChartBar /> Explore Market
              </Link>
              <Link to="/news" className="hero__btn hero__btn--secondary">
                <HiNewspaper /> Read News
              </Link>
            </div>
          </motion.div>

          {/* Global Stats */}
          {globalData && (
            <motion.div
              className="hero__stats"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="hero__stat glass-card">
                <FaGlobeAmericas className="hero__stat-icon" />
                <div>
                  <span className="hero__stat-label">Market Cap</span>
                  <span className="hero__stat-value">
                    {formatMarketCap(globalData.total_market_cap?.usd)}
                  </span>
                </div>
              </div>
              <div className="hero__stat glass-card">
                <FaExchangeAlt className="hero__stat-icon" />
                <div>
                  <span className="hero__stat-label">Volume 24h</span>
                  <span className="hero__stat-value">
                    {formatMarketCap(globalData.total_volume?.usd)}
                  </span>
                </div>
              </div>
              <div className="hero__stat glass-card">
                <FaChartLine className="hero__stat-icon" />
                <div>
                  <span className="hero__stat-label">BTC Dominance</span>
                  <span className="hero__stat-value">
                    {globalData.market_cap_percentage?.btc?.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="hero__stat glass-card">
                <HiTrendingUp className="hero__stat-icon" />
                <div>
                  <span className="hero__stat-label">24h Change</span>
                  <span className={`hero__stat-value ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green' : 'text-red'}`}>
                    {formatPercent(globalData.market_cap_change_percentage_24h_usd)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <div className="container page-content">
        {/* Trending Section */}
        {trending.length > 0 && (
          <motion.section
            className="home-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">
              <HiFire className="icon" style={{ color: '#f59e0b' }} />
              <span>Trending</span>
            </h2>
            <div className="trending-grid">
              {trending.slice(0, 7).map((coin, i) => (
                <motion.div
                  key={coin.id}
                  className="trending-item glass-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(139, 92, 246, 0.4)' }}
                >
                  <Link to={`/coin/${coin.id}`} className="trending-item__link">
                    <span className="trending-item__rank">#{i + 1}</span>
                    <img src={coin.thumb} alt={coin.name} className="trending-item__img" />
                    <div className="trending-item__info">
                      <span className="trending-item__name">{coin.name}</span>
                      <span className="trending-item__symbol">{coin.symbol}</span>
                    </div>
                    {coin.data?.price_change_percentage_24h?.usd != null && (
                      <span className={`trending-item__change ${coin.data.price_change_percentage_24h.usd >= 0 ? 'up' : 'down'}`}>
                        {formatPercent(coin.data.price_change_percentage_24h.usd)}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Top Coins */}
        <motion.section
          className="home-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-header">
            <h2 className="section-title">
              <HiTrendingUp className="icon" style={{ color: '#10b981' }} />
              <span>Top Cryptocurrencies</span>
            </h2>
            <Link to="/market" className="section-link">
              View all <FaArrowRight />
            </Link>
          </div>
          {loading ? (
            <CoinCardSkeleton count={8} />
          ) : (
            <div className="coins-grid">
              {topCoins.map((coin, i) => (
                <CoinCard key={coin.id} coin={coin} index={i} />
              ))}
            </div>
          )}
        </motion.section>

        {/* News */}
        <motion.section
          className="home-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-header">
            <h2 className="section-title">
              <HiNewspaper className="icon" style={{ color: '#8b5cf6' }} />
              <span>Latest News</span>
            </h2>
            <Link to="/news" className="section-link">
              View all <FaArrowRight />
            </Link>
          </div>
          {loading ? (
            <NewsCardSkeleton count={6} />
          ) : (
            <div className="news-grid">
              {news.slice(0, 6).map((article, i) => (
                <NewsCard key={article.id || i} article={article} index={i} />
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
