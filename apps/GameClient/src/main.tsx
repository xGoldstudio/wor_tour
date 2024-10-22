import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { gsap } from "gsap";

import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setDataServerUrl } from "@repo/lib";

gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger);
// for images retrieval
setDataServerUrl(__DATA_SERVER_URL__);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>,
);

document.body.style.touchAction = "none";