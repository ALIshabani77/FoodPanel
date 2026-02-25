import React from "react";
import { motion } from "framer-motion";

export default function FoodCard({ food, selected, onSelect }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark rounded-xl shadow-md overflow-hidden transition-all"
    >
      <div
        className="h-44 bg-cover bg-center"
        style={{ backgroundImage: `url(${food.img})` }}
      ></div>
      <div className="p-4 text-right">
        <h4 className="text-lg font-semibold mb-1">{food.name}</h4>
        <p className="text-sm text-text-light/80 mb-3">{food.desc}</p>

        {!selected ? (
          <button
            onClick={onSelect}
            className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/80 transition"
          >
            انتخاب
          </button>
        ) : (
          <div className="w-full py-2 bg-green-500 text-white rounded-lg font-medium">
            ✅ ثبت شد
          </div>
        )}
      </div>
    </motion.div>
  );
}
