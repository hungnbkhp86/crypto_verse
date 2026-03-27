import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBitcoin, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { HiTrendingUp, HiNewspaper, HiChartBar, HiInformationCircle } from 'react-icons/hi';
import { searchCoins } from '../services/api';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const results = await searchCoins(searchQuery);
          setSearchResults(results.slice(0, 8));
        } catch {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const navItems = [
    { path: '/', label: 'Home', icon: <HiChartBar /> },
    { path: '/market', label: 'Market', icon: <HiTrendingUp /> },
    { path: '/news', label: 'News', icon: <HiNewspaper /> },
    { path: '/about', label: 'About', icon: <HiInformationCircle /> },
  ];

  return (
    <motion.header
      className={`header ${scrolled ? 'header--scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="container header__inner">
        <Link to="/" className="header__logo">
          <motion.div
            className="header__logo-icon"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <FaBitcoin />
          </motion.div>
          <span className="header__logo-text">
            Crypto<span className="gradient-text">Verse</span>
          </span>
        </Link>

        <nav className="header__nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`header__nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="header__nav-icon">{item.icon}</span>
              {item.label}
              {location.pathname === item.path && (
                <motion.div
                  className="header__nav-indicator"
                  layoutId="nav-indicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          <motion.button
            className="header__search-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {searchOpen ? <FaTimes /> : <FaSearch />}
          </motion.button>

          <button
            className="header__mobile-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="header__search-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container">
              <div className="header__search-box">
                <FaSearch className="header__search-icon" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search coins... (e.g., Bitcoin, Ethereum)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="header__search-input"
                />
              </div>
              {searchResults.length > 0 && (
                <motion.div
                  className="header__search-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {searchResults.map((coin) => (
                    <motion.div
                      key={coin.id}
                      className="header__search-result"
                      onClick={() => {
                        navigate(`/coin/${coin.id}`);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      whileHover={{ x: 8, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                    >
                      <img src={coin.thumb} alt={coin.name} className="header__search-result-img" />
                      <div>
                        <div className="header__search-result-name">{coin.name}</div>
                        <div className="header__search-result-symbol">{coin.symbol}</div>
                      </div>
                      {coin.market_cap_rank && (
                        <span className="header__search-result-rank">#{coin.market_cap_rank}</span>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="header__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`header__mobile-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
