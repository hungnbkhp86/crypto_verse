import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { FaArrowLeft, FaCaretUp, FaCaretDown, FaExternalLinkAlt, FaGlobe } from 'react-icons/fa';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { fetchCoinDetail, fetchCoinChart, formatPrice, formatPercent, formatMarketCap } from '../services/api';
import './CoinDetail.css';

const TIME_RANGES = [
  { label: '24h', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 },
];

export default function CoinDetail() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchCoinDetail(id),
      fetchCoinChart(id, timeRange),
    ])
      .then(([detail, chart]) => {
        setCoin(detail);
        const formatted = chart.prices.map(([timestamp, price]) => ({
          time: new Date(timestamp).toLocaleDateString('vi-VN', {
            month: 'short',
            day: 'numeric',
            ...(timeRange <= 1 ? { hour: '2-digit', minute: '2-digit' } : {}),
          }),
          price,
        }));
        setChartData(formatted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, timeRange]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container page-content">
          <div className="coin-detail-loading">
            <motion.div
              className="coin-detail-loading__spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p>Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="page-wrapper">
        <div className="container page-content">
          <p>Coin not found.</p>
          <Link to="/market">← Go back</Link>
        </div>
      </div>
    );
  }

  const priceChange24h = coin.market_data?.price_change_percentage_24h;
  const priceChange7d = coin.market_data?.price_change_percentage_7d;
  const priceChange30d = coin.market_data?.price_change_percentage_30d;
  const isUp = priceChange24h >= 0;
  const chartColor = isUp ? '#10b981' : '#ef4444';

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/market" className="coin-detail__back">
            <FaArrowLeft /> Back to Market
          </Link>

          {/* Header */}
          <div className="coin-detail__header">
            <div className="coin-detail__header-left">
              <motion.img
                src={coin.image?.large}
                alt={coin.name}
                className="coin-detail__logo"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              />
              <div>
                <div className="coin-detail__name-row">
                  <h1 className="coin-detail__name">{coin.name}</h1>
                  <span className="coin-detail__symbol">{coin.symbol?.toUpperCase()}</span>
                  {coin.market_cap_rank && (
                    <span className="coin-detail__rank">Rank #{coin.market_cap_rank}</span>
                  )}
                </div>
                <div className="coin-detail__price-row">
                  <span className="coin-detail__price">
                    {formatPrice(coin.market_data?.current_price?.usd)}
                  </span>
                  <span className={`coin-detail__change badge ${isUp ? 'badge-green' : 'badge-red'}`}>
                    {isUp ? <FaCaretUp /> : <FaCaretDown />}
                    {formatPercent(priceChange24h)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="coin-detail__chart glass-card">
            <div className="coin-detail__chart-header">
              <h3>Price Chart</h3>
              <div className="coin-detail__time-ranges">
                {TIME_RANGES.map((tr) => (
                  <button
                    key={tr.days}
                    className={`coin-detail__time-btn ${timeRange === tr.days ? 'active' : ''}`}
                    onClick={() => setTimeRange(tr.days)}
                  >
                    {tr.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="coin-detail__chart-wrapper">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    stroke="#6b6b8a"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="#6b6b8a"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(v) => formatPrice(v)}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(20, 20, 50, 0.95)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#e8e8ff',
                      fontSize: '0.85rem',
                    }}
                    formatter={(v) => [formatPrice(v), 'Price']}
                    labelStyle={{ color: '#9d9dbe', marginBottom: '4px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={chartColor}
                    strokeWidth={2}
                    fill="url(#chartGrad)"
                    dot={false}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="coin-detail__stats">
            <div className="coin-detail__stat glass-card">
              <span className="coin-detail__stat-label">Market Cap</span>
              <span className="coin-detail__stat-value">
                {formatMarketCap(coin.market_data?.market_cap?.usd)}
              </span>
            </div>
            <div className="coin-detail__stat glass-card">
              <span className="coin-detail__stat-label">Volume 24h</span>
              <span className="coin-detail__stat-value">
                {formatMarketCap(coin.market_data?.total_volume?.usd)}
              </span>
            </div>
            <div className="coin-detail__stat glass-card">
              <span className="coin-detail__stat-label">24h High</span>
              <span className="coin-detail__stat-value text-green">
                {formatPrice(coin.market_data?.high_24h?.usd)}
              </span>
            </div>
            <div className="coin-detail__stat glass-card">
              <span className="coin-detail__stat-label">24h Low</span>
              <span className="coin-detail__stat-value text-red">
                {formatPrice(coin.market_data?.low_24h?.usd)}
              </span>
            </div>
            <div className="coin-detail__stat glass-card">
              <span className="coin-detail__stat-label">ATH</span>
              <span className="coin-detail__stat-value">
                {formatPrice(coin.market_data?.ath?.usd)}
              </span>
            </div>
            <div className="coin-detail__stat glass-card">
              <span className="coin-detail__stat-label">ATL</span>
              <span className="coin-detail__stat-value">
                {formatPrice(coin.market_data?.atl?.usd)}
              </span>
            </div>
            <div className="coin-detail__stat glass-card">
              <span className="coin-detail__stat-label">Circulating Supply</span>
              <span className="coin-detail__stat-value">
                {coin.market_data?.circulating_supply
                  ? `${(coin.market_data.circulating_supply / 1e6).toFixed(2)}M`
                  : 'N/A'}
              </span>
            </div>
            <div className="coin-detail__stat glass-card">
              <span className="coin-detail__stat-label">Total Supply</span>
              <span className="coin-detail__stat-value">
                {coin.market_data?.total_supply
                  ? `${(coin.market_data.total_supply / 1e6).toFixed(2)}M`
                  : '∞'}
              </span>
            </div>
          </div>

          {/* Price Changes */}
          <div className="coin-detail__changes glass-card">
            <h3 className="coin-detail__changes-title">Price Changes</h3>
            <div className="coin-detail__changes-grid">
              {[
                { label: '24 hours', value: priceChange24h },
                { label: '7 days', value: priceChange7d },
                { label: '30 days', value: priceChange30d },
                { label: '1 year', value: coin.market_data?.price_change_percentage_1y },
              ].map((item) => (
                <div key={item.label} className="coin-detail__change-item">
                  <span className="coin-detail__change-label">{item.label}</span>
                  <span className={`coin-detail__change-value ${(item.value ?? 0) >= 0 ? 'text-green' : 'text-red'}`}>
                    {item.value != null ? (
                      <>
                        {item.value >= 0 ? <HiTrendingUp /> : <HiTrendingDown />}
                        {formatPercent(item.value)}
                      </>
                    ) : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {coin.description?.en && (
            <div className="coin-detail__description glass-card">
              <h3>About {coin.name}</h3>
              <div
                className="coin-detail__description-text"
                dangerouslySetInnerHTML={{
                  __html: coin.description.en.split('. ').slice(0, 5).join('. ') + '.',
                }}
              />
            </div>
          )}

          {/* Links */}
          {coin.links && (
            <div className="coin-detail__links">
              {coin.links.homepage?.[0] && (
                <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer" className="coin-detail__link glass-card">
                  <FaGlobe /> Website
                  <FaExternalLinkAlt className="coin-detail__link-ext" />
                </a>
              )}
              {coin.links.blockchain_site?.[0] && (
                <a href={coin.links.blockchain_site[0]} target="_blank" rel="noopener noreferrer" className="coin-detail__link glass-card">
                  🔗 Explorer
                  <FaExternalLinkAlt className="coin-detail__link-ext" />
                </a>
              )}
              {coin.links.subreddit_url && (
                <a href={coin.links.subreddit_url} target="_blank" rel="noopener noreferrer" className="coin-detail__link glass-card">
                  📱 Reddit
                  <FaExternalLinkAlt className="coin-detail__link-ext" />
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
