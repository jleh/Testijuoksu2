import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import banner from "./banneri.jpg";
import { Menu } from "./components/Menu";
import Event from "./components/Event";
import { fetchEvents } from "./slices/eventSlice";
import { fetchRunners } from "./slices/runnerSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchRunners());
  }, [dispatch]);

  return (
    <>
      <h1>
        <img src={banner} alt="Alueen testijuoksu" className="max-w-4xl" />
      </h1>
      <Menu />
      <Routes>
        <Route path="event/:eventId" element={<Event />} />
      </Routes>
    </>
  );
}

export default App;
