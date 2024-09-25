import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './register';
import Todo from './todo';

function App() {
return(
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path='/todo' element={<Todo />} />
  </Routes>
  </BrowserRouter>
)
}

export default App;
