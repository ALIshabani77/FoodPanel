import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ show, message, type = "success" }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={message}
          initial={{ opacity: 0, x: 50, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 50, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`fixed top-20 right-8 z-[9999] px-6 py-3 rounded-xl shadow-lg text-white font-semibold text-sm sm:text-base backdrop-blur-md ${
            type === "success"
              ? "bg-green-600/90"
              : "bg-red-600/90"
          }`}
          style={{
            boxShadow:
              type === "success"
                ? "0 6px 20px rgba(34,197,94,0.4)"
                : "0 6px 20px rgba(239,68,68,0.4)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {type === "success" ? "" : "❌"}
            </span>
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
