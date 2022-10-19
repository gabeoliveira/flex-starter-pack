import { createContext } from "react";
import { useContext } from "react";

export const FormContext = createContext();

export function useForm() {
    const context = useContext(FormContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }

    return context;
};