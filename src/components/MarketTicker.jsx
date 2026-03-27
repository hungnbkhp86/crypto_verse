import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { fetchTopCoins, formatPrice, formatPercent } from '../services/api';
import './MarketTicker.css';

export default function MarketTicker() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    fetchTopCoins(1, 20)
      .then(setCoins)
      .catch(() => {});
    const interval = setInterval(() => {
      fetchTopCoins(1, 20).then(setCoins).catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (coins.length === 0) return null;

  const tickerItems = [...coins, ...coins];

  return (
    <div className="ticker-wrapper">
      <motion.div
        className="ticker-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {tickerItems.map((coin, i) => {
          const isUp = coin.price_change_percentage_24h >= 0;
          return (
            <div key={`${coin.id}-${i}`} className="ticker-item">
              <img src={coin.image} alt={coin.symbol} className="ticker-item__img" />
              <span className="ticker-item__symbol">{coin.symbol?.toUpperCase()}</span>
              <span className="ticker-item__price">{formatPrice(coin.current_price)}</span>
              <span className={`ticker-item__change ${isUp ? 'up' : 'down'}`}>
                {isUp ? <FaCaretUp /> : <FaCaretDown />}
                {formatPercent(coin.price_change_percentage_24h)}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
