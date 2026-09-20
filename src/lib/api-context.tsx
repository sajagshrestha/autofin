import { createContext, useContext } from "react";
import { rpc } from "./api-client";

// Production is the default; a demo supplies an entirely local transport.
export const ApiClientContext = createContext(rpc);
export const useApiClient = () => useContext(ApiClientContext);
