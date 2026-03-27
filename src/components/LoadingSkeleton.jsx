import { motion } from 'framer-motion';
import './LoadingSkeleton.css';

export function CoinCardSkeleton({ count = 8 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="skeleton-card glass-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="skeleton-card__header">
            <div className="skeleton skeleton-badge" />
            <div className="skeleton skeleton-badge" />
          </div>
          <div className="skeleton-card__info">
            <div className="skeleton skeleton-circle" />
            <div>
              <div className="skeleton skeleton-text-md" />
              <div className="skeleton skeleton-text-sm" />
            </div>
          </div>
          <div className="skeleton skeleton-text-lg" />
          <div className="skeleton skeleton-chart" />
          <div className="skeleton-card__footer">
            <div className="skeleton skeleton-text-md" />
            <div className="skeleton skeleton-text-md" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function NewsCardSkeleton({ count = 6 }) {
  return (
    <div className="skeleton-news-grid">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="skeleton-news glass-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="skeleton skeleton-news-img" />
          <div className="skeleton-news__content">
            <div className="skeleton skeleton-text-sm" />
            <div className="skeleton skeleton-text-lg" />
            <div className="skeleton skeleton-text-md" />
            <div className="skeleton skeleton-text-md" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
