import './assets/css/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/required/Header';
import Footer from './components/required/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/" element={<LoginPage/>} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>

  );
}
