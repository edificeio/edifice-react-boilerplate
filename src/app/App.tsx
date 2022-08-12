import Header from "components/Header";

function App() {
  return (
    <div className="App">
      <div>
        <Header />
      </div>
      <h1>Vite + React</h1>
      <h2>Welcome </h2>
      <div className="card">
        <p>
          Edit<code>src/App.tsx</code> and save to test HMR
        </p>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  );
}

export default App;
