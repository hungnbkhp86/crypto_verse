import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiTrendingUp, HiSearch } from 'react-icons/hi';
import { FaCaretUp, FaCaretDown, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import CoinCard from '../components/CoinCard';
import { CoinCardSkeleton } from '../components/LoadingSkeleton';
import { fetchTopCoins, formatPrice, formatPercent, formatMarketCap } from '../services/api';
import './Market.css';

export default function Market() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('market_cap_rank');
  const [sortDir, setSortDir] = useState('asc');
  const [viewMode, setViewMode] = useState('table');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchTopCoins(1, 100)
      .then(setCoins)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredCoins = coins
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (sortDir === 'asc') return (valA ?? 0) > (valB ?? 0) ? 1 : -1;
      return (valA ?? 0) < (valB ?? 0) ? 1 : -1;
    });

  const perPage = 20;
  const totalPages = Math.ceil(filteredCoins.length / perPage);
  const pagedCoins = filteredCoins.slice((page - 1) * perPage, page * perPage);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const SortIcon = ({ column }) => {
    if (sortKey !== column) return null;
    return sortDir === 'asc' ? <FaSortAmountUp className="sort-icon" /> : <FaSortAmountDown className="sort-icon" />;
  };

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="section-title" style={{ fontSize: '2rem' }}>
            <HiTrendingUp className="icon" style={{ color: '#10b981' }} />
            Crypto Market
          </h1>

          {/* Controls */}
          <div className="market-controls">
            <div className="market-search glass-card">
              <HiSearch />
              <input
                type="text"
                placeholder="Search coins..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="market-view-toggle">
              <button
                className={viewMode === 'table' ? 'active' : ''}
                onClick={() => setViewMode('table')}
              >
                Table
              </button>
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
            </div>
          </div>

          {loading ? (
            <CoinCardSkeleton count={12} />
          ) : viewMode === 'table' ? (
            <>
              <div className="market-table-wrapper glass-card">
                <table className="market-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('market_cap_rank')}># <SortIcon column="market_cap_rank" /></th>
                      <th>Coin</th>
                      <th onClick={() => handleSort('current_price')} className="text-right">Price <SortIcon column="current_price" /></th>
                      <th onClick={() => handleSort('price_change_percentage_24h')} className="text-right">24h <SortIcon column="price_change_percentage_24h" /></th>
                      <th onClick={() => handleSort('market_cap')} className="text-right hide-mobile">Market Cap <SortIcon column="market_cap" /></th>
                      <th onClick={() => handleSort('total_volume')} className="text-right hide-mobile">Volume <SortIcon column="total_volume" /></th>
                      <th className="hide-mobile">7 Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedCoins.map((coin, i) => {
                      const isUp = coin.price_change_percentage_24h >= 0;
                      return (
                        <motion.tr
                          key={coin.id}
                          onClick={() => navigate(`/coin/${coin.id}`)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.02 }}
                          whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                          className="market-table__row"
                        >
                          <td className="market-table__rank">{coin.market_cap_rank}</td>
                          <td>
                            <div className="market-table__coin">
                              <img src={coin.image} alt={coin.name} />
                              <div>
                                <span className="market-table__name">{coin.name}</span>
                                <span className="market-table__symbol">{coin.symbol?.toUpperCase()}</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-right market-table__price">{formatPrice(coin.current_price)}</td>
                          <td className={`text-right ${isUp ? 'text-green' : 'text-red'}`}>
                            <span className="market-table__change-cell">
                              {isUp ? <FaCaretUp /> : <FaCaretDown />}
                              {formatPercent(coin.price_change_percentage_24h)}
                            </span>
                          </td>
                          <td className="text-right hide-mobile">{formatMarketCap(coin.market_cap)}</td>
                          <td className="text-right hide-mobile">{formatMarketCap(coin.total_volume)}</td>
                          <td className="hide-mobile">
                            {coin.sparkline_in_7d?.price && (
                              <svg viewBox="0 0 80 24" className="market-table__spark" preserveAspectRatio="none">
                                {(() => {
                                  const prices = coin.sparkline_in_7d.price;
                                  const min = Math.min(...prices);
                                  const max = Math.max(...prices);
                                  const range = max - min || 1;
                                  const step = 80 / (prices.length - 1);
                                  const points = prices.map((p, idx) =>
                                    `${idx * step},${22 - ((p - min) / range) * 20}`
                                  ).join(' ');
                                  return (
                                    <polyline
                                      points={points}
                                      fill="none"
                                      stroke={isUp ? '#10b981' : '#ef4444'}
                                      strokeWidth="1.5"
                                    />
                                  );
                                })()}
                              </svg>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="market-pagination">
                <button
                  className="market-pagination__btn"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  ← Prev
                </button>
                <div className="market-pagination__pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '...' ? (
                        <span key={`dot-${i}`} className="market-pagination__dots">...</span>
                      ) : (
                        <button
                          key={p}
                          className={`market-pagination__page ${page === p ? 'active' : ''}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>
                <button
                  className="market-pagination__btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <div className="coins-grid">
              {pagedCoins.map((coin, i) => (
                <CoinCard key={coin.id} coin={coin} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}


