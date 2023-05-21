import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat/Chat";

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
          
        </Routes>
      </BrowserRouter>
    </>
  );
};
