
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// export default function Navbar({ active = "" }) {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [hovered, setHovered] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
//   // 🌟 استیت برای نگهداری اطلاعات کاربر (برای اینکه قابل آپدیت باشد)
//   const [userInfo, setUserInfo] = useState({
//       name: "کاربر",
//       avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png"
//   });

//   const navigate = useNavigate();

//   // تابعی برای خواندن اطلاعات از LocalStorage
//   const loadUserData = () => {
//     try {
//         const userData = JSON.parse(localStorage.getItem("user") || "{}");
//         const fullName = userData.first_name 
//             ? `${userData.first_name} ${userData.last_name || ""}` 
//             : "کاربر";
        
//         // اگر عکس پروفایل در دیتابیس نبود، از عکس پیش‌فرض استفاده کن
//         const avatar = userData.avatar 
//             ? userData.avatar 
//             : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

//         setUserInfo({ name: fullName, avatar: avatar });
//     } catch (e) {
//         console.error("Error reading user data", e);
//     }
//   };

//   useEffect(() => {
//     // ۱. بارگذاری اولیه
//     loadUserData();

//     // ۲. گوش دادن به رویداد اسکرول برای افکت هدر
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);

//     // ۳. 📢 گوش دادن به رویداد تغییر پروفایل (از صفحه پروفایل)
//     window.addEventListener("userUpdated", loadUserData);

//     return () => {
//         window.removeEventListener("scroll", handleScroll);
//         window.removeEventListener("userUpdated", loadUserData);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <header
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       className={`fixed top-0 z-50 w-full transition-all duration-300 ${
//         isScrolled
//           ? "bg-[#e9dfd7]/95 shadow-md backdrop-blur-md"
//           : "bg-[#f3ebe5]"
//       }`}
//     >
//       <div className="flex justify-between items-center px-6 sm:px-12 py-4">
        
//         {/* سمت چپ (در RTL): لوگو */}
//         <div className="text-lg sm:text-xl font-semibold text-[#503a2f]">
//           🍴 شرکت نوآفرین
//         </div>

//         {/* منوی دسکتاپ (وسط) */}
//         <nav className="hidden md:flex gap-10 text-[#8b735a] font-medium text-base">
//           <Link
//             to="/menu"
//             className={`pb-1 transition ${
//               active === "menu"
//                 ? "text-[#c97b39] border-b-2 border-[#c97b39]"
//                 : "hover:text-[#c97b39]"
//             }`}
//           >
//             منو
//           </Link>
//           <Link
//             to="/summary"
//             className={`pb-1 transition ${
//               active === "summary"
//                 ? "text-[#c97b39] border-b-2 border-[#c97b39]"
//                 : "hover:text-[#c97b39]"
//             }`}
//           >
//             خلاصه سفارش ماهانه
//           </Link>
//           <Link
//             to="/feedback"
//             className={`pb-1 transition ${
//               active === "feedback"
//                 ? "text-[#c97b39] border-b-2 border-[#c97b39]"
//                 : "hover:text-[#c97b39]"
//             }`}
//           >
//             بازخورد
//           </Link>
//           <Link
//             to="/orders"
//             className={`pb-1 transition ${
//               active === "orders"
//                 ? "text-[#c97b39] border-b-2 border-[#c97b39]"
//                 : "hover:text-[#c97b39]"
//             }`}
//           >
//             سفارشات
//           </Link>
//         </nav>

//         {/* سمت راست (در RTL): عکس پروفایل و منوی موبایل */}
//         <div className="flex items-center gap-4">
//             {/* دکمه منوی موبایل */}
//             <button
//             className="md:hidden text-[#503a2f] text-2xl focus:outline-none"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//             {mobileMenuOpen ? "✕" : "☰"}
//             </button>

//             {/* ✅ عکس پروفایل لینک شده */}
//             <Link to="/profile" className="hidden md:block group relative" title="مشاهده پروفایل">
//                 <img
//                 src={userInfo.avatar}
//                 alt="profile"
//                 className="w-9 h-9 rounded-full border-2 border-[#c97b39] cursor-pointer hover:scale-105 transition object-cover bg-white"
//                 />
//             </Link>
//         </div>
//       </div>

//       {/* 🌈 نوار طلایی متحرک */}
//       <div
//         className={`h-1 bg-gradient-to-r from-[#c97b39] via-[#f5c77c] to-[#c97b39] transition-all duration-700 ${
//           hovered ? "animate-[slide_3s_linear_infinite]" : ""
//         }`}
//       />

//       {/* منوی موبایل بازشونده */}
//       {mobileMenuOpen && (
//         <div className="md:hidden bg-[#f3ebe5] border-t border-[#e0d7cc] flex flex-col text-[#8b735a] font-medium text-center py-4 space-y-4 shadow-lg">
          
//           {/* پروفایل در منوی موبایل */}
//           <div className="flex flex-col items-center gap-2 pb-2 border-b border-[#e0d7cc]/50">
//              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
//                 <img
//                   src={userInfo.avatar}
//                   alt="profile"
//                   className="w-16 h-16 rounded-full border-2 border-[#c97b39] object-cover bg-white"
//                 />
//              </Link>
//              <div className="text-sm text-[#503a2f] font-bold">{userInfo.name}</div>
//              <Link 
//                 to="/profile" 
//                 className="text-xs text-[#c97b39] hover:underline"
//                 onClick={() => setMobileMenuOpen(false)}
//              >
//                 ویرایش پروفایل
//              </Link>
//           </div>

//           <Link to="/menu" className={active === "menu" ? "text-[#c97b39]" : ""} onClick={() => setMobileMenuOpen(false)}>
//             منو
//           </Link>
//           <Link to="/summary" className={active === "summary" ? "text-[#c97b39]" : ""} onClick={() => setMobileMenuOpen(false)}>
//             خلاصه سفارش ماهانه
//           </Link>
//           <Link to="/feedback" className={active === "feedback" ? "text-[#c97b39]" : ""} onClick={() => setMobileMenuOpen(false)}>
//             بازخورد
//           </Link>
//           <Link to="/orders" className={active === "orders" ? "text-[#c97b39]" : ""} onClick={() => setMobileMenuOpen(false)}>
//             سفارشات
//           </Link>
          
//           <button onClick={handleLogout} className="text-red-500 font-bold mt-2">
//             خروج از حساب
//           </button>
//         </div>
//       )}

//       {/* استایل‌های انیمیشن */}
//       <style>
//         {`
//           @keyframes slide {
//             0% { background-position: 0% 50%; }
//             100% { background-position: 200% 50%; }
//           }
//           .animate-[slide_3s_linear_infinite] {
//             background-size: 200% 200%;
//             animation: slide 3s linear infinite;
//           }
//         `}
//       </style>
//     </header>
//   );
// }





///حالت داشبورد

// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AnimatePresence, motion } from "framer-motion";

// export default function Navbar({ active }) {
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.clear();
//     navigate("/login", { replace: true });
//   };

//   const Item = ({ to, label, name }) => (
//     <Link
//       to={to}
//       onClick={() => setOpen(false)}
//       className={`block px-4 py-3 rounded-xl text-sm font-medium
//         ${
//           active === name
//             ? "bg-[#c97b39] text-white"
//             : "hover:bg-[#f0e6dd]"
//         }`}
//     >
//       {label}
//     </Link>
//   );

//   return (
//     <>
//       {/* Top bar */}
//       <div className="fixed top-0 right-0 left-0 z-50 h-16 bg-white shadow flex items-center px-4">
//         <button onClick={() => setOpen(true)} className="text-2xl">
//           ☰
//         </button>
//         <h1 className="mx-auto font-bold text-[#503a2f]">
//           پنل غذا
//         </h1>
//       </div>

//       {/* Drawer */}
//       <AnimatePresence>
//         {open && (
//           <>
//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               className="fixed top-0 right-0 w-64 h-full bg-white z-50 shadow-lg p-4"
//             >
//               <div className="space-y-2 mt-8">
//                 <Item to="/menu" label="🍽 منو" name="menu" />
//                 <Item to="/summary" label="📊 خلاصه سفارش" name="summary" />
//                 <Item to="/orders" label="📅 سفارشات" name="orders" />
//                 <Item to="/feedback" label="💬 بازخورد" name="feedback" />
//                 <Item to="/profile" label="👤 پروفایل" name="profile" />

//                 <button
//                   onClick={logout}
//                   className="w-full mt-6 bg-red-100 text-red-600 py-2 rounded-xl"
//                 >
//                   خروج
//                 </button>
//               </div>
//             </motion.div>

//             <div
//               onClick={() => setOpen(false)}
//               className="fixed inset-0 bg-black/30 z-40"
//             />
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }


//خفن


// // src/components/Navbar.jsx
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AnimatePresence, motion } from "framer-motion";

// export default function Navbar({ active = "" }) {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [hovered, setHovered] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const navigate = useNavigate();
//   const [userInfo, setUserInfo] = useState({
//     name: "کاربر",
//     avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
//   });

//   const loadUserData = () => {
//     try {
//       const userData = JSON.parse(localStorage.getItem("user") || "{}");
//       const fullName = userData.first_name
//         ? `${userData.first_name} ${userData.last_name || ""}`
//         : "کاربر";
//       const avatar = userData.avatar
//         ? userData.avatar
//         : "https://cdn-icons-png.flaticon.com/512/847/847969.png";
//       setUserInfo({ name: fullName, avatar });
//     } catch (e) {
//       console.error("Error reading user data", e);
//     }
//   };

//   useEffect(() => {
//     loadUserData();
//     window.addEventListener("scroll", () => setIsScrolled(window.scrollY > 20));
//     window.addEventListener("userUpdated", loadUserData);

//     return () => {
//       window.removeEventListener("scroll", () => setIsScrolled(window.scrollY > 20));
//       window.removeEventListener("userUpdated", loadUserData);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const menuItems = [
//     { label: "منو", to: "/menu", name: "menu" },
//     { label: "خلاصه سفارش ماهانه", to: "/summary", name: "summary" },
//     { label: "بازخورد", to: "/feedback", name: "feedback" },
//     { label: "سفارشات", to: "/orders", name: "orders" },
//   ];

//   return (
//     <header
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       className={`fixed top-0 z-50 w-full transition-all duration-300 ${
//         isScrolled
//           ? "bg-[#e9dfd7]/95 shadow-md backdrop-blur-md"
//           : "bg-[#f3ebe5]"
//       }`}
//     >
//       <div className="flex justify-between items-center px-6 sm:px-12 py-4">
//         {/* لوگو */}
//         <div className="text-lg sm:text-xl font-semibold text-[#503a2f]">🍴 شرکت نوآفرین</div>

//         {/* منوی دسکتاپ */}
//         <nav className="hidden md:flex gap-10 text-[#8b735a] font-medium text-base">
//           {menuItems.map((item) => (
//             <Link
//               key={item.name}
//               to={item.to}
//               className={`pb-1 transition ${
//                 active === item.name
//                   ? "text-[#c97b39] border-b-2 border-[#c97b39]"
//                   : "hover:text-[#c97b39]"
//               }`}
//             >
//               {item.label}
//             </Link>
//           ))}
//         </nav>

//         {/* سمت راست */}
//         <div className="flex items-center gap-4">
//           <button
//             className="md:hidden text-[#503a2f] text-2xl focus:outline-none"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             {mobileMenuOpen ? "✕" : "☰"}
//           </button>

//           <Link to="/profile" className="hidden md:block group relative" title="مشاهده پروفایل">
//             <img
//               src={userInfo.avatar}
//               alt="profile"
//               className="w-9 h-9 rounded-full border-2 border-[#c97b39] cursor-pointer hover:scale-105 transition object-cover bg-white"
//             />
//           </Link>
//         </div>
//       </div>

//       {/* نوار طلایی متحرک */}
//       <div
//         className={`h-1 bg-gradient-to-r from-[#c97b39] via-[#f5c77c] to-[#c97b39] transition-all duration-700 ${
//           hovered ? "animate-[slide_3s_linear_infinite]" : ""
//         }`}
//       />

//       {/* منوی موبایل */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <>
//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               className="fixed top-0 right-0 w-64 h-full bg-[#f3ebe5] z-50 shadow-lg flex flex-col p-4 space-y-4"
//             >
//               {/* پروفایل */}
//               <div className="flex flex-col items-center gap-2 pb-2 border-b border-[#e0d7cc]/50">
//                 <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
//                   <img
//                     src={userInfo.avatar}
//                     alt="profile"
//                     className="w-16 h-16 rounded-full border-2 border-[#c97b39] object-cover bg-white"
//                   />
//                 </Link>
//                 <div className="text-sm text-[#503a2f] font-bold">{userInfo.name}</div>
//                 <Link
//                   to="/profile"
//                   className="text-xs text-[#c97b39] hover:underline"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   ویرایش پروفایل
//                 </Link>
//               </div>

//               {menuItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.to}
//                   className={`px-4 py-3 rounded-xl text-sm font-medium ${
//                     active === item.name ? "bg-[#c97b39] text-white" : "hover:bg-[#f0e6dd]"
//                   }`}
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   {item.label}
//                 </Link>
//               ))}

//               <button
//                 onClick={handleLogout}
//                 className="w-full mt-4 bg-red-100 text-red-600 py-2 rounded-xl font-bold"
//               >
//                 خروج از حساب
//               </button>
//             </motion.div>

//             {/* بک‌گراند تار */}
//             <div
//               onClick={() => setMobileMenuOpen(false)}
//               className="fixed inset-0 bg-black/30 z-40"
//             />
//           </>
//         )}
//       </AnimatePresence>

//       {/* استایل انیمیشن */}
//       <style>
//         {`
//           @keyframes slide {
//             0% { background-position: 0% 50%; }
//             100% { background-position: 200% 50%; }
//           }
//           .animate-[slide_3s_linear_infinite] {
//             background-size: 200% 200%;
//             animation: slide 3s linear infinite;
//           }
//         `}
//       </style>
//     </header>
//   );
// }












import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar({ active = "" }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  // ================= USER STATE =================
  const [userData, setUserData] = useState({});
  const isKitchen = userData?.is_staff === true;

  const [userInfo, setUserInfo] = useState({
    name: "کاربر",
    avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
  });

  const loadUserData = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserData(user);

    setUserInfo({
      name: user.first_name
        ? `${user.first_name} ${user.last_name || ""}`
        : "کاربر",
      avatar:
        user.avatar ||
        "https://cdn-icons-png.flaticon.com/512/847/847969.png",
    });
  };

  useEffect(() => {
    loadUserData();
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("userUpdated", loadUserData);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("userUpdated", loadUserData);
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  // ================= MENU ITEMS =================
  const menuItems = [
    { label: "منو", to: "/menu", name: "menu", icon: "🍽" },
    { label: "خلاصه سفارش ماهانه", to: "/summary", name: "summary", icon: "📊" },
    { label: "بازخورد", to: "/feedback", name: "feedback", icon: "💬" },

    ...(isKitchen
      ? [{ label: "سفارشات", to: "/orders", name: "orders", icon: "📅" }]
      : []),

    { label: "پروفایل", to: "/profile", name: "profile", icon: "👤" },
  ];

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`fixed top-0 z-50 w-full transition-all duration-300
          ${
            isScrolled
              ? "bg-[#e9dfd7]/95 shadow-md backdrop-blur-md"
              : "bg-[#f3ebe5]"
          }
        `}
      >
        <div className="flex justify-between items-center px-6 sm:px-12 py-4">
          <div className="text-lg sm:text-xl font-semibold text-[#503a2f]">
            🍴 شرکت نوآفرین
          </div>

          {/* ===== DESKTOP MENU ===== */}
          <nav className="hidden md:flex gap-10 text-[#8b735a] font-medium text-base">
            {menuItems
              .filter((i) => i.name !== "profile")
              .map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`pb-1 transition-all
                    ${
                      active === item.name
                        ? "text-[#c97b39] border-b-2 border-[#c97b39]"
                        : "hover:text-[#c97b39]"
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-2xl text-[#503a2f]"
              onClick={() => setMobileMenuOpen(true)}
            >
              ☰
            </button>

            <Link to="/profile" className="hidden md:block">
              <img
                src={userInfo.avatar}
                alt="profile"
                className="w-9 h-9 rounded-full border-2 border-[#c97b39] object-cover bg-white hover:scale-105 transition"
              />
            </Link>
          </div>
        </div>

        {/* ===== GOLD BAR ===== */}
        <div
          className={`h-1 bg-gradient-to-r from-[#c97b39] via-[#f5c77c] to-[#c97b39]
            ${hovered ? "animate-[slide_3s_linear_infinite]" : ""}
          `}
        />
      </header>

      {/* ================= MOBILE MENU (LIKE CODE 2) ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25 }}
              className="fixed top-0 right-0 w-64 h-full bg-[#f3ebe5] z-50 shadow-xl p-4"
            >
              {/* USER CARD */}
              <div className="flex flex-col items-center gap-2 pb-4 border-b border-[#e0d7cc]/50">
                <img
                  src={userInfo.avatar}
                  className="w-16 h-16 rounded-full border-2 border-[#c97b39] object-cover bg-white"
                />
                <p className="text-sm font-bold text-[#503a2f]">
                  {userInfo.name}
                </p>
              </div>

              {/* MENU */}
              <div className="space-y-2 mt-6">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${
                        active === item.name
                          ? "bg-[#c97b39] text-white shadow"
                          : "text-[#503a2f] hover:bg-[#faf5f0]"
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}

                <button
                  onClick={logout}
                  className="w-full mt-4 bg-red-100 text-red-600 py-2 rounded-xl font-bold"
                >
                  خروج از حساب
                </button>
              </div>
            </motion.div>

            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/30 z-40"
            />
          </>
        )}
      </AnimatePresence>

      {/* ================= ANIMATION ================= */}
      <style>
        {`
          @keyframes slide {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
          .animate-[slide_3s_linear_infinite] {
            background-size: 200% 200%;
            animation: slide 3s linear infinite;
          }
        `}
      </style>
    </>
  );
}

























































