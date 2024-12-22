import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpacesPage from "./pages/SpacesPage.js";
import AllQuestsPage from "./pages/AllQuestsPage.jsx";
import QuestPage from "./pages/QuestPage.jsx";
import { SpaceProvider } from "./context/SpaceContext.js";

const App = () => {
  return (
    <SpaceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SpacesPage />} />
          <Route path="/quests/:spaceId" element={<AllQuestsPage />} />
          <Route path="/quests/:spaceId/:questId" element={<QuestPage />} />
        </Routes>
      </Router>
    </SpaceProvider>
  );
};

export default App;
