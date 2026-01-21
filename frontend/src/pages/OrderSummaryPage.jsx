// // src/pages/OrderSummaryPage.jsx
// import React, { useEffect, useState } from "react";
// import moment from "moment-jalaali";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import "@fontsource/vazir";
// import { motion, AnimatePresence } from "framer-motion";
// import Toast from "../components/Toast";

// moment.loadPersian({ dialect: "persian-modern" });

// // ===============================
// // 🔥 استفاده از ENV — مهم برای لیارا
// // ===============================
// const API_BASE = process.env.REACT_APP_API_BASE;

// export default function OrderSummaryPage() {
//   const [menus, setMenus] = useState([]);
//   const [selections, setSelections] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalFoods, setModalFoods] = useState([]);
//   const [pickedFoodId, setPickedFoodId] = useState(null);
//   const [editingSelection, setEditingSelection] = useState(null);

//   const [hoveredRow, setHoveredRow] = useState(null);

//   // Toast
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");
//   const [showToast, setShowToast] = useState(false);

//   const showNotification = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 2500);
//   };

//   // ===============================
//   // ⛓ ساخت axios instance
//   // ===============================
//   const token = localStorage.getItem("access");

//   const api = axios.create({
//     baseURL: API_BASE,
//     headers: token ? { Authorization: `Bearer ${token}` } : {},
//   });

//   // ===============================
//   // 📌 گرفتن منو + انتخاب‌های کاربر
//   // ===============================
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const [menuRes, selectRes] = await Promise.all([
//           axios.get(`${API_BASE}/menu/`),
//           token ? api.get(`/user-selections/`) : Promise.resolve({ data: [] }),
//         ]);

//         setMenus(menuRes.data || []);
//         setSelections(selectRes.data || []);
//       } catch (err) {
//         console.error("❌ خطا در دریافت اطلاعات:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const formatJDate = (dateStr) =>
//     moment(dateStr, "YYYY-MM-DD").format("jD jMMMM jYYYY");

//   // ===============================
//   // ⏱ وضعیت امکان ویرایش
//   // ===============================
//   const getEditStatus = (menuDate) => {
//     const now = moment();
//     const target = moment(menuDate, "YYYY-MM-DD");
//     const diffHours = target.diff(now, "hours");
//     const diffDays = target.diff(now, "days");

//     if (diffHours <= 0)
//       return { canEdit: false, message: "⏰ مهلت ویرایش این سفارش تمام شده است" };

//     if (diffHours <= 24)
//       return {
//         canEdit: false,
//         message: `⚠️ کمتر از ۲۴ ساعت تا پایان مهلت (${diffHours} ساعت)`,
//       };

//     if (diffDays < 3)
//       return {
//         canEdit: true,
//         message: `🕒 ${Math.floor(diffHours)} ساعت تا پایان مهلت ویرایش`,
//       };

//     return {
//       canEdit: true,
//       message: `🗓 ${Math.floor(diffDays)} روز تا پایان مهلت ویرایش`,
//     };
//   };

//   // ===============================
//   // 🗑 حذف سفارش
//   // ===============================
//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/selection/${id}/`);
//       const fresh = await api.get("/user-selections/");
//       setSelections(fresh.data || []);
//       showNotification("✅ سفارش با موفقیت حذف شد", "success");
//     } catch (err) {
//       console.error("❌ خطا در حذف:", err);
//       showNotification("❌ خطا در حذف سفارش", "error");
//     }
//   };

//   // ===============================
//   // ✏️ شروع ویرایش
//   // ===============================
//   const handleEdit = (selection) => {
//     const menu = menus.find((m) => m.id === selection.menu.id);
//     setModalFoods(menu ? menu.foods : []);
//     setPickedFoodId(selection.selected_food?.id || null);
//     setEditingSelection(selection);
//     setIsModalOpen(true);
//   };

//   // ===============================
//   // 💾 ذخیره ویرایش
//   // ===============================
//   const saveEdit = async () => {
//     if (!editingSelection || !pickedFoodId) return;

//     try {
//       await api.post("/menu/select/", {
//         menu: editingSelection.menu.id,
//         food: pickedFoodId,
//       });

//       const fresh = await api.get("/user-selections/");
//       setSelections(fresh.data || []);
//       setIsModalOpen(false);

//       showNotification("✅ تغییرات با موفقیت ذخیره شد", "success");
//     } catch (err) {
//       console.error("❌ خطا در ذخیره:", err);
//       showNotification("❌ خطا در ذخیره تغییرات", "error");
//     }
//   };

//   return (
//     <div
//       dir="rtl"
//       className="min-h-screen bg-[#f8f5f2] font-[Vazir] text-gray-800 flex flex-col items-center relative"
//     >
//       {/* Toast */}
//       <Toast show={showToast} message={toastMessage} type={toastType} />

//       Navbar
//       <Navbar active="summary" />

//       {/* محتوا */}
//       <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full max-w-6xl">
//         <h1 className="text-3xl font-bold text-[#503a2f] mb-10 text-center">
//           خلاصه سفارش ماهانه 🍱
//         </h1>

//         <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full">
//           <table className="w-full text-right border-collapse">
//             <thead className="bg-[#f3ebe5] text-[#503a2f]">
//               <tr>
//                 <th className="py-3 px-6 text-sm font-semibold">تاریخ</th>
//                 <th className="py-3 px-6 text-sm font-semibold">غذای انتخابی</th>
//                 <th className="py-3 px-6 text-sm font-semibold text-left">عملیات</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="3" className="text-center text-gray-500 py-6 text-sm">
//                     در حال بارگذاری...
//                   </td>
//                 </tr>
//               ) : selections.length > 0 ? (
//                 selections.map((sel) => {
//                   const { canEdit, message } = getEditStatus(sel.menu.date);

//                   return (
//                     <tr
//                       key={sel.id}
//                       className="border-b hover:bg-[#faf5f0] transition"
//                       onMouseEnter={() => setHoveredRow(sel.id)}
//                       onMouseLeave={() => setHoveredRow(null)}
//                     >
//                       <td className="py-3 px-6">{formatJDate(sel.menu.date)}</td>

//                       <td className="py-3 px-6">
//                         {sel.selected_food?.name || "—"}
//                       </td>

//                       <td className="py-3 px-6 text-left relative">
//                         <div className="flex items-center justify-end gap-6">
//                           <button
//                             onClick={() => canEdit && handleEdit(sel)}
//                             disabled={!canEdit}
//                             className={`flex items-center gap-1 ${
//                               canEdit
//                                 ? "text-[#c97b39] hover:text-[#a15e2e]"
//                                 : "text-gray-400 cursor-not-allowed"
//                             }`}
//                           >
//                             ✏️ <span>ویرایش</span>
//                           </button>

//                           <button
//                             onClick={() => handleDelete(sel.id)}
//                             className="flex items-center gap-1 text-red-500 hover:text-red-600"
//                           >
//                             🗑 <span>حذف</span>
//                           </button>
//                         </div>

//                         {/* Tooltip */}
//                         <AnimatePresence>
//                           {hoveredRow === sel.id && (
//                             <motion.div
//                               initial={{ opacity: 0, y: 10 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               exit={{ opacity: 0, y: 10 }}
//                               transition={{ duration: 0.25 }}
//                               className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#c97b39] text-white text-xs rounded-md py-1 px-3 whitespace-nowrap shadow-lg"
//                             >
//                               {message}
//                             </motion.div>
//                           )}
//                         </AnimatePresence>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="text-center text-gray-500 py-6 text-sm">
//                     هنوز سفارشی ثبت نکرده‌اید 🍽️
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </main>

//       {/* مودال ویرایش */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             transition={{ duration: 0.3 }}
//             className="bg-[#FDF8F0] rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 text-right max-h-[85vh] overflow-y-auto"
//           >
//             <div className="flex justify-between items-center pb-4 border-b border-[#E0D7CC]">
//               <h3 className="text-xl font-bold">ویرایش سفارش ناهار</h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 rounded-full hover:bg-[#8B5F42]/10 transition"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="py-6">
//               <p className="mb-4">
//                 ناهار فعلی شما:{" "}
//                 <span className="font-semibold text-[#8B5F42]">
//                   {editingSelection?.selected_food?.name || "—"}
//                 </span>
//               </p>

//               <div className="space-y-4">
//                 {modalFoods.length ? (
//                   modalFoods.map((f) => {
//                     const active = pickedFoodId === f.id;

//                     return (
//                       <div
//                         key={f.id}
//                         onClick={() => setPickedFoodId(f.id)}
//                         className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer hover:bg-[#8B5F42]/5 transition ${
//                           active
//                             ? "bg-[#8B5F42]/10 ring-2 ring-[#8B5F42]"
//                             : "border-[#E0D7CC]"
//                         }`}
//                       >
//                         <img
//                           src={
//                             f.photo
//                               ? f.photo
//                               : "https://via.placeholder.com/80x80?text=No+Image"
//                           }
//                           alt={f.name}
//                           className="w-20 h-20 object-cover rounded-lg border border-[#E0D7CC]"
//                         />

//                         <div className="flex flex-col">
//                           <h4 className="font-bold text-[#503a2f]">{f.name}</h4>
//                           <p className="text-sm text-[#4F3C2C]/70 mt-1">
//                             {f.description || "بدون توضیحات"}
//                           </p>
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <div className="p-4 rounded-lg border border-[#E0D7CC] text-sm">
//                     برای این روز منویی ثبت نشده است.
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end gap-4 pt-4 border-t border-[#E0D7CC]">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-6 py-2 rounded-lg text-sm font-medium border border-[#E0D7CC] hover:bg-[#8B5F42]/10 transition"
//               >
//                 لغو
//               </button>

//               <button
//                 onClick={saveEdit}
//                 disabled={!pickedFoodId}
//                 className="px-6 py-2 rounded-lg text-sm font-medium bg-[#8B5F42] text-white hover:bg-[#8B5F42]/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
//               >
//                 ذخیره تغییرات
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// }









import React, { useEffect, useState } from "react";
import moment from "moment-jalaali";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import api from "../api"; // ✅ استفاده از api.js با refresh token
import "@fontsource/vazir";

moment.loadPersian({ dialect: "persian-modern" });

export default function OrderSummaryPage() {
  const [menus, setMenus] = useState([]);
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFoods, setModalFoods] = useState([]);
  const [pickedFoodId, setPickedFoodId] = useState(null);
  const [editingSelection, setEditingSelection] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // ===============================
  // 📌 دریافت منو و انتخاب‌های کاربر
  // ===============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [menuRes, selectRes] = await Promise.all([
          api.get("/menu/"),
          api.get("/user-selections/"),
        ]);

        setMenus(menuRes.data || []);
        setSelections(selectRes.data || []);
      } catch (err) {
        console.error("❌ خطا در دریافت اطلاعات:", err);
        showNotification("خطا در دریافت اطلاعات", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatJDate = (dateStr) =>
    moment(dateStr, "YYYY-MM-DD").format("jD jMMMM jYYYY");

  // ===============================
  // ⏱ وضعیت امکان ویرایش
  // ===============================
  const getEditStatus = (menuDate) => {
    const now = moment();
    const target = moment(menuDate, "YYYY-MM-DD");
    const diffHours = target.diff(now, "hours");
    const diffDays = target.diff(now, "days");

    if (diffHours <= 0)
      return { canEdit: false, message: "⏰ مهلت ویرایش این سفارش تمام شده است" };

    if (diffHours <= 24)
      return {
        canEdit: false,
        message: `⚠️ کمتر از ۲۴ ساعت تا پایان مهلت (${diffHours} ساعت)`,
      };

    if (diffDays < 3)
      return {
        canEdit: true,
        message: `🕒 ${Math.floor(diffHours)} ساعت تا پایان مهلت ویرایش`,
      };

    return {
      canEdit: true,
      message: `🗓 ${Math.floor(diffDays)} روز تا پایان مهلت ویرایش`,
    };
  };

  // ===============================
  // 🗑 حذف سفارش
  // ===============================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/selection/${id}/`);
      const fresh = await api.get("/user-selections/");
      setSelections(fresh.data || []);
      showNotification("✅ سفارش با موفقیت حذف شد", "success");
    } catch (err) {
      console.error("❌ خطا در حذف:", err);
      showNotification("❌ خطا در حذف سفارش", "error");
    }
  };

  // ===============================
  // ✏️ شروع ویرایش
  // ===============================
  const handleEdit = (selection) => {
    const menu = menus.find((m) => m.id === selection.menu.id);
    setModalFoods(menu ? menu.foods : []);
    setPickedFoodId(selection.selected_food?.id || null);
    setEditingSelection(selection);
    setIsModalOpen(true);
  };

  // ===============================
  // 💾 ذخیره ویرایش
  // ===============================
  const saveEdit = async () => {
    if (!editingSelection || !pickedFoodId) return;

    try {
      await api.post("/menu/select/", {
        menu: editingSelection.menu.id,
        food: pickedFoodId,
      });

      const fresh = await api.get("/user-selections/");
      setSelections(fresh.data || []);
      setIsModalOpen(false);

      showNotification("✅ تغییرات با موفقیت ذخیره شد", "success");
    } catch (err) {
      console.error("❌ خطا در ذخیره:", err);
      showNotification("❌ خطا در ذخیره تغییرات", "error");
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f8f5f2] font-[Vazir] text-gray-800 flex flex-col items-center relative"
    >
      <Toast show={showToast} message={toastMessage} type={toastType} />

      <Navbar active="summary" />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-[#503a2f] mb-10 text-center">
          خلاصه سفارش ماهانه 🍱
        </h1>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full">
          <table className="w-full text-right border-collapse">
            <thead className="bg-[#f3ebe5] text-[#503a2f]">
              <tr>
                <th className="py-3 px-6 text-sm font-semibold">تاریخ</th>
                <th className="py-3 px-6 text-sm font-semibold">غذای انتخابی</th>
                <th className="py-3 px-6 text-sm font-semibold text-left">عملیات</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-6 text-sm">
                    در حال بارگذاری...
                  </td>
                </tr>
              ) : selections.length > 0 ? (
                selections.map((sel) => {
                  const { canEdit, message } = getEditStatus(sel.menu.date);

                  return (
                    <tr
                      key={sel.id}
                      className="border-b hover:bg-[#faf5f0] transition"
                      onMouseEnter={() => setHoveredRow(sel.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="py-3 px-6">{formatJDate(sel.menu.date)}</td>
                      <td className="py-3 px-6">{sel.selected_food?.name || "—"}</td>
                      <td className="py-3 px-6 text-left relative">
                        <div className="flex items-center justify-end gap-6">
                          <button
                            onClick={() => canEdit && handleEdit(sel)}
                            disabled={!canEdit}
                            className={`flex items-center gap-1 ${
                              canEdit
                                ? "text-[#c97b39] hover:text-[#a15e2e]"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            ✏️ <span>ویرایش</span>
                          </button>

                          <button
                            onClick={() => handleDelete(sel.id)}
                            className="flex items-center gap-1 text-red-500 hover:text-red-600"
                          >
                            🗑 <span>حذف</span>
                          </button>
                        </div>

                        {/* Tooltip */}
                        <AnimatePresence>
                          {hoveredRow === sel.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.25 }}
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#c97b39] text-white text-xs rounded-md py-1 px-3 whitespace-nowrap shadow-lg"
                            >
                              {message}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-6 text-sm">
                    هنوز سفارشی ثبت نکرده‌اید 🍽️
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* مودال ویرایش */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-[#FDF8F0] rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 text-right max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-4 border-b border-[#E0D7CC]">
              <h3 className="text-xl font-bold">ویرایش سفارش ناهار</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#8B5F42]/10 transition"
              >
                ✕
              </button>
            </div>

            <div className="py-6">
              <p className="mb-4">
                ناهار فعلی شما:{" "}
                <span className="font-semibold text-[#8B5F42]">
                  {editingSelection?.selected_food?.name || "—"}
                </span>
              </p>

              <div className="space-y-4">
                {modalFoods.length ? (
                  modalFoods.map((f) => {
                    const active = pickedFoodId === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => setPickedFoodId(f.id)}
                        className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer hover:bg-[#8B5F42]/5 transition ${
                          active
                            ? "bg-[#8B5F42]/10 ring-2 ring-[#8B5F42]"
                            : "border-[#E0D7CC]"
                        }`}
                      >
                        <img
                          src={
                            f.photo
                              ? f.photo
                              : "https://via.placeholder.com/80x80?text=No+Image"
                          }
                          alt={f.name}
                          className="w-20 h-20 object-cover rounded-lg border border-[#E0D7CC]"
                        />

                        <div className="flex flex-col">
                          <h4 className="font-bold text-[#503a2f]">{f.name}</h4>
                          <p className="text-sm text-[#4F3C2C]/70 mt-1">
                            {f.description || "بدون توضیحات"}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 rounded-lg border border-[#E0D7CC] text-sm">
                    برای این روز منویی ثبت نشده است.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-[#E0D7CC]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-lg text-sm font-medium border border-[#E0D7CC] hover:bg-[#8B5F42]/10 transition"
              >
                لغو
              </button>

              <button
                onClick={saveEdit}
                disabled={!pickedFoodId}
                className="px-6 py-2 rounded-lg text-sm font-medium bg-[#8B5F42] text-white hover:bg-[#8B5F42]/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ذخیره تغییرات
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
