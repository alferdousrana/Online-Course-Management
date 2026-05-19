// ThemeLangContext.js
import React, { createContext, useEffect, useState } from "react";

export const ThemeLangContext = createContext();

export const ThemeLangProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", theme); // Add class or attribute
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <ThemeLangContext.Provider
      value={{ theme, setTheme, language, setLanguage }}
    >
      {children}
    </ThemeLangContext.Provider>
  );
};
