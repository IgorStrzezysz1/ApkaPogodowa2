import { motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

const pageVariants = {
  initial: { opacity: 0, x: "-100vw" },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: "100vw" },
};

const PageWrapper = ({ children }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route
        path="/"
        element={
          <PageWrapper>
            <HomePage />
          </PageWrapper>
        }
      />
      <Route
        path="/about"
        element={
          <PageWrapper>
            <AboutPage />
          </PageWrapper>
        }
      />
    </Routes>
  </Router>
);

const HomePage = () => <div>Home Page</div>;
const AboutPage = () => <div>About Page</div>;

export default App;
