
"use client";

import { useEffect, useState } from "react";

export default function BDDate() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const formattedDate = new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date());

      setDate(formattedDate);
    };

    updateDate();

    // প্রতি মিনিটে তারিখ আপডেট পরীক্ষা করবে
    const interval = setInterval(updateDate, 60000);

    return () => clearInterval(interval);
  }, []);

  return <span>{date || "তারিখ লোড হচ্ছে..."}</span>;
}
