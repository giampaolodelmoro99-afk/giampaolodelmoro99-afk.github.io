import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import { Suspense, lazy } from "react";
import Loading from "./components/Loading";

const Home = lazy(() => import("./pages/Home"))
const Profilo = lazy(() => import("./pages/Profilo"))
const Stack = lazy(() => import("./pages/Stack"))
const Progetti = lazy(() => import("./pages/Progetti"))
const Contatti = lazy(() => import("./pages/Contatti"))
const NotFound = lazy(() => import("./pages/NotFound"))

function App() {
  return (
    <Suspense fallback={<Loading/>}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home/>}/>
          <Route path="/profilo" element={<Profilo />} />
          <Route path="/stack" element={<Stack />} />
          <Route path="/progetti" element={<Progetti />} />
          <Route path="/contatti" element={<Contatti />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;