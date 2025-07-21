import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./pages/dashboard"
import Payment from './pages/payment';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path='/payments' element={<Payment />} />
      </Routes>
    </Router>
  )
}

export default App
