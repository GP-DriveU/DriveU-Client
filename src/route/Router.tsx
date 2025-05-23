import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../services/home/HomePage";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
