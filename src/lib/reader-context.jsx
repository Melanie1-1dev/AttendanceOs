import React, { createContext, useContext, useEffect, useState } from "react";

const ReaderContext = createContext(null);

const STORAGE_KEY = "rfid.reader.status";

export function ReaderProvider({ children }) {
  const [status, setStatus] = useState(() => {
    if (typeof window === "undefined") return "online";
    return window.localStorage.getItem(STORAGE_KEY) || "online";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, status);
  }, [status]);

  const value = {
    status,
    isOnline: status === "online",
    readerName: "READER-01 · USB-HID",
    setStatus,
    goOnline: () => setStatus("online"),
    goOffline: () => setStatus("offline"),
    toggle: () => setStatus((prev) => (prev === "online" ? "offline" : "online")),
  };

  return <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>;
}

export function useReader() {
  const ctx = useContext(ReaderContext);
  if (!ctx) throw new Error("useReader must be used within ReaderProvider");
  return ctx;
}