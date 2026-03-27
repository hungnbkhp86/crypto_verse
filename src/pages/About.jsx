import { motion } from 'framer-motion';
import { FaEnvelope, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import './About.css';

export default function About() {
  return (
    <div className="page-wrapper">
      <section className="simple-page">
        <div className="container">
          <motion.div
            className="simple-page__header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h1 className="simple-page__title">
              <FaInfoCircle /> About Us
            </h1>
            <p className="simple-page__subtitle">
              CryptoVerse helps you follow crypto markets and catch up on headlines — fast, clean,
              and in one place.
            </p>
          </motion.div>

          <div className="simple-page__content">
            <div className="info-card">
              <h2>Who we are</h2>
              <p>
                CryptoVerse is a frontend-focused product built around a simple idea: market data
                should be easy to scan, pleasant to read, and quick to navigate. We aim to reduce
                noise and help you focus on what matters.
              </p>
              <p className="muted">
                Note: CryptoVerse is not an exchange and does not provide financial or investment
                advice.
              </p>
            </div>

            <div className="info-card">
              <h2>What you can do on CryptoVerse</h2>
              <ul>
                <li>
                  <strong>Market</strong>: track top coins, market cap, volume, and price changes.
                </li>
                <li>
                  <strong>Coin details</strong>: dive into a coin page with charts and key metrics.
                </li>
                <li>
                  <strong>News</strong>: read curated headlines aggregated from public sources.
                </li>
                <li>
                  <strong>Search</strong>: quickly find coins directly from the header.
                </li>
              </ul>
            </div>

            <div className="info-card">
              <h2>
                <FaEnvelope /> Contact
              </h2>
              <p>
                Support / partnerships:{' '}
                <a href="mailto:sp.doublehshop@gmail.com">sp.doublehshop@gmail.com</a>
              </p>
              <p className="muted">
                If you report a bug, please include the page URL, time of occurrence, coin ID, and
                screenshots (if available).
              </p>
            </div>

            <div className="info-card">
              <h2>
                <FaShieldAlt /> Privacy
              </h2>
              <p>
                We’re transparent about data handling. For details, please read our{' '}
                <a href="/privacy">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
