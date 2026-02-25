// import React, { useState, useEffect } from "react";
// import moment from "moment-jalaali";
// import { motion, AnimatePresence } from "framer-motion";
// import "@fontsource/vazir";

// import api from "../api";
// import Navbar from "../components/Navbar";
// import Toast from "../components/Toast";

// moment.loadPersian({ dialect: "persian-modern" });

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
//   const [monthStatus, setMonthStatus] = useState({});
//   const [foodRatings, setFoodRatings] = useState({});

//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   const showNotification = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 2500);
//   };

//   useEffect(() => {
//     api
//       .get("menu/")
//       .then((res) => setMenus(res.data))
//       .catch(() => showNotification("❌ خطا در دریافت منو", "error"));
//   }, []);

//   useEffect(() => {
//     api
//       .get("food-ratings/")
//       .then((res) => {
//         const ratingMap = {};
//         res.data.forEach((item) => {
//           ratingMap[item.food__id] = {
//             avg: item.avg_rating,
//             count: item.total_votes,
//           };
//         });
//         setFoodRatings(ratingMap);
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     api.get("user-selections/").then((res) => {
//       const dated = res.data.map((sel) =>
//         moment(sel.menu.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD")
//       );
//       setSelectedDays(dated);
//     });
//   }, []);

//   useEffect(() => {
//     const year = currentMonth.jYear();
//     const month = currentMonth.jMonth() + 1;

//     api
//       .get(`menu/month-status/?year=${year}&month=${month}`)
//       .then((res) => setMonthStatus(res.data.days || {}))
//       .catch(() => setMonthStatus({}));
//   }, [currentMonth]);

//   useEffect(() => {
//     if (!monthStatus || !selectedDate) return;

//     const currentInfo = monthStatus[selectedDate];
//     if (!currentInfo || currentInfo.enabled !== false) return;

//     const daysInMonth = moment.jDaysInMonth(
//       currentMonth.jYear(),
//       currentMonth.jMonth()
//     );

//     for (
//       let i = moment(selectedDate, "jYYYY-jMM-jDD").jDate() + 1;
//       i <= daysInMonth;
//       i++
//     ) {
//       const nextDay = currentMonth
//         .clone()
//         .startOf("jMonth")
//         .add(i - 1, "day")
//         .format("jYYYY-jMM-jDD");

//       if (monthStatus[nextDay]?.enabled === true) {
//         setSelectedDate(nextDay);
//         break;
//       }
//     }
//   }, [selectedDate, monthStatus, currentMonth]);

//   useEffect(() => {
//     const converted = menus.map((m) => ({
//       ...m,
//       jDate: moment(m.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD"),
//     }));

//     const menu = converted.find((m) => m.jDate === selectedDate);
//     setFoodsForDay(menu ? menu.foods : []);
//     setMenuId(menu ? menu.id : null);
//   }, [selectedDate, menus]);

//   const saveSelection = async (menuId, foodId, foodName) => {
//     try {
//       const res = await api.post("menu/select/", {
//         menu: menuId,
//         food: foodId,
//       });

//       if (res.status === 200) {
//         showNotification(`🍽 ${foodName} با موفقیت ثبت شد`);

//         if (!selectedDays.includes(selectedDate)) {
//           setSelectedDays((prev) => [...prev, selectedDate]);
//         }

//         const nextDay = moment(selectedDate, "jYYYY-jMM-jDD").add(1, "day");
//         if (nextDay.jMonth() !== currentMonth.jMonth()) {
//           setCurrentMonth(nextDay);
//         }
//         setSelectedDate(nextDay.format("jYYYY-jMM-jDD"));
//       }
//     } catch {
//       showNotification("❌ خطا در ثبت انتخاب", "error");
//     }
//   };

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
//     <div dir="rtl" className="min-h-screen bg-[#f8f5f2] font-[Vazir]">
//       <Navbar active="menu" />
//       <Toast show={showToast} message={toastMessage} type={toastType} />

//       <main className="pt-24 max-w-6xl mx-auto px-4">
//         <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* تقویم */}
//           <motion.div className="bg-white rounded-xl shadow-sm p-4 border border-gray-50">
//             <div className="flex justify-between mb-4">
//               <button onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, "jMonth"))}>❮</button>
//               <h3 className="font-semibold">{currentMonth.format("jMMMM jYYYY")}</h3>
//               <button onClick={() => setCurrentMonth(currentMonth.clone().add(1, "jMonth"))}>❯</button>
//             </div>
//             <div className="grid grid-cols-7 text-center text-xs mb-2">
//               {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (<div key={d}>{d}</div>))}
//             </div>
//             <div className="grid grid-cols-7 gap-1 text-center text-sm">
//               {blanks.map((_, i) => (<div key={i} />))}
//               {days.map((day) => {
//                 const dateStr = day.format("jYYYY-jMM-jDD");
//                 const dayNumber = day.jDate();
//                 const info = monthStatus[dateStr];
//                 const isDisabled = info && info.enabled === false;
//                 const isSelected = dateStr === selectedDate;
//                 const isChosen = selectedDays.includes(dateStr);
//                 return (
//                   <button
//                     key={dateStr}
//                     disabled={isDisabled}
//                     onClick={() => isDisabled ? showNotification(info?.reason || "⛔ غیرفعال", "error") : setSelectedDate(dateStr)}
//                     className={`relative py-2 rounded-full font-medium ${
//                         isDisabled ? info?.reason === "تعطیل" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-500"
//                         : isSelected ? "bg-[#c97b39] text-white"
//                         : isChosen ? "bg-green-100 text-green-700" : "hover:bg-[#f0e6dd]"
//                     }`}
//                   >
//                     {dayNumber}
//                   </button>
//                 );
//               })}
//             </div>
//           </motion.div>

//           {/* راهنمای وضعیت */}
//          <div className="bg-white rrounded-xl shadow-sm p-4 border border-gray-50 flex flex-col justify-center">
//     <div>
//       <h3 className="text-lg font-bold mb-6 text-[#503a2f] border-b border-[#f0e6dd] pb-3 flex items-center gap-2">
//         راهنمای تقویم و وضعیت‌ها 🗓️
//       </h3>
//       <ul className="grid grid-cols-2 gap-2">
//         <li className="flex items-center gap-3">
//           <span className="w-3.5 h-3.5 rounded-full bg-[#22c55e] shadow-sm" />
//           <span className="text-[#6F6259]">روزهای دارای رزرو قطعی ناهار</span>
//         </li>
//         <li className="flex items-center gap-3">
//           <span className="w-3.5 h-3.5 rounded-full bg-[#c97b39] shadow-sm" />
//           <span className="text-[#6F6259]">روز انتخاب شده (مشاهده منو)</span>
//         </li>
//         <li className="flex items-center gap-3">
//           <span className="w-3.5 h-3.5 rounded-full bg-[#94a3b8] shadow-sm" />
//           <span className="text-[#6F6259]">روزهای فاقد منو یا غیرقابل انتخاب</span>
//         </li>
//         <li className="flex items-center gap-3">
//           <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444] shadow-sm" />
//           <span className="text-[#6F6259]">روزهای تعطیل یا غیرفعال شده</span>
//         </li>
//       </ul>
//     </div>

//     {/* باکس خلاصه فعالیت (پر کردن فضای خالی پایین کارت) */}
//     <div className="mt-8 pt-6 border-t border-dashed border-[#e0d7cc]">
//       <div className="bg-[#fdf8f4] p-5 rounded-xl border border-[#f5e6d8]">
//         <p className="text-xs text-[#8b735a] leading-7">
//           <strong className="block mb-2 text-[#c97b39] text-sm">خلاصه فعالیت شما:</strong>
//           شما در ماه <span className="font-bold text-[#503a2f]">{currentMonth.format("jMMMM")}</span>، تا این لحظه برای <span className="font-bold text-[#d46211]">{selectedDays.filter(d => d.startsWith(currentMonth.format("jYYYY-jMM"))).length} روز</span> رزرو ناهار ثبت کرده‌اید.
//         </p>
//       </div>
//       <p className="text-[10px] text-gray-400 mt-4 text-center italic">
//         شرکت ریل‌پرداز نوآفرین - واحد رفاهی و تدارکات
//       </p>
//     </div>
//   </div>
//         </section>

//         {/* لیست غذاها - کارت‌های کوچک‌تر */}
//         <section className="mt-2 mb-12">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={selectedDate}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//             >
//               {foodsForDay.length ? (
//                 foodsForDay.map((food) => (
//                 <div key={food.id} className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100/50 group overflow-hidden">
                  
//                   {/* بخش تصویر با امتیاز شناور */}
//                   <div className="relative h-32 overflow-hidden">
//                     <img 
//                       src={food.photo || "https://via.placeholder.com/400x250"} 
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
//                       alt={food.name} 
//                     />
                    
//                     {/* Badge امتیاز شناور مدرن */}
//                     {foodRatings[food.id] && (
//                       <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl shadow-sm flex items-center gap-1 border border-white">
//                         <span className="material-symbols-outlined !text-base text-orange-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                         <span className="text-xs font-black text-[#503a2f] transform translate-y-[1px]">
//                           {foodRatings[food.id].avg?.toFixed(1)}
//                         </span>
//                         <span className="text-[9px] text-gray-400 mt-0.5 mr-0.5">({foodRatings[food.id].count})</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* محتوای کارت */}
//                   <div className="p-5 flex flex-col flex-grow items-center text-center">
//                     <h4 className="text-lg font-black text-[#503a2f] mb-1 group-hover:text-[#c97b39] transition-colors">
//                       {food.name}
//                     </h4>

//                     <p className="text-[11px] text-gray-400 mb-5 line-clamp-1 font-medium leading-relaxed">
//                       {food.description || "تجربه‌ای لذیذ از طعم‌های اصیل ایرانی"}
//                     </p>
                    
//                     <button
//                       onClick={() => saveSelection(menuId, food.id, food.name)}
//                       className="w-full py-3 rounded-full bg-[#c97b39] text-white hover:bg-[#b06a31] font-extrabold text-sm transition-all shadow-[0_4px_12px_rgba(201,123,57,0.2)] hover:shadow-[0_6px_20px_rgba(201,123,57,0.3)] active:scale-95"
//                     >
//                       انتخاب ناهار امروز 🍛
//                     </button>
//                   </div>
//                 </div>
//               ))
//               ) : (
//                 <p className="text-center text-gray-500 col-span-full py-10">برای این روز منویی ثبت نشده است</p>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </section>
//       </main>
//     </div>
//   );
// }




// import React, { useState, useEffect } from "react";
// import moment from "moment-jalaali";
// import { motion, AnimatePresence } from "framer-motion";
// import "@fontsource/vazir";

// import api from "../api";
// import Navbar from "../components/Navbar";
// import Toast from "../components/Toast";

// moment.loadPersian({ dialect: "persian-modern" });

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
//   const [monthStatus, setMonthStatus] = useState({});
//   const [foodRatings, setFoodRatings] = useState({});

//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   const showNotification = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 2500);
//   };

//   useEffect(() => {
//     api
//       .get("menu/")
//       .then((res) => setMenus(res.data))
//       .catch(() => showNotification("❌ خطا در دریافت منو", "error"));
//   }, []);

//   useEffect(() => {
//     api
//       .get("food-ratings/")
//       .then((res) => {
//         const ratingMap = {};
//         res.data.forEach((item) => {
//           ratingMap[item.food__id] = {
//             avg: item.avg_rating,
//             count: item.total_votes,
//           };
//         });
//         setFoodRatings(ratingMap);
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     api.get("user-selections/").then((res) => {
//       const dated = res.data.map((sel) =>
//         moment(sel.menu.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD")
//       );
//       setSelectedDays(dated);
//     });
//   }, []);

//   useEffect(() => {
//     const year = currentMonth.jYear();
//     const month = currentMonth.jMonth() + 1;

//     api
//       .get(`menu/month-status/?year=${year}&month=${month}`)
//       .then((res) => setMonthStatus(res.data.days || {}))
//       .catch(() => setMonthStatus({}));
//   }, [currentMonth]);

//   useEffect(() => {
//     if (!monthStatus || !selectedDate) return;

//     const currentInfo = monthStatus[selectedDate];
//     if (!currentInfo || currentInfo.enabled !== false) return;

//     const daysInMonth = moment.jDaysInMonth(
//       currentMonth.jYear(),
//       currentMonth.jMonth()
//     );

//     for (
//       let i = moment(selectedDate, "jYYYY-jMM-jDD").jDate() + 1;
//       i <= daysInMonth;
//       i++
//     ) {
//       const nextDay = currentMonth
//         .clone()
//         .startOf("jMonth")
//         .add(i - 1, "day")
//         .format("jYYYY-jMM-jDD");

//       if (monthStatus[nextDay]?.enabled === true) {
//         setSelectedDate(nextDay);
//         break;
//       }
//     }
//   }, [selectedDate, monthStatus, currentMonth]);

//   useEffect(() => {
//     const converted = menus.map((m) => ({
//       ...m,
//       jDate: moment(m.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD"),
//     }));

//     const menu = converted.find((m) => m.jDate === selectedDate);
//     setFoodsForDay(menu ? menu.foods : []);
//     setMenuId(menu ? menu.id : null);
//   }, [selectedDate, menus]);

//   const saveSelection = async (menuId, foodId, foodName) => {
//     try {
//       const res = await api.post("menu/select/", {
//         menu: menuId,
//         food: foodId,
//       });

//       if (res.status === 200) {
//         showNotification(`🍽 ${foodName} با موفقیت ثبت شد`);

//         if (!selectedDays.includes(selectedDate)) {
//           setSelectedDays((prev) => [...prev, selectedDate]);
//         }

//         const nextDay = moment(selectedDate, "jYYYY-jMM-jDD").add(1, "day");
//         if (nextDay.jMonth() !== currentMonth.jMonth()) {
//           setCurrentMonth(nextDay);
//         }
//         setSelectedDate(nextDay.format("jYYYY-jMM-jDD"));
//       }
//     } catch {
//       showNotification("❌ خطا در ثبت انتخاب", "error");
//     }
//   };

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
//     <div dir="rtl" className="min-h-screen bg-[#f8f5f2] font-[Vazir]">
//       <Navbar active="menu" />
//       <Toast show={showToast} message={toastMessage} type={toastType} />

//       <main className="pt-24 max-w-6xl mx-auto px-4">
//         <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* تقویم */}
//           <motion.div className="bg-white rounded-2xl shadow-md p-6">
//             <div className="flex justify-between mb-4">
//               <button onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, "jMonth"))}>❮</button>
//               <h3 className="font-semibold">{currentMonth.format("jMMMM jYYYY")}</h3>
//               <button onClick={() => setCurrentMonth(currentMonth.clone().add(1, "jMonth"))}>❯</button>
//             </div>
//             <div className="grid grid-cols-7 text-center text-xs mb-2">
//               {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (<div key={d}>{d}</div>))}
//             </div>
//             <div className="grid grid-cols-7 gap-1 text-center text-sm">
//               {blanks.map((_, i) => (<div key={i} />))}
//               {days.map((day) => {
//                 const dateStr = day.format("jYYYY-jMM-jDD");
//                 const dayNumber = day.jDate();
//                 const info = monthStatus[dateStr];
//                 const isDisabled = info && info.enabled === false;
//                 const isSelected = dateStr === selectedDate;
//                 const isChosen = selectedDays.includes(dateStr);
//                 return (
//                   <button
//                     key={dateStr}
//                     disabled={isDisabled}
//                     onClick={() => isDisabled ? showNotification(info?.reason || "⛔ غیرفعال", "error") : setSelectedDate(dateStr)}
//                     className={`relative py-2 rounded-full font-medium ${
//                         isDisabled ? info?.reason === "تعطیل" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-500"
//                         : isSelected ? "bg-[#c97b39] text-white"
//                         : isChosen ? "bg-green-100 text-green-700" : "hover:bg-[#f0e6dd]"
//                     }`}
//                   >
//                     {dayNumber}
//                   </button>
//                 );
//               })}
//             </div>
//           </motion.div>

//           {/* راهنمای وضعیت */}
//           <div className="bg-white rounded-2xl shadow-md p-6">
//             <h3 className="text-lg font-bold mb-4 text-[#7a4a24]">راهنمای وضعیت روزها در تقویم منو</h3>
//             <ul className="space-y-3 text-sm">
//               <li className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-green-500" /><span>روزهایی که غذای آن‌ها ثبت شده است</span></li>
//               <li className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-[#c97b39]" /><span>روزی که در حال مشاهده آن هستید</span></li>
//               <li className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-gray-400" /><span>روزهای بدون منو یا غیرقابل انتخاب</span></li>
//               <li className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-red-500" /><span>روزهای تعطیل یا غیرفعال‌شده</span></li>
//             </ul>
//           </div>
//         </section>

//         {/* لیست غذاها - کارت‌های کوچک‌تر */}
//         <section className="mt-8 mb-12">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={selectedDate}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//             >
//               {foodsForDay.length ? (
//                 foodsForDay.map((food) => (
//                   <div key={food.id} className="bg-white rounded-xl shadow-md p-3 flex flex-col">
//                     <img
//                       src={food.photo || "https://via.placeholder.com/300"}
//                       alt={food.name}
//                       className="h-32 w-full object-cover rounded-lg"
//                     />
//                     <div className="mt-2 flex flex-col flex-grow">
//                       <h4 className="text-base font-bold text-[#503a2f]">{food.name}</h4>
                      
//                       {/* نمایش امتیاز */}
//                       {foodRatings[food.id] && (
//                         <div className="flex items-center gap-1 mt-0.5 text-xs text-yellow-500">
//                           <span>★ {foodRatings[food.id].avg?.toFixed(1)}</span>
//                           <span className="text-gray-400">({foodRatings[food.id].count} رأی)</span>
//                         </div>
//                       )}

//                       <p className="text-xs text-gray-600 mt-1 mb-3 line-clamp-2">
//                         {food.description || "بدون توضیح"}
//                       </p>
                      
//                       <button
//                         onClick={() => saveSelection(menuId, food.id, food.name)}
//                         className="w-full bg-[#c97b39] text-white py-1.5 rounded-lg text-sm font-medium hover:bg-[#b06a31] transition-colors mt-auto"
//                       >
//                         انتخاب 🍛
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500 col-span-full py-10">برای این روز منویی ثبت نشده است</p>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </section>
//       </main>
//     </div>
//   );
// }







// import React, { useState, useEffect } from "react";
// import moment from "moment-jalaali";
// import { motion, AnimatePresence } from "framer-motion";
// import "@fontsource/vazir";

// import api from "../api";
// import Navbar from "../components/Navbar";
// import Toast from "../components/Toast";

// moment.loadPersian({ dialect: "persian-modern" });

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
//   const [monthStatus, setMonthStatus] = useState({});
//   const [foodRatings, setFoodRatings] = useState({});

//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   const showNotification = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 2500);
//   };

//   useEffect(() => {
//     api
//       .get("menu/")
//       .then((res) => setMenus(res.data))
//       .catch(() => showNotification("❌ خطا در دریافت منو", "error"));
//   }, []);

//   useEffect(() => {
//     api
//       .get("food-ratings/")
//       .then((res) => {
//         const ratingMap = {};
//         res.data.forEach((item) => {
//           ratingMap[item.food__id] = {
//             avg: item.avg_rating,
//             count: item.total_votes,
//           };
//         });
//         setFoodRatings(ratingMap);
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     api.get("user-selections/").then((res) => {
//       const dated = res.data.map((sel) =>
//         moment(sel.menu.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD")
//       );
//       setSelectedDays(dated);
//     });
//   }, []);

//   useEffect(() => {
//     const year = currentMonth.jYear();
//     const month = currentMonth.jMonth() + 1;

//     api
//       .get(`menu/month-status/?year=${year}&month=${month}`)
//       .then((res) => setMonthStatus(res.data.days || {}))
//       .catch(() => setMonthStatus({}));
//   }, [currentMonth]);

//   useEffect(() => {
//     if (!monthStatus || !selectedDate) return;

//     const currentInfo = monthStatus[selectedDate];
//     if (!currentInfo || currentInfo.enabled !== false) return;

//     const daysInMonth = moment.jDaysInMonth(
//       currentMonth.jYear(),
//       currentMonth.jMonth()
//     );

//     for (
//       let i = moment(selectedDate, "jYYYY-jMM-jDD").jDate() + 1;
//       i <= daysInMonth;
//       i++
//     ) {
//       const nextDay = currentMonth
//         .clone()
//         .startOf("jMonth")
//         .add(i - 1, "day")
//         .format("jYYYY-jMM-jDD");

//       if (monthStatus[nextDay]?.enabled === true) {
//         setSelectedDate(nextDay);
//         break;
//       }
//     }
//   }, [selectedDate, monthStatus, currentMonth]);

//   useEffect(() => {
//     const converted = menus.map((m) => ({
//       ...m,
//       jDate: moment(m.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD"),
//     }));

//     const menu = converted.find((m) => m.jDate === selectedDate);
//     setFoodsForDay(menu ? menu.foods : []);
//     setMenuId(menu ? menu.id : null);
//   }, [selectedDate, menus]);

//   const saveSelection = async (menuId, foodId, foodName) => {
//     try {
//       const res = await api.post("menu/select/", {
//         menu: menuId,
//         food: foodId,
//       });

//       if (res.status === 200) {
//         showNotification(`🍽 ${foodName} با موفقیت ثبت شد`);

//         if (!selectedDays.includes(selectedDate)) {
//           setSelectedDays((prev) => [...prev, selectedDate]);
//         }

//         const nextDay = moment(selectedDate, "jYYYY-jMM-jDD").add(1, "day");
//         if (nextDay.jMonth() !== currentMonth.jMonth()) {
//           setCurrentMonth(nextDay);
//         }
//         setSelectedDate(nextDay.format("jYYYY-jMM-jDD"));
//       }
//     } catch {
//       showNotification("❌ خطا در ثبت انتخاب", "error");
//     }
//   };

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
//     <div dir="rtl" className="min-h-screen bg-[#f8f5f2] font-[Vazir]">
//       <Navbar active="menu" />
//       <Toast show={showToast} message={toastMessage} type={toastType} />

//       <main className="pt-24 max-w-6xl mx-auto px-4">
//         <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* تقویم */}
//           <motion.div className="bg-white rounded-xl shadow-sm p-4 border border-gray-50" >
//             <div className="flex justify-between mb-4">
//               <button onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, "jMonth"))}>❮</button>
//               <h3 className="font-semibold">{currentMonth.format("jMMMM jYYYY")}</h3>
//               <button onClick={() => setCurrentMonth(currentMonth.clone().add(1, "jMonth"))}>❯</button>
//             </div>
//             <div className="grid grid-cols-7 text-center text-xs mb-2">
//               {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (<div key={d}>{d}</div>))}
//             </div>
//             <div className="grid grid-cols-7 gap-1 text-center text-sm">
//               {blanks.map((_, i) => (<div key={i} />))}
//               {days.map((day) => {
//                 const dateStr = day.format("jYYYY-jMM-jDD");
//                 const dayNumber = day.jDate();
//                 const info = monthStatus[dateStr];
//                 const isDisabled = info && info.enabled === false;
//                 const isSelected = dateStr === selectedDate;
//                 const isChosen = selectedDays.includes(dateStr);
//                 return (
//                   <button
//                     key={dateStr}
//                     disabled={isDisabled}
//                     onClick={() => isDisabled ? showNotification(info?.reason || "⛔ غیرفعال", "error") : setSelectedDate(dateStr)}
//                     className={`relative py-2 rounded-full font-medium ${
//                         isDisabled ? info?.reason === "تعطیل" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-500"
//                         : isSelected ? "bg-[#c97b39] text-white"
//                         : isChosen ? "bg-green-100 text-green-700" : "hover:bg-[#f0e6dd]"
//                     }`}
//                   >
//                     {dayNumber}
//                   </button>
//                 );
//               })}
//             </div>
//           </motion.div>

//           {/* راهنمای وضعیت */}
//          <div className="bg-white rrounded-xl shadow-sm p-4 border border-gray-50 flex flex-col justify-center">
//     <div>
//       <h3 className="text-lg font-bold mb-6 text-[#503a2f] border-b border-[#f0e6dd] pb-3 flex items-center gap-2">
//         راهنمای تقویم و وضعیت‌ها 🗓️
//       </h3>
//       <ul className="grid grid-cols-2 gap-2">
//         <li className="flex items-center gap-3">
//           <span className="w-3.5 h-3.5 rounded-full bg-[#22c55e] shadow-sm" />
//           <span className="text-[#6F6259]">روزهای دارای رزرو قطعی ناهار</span>
//         </li>
//         <li className="flex items-center gap-3">
//           <span className="w-3.5 h-3.5 rounded-full bg-[#c97b39] shadow-sm" />
//           <span className="text-[#6F6259]">روز انتخاب شده (مشاهده منو)</span>
//         </li>
//         <li className="flex items-center gap-3">
//           <span className="w-3.5 h-3.5 rounded-full bg-[#94a3b8] shadow-sm" />
//           <span className="text-[#6F6259]">روزهای فاقد منو یا غیرقابل انتخاب</span>
//         </li>
//         <li className="flex items-center gap-3">
//           <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444] shadow-sm" />
//           <span className="text-[#6F6259]">روزهای تعطیل یا غیرفعال شده</span>
//         </li>
//       </ul>
//     </div>

//     {/* باکس خلاصه فعالیت (پر کردن فضای خالی پایین کارت) */}
//     <div className="mt-8 pt-6 border-t border-dashed border-[#e0d7cc]">
//       <div className="bg-[#fdf8f4] p-5 rounded-xl border border-[#f5e6d8]">
//         <p className="text-xs text-[#8b735a] leading-7">
//           <strong className="block mb-2 text-[#c97b39] text-sm">خلاصه فعالیت شما:</strong>
//           شما در ماه <span className="font-bold text-[#503a2f]">{currentMonth.format("jMMMM")}</span>، تا این لحظه برای <span className="font-bold text-[#d46211]">{selectedDays.filter(d => d.startsWith(currentMonth.format("jYYYY-jMM"))).length} روز</span> رزرو ناهار ثبت کرده‌اید.
//         </p>
//       </div>
//       <p className="text-[10px] text-gray-400 mt-4 text-center italic">
//         شرکت ریل‌پرداز نوآفرین - واحد رفاهی و تدارکات
//       </p>
//     </div>
//   </div>
//         </section>

//         {/* لیست غذاها - کارت‌های کوچک‌تر */}
//         <section className="mt-2 mb-12">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={selectedDate}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//             >
//               {foodsForDay.length ? (
//                 foodsForDay.map((food) => (
//                 // جایگزین خط ۲۱۳ تا ۲۴۸
// <div key={food.id} className="group bg-white/80 backdrop-blur-sm rounded-[2.5rem] p-3 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(201,123,57,0.12)] transition-all duration-500 flex flex-col overflow-hidden">
  
//   {/* بخش تصویر با لبه‌های گرد و زوم */}
//   <div className="relative h-32 overflow-hidden rounded-[2rem]">
//     <img 
//       src={food.photo || "https://via.placeholder.com/400x250"} 
//       className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
//       alt={food.name} 
//     />
//     {/* سایه ملایم روی عکس برای خوانایی امتیاز */}
//     <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    
//     {/* امتیاز شیشه‌ای شناور روی عکس */}
//     {foodRatings[food.id] && (
//       <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md border border-white/30 px-2 py-1 rounded-full flex items-center gap-1 text-white shadow-xl">
//         <span className="material-symbols-outlined !text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//         <span className="text-[10px] font-bold tabular-nums">{foodRatings[food.id].avg?.toFixed(1)}</span>
//         <span className="text-[8px] opacity-70">({foodRatings[food.id].count})</span>
//       </div>
//     )}
//   </div>

//   {/* محتوا */}
//   <div className="px-3 py-4 flex flex-col items-center text-center flex-grow">
//     <h4 className="text-base font-black text-[#503a2f] mb-1 group-hover:text-[#c97b39] transition-colors">
//       {food.name}
//     </h4>
//     <p className="text-[10px] text-gray-400 mb-4 line-clamp-1 italic font-medium">
//       {food.description || "تجربه‌ای لذیذ از ناهار شرکت نُوآفرین"}
//     </p>
    
//     <button
//       onClick={() => saveSelection(menuId, food.id, food.name)}
//       className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#c97b39] to-[#d48c52] text-white font-bold text-xs shadow-[0_4px_15px_rgba(201,123,57,0.3)] hover:shadow-[0_8px_25px_rgba(201,123,57,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
//     >
//       رزرو این ناهار 🍛
//     </button>
//   </div>
// </div>
//               ))
//               ) : (
//                 <p className="text-center text-gray-500 col-span-full py-10">برای این روز منویی ثبت نشده است</p>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </section>
//       </main>
//     </div>
//   );
// }

































































































import React, { useState, useEffect } from "react";
import moment from "moment-jalaali";
import { motion, AnimatePresence } from "framer-motion";
import "@fontsource/vazir";

import api from "../api";
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
  const [monthStatus, setMonthStatus] = useState({});
  const [foodRatings, setFoodRatings] = useState({});

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [selectionsMap, setSelectionsMap] = useState({});

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  useEffect(() => {
    api
      .get("menu/")
      .then((res) => setMenus(res.data))
      .catch(() => showNotification("❌ خطا در دریافت منو", "error"));
  }, []);

  useEffect(() => {
    api
      .get("food-ratings/")
      .then((res) => {
        const ratingMap = {};
        res.data.forEach((item) => {
          ratingMap[item.food__id] = {
            avg: item.avg_rating,
            count: item.total_votes,
          };
        });
        setFoodRatings(ratingMap);
      })
      .catch(() => {});
  }, []);

useEffect(() => {
  api.get("user-selections/").then((res) => {
    const mapping = {};
    if (res.data && Array.isArray(res.data)) {
      res.data.forEach((sel) => {
        // ⭐ اصلاح شد: استفاده از selected_food مطابق با مدل جنگو
        if (sel?.menu?.date && sel?.selected_food?.id) {
          const dateKey = moment(sel.menu.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD");
          mapping[dateKey] = sel.selected_food.id; 
        }
      });
    }
    setSelectionsMap(mapping);
    setSelectedDays(Object.keys(mapping));
  }).catch(err => console.error("Error fetching selections:", err));
}, []);
  useEffect(() => {
    const year = currentMonth.jYear();
    const month = currentMonth.jMonth() + 1;

    api
      .get(`menu/month-status/?year=${year}&month=${month}`)
      .then((res) => setMonthStatus(res.data.days || {}))
      .catch(() => setMonthStatus({}));
  }, [currentMonth]);

  useEffect(() => {
    if (!monthStatus || !selectedDate) return;

    const currentInfo = monthStatus[selectedDate];
    if (!currentInfo || currentInfo.enabled !== false) return;

    const daysInMonth = moment.jDaysInMonth(
      currentMonth.jYear(),
      currentMonth.jMonth()
    );

    for (
      let i = moment(selectedDate, "jYYYY-jMM-jDD").jDate() + 1;
      i <= daysInMonth;
      i++
    ) {
      const nextDay = currentMonth
        .clone()
        .startOf("jMonth")
        .add(i - 1, "day")
        .format("jYYYY-jMM-jDD");

      if (monthStatus[nextDay]?.enabled === true) {
        setSelectedDate(nextDay);
        break;
      }
    }
  }, [selectedDate, monthStatus, currentMonth]);

  useEffect(() => {
    const converted = menus.map((m) => ({
      ...m,
      jDate: moment(m.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD"),
    }));

    const menu = converted.find((m) => m.jDate === selectedDate);
    setFoodsForDay(menu ? menu.foods : []);
    setMenuId(menu ? menu.id : null);
  }, [selectedDate, menus]);

 const saveSelection = async (mId, foodId, foodName) => {
    try {
      const res = await api.post("menu/select/", { menu: mId, food: foodId });
      if (res.status === 200 || res.status === 201) {
        // تغییر آنی تیک سبز روی همان کارت
        setSelectionsMap(prev => ({ ...prev, [selectedDate]: foodId }));
        if (!selectedDays.includes(selectedDate)) setSelectedDays(prev => [...prev, selectedDate]);
        
        // مکث ۸۰۰ میلی‌ثانیه‌ای برای لذت بردن از افکت رزرو، سپس رفتن به روز بعد
        setTimeout(() => {
          const nextDay = moment(selectedDate, "jYYYY-jMM-jDD").add(1, "day");
          if (nextDay.jMonth() !== currentMonth.jMonth()) setCurrentMonth(nextDay);
          setSelectedDate(nextDay.format("jYYYY-jMM-jDD"));
        }, 800);
      }
    } catch {
      showNotification("❌ خطا در ثبت انتخاب", "error");
    }
  };
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
    <div dir="rtl" className="min-h-screen bg-[#f8f5f2] font-[Vazir]">
      <Navbar active="menu" />
      <Toast show={showToast} message={toastMessage} type={toastType} />

      <main className="pt-24 max-w-6xl mx-auto px-4">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* تقویم */}
          <motion.div className="bg-white rounded-xl shadow-sm p-4 border border-gray-50">
            <div className="flex justify-between mb-4">
              <button onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, "jMonth"))}>❮</button>
              <h3 className="font-semibold">{currentMonth.format("jMMMM jYYYY")}</h3>
              <button onClick={() => setCurrentMonth(currentMonth.clone().add(1, "jMonth"))}>❯</button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs mb-2">
              {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (<div key={d}>{d}</div>))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {blanks.map((_, i) => (<div key={i} />))}
              {days.map((day) => {
                const dateStr = day.format("jYYYY-jMM-jDD");
                const dayNumber = day.jDate();
                const info = monthStatus[dateStr];
                const isDisabled = info && info.enabled === false;
                const isSelected = dateStr === selectedDate;
                const isChosen = selectedDays.includes(dateStr);
                return (
                  <button
                    key={dateStr}
                    disabled={isDisabled}
                    onClick={() => isDisabled ? showNotification(info?.reason || "⛔ غیرفعال", "error") : setSelectedDate(dateStr)}
                    className={`relative py-2 rounded-full font-medium ${
                        isDisabled ? info?.reason === "تعطیل" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-500"
                        : isSelected ? "bg-[#c97b39] text-white"
                        : isChosen ? "bg-green-100 text-green-700" : "hover:bg-[#f0e6dd]"
                    }`}
                  >
                    {dayNumber}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* راهنمای وضعیت */}
         <div className="bg-white rrounded-xl shadow-sm p-4 border border-gray-50 flex flex-col justify-center">
    <div>
      <h3 className="text-lg font-bold mb-6 text-[#503a2f] border-b border-[#f0e6dd] pb-3 flex items-center gap-2">
        راهنمای تقویم و وضعیت‌ها 🗓️
      </h3>
      <ul className="grid grid-cols-2 gap-2">
        <li className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full bg-[#22c55e] shadow-sm" />
          <span className="text-[#6F6259]">روزهای دارای رزرو قطعی ناهار</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full bg-[#c97b39] shadow-sm" />
          <span className="text-[#6F6259]">روز انتخاب شده (مشاهده منو)</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full bg-[#94a3b8] shadow-sm" />
          <span className="text-[#6F6259]">روزهای فاقد منو یا غیرقابل انتخاب</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444] shadow-sm" />
          <span className="text-[#6F6259]">روزهای تعطیل یا غیرفعال شده</span>
        </li>
      </ul>
    </div>

    {/* باکس خلاصه فعالیت (پر کردن فضای خالی پایین کارت) */}
    <div className="mt-8 pt-6 border-t border-dashed border-[#e0d7cc]">
      <div className="bg-[#fdf8f4] p-5 rounded-xl border border-[#f5e6d8]">
        <p className="text-xs text-[#8b735a] leading-7">
          <strong className="block mb-2 text-[#c97b39] text-sm">خلاصه فعالیت شما:</strong>
          شما در ماه <span className="font-bold text-[#503a2f]">{currentMonth.format("jMMMM")}</span>، تا این لحظه برای <span className="font-bold text-[#d46211]">{selectedDays.filter(d => d.startsWith(currentMonth.format("jYYYY-jMM"))).length} روز</span> رزرو ناهار ثبت کرده‌اید.
        </p>
      </div>
      <p className="text-[10px] text-gray-400 mt-4 text-center italic">
        شرکت ریل‌پرداز نوآفرین - واحد رفاهی و تدارکات
      </p>
    </div>
  </div>
        </section>

        {/* لیست غذاها - کارت‌های کوچک‌تر */}
        <section className="mt-4 mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {foodsForDay.length ? (
                foodsForDay.map((food) => {
                  const isThisSelected = selectionsMap[selectedDate] === food.id;

                  return (
                    <div 
                      key={food.id} 
                      className={`rounded-[2rem] transition-all duration-500 flex flex-col border overflow-hidden group
                        ${isThisSelected 
                          ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)] bg-green-50/10 scale-[1.02]' 
                          : 'bg-white shadow-sm hover:shadow-xl border-gray-100/50'}`}
                    >
                      <div className="relative h-28 overflow-hidden">
                        <img src={food.photo || "https://via.placeholder.com/400x250"} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isThisSelected ? 'blur-[1px]' : ''}`} alt={food.name} />
                        {isThisSelected && (
                          <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center backdrop-blur-[1px]">
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1.1 }} className="material-symbols-outlined !text-6xl text-white drop-shadow-lg">check_circle</motion.span>
                          </div>
                        )}
                        {!isThisSelected && foodRatings[food.id] && (
                          <div className="absolute top-3 left-3 bg-white/40 backdrop-blur-md px-2 py-1 rounded-xl shadow-sm flex items-center gap-1 border border-white/40">
                            <span className="material-symbols-outlined !text-base text-orange-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-xs font-black text-[#503a2f] transform translate-y-[1px]">{foodRatings[food.id].avg?.toFixed(1)}</span>
                            <span className="text-[9px] text-gray-500 mt-0.5 mr-0.5">({foodRatings[food.id].count})</span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-grow items-center text-center">
                        <h4 className={`text-lg font-black mb-1 transition-colors ${isThisSelected ? 'text-green-700' : 'text-[#503a2f] group-hover:text-[#c97b39]'}`}>{food.name}</h4>
                        <p className="text-[11px] text-gray-400 mb-5 line-clamp-1 italic">{food.description || "تجربه‌ای لذیذ از طعم‌های اصیل در نُوآفرین"}</p>
                        
                        <button
                          onClick={() => saveSelection(menuId, food.id, food.name)}
                          className={`w-full py-3 rounded-full font-extrabold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2
                            ${isThisSelected ? 'bg-green-500 text-white cursor-default' : 'bg-[#c97b39] text-white hover:bg-[#b06a31]'}`}
                        >
                          {isThisSelected ? <>رزرو شد <span className="material-symbols-outlined !text-base">task_alt</span></> : 'انتخاب ناهار امروز 🍛'}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-16 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-bold">برای این تاریخ منویی تعریف نشده است 🍽️</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}







// import React, { useState, useEffect } from "react";
// import moment from "moment-jalaali";
// import { motion, AnimatePresence } from "framer-motion";
// import "@fontsource/vazir";

// import api from "../api";
// import Navbar from "../components/Navbar";
// import Toast from "../components/Toast";

// moment.loadPersian({ dialect: "persian-modern" });

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
//   const [monthStatus, setMonthStatus] = useState({});
//   const [foodRatings, setFoodRatings] = useState({});

//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   const showNotification = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 2500);
//   };

//   useEffect(() => {
//     api
//       .get("menu/")
//       .then((res) => setMenus(res.data))
//       .catch(() => showNotification("❌ خطا در دریافت منو", "error"));
//   }, []);

//   useEffect(() => {
//     api
//       .get("food-ratings/")
//       .then((res) => {
//         const ratingMap = {};
//         res.data.forEach((item) => {
//           ratingMap[item.food__id] = {
//             avg: item.avg_rating,
//             count: item.total_votes,
//           };
//         });
//         setFoodRatings(ratingMap);
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     api.get("user-selections/").then((res) => {
//       const dated = res.data.map((sel) =>
//         moment(sel.menu.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD")
//       );
//       setSelectedDays(dated);
//     });
//   }, []);

//   useEffect(() => {
//     const year = currentMonth.jYear();
//     const month = currentMonth.jMonth() + 1;

//     api
//       .get(`menu/month-status/?year=${year}&month=${month}`)
//       .then((res) => setMonthStatus(res.data.days || {}))
//       .catch(() => setMonthStatus({}));
//   }, [currentMonth]);

//   useEffect(() => {
//     if (!monthStatus || !selectedDate) return;

//     const currentInfo = monthStatus[selectedDate];
//     if (!currentInfo || currentInfo.enabled !== false) return;

//     const daysInMonth = moment.jDaysInMonth(
//       currentMonth.jYear(),
//       currentMonth.jMonth()
//     );

//     for (
//       let i = moment(selectedDate, "jYYYY-jMM-jDD").jDate() + 1;
//       i <= daysInMonth;
//       i++
//     ) {
//       const nextDay = currentMonth
//         .clone()
//         .startOf("jMonth")
//         .add(i - 1, "day")
//         .format("jYYYY-jMM-jDD");

//       if (monthStatus[nextDay]?.enabled === true) {
//         setSelectedDate(nextDay);
//         break;
//       }
//     }
//   }, [selectedDate, monthStatus, currentMonth]);

//   useEffect(() => {
//     const converted = menus.map((m) => ({
//       ...m,
//       jDate: moment(m.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD"),
//     }));

//     const menu = converted.find((m) => m.jDate === selectedDate);
//     setFoodsForDay(menu ? menu.foods : []);
//     setMenuId(menu ? menu.id : null);
//   }, [selectedDate, menus]);

//   const saveSelection = async (menuId, foodId, foodName) => {
//     try {
//       const res = await api.post("menu/select/", {
//         menu: menuId,
//         food: foodId,
//       });

//       if (res.status === 200) {
//         showNotification(`🍽 ${foodName} با موفقیت ثبت شد`);

//         if (!selectedDays.includes(selectedDate)) {
//           setSelectedDays((prev) => [...prev, selectedDate]);
//         }

//         const nextDay = moment(selectedDate, "jYYYY-jMM-jDD").add(1, "day");
//         if (nextDay.jMonth() !== currentMonth.jMonth()) {
//           setCurrentMonth(nextDay);
//         }
//         setSelectedDate(nextDay.format("jYYYY-jMM-jDD"));
//       }
//     } catch {
//       showNotification("❌ خطا در ثبت انتخاب", "error");
//     }
//   };

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
//     <div dir="rtl" className="min-h-screen bg-[#f8f5f2] font-[Vazir]">
//       <Navbar active="menu" />
//       <Toast show={showToast} message={toastMessage} type={toastType} />

//       <main className="pt-24 max-w-6xl mx-auto px-4">
//         <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* تقویم */}
//           <motion.div className="bg-white rounded-2xl shadow-md p-6">
//             <div className="flex justify-between mb-4">
//               <button onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, "jMonth"))}>❮</button>
//               <h3 className="font-semibold">{currentMonth.format("jMMMM jYYYY")}</h3>
//               <button onClick={() => setCurrentMonth(currentMonth.clone().add(1, "jMonth"))}>❯</button>
//             </div>
//             <div className="grid grid-cols-7 text-center text-xs mb-2">
//               {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (<div key={d}>{d}</div>))}
//             </div>
//             <div className="grid grid-cols-7 gap-1 text-center text-sm">
//               {blanks.map((_, i) => (<div key={i} />))}
//               {days.map((day) => {
//                 const dateStr = day.format("jYYYY-jMM-jDD");
//                 const dayNumber = day.jDate();
//                 const info = monthStatus[dateStr];
//                 const isDisabled = info && info.enabled === false;
//                 const isSelected = dateStr === selectedDate;
//                 const isChosen = selectedDays.includes(dateStr);
//                 return (
//                   <button
//                     key={dateStr}
//                     disabled={isDisabled}
//                     onClick={() => isDisabled ? showNotification(info?.reason || "⛔ غیرفعال", "error") : setSelectedDate(dateStr)}
//                     className={`relative py-2 rounded-full font-medium ${
//                         isDisabled ? info?.reason === "تعطیل" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-500"
//                         : isSelected ? "bg-[#c97b39] text-white"
//                         : isChosen ? "bg-green-100 text-green-700" : "hover:bg-[#f0e6dd]"
//                     }`}
//                   >
//                     {dayNumber}
//                   </button>
//                 );
//               })}
//             </div>
//           </motion.div>

//           {/* راهنمای وضعیت */}
//           <div className="bg-white rounded-2xl shadow-md p-6">
//             <h3 className="text-lg font-bold mb-4 text-[#7a4a24]">راهنمای وضعیت روزها در تقویم منو</h3>
//             <ul className="space-y-3 text-sm">
//               <li className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-green-500" /><span>روزهایی که غذای آن‌ها ثبت شده است</span></li>
//               <li className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-[#c97b39]" /><span>روزی که در حال مشاهده آن هستید</span></li>
//               <li className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-gray-400" /><span>روزهای بدون منو یا غیرقابل انتخاب</span></li>
//               <li className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-red-500" /><span>روزهای تعطیل یا غیرفعال‌شده</span></li>
//             </ul>
//           </div>
//         </section>

//         {/* لیست غذاها - کارت‌های کوچک‌تر */}
//         <section className="mt-8 mb-12">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={selectedDate}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//             >
//               {foodsForDay.length ? (
//                 foodsForDay.map((food) => (
//                   <div key={food.id} className="bg-white rounded-xl shadow-md p-3 flex flex-col">
//                     <img
//                       src={food.photo || "https://via.placeholder.com/300"}
//                       alt={food.name}
//                       className="h-32 w-full object-cover rounded-lg"
//                     />
//                     <div className="mt-2 flex flex-col flex-grow">
//                       <h4 className="text-base font-bold text-[#503a2f]">{food.name}</h4>
                      
//                       {/* نمایش امتیاز */}
//                       {foodRatings[food.id] && (
//                         <div className="flex items-center gap-1 mt-0.5 text-xs text-yellow-500">
//                           <span>★ {foodRatings[food.id].avg?.toFixed(1)}</span>
//                           <span className="text-gray-400">({foodRatings[food.id].count} رأی)</span>
//                         </div>
//                       )}

//                       <p className="text-xs text-gray-600 mt-1 mb-3 line-clamp-2">
//                         {food.description || "بدون توضیح"}
//                       </p>
                      
//                       <button
//                         onClick={() => saveSelection(menuId, food.id, food.name)}
//                         className="w-full bg-[#c97b39] text-white py-1.5 rounded-lg text-sm font-medium hover:bg-[#b06a31] transition-colors mt-auto"
//                       >
//                         انتخاب 🍛
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500 col-span-full py-10">برای این روز منویی ثبت نشده است</p>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </section>
//       </main>
//     </div>
//   );
// }







// import React, { useState, useEffect } from "react";
// import moment from "moment-jalaali";
// import { motion, AnimatePresence } from "framer-motion";
// import "@fontsource/vazir";

// import api from "../api";
// import Navbar from "../components/Navbar";
// import Toast from "../components/Toast";

// moment.loadPersian({ dialect: "persian-modern" });

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
//   const [monthStatus, setMonthStatus] = useState({});
//   const [foodRatings, setFoodRatings] = useState({});
//   const [selectionsMap, setSelectionsMap] = useState({});

//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   const showNotification = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 2500);
//   };

//   useEffect(() => {
//     api
//       .get("menu/")
//       .then((res) => setMenus(res.data))
//       .catch(() => showNotification("❌ خطا در دریافت منو", "error"));
//   }, []);

//   useEffect(() => {
//     api
//       .get("food-ratings/")
//       .then((res) => {
//         const ratingMap = {};
//         res.data.forEach((item) => {
//           ratingMap[item.food__id] = {
//             avg: item.avg_rating,
//             count: item.total_votes,
//           };
//         });
//         setFoodRatings(ratingMap);
//       })
//       .catch(() => {});
//   }, []);

//  useEffect(() => {
//     api.get("user-selections/").then((res) => {
//       const mapping = {};
//       if (res.data && Array.isArray(res.data)) {
//         res.data.forEach((sel) => {
//           if (sel?.menu?.date && sel?.food?.id) {
//             const dateKey = moment(sel.menu.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD");
//             mapping[dateKey] = sel.food.id; 
//           }
//         });
//       }
//       setSelectionsMap(mapping);
//       setSelectedDays(Object.keys(mapping));
//     });
//   }, []);
//   useEffect(() => {
//     const year = currentMonth.jYear();
//     const month = currentMonth.jMonth() + 1;

//     api
//       .get(`menu/month-status/?year=${year}&month=${month}`)
//       .then((res) => setMonthStatus(res.data.days || {}))
//       .catch(() => setMonthStatus({}));
//   }, [currentMonth]);

//   useEffect(() => {
//     if (!monthStatus || !selectedDate) return;

//     const currentInfo = monthStatus[selectedDate];
//     if (!currentInfo || currentInfo.enabled !== false) return;

//     const daysInMonth = moment.jDaysInMonth(
//       currentMonth.jYear(),
//       currentMonth.jMonth()
//     );

//     for (
//       let i = moment(selectedDate, "jYYYY-jMM-jDD").jDate() + 1;
//       i <= daysInMonth;
//       i++
//     ) {
//       const nextDay = currentMonth
//         .clone()
//         .startOf("jMonth")
//         .add(i - 1, "day")
//         .format("jYYYY-jMM-jDD");

//       if (monthStatus[nextDay]?.enabled === true) {
//         setSelectedDate(nextDay);
//         break;
//       }
//     }
//   }, [selectedDate, monthStatus, currentMonth]);

//   useEffect(() => {
//     const converted = menus.map((m) => ({
//       ...m,
//       jDate: moment(m.date, "YYYY-MM-DD").format("jYYYY-jMM-jDD"),
//     }));

//     const menu = converted.find((m) => m.jDate === selectedDate);
//     setFoodsForDay(menu ? menu.foods : []);
//     setMenuId(menu ? menu.id : null);
//   }, [selectedDate, menus]);

//   const saveSelection = async (mId, foodId, foodName) => {
//     try {
//       const res = await api.post("menu/select/", { menu: mId, food: foodId });
//       if (res.status === 200 || res.status === 201) {
//         // تغییر آنی وضعیت در فرانت (تیک سبز و هاله نوری)
//         setSelectionsMap(prev => ({ ...prev, [selectedDate]: foodId }));
//         if (!selectedDays.includes(selectedDate)) setSelectedDays(prev => [...prev, selectedDate]);
        
       
//         // مکث کوتاه ۸۰۰ میلی‌ثانیه‌ای برای دیدن تیک سبز، سپس رفتن به روز بعد
//         setTimeout(() => {
//           const nextDay = moment(selectedDate, "jYYYY-jMM-jDD").add(1, "day");
//           if (nextDay.jMonth() !== currentMonth.jMonth()) setCurrentMonth(nextDay);
//           setSelectedDate(nextDay.format("jYYYY-jMM-jDD"));
//         }, 800);
//       }
//     } catch {
//       showNotification("❌ خطا در ثبت انتخاب", "error");
//     }
//   };

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
//     <div dir="rtl" className="min-h-screen bg-[#f8f5f2] font-[Vazir]">
//       <Navbar active="menu" />
//       <Toast show={showToast} message={toastMessage} type={toastType} />

//       <main className="pt-24 max-w-6xl mx-auto px-4">
//         <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* تقویم */}
//           <motion.div className="bg-white rounded-xl shadow-sm p-4 border border-gray-50" >
//             <div className="flex justify-between mb-4">
//               <button onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, "jMonth"))}>❮</button>
//               <h3 className="font-semibold">{currentMonth.format("jMMMM jYYYY")}</h3>
//               <button onClick={() => setCurrentMonth(currentMonth.clone().add(1, "jMonth"))}>❯</button>
//             </div>
//             <div className="grid grid-cols-7 text-center text-xs mb-2">
//               {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (<div key={d}>{d}</div>))}
//             </div>
//             <div className="grid grid-cols-7 gap-1 text-center text-sm">
//               {blanks.map((_, i) => (<div key={i} />))}
//               {days.map((day) => {
//                 const dateStr = day.format("jYYYY-jMM-jDD");
//                 const dayNumber = day.jDate();
//                 const info = monthStatus[dateStr];
//                 const isDisabled = info && info.enabled === false;
//                 const isSelected = dateStr === selectedDate;
//                 const isChosen = selectedDays.includes(dateStr);
//                 return (
//                   <button
//                     key={dateStr}
//                     disabled={isDisabled}
//                     onClick={() => isDisabled ? showNotification(info?.reason || "⛔ غیرفعال", "error") : setSelectedDate(dateStr)}
//                     className={`relative py-2 rounded-full font-medium ${
//                         isDisabled ? info?.reason === "تعطیل" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-500"
//                         : isSelected ? "bg-[#c97b39] text-white"
//                         : isChosen ? "bg-green-100 text-green-700" : "hover:bg-[#f0e6dd]"
//                     }`}
//                   >
//                     {dayNumber}
//                   </button>
//                 );
//               })}
//             </div>
//           </motion.div>

//           {/* راهنمای وضعیت */}
//          <div className="bg-white rrounded-xl shadow-sm p-4 border border-gray-50 flex flex-col justify-center">
//     <div>
//       <h3 className="text-lg font-bold mb-6 text-[#503a2f] border-b border-[#f0e6dd] pb-3 flex items-center gap-2">
//         راهنمای تقویم و وضعیت‌ها 🗓️
//       </h3>
//       <ul className="grid grid-cols-2 gap-2">
//         <li className="flex items-center gap-3">
//           <span className="w-3.5 h-3.5 rounded-full bg-[#22c55e] shadow-sm" />
//           <span className="text-[#6F6259]">روزهای دارای رزرو قطعی ناهار</span>
//         </li>
//         <li className="flex items-center gap-3">
//           <span className="w-3.5 h-3.5 rounded-full bg-[#c97b39] shadow-sm" />
//           <span className="text-[#6F6259]">روز انتخاب شده (مشاهده منو)</span>
//         </li>
//         <li className="flex items-center gap-3">
//           <span className="w-3.5 h-3.5 rounded-full bg-[#94a3b8] shadow-sm" />
//           <span className="text-[#6F6259]">روزهای فاقد منو یا غیرقابل انتخاب</span>
//         </li>
//         <li className="flex items-center gap-3">
//           <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444] shadow-sm" />
//           <span className="text-[#6F6259]">روزهای تعطیل یا غیرفعال شده</span>
//         </li>
//       </ul>
//     </div>

//     {/* باکس خلاصه فعالیت (پر کردن فضای خالی پایین کارت) */}
//     <div className="mt-8 pt-6 border-t border-dashed border-[#e0d7cc]">
//       <div className="bg-[#fdf8f4] p-5 rounded-xl border border-[#f5e6d8]">
//         <p className="text-xs text-[#8b735a] leading-7">
//           <strong className="block mb-2 text-[#c97b39] text-sm">خلاصه فعالیت شما:</strong>
//           شما در ماه <span className="font-bold text-[#503a2f]">{currentMonth.format("jMMMM")}</span>، تا این لحظه برای <span className="font-bold text-[#d46211]">{selectedDays.filter(d => d.startsWith(currentMonth.format("jYYYY-jMM"))).length} روز</span> رزرو ناهار ثبت کرده‌اید.
//         </p>
//       </div>
//       <p className="text-[10px] text-gray-400 mt-4 text-center italic">
//         شرکت ریل‌پرداز نوآفرین - واحد رفاهی و تدارکات
//       </p>
//     </div>
//   </div>
//         </section>

//         {/* لیست غذاها - کارت‌های کوچک‌تر */}
//         <section className="mt-2 mb-12">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={selectedDate}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//             >
//               {foodsForDay.length ? (
//                 foodsForDay.map((food) => {
//                   const isThisSelected = selectionsMap[selectedDate] === food.id;

//                   return (
//                     <div 
//                       key={food.id} 
//                       className={`group relative rounded-[2.5rem] p-3 transition-all duration-500 flex flex-col overflow-hidden border-2
//                         ${isThisSelected 
//                           ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)] bg-green-50/20 scale-[1.02]' 
//                           : 'border-white bg-white shadow-sm hover:shadow-xl'}`}
//                     >
//                       {/* تصویر با اورلی تایید */}
//                       <div className="relative h-28 overflow-hidden rounded-[2rem]">
//                         <img 
//                           src={food.photo || "https://via.placeholder.com/400x300"} 
//                           className={`w-full h-full object-cover transition-transform duration-700 ${isThisSelected ? 'blur-[1.5px] scale-105' : 'group-hover:scale-110'}`} 
//                           alt={food.name} 
//                         />
//                         {isThisSelected && (
//                           <div className="absolute inset-0 bg-green-600/30 flex items-center justify-center backdrop-blur-[1px]">
//                             <motion.span initial={{ scale: 0 }} animate={{ scale: 1.2 }} className="material-symbols-outlined !text-7xl text-white drop-shadow-lg">check_circle</motion.span>
//                           </div>
//                         )}
//                         {/* امتیاز شناور شیشه‌ای */}
//                         {!isThisSelected && foodRatings[food.id] && (
//                           <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-white border border-white/30 text-[10px] font-bold">
//                             <span className="material-symbols-outlined !text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                             {foodRatings[food.id].avg?.toFixed(1)}
//                           </div>
//                         )}
//                       </div>

//                       {/* محتوا و دکمه انتخاب (بدون قفل برای تغییر نظر) */}
//                       <div className="p-5 flex flex-col items-center text-center flex-grow">
//                         <h4 className={`text-lg font-black mb-1 transition-colors ${isThisSelected ? 'text-green-700' : 'text-[#503a2f]'}`}>{food.name}</h4>
//                         <p className="text-[10px] text-gray-400 mb-5 line-clamp-1 italic">{food.description || "تجربه‌ای لذیذ از ناهار شرکت نُوآفرین"}</p>
                        
//                         <button
//                           onClick={() => saveSelection(menuId, food.id, food.name)}
//                           className={`w-full py-3.5 rounded-full font-black text-sm transition-all duration-300 flex items-center justify-center gap-2
//                             ${isThisSelected 
//                               ? 'bg-green-500 text-white shadow-none cursor-default' 
//                               : 'bg-gradient-to-r from-[#c97b39] to-[#d48c52] text-white shadow-md hover:shadow-orange-200 active:scale-95'}`}
//                         >
//                           {isThisSelected ? (
//                             <>رزرو نهایی شد <span className="material-symbols-outlined !text-base">task_alt</span></>
//                           ) : (
//                             'تایید و رزرو نهایی ناهار 🍛'
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="col-span-full py-16 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-gray-200">
//                    <p className="text-gray-400 font-black text-sm text-center w-full">هنوز منویی برای این تاریخ ثبت نشده است 🍽️</p>
//                 </div>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </section>
//       </main>
//     </div>
//   );
// }