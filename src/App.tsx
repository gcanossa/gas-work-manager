import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.initialRoute) {
      navigate(window.initialRoute);
    }
  }, []);

  return (
    <div className="container box-border py-3">
      <Outlet />
    </div>
  );
}

export default App;
