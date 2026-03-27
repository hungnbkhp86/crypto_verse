// CoinGecko Public API
const isDev = import.meta.env?.DEV;
const COINGECKO_BASE = isDev ? '/api/coingecko' : 'https://api.coingecko.com/api/v3';

// CryptoCompare
const CRYPTOCOMPARE_BASE = isDev ? '/api/cryptocompare' : 'https://min-api.cryptocompare.com/data/v2';

// ===== MARKET DATA (CoinGecko) =====

export async function fetchTopCoins(page = 1, perPage = 50) {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('fetchTopCoins error:', error);
    return [];
  }
}

export async function fetchCoinDetail(id) {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
    );
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch (error) {
    console.error('fetchCoinDetail error:', error);
    throw error;
  }
}

export async function fetchCoinChart(id, days = 7) {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    return data && Array.isArray(data.prices) ? data : { prices: [] };
  } catch (error) {
    console.error('fetchCoinChart error:', error);
    return { prices: [] };
  }
}

export async function fetchTrendingCoins() {
  try {
    const res = await fetch(`${COINGECKO_BASE}/search/trending`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data || !Array.isArray(data.coins)) return [];
    return data.coins.map(c => c.item) || [];
  } catch (error) {
    console.error('fetchTrendingCoins error:', error);
    return [];
  }
}

export async function fetchGlobalData() {
  try {
    const res = await fetch(`${COINGECKO_BASE}/global`);
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.data ? data.data : null;
  } catch (error) {
    console.error('fetchGlobalData error:', error);
    return null;
  }
}

export async function searchCoins(query) {
  try {
    const res = await fetch(`${COINGECKO_BASE}/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data && Array.isArray(data.coins) ? data.coins : [];
  } catch (error) {
    console.error('searchCoins error:', error);
    return [];
  }
}

// ===== NEWS (CoinTelegraph via RSS2JSON) =====

export async function fetchCryptoNews(categories = '', limit = 20) {
  try {
    const rssUrl = categories ? `https://cointelegraph.com/rss/tag/${categories.toLowerCase()}` : `https://cointelegraph.com/rss`;
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data || data.status !== 'ok' || !Array.isArray(data.items)) return [];
    
    return data.items.map((item, index) => ({
      id: item.guid || index,
      title: item.title,
      body: item.description?.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' '),
      url: item.link,
      imageurl: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&fit=crop',
      source: 'CoinTelegraph',
      published_on: new Date(item.pubDate).getTime() / 1000,
      categories: item.categories?.join('|') || 'Crypto'
    }));
  } catch (error) {
    console.error('fetchCryptoNews error:', error);
    return [];
  }
}

export async function fetchNewsCategories() {
  return [
    'Bitcoin', 'Ethereum', 'Altcoin', 'Blockchain', 'Business', 'Regulation'
  ];
}

// ===== HELPERS =====

export function formatPrice(price) {
  if (price == null) return 'N/A';
  if (price >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(price);
}

export function formatMarketCap(value) {
  if (value == null) return 'N/A';
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

export function formatPercent(value) {
  if (value == null) return 'N/A';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() / 1000) - timestamp);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
