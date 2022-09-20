import Header from "components/Header";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation(["translations"]);

  function handleChangeLanguage(lng: string) {
    i18n.changeLanguage(lng);
  }

  console.log(i18n);

  return (
    <div className="App">
      <div>
        <Header />
      </div>
      <h1>Vite + React</h1>
      <h2>{t("welcome.react", { ns: "translations" })}</h2>
      <div className="card">
        <p>
          Edit<code>src/App.tsx</code> and save to test HMR
        </p>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
      <div className="card">
        <p>Change language:</p>
        <button type="button" onClick={() => handleChangeLanguage("fr")}>
          fr
        </button>
        <button type="button" onClick={() => handleChangeLanguage("en")}>
          en
        </button>
      </div>
    </div>
  );
}

export default App;
