import React, { useContext, useState, useEffect } from "react";
import { ThemeLangContext } from "../../ThemeLangContext";
import { useTranslation } from "react-i18next";

function Settings() {
  const { theme, setTheme, language, setLanguage } =
    useContext(ThemeLangContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState("public");

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("notificationsEnabled", notificationsEnabled);
    localStorage.setItem("emailUpdates", emailUpdates);
    localStorage.setItem("profileVisibility", profileVisibility);
    alert("Settings saved to browser!");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <h4 className="mb-4 text-center">{t("settings")}</h4>
        <form onSubmit={handleSave}>
          {/* Theme */}
          <div className="mb-3">
            <label>{t("themeMode")}</label>
            <div>
              <label className="me-3">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === "light"}
                  onChange={(e) => setTheme(e.target.value)}
                />
                Light
              </label>
              <label>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === "dark"}
                  onChange={(e) => setTheme(e.target.value)}
                />
                Dark
              </label>
            </div>
          </div>

          {/* Language */}
          <div className="mb-3">
            <label>{t("language")}</label>
            <select
              className="form-select w-50"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="bn">বাংলা</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="mb-3">
            <label>{t("notifications")}</label>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label>{t("emailUpdates")}</label>
            <input
              type="checkbox"
              checked={emailUpdates}
              onChange={() => setEmailUpdates(!emailUpdates)}
            />
          </div>

          {/* Visibility */}
          <div className="mb-3">
            <label>{t("profileVisibility")}</label>
            <select
              className="form-select w-50"
              value={profileVisibility}
              onChange={(e) => setProfileVisibility(e.target.value)}
            >
              <option value="public">{t("public")}</option>
              <option value="private">{t("private")}</option>
              <option value="friends">{t("friendsOnly")}</option>
            </select>
          </div>

          <button className="btn btn-primary">{t("save")}</button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
