import "./App.css";
import { RouterProvider } from "react-router-dom";
import { AppRouter } from "./App.routes";
import { Navigation } from "./navigation/navigation";

function App() {
  return (
    <div className="flex flex-col w-full">
      <Navigation />
      <RouterProvider router={AppRouter} />
    </div>
  );
}

export default App;
