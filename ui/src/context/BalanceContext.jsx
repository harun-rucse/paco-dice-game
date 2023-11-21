import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "../features/authentication/useCurrentUser";

const BalanceContext = createContext();

function BalanceProvider({ children }) {
  const [showBalance, setShowBalance] = useState(false);
  const { user: account } = useCurrentUser();

  const [currentBalance, setCurrentBalance] = useState({});

  useEffect(() => {
    if (!account) return;
    // get the highest balance with name and value from the account object
    let maxBalance = -Infinity;
    let maxKey = "";
    let imgUrl = "";

    for (const key in account) {
      if (typeof account[key] === "number") {
        if (account[key] > maxBalance) {
          maxBalance = account[key];
          maxKey = key;
          imgUrl = `/tokens/${key}.png`;
        }
      }
    }

    // setCurrentBalance({ name: maxKey, value: maxBalance });
    setCurrentBalance((current) => {
      return {
        ...current,
        imgUrl,
        name: maxKey,
        value: maxBalance,
      };
    });
  }, [account]);

  useEffect(() => {
    if (account) {
      setCurrentBalance((current) => {
        return {
          ...current,
          value: account[current?.name?.toLowerCase()],
        };
      });
    }
  }, [account]);

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
