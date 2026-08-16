import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

function titleUntitledFrames() {
  document.querySelectorAll("iframe").forEach((frame) => {
    if (!frame.getAttribute("title")) {
      frame.setAttribute("title", "Embedded content");
    }
  });
}

titleUntitledFrames();
new MutationObserver(titleUntitledFrames).observe(document.documentElement, {
  childList: true,
  subtree: true,
});
