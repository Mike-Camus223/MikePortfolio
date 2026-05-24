import { useEffect, useState } from "react";

export function useArgentinaDateTime() {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    const updateDateTime = () => {
        const now = new Date();

        const argentinaTime = now.toLocaleTimeString("es-AR", {
            timeZone: "America/Argentina/Buenos_Aires",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        const argentinaDate = now.toLocaleDateString("en-US", {
            timeZone: "America/Argentina/Buenos_Aires",
            weekday: "long",
            day: "numeric",
            month: "long",
        });

        setTime(argentinaTime);
        setDate(argentinaDate);
    };

    useEffect(() => {
        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    return {
        time,
        date,
        updateDateTime, // disponible para llamarla manualmente si querés
    };
}