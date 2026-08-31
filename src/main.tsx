import { createRoot } from "react-dom/client";
import { App } from "./App";
import { AmbientMusicControl } from "./components/AmbientMusicControl";
import "./styles.css";

createRoot(document.getElementById("root")!).render(<>
  <App />
  <AmbientMusicControl />
</>);
