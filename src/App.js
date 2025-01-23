import logo from './logo.svg';
import './styling/App.css';
import { BrowserRouter } from 'react-router-dom';
import Routing from './components/Routes';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routing/>
      </div>
    </BrowserRouter>
  );
}

export default App;
