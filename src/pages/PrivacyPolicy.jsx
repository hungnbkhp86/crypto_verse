import { motion } from 'framer-motion';
import { FaUserShield } from 'react-icons/fa';
import './PrivacyPolicy.css';

export default function PrivacyPolicy() {
  const updatedAt = '2026-03-27';

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
              <FaUserShield /> Privacy Policy
            </h1>
            <p className="simple-page__subtitle">Last updated: {updatedAt}</p>
          </motion.div>

          <div className="simple-page__content">
            <div className="policy-card">
              <h2>Overview</h2>
              <p>
                CryptoVerse is a frontend application that displays public cryptocurrency market
                data and news. This policy explains what information may be processed when you use
                the website.
              </p>
            </div>

            <div className="policy-card">
              <h2>Information we collect</h2>
              <ul>
                <li>
                  <strong>Limited technical data:</strong> depending on your hosting and logging
                  configuration, basic technical information may be recorded (for example: IP
                  address, browser type, device type, and pages visited).
                </li>
                <li>
                  <strong>No account data:</strong> we do not provide user accounts and we do not
                  request passwords.
                </li>
                <li>
                  <strong>No payment data:</strong> we do not process payments or store billing
                  information.
                </li>
              </ul>
            </div>

            <div className="policy-card">
              <h2>Third-party services</h2>
              <p>
                The app fetches prices and news from third-party APIs (for example CoinGecko and
                RSS providers). When your browser requests these resources, certain information
                (such as IP address and user-agent) may be visible to those providers.
              </p>
              <p className="muted">
                Please review the privacy policies of those providers for details on how they
                handle data.
              </p>
            </div>

            <div className="policy-card">
              <h2>Cookies</h2>
              <p>
                CryptoVerse itself does not set advertising cookies. However, third-party services
                or your hosting platform may use cookies or similar technologies for basic
                functionality, analytics, or security.
              </p>
            </div>

            <div className="policy-card">
              <h2>Data retention</h2>
              <p>
                If server logs are enabled by your hosting provider, data retention depends on the
                hosting configuration. We aim to keep only what’s necessary for security and
                troubleshooting.
              </p>
            </div>

            <div className="policy-card">
              <h2>Your choices</h2>
              <ul>
                <li>You can stop using the site at any time.</li>
                <li>
                  You can use browser settings to restrict cookies, depending on your preferences.
                </li>
              </ul>
            </div>

            <div className="policy-card">
              <h2>Contact</h2>
              <p>
                If you have privacy questions, email{' '}
                <a href="mailto:sp.doublehshop@gmail.com">sp.doublehshop@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
