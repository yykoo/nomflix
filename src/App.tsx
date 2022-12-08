import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Tv from './routes/Tv';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={< Home />} />
        <Route path="/tv" element={< Tv />} />
        <Route path="/search" element={< Search />} />
      </Routes>
    </BrowserRouter>);
}

export default App;
