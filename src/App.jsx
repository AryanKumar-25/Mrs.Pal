import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MobileApp from './pages/MobileApp';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MobileApp />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
