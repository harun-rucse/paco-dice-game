import { createContext, useContext, useState } from "react";

const DarkModeContext = createContext();

const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    window.localStorage.getItem("theme") === null
      ? false
      : window.localStorage.getItem("theme") === "dark"
  );

  const toggleDarkMode = () => {
    window.localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    setIsDarkMode(!isDarkMode);
  };

  const setMode = (mode) => {
    window.localStorage.setItem("theme", mode);
    setIsDarkMode(mode === "dark");
  };

  const value = { isDarkMode, toggleDarkMode, setMode };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};

function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined)
    throw new Error("DarkModeContext was used outside of DarkMode Provider");

  return context;
}

export { DarkModeProvider, useDarkMode };
