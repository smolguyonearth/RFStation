import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Map from "./pages/Map"
import Footer from "./components/Footer"
import Monitor from "./pages/Monitor"

export default function Root() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/monitor" element={<Monitor />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
