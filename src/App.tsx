import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home/Home';
import { Engine } from './pages/engine/Engine';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home - rota raiz */}
        <Route path="/" element={<Home />} />

        {/* Engine - cena 3D */}
        <Route path="/engine" element={<Engine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
