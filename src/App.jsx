import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
