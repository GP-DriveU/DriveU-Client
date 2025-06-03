import Router from "./route/Router";
import Header from "./commons/layout/Header";
import Footer from "./commons/layout/Footer";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <BrowserRouter>
        <Header />
        <Router />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
