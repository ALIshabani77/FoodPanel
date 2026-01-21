
// import React, { useState, useEffect } from "react";

// import moment from "moment-jalaali";

// import { motion, AnimatePresence } from "framer-motion";

// import axios from "axios";

// import "@fontsource/vazir";



// import Navbar from "../components/Navbar";

// import Toast from "../components/Toast";



// moment.loadPersian({ dialect: "persian-modern" });



// const API_BASE = process.env.REACT_APP_API_BASE;



// export default function MenuPage() {

//   const today = moment();

//   const [currentMonth, setCurrentMonth] = useState(moment());

//   const [selectedDate, setSelectedDate] = useState(

//     today.format("jYYYY-jMM-jDD")

//   );



//   const [menus, setMenus] = useState([]);

//   const [foodsForDay, setFoodsForDay] = useState([]);

//   const [menuId, setMenuId] = useState(null);



//   const [selectedDays, setSelectedDays] = useState([]);

//   const [limitMessage, setLimitMessage] = useState("");



//   const [showToast, setShowToast] = useState(false);

//   const [toastMessage, setToastMessage] = useState("");

//   const [toastType, setToastType] = useState("success");



//   const showNotification = (message, type = "success") => {

//     setToastMessage(message);

//     setToastType(type);

//     setShowToast(true);

//     setTimeout(() => setShowToast(false), 2500);

//   };



//   // ------------------ دریافت منو ------------------

//   useEffect(() => {

//     const fetchMenus = async () => {

//       try {

//         const res = await axios.get(`${API_BASE}/menu/`);

//         setMenus(res.data);

//       } catch (err) {

//         showNotification("❌ خطا در دریافت منو", "error");

//       }

//     };

//     fetchMenus();

//   }, []);



//   // ------------------ دریافت انتخاب‌های قبلی ------------------

//   useEffect(() => {

//     const fetchSelections = async () => {

//       const token = localStorage.getItem("access");

//       if (!token) return;



//       try {

//         const res = await axios.get(`${API_BASE}/user-selections/`, {

//           headers: { Authorization: `Bearer ${token}` },

//         });



//         const dated = res.data.map((sel) =>

//           moment(sel.menu.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD")

//         );



//         setSelectedDays(dated);

//       } catch (err) {

//         showNotification("❌ خطا در دریافت انتخاب‌ها", "error");

//       }

//     };



//     fetchSelections();

//   }, []);



//   // ------------------ تنظیم غذاها ------------------

//   useEffect(() => {

//     const converted = menus.map((m) => ({

//       ...m,

//       jDate: moment(m.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD"),

//     }));



//     const menu = converted.find((m) => m.jDate === selectedDate);

//     setFoodsForDay(menu ? menu.foods : []);

//     setMenuId(menu ? menu.id : null);

//   }, [selectedDate, menus]);



//   // ------------------ محدودیت ۲۴ ساعت ------------------

//   const checkLimit = (gregorianDate) => {

//     const now = moment();

//     const target = moment(gregorianDate, "YYYY-MM-DD");

//     const hoursDiff = target.diff(now, "hours");



//     if (hoursDiff <= 0) {

//       return { allowed: false, msg: "⛔ این روز گذشته است." };

//     }



//     if (hoursDiff < 24) {

//       return { allowed: false, msg: "⛔ مهلت انتخاب برای این روز تمام شده است." };

//     }



//     return { allowed: true, msg: "" };

//   };



//   // ------------------ ثبت غذا (با قابلیت پرش به روز بعد) ------------------

//   const saveSelection = async (menuId, foodId, foodName) => {

//     if (limitMessage) {

//         showNotification(limitMessage, "error");

//         return;

//     }



//     const token = localStorage.getItem("access");

//     if (!token) {

//       showNotification("ابتدا باید وارد شوید.", "error");

//       return;

//     }



//     try {

//       const res = await axios.post(

//         `${API_BASE}/menu/select/`,

//         { menu: menuId, food: foodId },

//         {

//           headers: {

//             Authorization: `Bearer ${token}`,

//             "Content-Type": "application/json",

//           },

//         }

//       );



//       if (res.status === 200) {

//         showNotification(`🍽 ${foodName} با موفقیت ثبت شد`, "success");

        

//         // 1. آپدیت کردن تیک سبز برای روز جاری

//         if (!selectedDays.includes(selectedDate)) {

//           setSelectedDays((prev) => [...prev, selectedDate]);

//         }



//         // 🚀 منطق پرش خودکار

//         const currentMoment = moment(selectedDate, "jYYYY-jMM-jDD");

//         const nextDay = currentMoment.add(1, "day"); // یک روز اضافه کن

//         const nextDayStr = nextDay.format("jYYYY-jMM-jDD");



//         // اگر روز بعدی در ماه دیگری است، تقویم را ورق بزن

//         if (nextDay.jMonth() !== currentMonth.jMonth()) {

//             setCurrentMonth(nextDay);

//         }



//         // انتخاب روز جدید

//         setSelectedDate(nextDayStr);

//       }

//     } catch {

//       showNotification("❌ خطا در ثبت انتخاب", "error");

//     }

//   };



//   // ------------------ تقویم ------------------

//   const goToPrevMonth = () =>

//     setCurrentMonth(currentMonth.clone().subtract(1, "jMonth"));



//   const goToNextMonth = () =>

//     setCurrentMonth(currentMonth.clone().add(1, "jMonth"));



//   const daysInMonth = moment.jDaysInMonth(

//     currentMonth.jYear(),

//     currentMonth.jMonth()

//   );



//   let firstDay = currentMonth.clone().startOf("jMonth").day();

//   firstDay = (firstDay + 1) % 7;



//   const blanks = Array(firstDay).fill(null);

//   const days = Array.from({ length: daysInMonth }, (_, i) =>

//     currentMonth.clone().startOf("jMonth").add(i, "days")

//   );



//   return (

//     <div

//       dir="rtl"

//       className="min-h-screen bg-[#f8f5f2] font-[Vazir] flex flex-col items-center relative"

//     >

//       <Navbar active="menu" />



//       <Toast show={showToast} message={toastMessage} type={toastType} />



//       {/* ------------------ تقویم ------------------ */}

//       <section className="w-full max-w-6xl mt-28 flex flex-col md:flex-row justify-between items-start gap-10 px-6 sm:px-10">

//         <motion.div

//           layout

//           className="flex-1 bg-white rounded-2xl shadow-md p-6 sm:p-8"

//         >

//           <div className="flex justify-between items-center mb-5">

//             <button

//               onClick={goToPrevMonth}

//               className="text-gray-500 hover:text-[#c97b39]"

//             >

//               ❮

//             </button>



//             <h3 className="font-semibold text-[#503a2f] text-lg">

//               {currentMonth.format("jMMMM jYYYY")}

//             </h3>



//             <button

//               onClick={goToNextMonth}

//               className="text-gray-500 hover:text-[#c97b39]"

//             >

//               ❯

//             </button>

//           </div>



//           <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-600 mb-2">

//             {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (

//               <div key={d} className="font-semibold">

//                 {d}

//               </div>

//             ))}

//           </div>



//           <div className="grid grid-cols-7 gap-1 text-center text-sm">

//             {blanks.map((_, i) => (

//               <div key={i}></div>

//             ))}



//             {days.map((day) => {

//               const dateStr = day.format("jYYYY-jMM-jDD");

//               const gregorian = day.format("YYYY-MM-DD");



//               const limit = checkLimit(gregorian);



//               const isToday = day.isSame(moment(), "day");

//               const isSelected = dateStr === selectedDate;

//               const isChosen = selectedDays.includes(dateStr);



//               const disabled = !limit.allowed;



//               return (

//                 <motion.button

//                   key={dateStr}

//                   disabled={disabled}

//                   whileHover={disabled ? {} : { scale: 1.08 }}

//                   whileTap={disabled ? {} : { scale: 0.95 }}

//                   onClick={() => {

//                     if (disabled) {

//                       showNotification(limit.msg, "error");

//                       return;

//                     }

//                     setLimitMessage("");

//                     setSelectedDate(dateStr);

//                   }}

//                   className={`relative py-2 sm:py-3 rounded-full transition-all font-medium

//                     ${

//                       disabled

//                         ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"

//                         : isSelected

//                         ? "bg-[#c97b39] text-white"

//                         : isChosen

//                         ? "bg-green-100 text-green-700 border border-green-400"

//                         : isToday

//                         ? "bg-[#f5e6d8] text-[#503a2f]"

//                         : "text-gray-700 hover:bg-[#f0e6dd]"

//                     }`}

//                 >

//                   {day.format("jD")}



//                   {!disabled && isChosen && (

//                     <span className="absolute top-1 right-2 text-green-600 text-lg">

//                       ✔

//                     </span>

//                   )}

//                 </motion.button>

//               );

//             })}

//           </div>

//         </motion.div>



//         {/* متن سمت راست */}

//         <motion.div

//           layout

//           className="flex-1 bg-white rounded-2xl shadow-md p-6 sm:p-8 text-center md:text-right"

//         >

//           <h2 className="text-xl sm:text-2xl font-bold text-[#503a2f] mb-4">

//             وعده‌های غذایی خود را برای این ماه انتخاب کنید

//           </h2>

//           <p className="text-[#7c6656] text-sm sm:text-base">

//             با انتخاب دکمه زیر هر غذا، به صورت خودکار به روز بعد هدایت می‌شوید.

//           </p>

//         </motion.div>

//       </section>



//       {/* ------------------ لیست غذا ------------------ */}

//       <section className="w-full max-w-6xl bg-white shadow-md rounded-2xl mt-8 p-6 sm:p-8 mb-10">

//         <AnimatePresence mode="wait">

//           <motion.div

//             key={selectedDate}

//             initial={{ opacity: 0, y: 20 }}

//             animate={{ opacity: 1, y: 0 }}

//             exit={{ opacity: 0, y: -10 }}

//             transition={{ duration: 0.3 }}

//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"

//           >

//             {foodsForDay.length ? (

//               foodsForDay.map((food) => (

//                 <motion.div

//                   key={food.id}

//                   whileHover={{ scale: 1.02 }}

//                   className="bg-white rounded-2xl border border-[#f1e8e0] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"

//                 >

//                   <img

//                     src={

//                       food.photo

//                         ? food.photo

//                         : "https://via.placeholder.com/300x200?text=No+Image"

//                     }

//                     alt={food.name}

//                     className="h-44 w-full object-cover"

//                   />



//                   <div className="p-4 flex flex-col flex-grow">

//                     <h4 className="text-lg font-semibold text-[#503a2f]">

//                       {food.name}

//                     </h4>

//                     <p className="text-sm text-[#7c6656] mt-1 mb-4 flex-grow">

//                       {food.description || "بدون توضیحات"}

//                     </p>

                    

//                     {/* دکمه انتخاب */}

//                     <button

//                         onClick={() => saveSelection(menuId, food.id, food.name)}

//                         disabled={!!limitMessage}

//                         className={`w-full py-2 rounded-xl font-bold text-white transition-all

//                             ${limitMessage 

//                                 ? "bg-gray-400 cursor-not-allowed" 

//                                 : "bg-[#c97b39] hover:bg-[#b76c2d]"

//                             }`}

//                     >

//                         انتخاب 🍛

//                     </button>

//                   </div>

//                 </motion.div>

//               ))

//             ) : (

//               <p className="col-span-full text-center text-gray-500">

//                 برای این روز هنوز منویی ثبت نشده 🍽️

//               </p>

//             )}

//           </motion.div>

//         </AnimatePresence>

//       </section>

//     </div>

//   );

// }




import React, { useState, useEffect } from "react";
import moment from "moment-jalaali";
import { motion, AnimatePresence } from "framer-motion";
import "@fontsource/vazir";

import api from "../api"; // ✅ axios سراسری با refresh token
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

moment.loadPersian({ dialect: "persian-modern" });

export default function MenuPage() {
  const today = moment();
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(
    today.format("jYYYY-jMM-jDD")
  );

  const [menus, setMenus] = useState([]);
  const [foodsForDay, setFoodsForDay] = useState([]);
  const [menuId, setMenuId] = useState(null);

  const [selectedDays, setSelectedDays] = useState([]);
  const [limitMessage, setLimitMessage] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // ------------------ دریافت منو ------------------
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await api.get("menu/");
        setMenus(res.data);
      } catch {
        showNotification("❌ خطا در دریافت منو", "error");
      }
    };
    fetchMenus();
  }, []);

  // ------------------ دریافت انتخاب‌های قبلی ------------------
  useEffect(() => {
    const fetchSelections = async () => {
      try {
        const res = await api.get("user-selections/");
        const dated = res.data.map((sel) =>
          moment(sel.menu.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD")
        );
        setSelectedDays(dated);
      } catch {
        // اگر کاربر لاگین نباشد یا refresh منقضی شود
      }
    };
    fetchSelections();
  }, []);

  // ------------------ تنظیم غذاها ------------------
  useEffect(() => {
    const converted = menus.map((m) => ({
      ...m,
      jDate: moment(m.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD"),
    }));

    const menu = converted.find((m) => m.jDate === selectedDate);
    setFoodsForDay(menu ? menu.foods : []);
    setMenuId(menu ? menu.id : null);
  }, [selectedDate, menus]);

  // ------------------ محدودیت ۲۴ ساعت ------------------
  const checkLimit = (gregorianDate) => {
    const now = moment();
    const target = moment(gregorianDate, "YYYY-MM-DD");
    const hoursDiff = target.diff(now, "hours");

    if (hoursDiff <= 0) {
      return { allowed: false, msg: "⛔ این روز گذشته است." };
    }

    if (hoursDiff < 24) {
      return { allowed: false, msg: "⛔ مهلت انتخاب برای این روز تمام شده است." };
    }

    return { allowed: true, msg: "" };
  };

  // ------------------ ثبت غذا ------------------
  const saveSelection = async (menuId, foodId, foodName) => {
    if (limitMessage) {
      showNotification(limitMessage, "error");
      return;
    }

    try {
      const res = await api.post("menu/select/", {
        menu: menuId,
        food: foodId,
      });

      if (res.status === 200) {
        showNotification(`🍽 ${foodName} با موفقیت ثبت شد`, "success");

        if (!selectedDays.includes(selectedDate)) {
          setSelectedDays((prev) => [...prev, selectedDate]);
        }

        const currentMoment = moment(selectedDate, "jYYYY-jMM-jDD");
        const nextDay = currentMoment.add(1, "day");
        const nextDayStr = nextDay.format("jYYYY-jMM-jDD");

        if (nextDay.jMonth() !== currentMonth.jMonth()) {
          setCurrentMonth(nextDay);
        }

        setSelectedDate(nextDayStr);
      }
    } catch {
      showNotification("❌ خطا در ثبت انتخاب", "error");
    }
  };

  // ------------------ تقویم ------------------
  const goToPrevMonth = () =>
    setCurrentMonth(currentMonth.clone().subtract(1, "jMonth"));
  const goToNextMonth = () =>
    setCurrentMonth(currentMonth.clone().add(1, "jMonth"));

  const daysInMonth = moment.jDaysInMonth(
    currentMonth.jYear(),
    currentMonth.jMonth()
  );

  let firstDay = currentMonth.clone().startOf("jMonth").day();
  firstDay = (firstDay + 1) % 7;

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) =>
    currentMonth.clone().startOf("jMonth").add(i, "days")
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f8f5f2] font-[Vazir] flex flex-col items-center relative"
    >
      <Navbar active="menu" />
      <Toast show={showToast} message={toastMessage} type={toastType} />

      {/* ------------------ تقویم ------------------ */}
      <section className="w-full max-w-6xl mt-28 flex flex-col md:flex-row justify-between items-start gap-10 px-6 sm:px-10">
        <motion.div
          layout
          className="flex-1 bg-white rounded-2xl shadow-md p-6 sm:p-8"
        >
          <div className="flex justify-between items-center mb-5">
            <button
              onClick={goToPrevMonth}
              className="text-gray-500 hover:text-[#c97b39]"
            >
              ❮
            </button>

            <h3 className="font-semibold text-[#503a2f] text-lg">
              {currentMonth.format("jMMMM jYYYY")}
            </h3>

            <button
              onClick={goToNextMonth}
              className="text-gray-500 hover:text-[#c97b39]"
            >
              ❯
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-600 mb-2">
            {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (
              <div key={d} className="font-semibold">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {blanks.map((_, i) => (
              <div key={i}></div>
            ))}

            {days.map((day) => {
              const dateStr = day.format("jYYYY-jMM-jDD");
              const gregorian = day.format("YYYY-MM-DD");

              const limit = checkLimit(gregorian);

              const isToday = day.isSame(moment(), "day");
              const isSelected = dateStr === selectedDate;
              const isChosen = selectedDays.includes(dateStr);

              const disabled = !limit.allowed;

              return (
                <motion.button
                  key={dateStr}
                  disabled={disabled}
                  whileHover={disabled ? {} : { scale: 1.08 }}
                  whileTap={disabled ? {} : { scale: 0.95 }}
                  onClick={() => {
                    if (disabled) {
                      showNotification(limit.msg, "error");
                      return;
                    }
                    setLimitMessage("");
                    setSelectedDate(dateStr);
                  }}
                  className={`relative py-2 sm:py-3 rounded-full transition-all font-medium
                    ${
                      disabled
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                        : isSelected
                        ? "bg-[#c97b39] text-white"
                        : isChosen
                        ? "bg-green-100 text-green-700 border border-green-400"
                        : isToday
                        ? "bg-[#f5e6d8] text-[#503a2f]"
                        : "text-gray-700 hover:bg-[#f0e6dd]"
                    }`}
                >
                  {day.format("jD")}
                  {!disabled && isChosen && (
                    <span className="absolute top-1 right-2 text-green-600 text-lg">
                      ✔
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          layout
          className="flex-1 bg-white rounded-2xl shadow-md p-6 sm:p-8 text-center md:text-right"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#503a2f] mb-4">
            وعده‌های غذایی خود را برای این ماه انتخاب کنید
          </h2>
          <p className="text-[#7c6656] text-sm sm:text-base">
            با انتخاب دکمه زیر هر غذا، به صورت خودکار به روز بعد هدایت می‌شوید.
          </p>
        </motion.div>
      </section>

      {/* ------------------ لیست غذا ------------------ */}
      <section className="w-full max-w-6xl bg-white shadow-md rounded-2xl mt-8 p-6 sm:p-8 mb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {foodsForDay.length ? (
              foodsForDay.map((food) => (
                <motion.div
                  key={food.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl border border-[#f1e8e0] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <img
                    src={
                      food.photo ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={food.name}
                    className="h-44 w-full object-cover"
                  />

                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="text-lg font-semibold text-[#503a2f]">
                      {food.name}
                    </h4>
                    <p className="text-sm text-[#7c6656] mt-1 mb-4 flex-grow">
                      {food.description || "بدون توضیحات"}
                    </p>

                    <button
                      onClick={() =>
                        saveSelection(menuId, food.id, food.name)
                      }
                      className="w-full py-2 rounded-xl font-bold text-white bg-[#c97b39] hover:bg-[#b76c2d]"
                    >
                      انتخاب 🍛
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                برای این روز هنوز منویی ثبت نشده 🍽️
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
