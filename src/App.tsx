import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Error from "./pages/Error";
import About from "./pages/About";
import AddUser from "./pages/AddUser";
function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Error" element={<Error />} />

        </Routes>
        <Toaster />
      </Router>
    </>
  );
}

export default App;
