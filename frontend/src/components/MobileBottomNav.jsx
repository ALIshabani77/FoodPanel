import { NavLink } from "react-router-dom";

export default function MobileBottomNav() {
  const navItems = [
    { to: "/menu", label: "منو", icon: "restaurant_menu" },
    { to: "/feedback", label: "بازخورد", icon: "rate_review" },
    { to: "/profile", label: "پروفایل", icon: "person" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs transition-colors ${
                isActive ? "text-[#c97b39]" : "text-gray-400"
              }`
            }
          >
            <span className="material-symbols-outlined text-2xl mb-1">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
