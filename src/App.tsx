import { Routes, Route } from "react-router-dom";
import PageIndex from "./pages/home/pageindex";
import PageProject from "./pages/project/pageproject";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PageIndex />} />
      <Route path="/project" element={<PageProject />} />
      <Route path="*" element={<div className="p-4">Page Not Found</div>} />
    </Routes>
  );
}