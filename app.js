import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExploreEvents from "./app/pages/explore-events";
import CreateEvent from "./links-pages/CreateEvent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/explore-events" element={<ExploreEvents />} />
        <Route path="/create-event" element={<CreateEvent />} />
      </Routes>
    </Router>
  );
}

export default App;
