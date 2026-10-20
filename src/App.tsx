import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const CaseRoute=lazy(()=>import("./pages/CaseRoute"));

const App = () => (
  <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cases/:id/" element={<Suspense fallback={<p role="status">Загружаю кейс…</p>}><CaseRoute/></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  </MotionConfig>
);

export default App;
