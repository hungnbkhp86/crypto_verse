import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaClock } from 'react-icons/fa';
import { timeAgo } from '../services/api';
import './NewsCard.css';

export default function NewsCard({ article, index }) {
  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="news-card glass-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(139, 92, 246, 0.2)' }}
    >
      <div className="news-card__image-wrapper">
        <img
          src={article.imageurl}
          alt={article.title}
          className="news-card__image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop';
          }}
        />
        <div className="news-card__image-overlay" />
        <span className="news-card__source">{article.source_info?.name || article.source}</span>
      </div>

      <div className="news-card__content">
        <div className="news-card__categories">
          {article.categories?.split('|').slice(0, 3).map((cat) => (
            <span key={cat} className="news-card__category">{cat}</span>
          ))}
        </div>
        <h3 className="news-card__title">{article.title}</h3>
        <p className="news-card__body">{article.body?.slice(0, 120)}...</p>
        <div className="news-card__footer">
          <span className="news-card__time">
            <FaClock /> {timeAgo(article.published_on)}
          </span>
          <span className="news-card__link">
            Read more <FaExternalLinkAlt />
          </span>
        </div>
      </div>
    </motion.a>
  );
}
