import { useState, useEffect } from "react";

const motivationalQuotes = [
  "Crush it, champ! 💪",
  "You're killing it! 🔥",
  "Keep pushing, beast! 🚀",
  "Stronger every day! ⚡",
  "You're a fitness legend! 🏆",
  "Push your limits! 💥",
  "Beast mode activated! 🦁",
  "Sweat is just weakness leaving! 💦",
  "Champions are made here! 👑",
  "Your only limit is you! 🌟"
];

const MotivationalQuote = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="brutal-card p-6 text-center bg-gradient-to-r from-fitness-green to-fitness-green-dark text-white">
      <p className="text-lg font-semibold">{quote}</p>
    </div>
  );
};

export default MotivationalQuote;