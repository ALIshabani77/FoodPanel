import React, { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-background-light/90 dark:bg-background-dark/90 sticky top-0 border-b border-border-light dark:border-border-dark backdrop-blur-md z-30">
      <div className="container mx-auto px-6 flex justify-between items-center h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full text-primary">
            <span className="material-symbols-outlined">corporate_fare</span>
          </div>
          <h1 className="text-lg font-bold">شرکت نوآفرین</h1>
        </div>

        <nav className="hidden md:flex gap-8 font-semibold text-base">
          <a href="#" className="text-primary">منو</a>
          <a href="#" className="hover:text-primary">خلاصه سفارش</a>
          <a href="#" className="hover:text-primary">بازخورد</a>
          <a href="#" className="hover:text-primary">سفارشات</a>
        </nav>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-md hover:bg-primary/10">
          <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border-light dark:border-border-dark">
          <nav className="flex flex-col p-3 text-right space-y-2 text-sm font-medium">
            <a href="#" className="py-2 px-3 rounded bg-primary/10 text-primary">منو</a>
            <a href="#" className="py-2 px-3 hover:bg-primary/5">خلاصه سفارش</a>
            <a href="#" className="py-2 px-3 hover:bg-primary/5">بازخورد</a>
            <a href="#" className="py-2 px-3 hover:bg-primary/5">سفارشات</a>
          </nav>
        </div>
      )}
    </header>
  );
}
