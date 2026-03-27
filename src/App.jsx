import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import MarketTicker from './components/MarketTicker';
import Footer from './components/Footer';
import Home from './pages/Home';
import Market from './pages/Market';
import News from './pages/News';
import CoinDetail from './pages/CoinDetail';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <Header />
      <MarketTicker />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <AnimatedPage>
                <Home />
              </AnimatedPage>
            }
          />
          <Route
            path="/market"
            element={
              <AnimatedPage>
                <Market />
              </AnimatedPage>
            }
          />
          <Route
            path="/news"
            element={
              <AnimatedPage>
                <News />
              </AnimatedPage>
            }
          />
          <Route
            path="/coin/:id"
            element={
              <AnimatedPage>
                <CoinDetail />
              </AnimatedPage>
            }
          />

          <Route
            path="/about"
            element={
              <AnimatedPage>
                <About />
              </AnimatedPage>
            }
          />
          <Route
            path="/privacy"
            element={
              <AnimatedPage>
                <PrivacyPolicy />
              </AnimatedPage>
            }
          />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}
