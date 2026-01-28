import { useState, useEffect } from "react";
  
function useSessionStorage(key, defaultValue) {
    const [values, setValues] = useState(() => {
        try {
        const saved = sessionStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
        } catch (err) {
        console.error("Error reading sessionStorage: ", err);
        return defaultValue;
        }
    });
    
    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(values));
    }, [key, values]);

    return [values, setValues];
}

export default useSessionStorage;