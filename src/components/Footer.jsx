import { motion } from 'framer-motion';
import { FaBitcoin, FaGithub, FaTwitter, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <FaBitcoin className="footer__logo-icon" />
              <span>Crypto<span className="gradient-text">Verse</span></span>
            </Link>
            <p className="footer__desc">
              Leading platform for crypto news and market tracking.
              Realtime data from CoinGecko & CryptoCompare.
            </p>
          </div>

          <div className="footer__links-group">
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/market">Market</Link>
            <Link to="/news">News</Link>
          </div>

          <div className="footer__links-group">
            <h4>Data Sources</h4>
            <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer">CoinGecko</a>
            <a href="https://api.rss2json.com" target="_blank" rel="noopener noreferrer">RSS2JSON</a>
            <a href="https://www.coindesk.com" target="_blank" rel="noopener noreferrer">CoinDesk</a>
            <a href="https://cointelegraph.com" target="_blank" rel="noopener noreferrer">CoinTelegraph</a>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 CryptoVerse. All rights reserved.</p>
          <p className="footer__disclaimer">
            Disclaimer: Data is provided for informational purposes only, not investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
