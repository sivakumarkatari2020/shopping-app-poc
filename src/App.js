import './App.css';
import {Route,Routes,Navigate} from 'react-router-dom'
import Home from './components/Home';
import ProductDetails from './components/ProductDetails';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigate replace to="/home" />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/product/:id" element={<ProductDetails />}></Route>
      </Routes>
    </div>
  );
}

export default App;
