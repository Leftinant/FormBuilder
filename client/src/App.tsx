import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FormPreview from "./components/FormPreview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/preview/:id' element={<FormPreview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
