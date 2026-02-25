// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import moment from "moment-jalaali";
// import { motion } from "framer-motion";

// import Navbar from "../components/Navbar";
// import Toast from "../components/Toast";

// import "@fontsource/vazir";

// // تنظیمات تاریخ شمسی
// moment.loadPersian({ dialect: "persian-modern" });

// const API_BASE = process.env.REACT_APP_API_BASE;

// // 📅 لیست تعطیلات رسمی شمسی (دقیقاً مشابه صفحه منو)
// const SHAMSI_HOLIDAYS = [
//   "1403-10-27", 
//   "1403-11-22", 
//   "1403-12-29",
//   "1404-01-01",
//   "1404-01-02",
//   "1404-01-03",
//   "1404-01-04",
//   "1404-01-12",
//   "1404-01-13",
// ];

// export default function OrdersPage() {
//   // 🛠️ پیدا کردن اولین روز کاری برای شروع (اجتناب از فرود روی تعطیلات)
//   const getFirstWorkDay = () => {
//     let day = moment().locale('en'); 
//     while (
//         day.day() === 4 || 
//         day.day() === 5 || 
//         SHAMSI_HOLIDAYS.includes(day.format("jYYYY-jMM-jDD"))
//     ) {
//       day.add(1, "day");
//     }
//     return day.format("jYYYY-jMM-jDD");
//   };

//   const [currentMonth, setCurrentMonth] = useState(moment());
//   const [selectedDate, setSelectedDate] = useState(getFirstWorkDay());

//   const [dailyTotal, setDailyTotal] = useState(0);
//   const [dailyFoods, setDailyFoods] = useState([]);
//   const [dailyOrders, setDailyOrders] = useState([]);
//   const [daysWithOrders, setDaysWithOrders] = useState([]);

//   const [loadingDay, setLoadingDay] = useState(false);
//   const [loadingMonth, setLoadingMonth] = useState(false);

//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   const token = localStorage.getItem("access");

//   // ============================================================
//   // 📌 تابع دریافت گزارش روزانه
//   // ============================================================
//   const fetchDailyReport = async (jDateStr) => {
//     if (!token) return;
//     const gDate = moment(jDateStr, "jYYYY-jMM-jDD").format("YYYY-MM-DD");

//     try {
//       setLoadingDay(true);
//       const res = await axios.get(`${API_BASE}/daily-orders-report/`, {
//         params: { date: gDate },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = res.data || {};
//       setDailyTotal(data.total_orders || 0);
//       setDailyFoods(data.foods || []);
//       setDailyOrders(data.orders || []);
//     } catch (err) {
//       console.error("❌ خطا در گزارش روز:", err);
//     } finally {
//       setLoadingDay(false);
//     }
//   };

//   // ============================================================
//   // 🚀 تابع دریافت وضعیت کل ماه
//   // ============================================================
//   const fetchMonthlyPresence = async (monthMoment) => {
//     if (!token) return;
//     try {
//       setLoadingMonth(true);
//       const gDateSample = monthMoment.clone().startOf("jMonth").format("YYYY-MM-DD");

//       const res = await axios.get(`${API_BASE}/monthly-orders-status/`, {
//         params: { date: gDateSample },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data && res.data.days_with_orders) {
//         const jalaliDays = res.data.days_with_orders.map(gDate => 
//              moment(gDate, "YYYY-MM-DD").locale('en').format("jYYYY-jMM-jDD")
//         );
//         setDaysWithOrders(jalaliDays);
//       }
//     } catch (err) {
//       console.error("❌ خطا در گزارش ماه:", err);
//     } finally {
//       setLoadingMonth(false);
//     }
//   };

//   useEffect(() => {
//     fetchDailyReport(selectedDate);
//     fetchMonthlyPresence(currentMonth);
//   }, [token, currentMonth, selectedDate]);

//   // ============================================================
//   // 🎮 کنترلرهای تقویم
//   // ============================================================
//   const goToPrevMonth = () => setCurrentMonth(prev => prev.clone().subtract(1, "jMonth"));
//   const goToNextMonth = () => setCurrentMonth(prev => prev.clone().add(1, "jMonth"));

//   const daysInMonth = moment.jDaysInMonth(currentMonth.jYear(), currentMonth.jMonth());
//   let firstDay = (currentMonth.clone().startOf("jMonth").day() + 1) % 7;
//   const blanks = Array(firstDay).fill(null);
//   const days = Array.from({ length: daysInMonth }, (_, i) =>
//     currentMonth.clone().startOf("jMonth").add(i, "days")
//   );

//   const handlePrint = () => window.print();
//   const selectedDateReadable = moment(selectedDate, "jYYYY-jMM-jDD").format("jD jMMMM jYYYY");

//   return (
//     <div dir="rtl" className="min-h-screen bg-[#f5efe6] text-[#332C26] font-[Vazir] flex flex-col">
//       <Navbar active="orders" />
//       <Toast show={showToast} message={toastMessage} type={toastType} />

//       <main className="flex-grow container mx-auto px-4 py-8 mt-28 printable">
//         <div className="flex flex-col gap-8">

//           {/* هدر */}
//           <div className="flex flex-col sm:flex-row justify-between items-start gap-4 no-print">
//             <div>
//               <h2 className="text-3xl font-bold text-[#332C26]">داشبورد گزارشات</h2>
//               <p className="text-sm text-[#6F6259] mt-1">نمایش لیست غذاهای سفارش داده شده به تفکیک روز.</p>
//             </div>
//             <button onClick={handlePrint} className="bg-[#4A403A] text-white py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-[#332C26] transition-all">
//               <span className="material-symbols-outlined">print</span> چاپ گزارش
//             </button>
//           </div>

//           <section className="flex flex-col md:flex-row gap-10">
//             {/* تقویم هوشمند */}
//             <motion.div layout className="flex-1 bg-white rounded-2xl shadow-md p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <button onClick={goToPrevMonth} className="text-gray-400 hover:text-[#c97b39]">❮</button>
//                 <h3 className="font-bold text-lg text-[#503a2f]">{currentMonth.format("jMMMM jYYYY")}</h3>
//                 <button onClick={goToNextMonth} className="text-gray-400 hover:text-[#c97b39]">❯</button>
//               </div>

//               <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-3">
//                 {["ش", "ی", "د", "س", "چ", "پ", "ج"].map(d => <div key={d}>{d}</div>)}
//               </div>

//               <div className="grid grid-cols-7 gap-1 text-center">
//                 {blanks.map((_, i) => <div key={i}></div>)}
//                 {days.map((day) => {
//                   const jStrEn = day.clone().locale('en').format("jYYYY-jMM-jDD");
//                   const isSelected = jStrEn === selectedDate;
//                   const hasOrders = daysWithOrders.includes(jStrEn);
                  
//                   // ❌ بررسی روزهای تعطیل (پنجشنبه، جمعه و لیست رسمی)
//                   const isDisabled = day.day() === 4 || day.day() === 5 || SHAMSI_HOLIDAYS.includes(jStrEn);

//                   return (
//                     <button
//                       key={jStrEn}
//                       disabled={isDisabled}
//                       onClick={() => setSelectedDate(jStrEn)}
//                       className={`relative py-3 rounded-full text-sm transition-all
//                         ${isDisabled ? "bg-gray-50 text-gray-300 cursor-not-allowed" : 
//                           isSelected ? "bg-[#c97b39] text-white font-bold shadow-md" : 
//                           "hover:bg-orange-50 text-[#4A403A]"}`}
//                     >
//                       {day.format("jD")}
//                       {/* نقطه نشان‌دهنده وجود سفارش (فقط برای روزهای غیر تعطیل) */}
//                       {hasOrders && !isSelected && !isDisabled && (
//                          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
//                       )}
//                       {/* علامت ضربدر ملایم برای تعطیلات */}
//                       {isDisabled && <span className="absolute inset-0 flex items-center justify-center opacity-10 text-[8px]">✖</span>}
//                     </button>
//                   );
//                 })}
//               </div>
//             </motion.div>

//             {/* راهنمای وضعیت */}
//             <div className="flex-1 bg-white rounded-2xl shadow-md p-8 flex flex-col justify-center">
//               <h2 className="text-xl font-bold text-[#503a2f] mb-6 border-b pb-2">راهنمای گزارشات</h2>
//               <div className="space-y-4 text-sm">
//                 <div className="flex items-center gap-3"><span className="w-4 h-4 bg-[#c97b39] rounded-full"></span> روز انتخاب شده جهت مشاهده جزئیات.</div>
//                 <div className="flex items-center gap-3"><span className="w-4 h-4 bg-green-500 rounded-full"></span> روزهای دارای سفارش ثبت شده.</div>
//                 <div className="flex items-center gap-3 text-gray-400"><span className="w-4 h-4 bg-gray-100 rounded-full"></span> روزهای تعطیل (غیرقابل انتخاب).</div>
//               </div>
//               <p className="mt-8 text-xs text-gray-400 leading-5">
//                 گزارش نمایش داده شده در پایین صفحه، مربوط به تاریخ <span className="font-bold text-[#c97b39]">{selectedDateReadable}</span> می‌باشد.
//               </p>
//             </div>
//           </section>

//           {/* خلاصه و آمار */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#D3C7B8] shadow-sm">
//               <h3 className="font-bold mb-4 text-[#4A403A]">📊 تفکیک غذاهای امروز</h3>
//               {loadingDay ? (
//                 <p className="text-center py-4">در حال دریافت آمار...</p>
//               ) : dailyFoods.length ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {dailyFoods.map((f, idx) => (
//                     <div key={idx} className="flex justify-between items-center p-3 bg-[#F5EFE6] rounded-lg">
//                       <span className="font-medium">{f.name}</span>
//                       <span className="bg-[#4A403A] text-white px-3 py-1 rounded-md text-xs">{f.count} عدد</span>
//                     </div>
//                   ))}
//                 </div>
//               ) : <p className="text-gray-400 text-sm">آماری برای این روز وجود ندارد.</p>}
//             </div>

//             <div className="bg-[#4A403A] p-6 rounded-xl text-white flex flex-col justify-center items-center shadow-lg">
//               <span className="text-sm opacity-80 mb-2">مجموع سفارشات</span>
//               <span className="text-5xl font-black">{loadingDay ? "..." : dailyTotal}</span>
//             </div>
//           </div>

//           {/* جدول جزئیات */}
//           <div className="bg-white rounded-xl shadow-sm border border-[#D3C7B8] overflow-hidden">
//             <div className="p-5 bg-[#F5EFE6] border-b border-[#D3C7B8]">
//               <h3 className="font-bold text-[#4A403A]">📋 لیست دقیق سفارش‌دهندگان</h3>
//             </div>
//             <table className="w-full text-right">
//               <thead className="bg-gray-50 text-xs text-gray-500">
//                 <tr>
//                   <th className="px-6 py-4">نام کارمند</th>
//                   <th className="px-6 py-4">غذای انتخابی</th>
//                   <th className="px-6 py-4 text-center">وضعیت</th>
//                 </tr>
//               </thead>
//               <tbody className="text-sm">
//                 {loadingDay ? (
//                   <tr><td colSpan="3" className="py-10 text-center">در حال بارگذاری لیست...</td></tr>
//                 ) : dailyOrders.length ? (
//                   dailyOrders.map((o) => (
//                     <tr key={o.id} className="border-t border-[#F5EFE6] hover:bg-gray-50">
//                       <td className="px-6 py-4 font-bold">{o.employee}</td>
//                       <td className="px-6 py-4 text-gray-600">{o.food || "نامشخص"}</td>
//                       <td className="px-6 py-4 text-center">
//                         <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full">تایید شده</span>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr><td colSpan="3" className="py-10 text-center text-gray-400">سفارشی یافت نشد.</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//         </div>
//       </main>
      
//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           .printable { margin-top: 0 !important; padding: 0 !important; }
//           body { background: white !important; }
//         }
//       `}</style>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import moment from "moment-jalaali";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

import api from "../api"; // ✅ استفاده از api.js با refresh token
import "@fontsource/vazir";

// تنظیمات تاریخ شمسی
moment.loadPersian({ dialect: "persian-modern" });

// 📅 لیست تعطیلات رسمی شمسی
const SHAMSI_HOLIDAYS = [
  "1403-10-27", 
  "1403-11-22", 
  "1403-12-29",
  "1404-01-01",
  "1404-01-02",
  "1404-01-03",
  "1404-01-04",
  "1404-01-12",
  "1404-01-13",
];

export default function OrdersPage() {
  // 🛠️ پیدا کردن اولین روز کاری
  const getFirstWorkDay = () => {
    let day = moment().locale('en'); 
    while (
        day.day() === 4 || 
        day.day() === 5 || 
        SHAMSI_HOLIDAYS.includes(day.format("jYYYY-jMM-jDD"))
    ) {
      day.add(1, "day");
    }
    return day.format("jYYYY-jMM-jDD");
  };

  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(getFirstWorkDay());

  const [dailyTotal, setDailyTotal] = useState(0);
  const [dailyFoods, setDailyFoods] = useState([]);
  const [dailyOrders, setDailyOrders] = useState([]);
  const [daysWithOrders, setDaysWithOrders] = useState([]);

  const [loadingDay, setLoadingDay] = useState(false);
  const [loadingMonth, setLoadingMonth] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showNotification = (message, type = "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // ============================================================
  // 📌 دریافت گزارش روزانه
  // ============================================================
  const fetchDailyReport = async (jDateStr) => {
    const gDate = moment(jDateStr, "jYYYY-jMM-jDD").format("YYYY-MM-DD");
    try {
      setLoadingDay(true);
      const res = await api.get("/daily-orders-report/", { params: { date: gDate } });
      const data = res.data || {};
      setDailyTotal(data.total_orders || 0);
      setDailyFoods(data.foods || []);
      setDailyOrders(data.orders || []);
    } catch (err) {
      console.error("❌ خطا در گزارش روز:", err);
      showNotification("خطا در دریافت گزارش روزانه", "error");
    } finally {
      setLoadingDay(false);
    }
  };

  // ============================================================
  // 🚀 دریافت وضعیت کل ماه
  // ============================================================
  const fetchMonthlyPresence = async (monthMoment) => {
    try {
      setLoadingMonth(true);
      const gDateSample = monthMoment.clone().startOf("jMonth").format("YYYY-MM-DD");
      const res = await api.get("/monthly-orders-status/", { params: { date: gDateSample } });
      if (res.data && res.data.days_with_orders) {
        const jalaliDays = res.data.days_with_orders.map(gDate =>
          moment(gDate, "YYYY-MM-DD").locale('en').format("jYYYY-jMM-jDD")
        );
        setDaysWithOrders(jalaliDays);
      }
    } catch (err) {
      console.error("❌ خطا در گزارش ماه:", err);
      showNotification("خطا در دریافت وضعیت ماهانه", "error");
    } finally {
      setLoadingMonth(false);
    }
  };

  useEffect(() => {
    fetchDailyReport(selectedDate);
    fetchMonthlyPresence(currentMonth);
  }, [currentMonth, selectedDate]);

  // ============================================================
  // 🎮 کنترلرهای تقویم
  // ============================================================
  const goToPrevMonth = () => setCurrentMonth(prev => prev.clone().subtract(1, "jMonth"));
  const goToNextMonth = () => setCurrentMonth(prev => prev.clone().add(1, "jMonth"));

  const daysInMonth = moment.jDaysInMonth(currentMonth.jYear(), currentMonth.jMonth());
  let firstDay = (currentMonth.clone().startOf("jMonth").day() + 1) % 7;
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) =>
    currentMonth.clone().startOf("jMonth").add(i, "days")
  );

  const handlePrint = () => window.print();
  const selectedDateReadable = moment(selectedDate, "jYYYY-jMM-jDD").format("jD jMMMM jYYYY");

  return (
    <div dir="rtl" className="min-h-screen bg-[#f5efe6] text-[#332C26] font-[Vazir] flex flex-col">
      <Navbar active="orders" />
      <Toast show={showToast} message={toastMessage} type={toastType} />

      <main className="flex-grow container mx-auto px-4 py-8 mt-28 printable">
        <div className="flex flex-col gap-8">

          {/* هدر */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 no-print">
            <div>
              <h2 className="text-3xl font-bold text-[#332C26]">داشبورد گزارشات</h2>
              <p className="text-sm text-[#6F6259] mt-1">نمایش لیست غذاهای سفارش داده شده به تفکیک روز.</p>
            </div>
            <button onClick={handlePrint} className="bg-[#4A403A] text-white py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-[#332C26] transition-all">
              <span className="material-symbols-outlined">print</span> چاپ گزارش
            </button>
          </div>

          {/* بخش تقویم و راهنما */}
          <section className="flex flex-col md:flex-row gap-10">
            {/* تقویم */}
            <motion.div layout className="flex-1 bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
              <div className="flex justify-between items-center mb-6">
                <button onClick={goToPrevMonth} className="text-gray-400 hover:text-[#c97b39]">❮</button>
                <h3 className="font-bold text-lg text-[#503a2f]">{currentMonth.format("jMMMM jYYYY")}</h3>
                <button onClick={goToNextMonth} className="text-gray-400 hover:text-[#c97b39]">❯</button>
              </div>

              {/* Header Days */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-3">
                {["ش", "ی", "د", "س", "چ", "پ", "ج"].map(d => <div key={d}>{d}</div>)}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {blanks.map((_, i) => <div key={i}></div>)}
                {days.map(day => {
                  const jStr = day.locale('en').format("jYYYY-jMM-jDD");
                  const isSelected = jStr === selectedDate;
                  const hasOrders = daysWithOrders.includes(jStr);
                 const isDisabled = !hasOrders;


                  return (
                    <button
                      key={jStr}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && setSelectedDate(jStr)}
                      className={`
                        relative
                        py-3 sm:py-2
                        rounded-full
                        text-sm
                        transition-all
                        ${
                        isDisabled
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                          : isSelected
                          ? "bg-[#c97b39] text-white font-bold shadow-md"
                          : "hover:bg-orange-50 text-[#4A403A]"
                      }
                      `}
                    >
                      {day.format("jD")}
                      {hasOrders && !isSelected && !isDisabled && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      )}
                      {isDisabled && <span className="absolute inset-0 flex items-center justify-center opacity-10 text-[8px]">✖</span>}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* راهنمای وضعیت */}
            <div className="flex-1 bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col justify-center">
              <h2 className="text-xl font-bold text-[#503a2f] mb-6 border-b pb-2">راهنمای گزارشات</h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3"><span className="w-4 h-4 bg-[#c97b39] rounded-full"></span> روز انتخاب شده جهت مشاهده جزئیات.</div>
                <div className="flex items-center gap-3"><span className="w-4 h-4 bg-green-500 rounded-full"></span> روزهای دارای سفارش ثبت شده.</div>
                <div className="flex items-center gap-3 text-gray-400"><span className="w-4 h-4 bg-gray-100 rounded-full"></span> روزهای تعطیل (غیرقابل انتخاب).</div>
              </div>
              <p className="mt-8 text-xs text-gray-400 leading-5">
                گزارش نمایش داده شده در پایین صفحه، مربوط به تاریخ <span className="font-bold text-[#c97b39]">{selectedDateReadable}</span> می‌باشد.
              </p>
            </div>
          </section>

          {/* خلاصه و آمار */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#D3C7B8] shadow-sm">
              <h3 className="font-bold mb-4 text-[#4A403A]">📊 تفکیک غذاهای امروز</h3>
              {loadingDay ? (
                <p className="text-center py-4">در حال دریافت آمار...</p>
              ) : dailyFoods.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dailyFoods.map((f, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-[#F5EFE6] rounded-lg">
                      <span className="font-medium">{f.name}</span>
                      <span className="bg-[#4A403A] text-white px-3 py-1 rounded-md text-xs">{f.count} عدد</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-gray-400 text-sm">آماری برای این روز وجود ندارد.</p>}
            </div>

            <div className="bg-[#4A403A] p-6 rounded-xl text-white flex flex-col justify-center items-center shadow-lg">
              <span className="text-sm opacity-80 mb-2">مجموع سفارشات</span>
              <span className="text-5xl font-black">{loadingDay ? "..." : dailyTotal}</span>
            </div>
          </div>

          {/* جدول جزئیات */}
          <div className="bg-white rounded-xl shadow-sm border border-[#D3C7B8] overflow-x-auto">
            <div className="p-5 bg-[#F5EFE6] border-b border-[#D3C7B8]">
              <h3 className="font-bold text-[#4A403A]">📋 لیست دقیق سفارش‌دهندگان</h3>
            </div>
            <table className="w-full text-right min-w-[500px]">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-6 py-4">نام کارمند</th>
                  <th className="px-6 py-4">غذای انتخابی</th>
                  <th className="px-6 py-4 text-center">وضعیت</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loadingDay ? (
                  <tr><td colSpan="3" className="py-10 text-center">در حال بارگذاری لیست...</td></tr>
                ) : dailyOrders.length ? (
                  dailyOrders.map((o) => (
                    <tr key={o.id} className="border-t border-[#F5EFE6] hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold">{o.employee}</td>
                      <td className="px-6 py-4 text-gray-600">{o.food || "نامشخص"}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full">تایید شده</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3" className="py-10 text-center text-gray-400">سفارشی یافت نشد.</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .printable { margin-top: 0 !important; padding: 0 !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}






































































































// import React, { useEffect, useState } from "react";
// import moment from "moment-jalaali";
// import { motion, AnimatePresence } from "framer-motion";

// import Navbar from "../components/Navbar";
// import Toast from "../components/Toast";

// import api from "../api"; 
// import "@fontsource/vazir";

// moment.loadPersian({ dialect: "persian-modern" });

// const SHAMSI_HOLIDAYS = ["1403-10-27", "1403-11-22", "1403-12-29", "1404-01-01", "1404-01-02", "1404-01-03", "1404-01-04", "1404-01-12", "1404-01-13"];

// export default function OrdersPage() {
//   const getFirstWorkDay = () => {
//     let day = moment().locale('en'); 
//     while (day.day() === 4 || day.day() === 5 || SHAMSI_HOLIDAYS.includes(day.format("jYYYY-jMM-jDD"))) {
//       day.add(1, "day");
//     }
//     return day.format("jYYYY-jMM-jDD");
//   };

//   const [currentMonth, setCurrentMonth] = useState(moment());
//   const [selectedDate, setSelectedDate] = useState(getFirstWorkDay());
//   const [dailyTotal, setDailyTotal] = useState(0);
//   const [dailyFoods, setDailyFoods] = useState([]);
//   const [dailyOrders, setDailyOrders] = useState([]);
//   const [daysWithOrders, setDaysWithOrders] = useState([]);
//   const [globalRatings, setGlobalRatings] = useState([]); // ⭐ استیت جدید برای غذاهای محبوب
//   const [loadingDay, setLoadingDay] = useState(false);
//   const [loadingMonth, setLoadingMonth] = useState(false);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   const showNotification = (message, type = "error") => {
//     setToastMessage(message); setToastType(type); setShowToast(true);
//     setTimeout(() => setShowToast(false), 2500);
//   };

//   const fetchDailyReport = async (jDateStr) => {
//     const gDate = moment(jDateStr, "jYYYY-jMM-jDD").format("YYYY-MM-DD");
//     try {
//       setLoadingDay(true);
//       const res = await api.get("/daily-orders-report/", { params: { date: gDate } });
//       setDailyTotal(res.data.total_orders || 0);
//       setDailyFoods(res.data.foods || []);
//       setDailyOrders(res.data.orders || []);
//     } catch (err) {
//       showNotification("خطا در دریافت گزارش روزانه", "error");
//     } finally { setLoadingDay(false); }
//   };

//   const fetchMonthlyPresence = async (monthMoment) => {
//     try {
//       setLoadingMonth(true);
//       const gDateSample = monthMoment.clone().startOf("jMonth").format("YYYY-MM-DD");
//       const res = await api.get("/monthly-orders-status/", { params: { date: gDateSample } });
//       if (res.data && res.data.days_with_orders) {
//         setDaysWithOrders(res.data.days_with_orders.map(g => moment(g, "YYYY-MM-DD").locale('en').format("jYYYY-jMM-jDD")));
//       }
//     } catch (err) { showNotification("خطا در دریافت وضعیت ماهانه", "error"); } finally { setLoadingMonth(false); }
//   };

//   // ⭐ دریافت رتبه‌بندی کل غذاها برای مسئول سفارشات
//   const fetchGlobalRatings = async () => {
//     try {
//       const res = await api.get("food-ratings/");
//       setGlobalRatings(res.data.slice(0, 5)); // نمایش ۵ غذای محبوب
//     } catch (err) { console.error("Error fetching global ratings"); }
//   };

//   useEffect(() => {
//     fetchDailyReport(selectedDate);
//     fetchMonthlyPresence(currentMonth);
//     fetchGlobalRatings();
//   }, [currentMonth, selectedDate]);

//   const goToPrevMonth = () => setCurrentMonth(prev => prev.clone().subtract(1, "jMonth"));
//   const goToNextMonth = () => setCurrentMonth(prev => prev.clone().add(1, "jMonth"));
//   const daysInMonth = moment.jDaysInMonth(currentMonth.jYear(), currentMonth.jMonth());
//   let firstDay = (currentMonth.clone().startOf("jMonth").day() + 1) % 7;
//   const blanks = Array(firstDay).fill(null);
//   const days = Array.from({ length: daysInMonth }, (_, i) => currentMonth.clone().startOf("jMonth").add(i, "days"));
//   const handlePrint = () => window.print();
//   const selectedDateReadable = moment(selectedDate, "jYYYY-jMM-jDD").format("jD jMMMM jYYYY");

//   return (
//     <div dir="rtl" className="min-h-screen bg-[#f5efe6] text-[#332C26] font-[Vazir] flex flex-col pb-10">
//       <Navbar active="orders" />
//       <Toast show={showToast} message={toastMessage} type={toastType} />

//       <main className="flex-grow container mx-auto px-4 py-8 mt-28 printable">
//         <div className="flex flex-col gap-8">
          
//           <div className="flex flex-col sm:flex-row justify-between items-start gap-4 no-print">
//             <div>
//               <h2 className="text-3xl font-black text-[#332C26]">مدیریت و گزارشات نُوآفرین</h2>
//               <p className="text-sm text-[#6F6259] mt-1">پنل ویژه مسئول تدارکات جهت بررسی سفارشات و کیفیت غذاها.</p>
//             </div>
//             <button onClick={handlePrint} className="bg-[#4A403A] text-white py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-[#332C26] transition-all">
//               <span className="material-symbols-outlined">print</span> چاپ گزارش روز
//             </button>
//           </div>

//           <section className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
//             {/* تقویم */}
//             <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
//               <div className="flex justify-between items-center mb-6">
//                 <button onClick={goToPrevMonth} className="text-gray-400 hover:text-[#c97b39]">❮</button>
//                 <h3 className="font-bold text-lg text-[#503a2f]">{currentMonth.format("jMMMM jYYYY")}</h3>
//                 <button onClick={goToNextMonth} className="text-gray-400 hover:text-[#c97b39]">❯</button>
//               </div>
//               <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-3">
//                 {["ش", "ی", "د", "س", "چ", "پ", "ج"].map(d => <div key={d}>{d}</div>)}
//               </div>
//               <div className="grid grid-cols-7 gap-1 text-center">
//                 {blanks.map((_, i) => <div key={i}></div>)}
//                 {days.map(day => {
//                   const jStr = day.locale('en').format("jYYYY-jMM-jDD");
//                   const isSelected = jStr === selectedDate;
//                   const hasOrders = daysWithOrders.includes(jStr);
//                   const isDisabled = !hasOrders;
//                   return (
//                     <button key={jStr} disabled={isDisabled} onClick={() => !isDisabled && setSelectedDate(jStr)}
//                       className={`relative py-3 rounded-full text-sm transition-all ${isDisabled ? "bg-gray-100 text-gray-300 cursor-not-allowed" : isSelected ? "bg-[#c97b39] text-white font-bold shadow-md" : "hover:bg-orange-50 text-[#4A403A]"}`}
//                     >
//                       {day.format("jD")}
//                       {hasOrders && !isSelected && !isDisabled && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full"></span>}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* ⭐ بخش جدید: غذاهای محبوب در کنار تقویم */}
//             <aside className="bg-white rounded-2xl shadow-md p-6 border-r-4 border-[#e67e22]">
//               <h3 className="text-[#0f172a] text-lg font-black mb-4 flex items-center gap-2">
//                 <span className="material-symbols-outlined text-orange-500">award_star</span>
//                 محبوب‌ترین غذاها
//               </h3>
//               <div className="space-y-3">
//                 {globalRatings.map((item, index) => (
//                   <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
//                     <div className="flex items-center gap-3">
//                       <span className="font-black text-orange-500 w-4">{index + 1}</span>
//                       <span className="text-sm font-bold text-[#1e293b]">{item.food__name}</span>
//                     </div>
//                     <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow-sm border border-orange-50">
//                       <span className="text-xs font-black text-orange-600">{item.avg_rating?.toFixed(1)}</span>
//                       <span className="material-symbols-outlined !text-xs text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <p className="mt-6 text-[10px] text-gray-400 italic text-center">این رتبه‌بندی بر اساس تمامی فیدبک‌های پرسنل محاسبه شده است.</p>
//             </aside>
//           </section>

//           {/* آمار روزانه */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#D3C7B8] shadow-sm">
//               <h3 className="font-bold mb-4 text-[#4A403A]">📊 تفکیک غذاهای امروز ({selectedDateReadable})</h3>
//               {loadingDay ? <p className="text-center py-4">در حال دریافت آمار...</p> : dailyFoods.length ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {dailyFoods.map((f, idx) => (
//                     <div key={idx} className="flex justify-between items-center p-3 bg-[#F5EFE6] rounded-lg border border-[#e8dfd3]">
//                       <span className="font-bold">{f.name}</span>
//                       <span className="bg-[#4A403A] text-white px-3 py-1 rounded-md text-xs font-black">{f.count} عدد</span>
//                     </div>
//                   ))}
//                 </div>
//               ) : <p className="text-gray-400 text-sm">آماری برای این روز وجود ندارد.</p>}
//             </div>
//             <div className="bg-[#4A403A] p-6 rounded-xl text-white flex flex-col justify-center items-center shadow-lg relative overflow-hidden">
//               <div className="absolute -right-5 -top-5 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
//               <span className="text-sm opacity-80 mb-2">مجموع سفارشات</span>
//               <span className="text-6xl font-black">{loadingDay ? "..." : dailyTotal}</span>
//             </div>
//           </div>

//           {/* جدول لیست اسامی */}
//           <div className="bg-white rounded-xl shadow-sm border border-[#D3C7B8] overflow-x-auto">
//             <div className="p-5 bg-[#F5EFE6] border-b border-[#D3C7B8] flex justify-between items-center">
//               <h3 className="font-bold text-[#4A403A]">📋 لیست دقیق سفارش‌دهندگان</h3>
//               <span className="text-xs text-gray-500 font-bold">{selectedDateReadable}</span>
//             </div>
//             <table className="w-full text-right min-w-[500px]">
//               <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
//                 <tr>
//                   <th className="px-6 py-4">نام کارمند</th>
//                   <th className="px-6 py-4">غذای انتخابی</th>
//                   <th className="px-6 py-4 text-center">وضعیت تدارکات</th>
//                 </tr>
//               </thead>
//               <tbody className="text-sm">
//                 {loadingDay ? (
//                   <tr><td colSpan="3" className="py-10 text-center">در حال بارگذاری لیست...</td></tr>
//                 ) : dailyOrders.length ? (
//                   dailyOrders.map((o) => (
//                     <tr key={o.id} className="border-t border-[#F5EFE6] hover:bg-orange-50/30 transition-colors">
//                       <td className="px-6 py-4 font-bold text-[#332C26]">{o.employee}</td>
//                       <td className="px-6 py-4 text-gray-600 font-medium">{o.food || "نامشخص"}</td>
//                       <td className="px-6 py-4 text-center">
//                         <span className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-black">تایید شده</span>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr><td colSpan="3" className="py-10 text-center text-gray-400">سفارشی یافت نشد.</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>

//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           .printable { margin-top: 0 !important; padding: 0 !important; }
//           body { background: white !important; }
//         }
//       `}</style>
//     </div>
//   );
// }