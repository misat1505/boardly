"use client";
import { refreshAccessToken } from "@/actions/user/refreshAccessToken";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";

type RefreshTokenContextProps = PropsWithChildren & {};

const RefreshTokenContext = createContext(undefined);

export const useRefreshTokenContext = () => {
  const context = useContext(RefreshTokenContext);
  if (context === undefined)
    throw new Error(
      "useRefreshTokenContext called outside RefreshTokenProvider."
    );
  return context;
};

const RefreshTokenProvider = ({ children }: RefreshTokenContextProps) => {
  useEffect(() => {
    refreshAccessToken();

    const interval = setInterval(refreshAccessToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <RefreshTokenContext.Provider value={undefined}>
      {children}
    </RefreshTokenContext.Provider>
  );
};

export default RefreshTokenProvider;
