import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { formatPrice, formatPercent, formatMarketCap } from '../services/api';
import './CoinCard.css';

export default function CoinCard({ coin, index }) {
  const navigate = useNavigate();
  const priceChange = coin.price_change_percentage_24h;
  const isUp = priceChange >= 0;

  return (
    <motion.div
      className="coin-card glass-card"
      onClick={() => navigate(`/coin/${coin.id}`)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 8px 40px rgba(139, 92, 246, 0.2)' }}
      layout
    >
      <div className="coin-card__header">
        <div className="coin-card__rank">#{coin.market_cap_rank}</div>
        <div className={`coin-card__change ${isUp ? 'up' : 'down'}`}>
          {isUp ? <FaCaretUp /> : <FaCaretDown />}
          {formatPercent(priceChange)}
        </div>
      </div>

      <div className="coin-card__info">
        <img src={coin.image} alt={coin.name} className="coin-card__img" />
        <div>
          <h3 className="coin-card__name">{coin.name}</h3>
          <span className="coin-card__symbol">{coin.symbol?.toUpperCase()}</span>
        </div>
      </div>

      <div className="coin-card__price">{formatPrice(coin.current_price)}</div>

      {/* Mini sparkline */}
      {coin.sparkline_in_7d?.price && (
        <div className="coin-card__sparkline">
          <svg viewBox="0 0 100 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`grad-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const prices = coin.sparkline_in_7d.price;
              const min = Math.min(...prices);
              const max = Math.max(...prices);
              const range = max - min || 1;
              const step = 100 / (prices.length - 1);
              const points = prices.map((p, i) => 
                `${i * step},${30 - ((p - min) / range) * 28}`
              ).join(' ');
              const areaPoints = points + ` 100,30 0,30`;
              return (
                <>
                  <polygon points={areaPoints} fill={`url(#grad-${coin.id})`} />
                  <polyline
                    points={points}
                    fill="none"
                    stroke={isUp ? '#10b981' : '#ef4444'}
                    strokeWidth="1.5"
                  />
                </>
              );
            })()}
          </svg>
        </div>
      )}

      <div className="coin-card__footer">
        <div className="coin-card__stat">
          <span className="coin-card__stat-label">Market Cap</span>
          <span className="coin-card__stat-value">{formatMarketCap(coin.market_cap)}</span>
        </div>
        <div className="coin-card__stat">
          <span className="coin-card__stat-label">Vol 24h</span>
          <span className="coin-card__stat-value">{formatMarketCap(coin.total_volume)}</span>
        </div>
      </div>
    </motion.div>
  );
}
