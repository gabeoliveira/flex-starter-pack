import { createContext } from "react";
import { useContext } from "react";

export const PluginContext = createContext();

export function usePlugins() {
    const context = useContext(PluginContext);
    console.log(context);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }

    return context;
};

