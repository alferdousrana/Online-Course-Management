import Main from './components/Main';
import './i18n';
import { ThemeLangProvider } from "./ThemeLangContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const lang = localStorage.getItem("language") || "en";
    i18n.changeLanguage(lang);
  }, [i18n]);

  return (
    <ThemeLangProvider>
      <Main />
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeLangProvider>
  );
}

export default App;
