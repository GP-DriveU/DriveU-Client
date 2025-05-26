import Router from "./route/Router";
import Header from "./commons/layout/Header";
import Footer from "./commons/layout/Footer";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Router />
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
