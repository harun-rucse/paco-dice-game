import { createContext, useContext, useState } from "react";

const BalanceContext = createContext();

function BalanceProvider({ children }) {
  const [showBalance, setShowBalance] = useState(false);
  const [currentBalance, setCurrentBalance] = useState({
    name: "BTC",
    value: "0.10189005",
    imgUrl: "/tokens/btc.png",
  });

  return (
    <BalanceContext.Provider
      value={{ showBalance, setShowBalance, currentBalance, setCurrentBalance }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined)
    throw new Error("BalanceContext was used outside of Balance Provider");

  return context;
}

export { BalanceProvider, useBalance };
