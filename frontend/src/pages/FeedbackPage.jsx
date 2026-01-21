// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import api from "../api";
// import Navbar from "../components/Navbar";
// import Toast from "../components/Toast";
// import "@fontsource/vazirmatn";

// export default function FeedbackPage() {
//   const [pendingMeals, setPendingMeals] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // استیت‌های فرم مودال
//   const [selectedMeal, setSelectedMeal] = useState(null);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   const showNotification = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 3000);
//   };

//   // دریافت لیست غذاهای منتظر نظر
//   useEffect(() => {
//     fetchPendingMeals();
//   }, []);

//   const fetchPendingMeals = async () => {
//     try {
//       const res = await api.get("feedback/pending/");
//       setPendingMeals(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openFeedbackModal = (meal) => {
//     setSelectedMeal(meal);
//     setRating(5); // پیش‌فرض ۵ ستاره
//     setComment("");
//   };

//   const closeFeedbackModal = () => {
//     setSelectedMeal(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!rating) return showNotification("لطفاً امتیاز دهید", "error");
    
//     setSubmitting(true);
//     try {
//       await api.post("feedback/create/", {
//         selection_id: selectedMeal.selection_id,
//         rating: rating,
//         comment: comment
//       });

//       showNotification("نظر شما با موفقیت ثبت شد! ممنون 💖", "success");
      
//       // حذف آیتم از لیست بدون رفرش
//       setPendingMeals((prev) => prev.filter(m => m.selection_id !== selectedMeal.selection_id));
//       closeFeedbackModal();

//     } catch (err) {
//       console.error(err);
//       showNotification("خطا در ثبت نظر.", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div dir="rtl" className="min-h-screen bg-[#f8f5f2] font-[Vazirmatn] flex flex-col">
//       <Navbar active="feedback" />
//       <Toast show={showToast} message={toastMessage} type={toastType} />

//       <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-20">
//         <div className="max-w-4xl mx-auto">
          
//           <div className="text-center mb-10">
//             <h1 className="text-3xl font-bold text-[#503a2f] mb-3">ثبت بازخورد و امتیاز</h1>
//             <p className="text-[#897561]">
//               نظرات شما به ما کمک می‌کند کیفیت غذاها را بهتر کنیم.
//             </p>
//           </div>

//           {loading ? (
//             <div className="text-center text-gray-400 mt-20">در حال بارگذاری...</div>
//           ) : pendingMeals.length === 0 ? (
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-center bg-white p-10 rounded-3xl shadow-sm border border-[#e0d7cc]"
//             >
//               <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
//               <h3 className="text-xl font-bold text-[#503a2f]">همه چیز عالیست!</h3>
//               <p className="text-gray-500 mt-2">شما برای تمام وعده‌های گذشته نظر خود را ثبت کرده‌اید.</p>
//             </motion.div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <AnimatePresence>
//                 {pendingMeals.map((meal) => (
//                   <motion.div
//                     key={meal.selection_id}
//                     layout
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.9 }}
//                     className="bg-white p-4 rounded-2xl shadow-sm border border-[#e0d7cc] flex gap-4 items-center hover:shadow-md transition-shadow"
//                   >
//                     {/* عکس غذا */}
//                     <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
//                       {meal.food_image ? (
//                         <img src={meal.food_image} alt={meal.food_name} className="w-full h-full object-cover" />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center text-gray-300">
//                            <span className="material-symbols-outlined text-3xl">restaurant</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* مشخصات */}
//                     <div className="flex-grow">
//                       <h3 className="font-bold text-[#503a2f]">{meal.food_name}</h3>
//                       <p className="text-sm text-gray-500 mb-3">{meal.date_str}</p>
//                       <button 
//                         onClick={() => openFeedbackModal(meal)}
//                         className="text-sm bg-[#c97b39] text-white px-4 py-2 rounded-lg hover:bg-[#b76c2d] transition-colors w-full sm:w-auto"
//                       >
//                         ثبت نظر ✍️
//                       </button>
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* --- مودال ثبت نظر --- */}
//       <AnimatePresence>
//         {selectedMeal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             onClick={closeFeedbackModal}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 50 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 50 }}
//               className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="text-center">
//                 <h3 className="text-xl font-bold text-[#503a2f] mb-1">{selectedMeal.food_name}</h3>
//                 <p className="text-xs text-gray-400 mb-6">{selectedMeal.date_str}</p>

//                 {/* ستاره‌ها */}
//                 <div className="flex justify-center gap-2 mb-6" dir="ltr">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                       key={star}
//                       type="button"
//                       onClick={() => setRating(star)}
//                       className={`text-4xl transition-transform hover:scale-110 ${
//                         star <= rating ? "text-yellow-400" : "text-gray-200"
//                       }`}
//                     >
//                       ★
//                     </button>
//                   ))}
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                   <textarea
//                     rows="4"
//                     placeholder="نظر شما درباره کیفیت غذا؟ (اختیاری)"
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                     className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#c97b39] focus:ring-1 focus:ring-[#c97b39] outline-none resize-none mb-6 text-sm"
//                   ></textarea>

//                   <div className="flex gap-3">
//                     <button
//                       type="submit"
//                       disabled={submitting}
//                       className="flex-1 bg-[#c97b39] text-white py-3 rounded-xl font-bold hover:bg-[#b76c2d] transition-colors disabled:opacity-50"
//                     >
//                       {submitting ? "..." : "ثبت بازخورد"}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={closeFeedbackModal}
//                       className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
//                     >
//                       لغو
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }




// src/pages/FeedbackPage.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ axios instance با refresh token خودکار
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import "@fontsource/vazirmatn";

export default function FeedbackPage() {
  const navigate = useNavigate();

  const [pendingMeals, setPendingMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // مودال فرم بازخورد
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // ✅ بررسی دسترسی کاربر
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  // دریافت غذاهای منتظر نظر
  useEffect(() => {
    fetchPendingMeals();
  }, []);

  const fetchPendingMeals = async () => {
    try {
      const res = await api.get("feedback/pending/");
      setPendingMeals(res.data);
    } catch (err) {
      console.error("Feedback Fetch Error:", err);
      showNotification("خطا در دریافت داده‌ها.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openFeedbackModal = (meal) => {
    setSelectedMeal(meal);
    setRating(5);
    setComment("");
  };

  const closeFeedbackModal = () => {
    setSelectedMeal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return showNotification("لطفاً امتیاز دهید", "error");
    
    setSubmitting(true);
    try {
      await api.post("feedback/create/", {
        selection_id: selectedMeal.selection_id,
        rating,
        comment,
      });

      showNotification("نظر شما با موفقیت ثبت شد! 💖", "success");

      setPendingMeals(prev =>
        prev.filter(m => m.selection_id !== selectedMeal.selection_id)
      );
      closeFeedbackModal();
    } catch (err) {
      console.error("Feedback Submit Error:", err.response || err);
      showNotification("خطا در ثبت نظر.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8f5f2] font-[Vazirmatn] flex flex-col">
      <Navbar active="feedback" />
      <Toast show={showToast} message={toastMessage} type={toastType} />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#503a2f] mb-3">ثبت بازخورد و امتیاز</h1>
            <p className="text-[#897561]">نظرات شما به ما کمک می‌کند کیفیت غذاها را بهتر کنیم.</p>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 mt-20">در حال بارگذاری...</div>
          ) : pendingMeals.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-white p-10 rounded-3xl shadow-sm border border-[#e0d7cc]"
            >
              <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
              <h3 className="text-xl font-bold text-[#503a2f]">همه چیز عالیست!</h3>
              <p className="text-gray-500 mt-2">برای تمام وعده‌های گذشته نظر خود را ثبت کرده‌اید.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {pendingMeals.map((meal) => (
                  <motion.div
                    key={meal.selection_id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-[#e0d7cc] flex gap-4 items-center hover:shadow-md transition-shadow"
                  >
                    <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      {meal.food_image ? (
                        <img src={meal.food_image} alt={meal.food_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                           <span className="material-symbols-outlined text-3xl">restaurant</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-bold text-[#503a2f]">{meal.food_name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{meal.date_str}</p>
                      <button 
                        onClick={() => openFeedbackModal(meal)}
                        className="text-sm bg-[#c97b39] text-white px-4 py-2 rounded-lg hover:bg-[#b76c2d] transition-colors w-full sm:w-auto"
                      >
                        ثبت نظر ✍️
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* --- مودال ثبت نظر --- */}
      <AnimatePresence>
        {selectedMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeFeedbackModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#503a2f] mb-1">{selectedMeal.food_name}</h3>
                <p className="text-xs text-gray-400 mb-6">{selectedMeal.date_str}</p>

                {/* ستاره‌ها */}
                <div className="flex justify-center gap-2 mb-6" dir="ltr">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-4xl transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  <textarea
                    rows="4"
                    placeholder="نظر شما درباره کیفیت غذا؟ (اختیاری)"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#c97b39] focus:ring-1 focus:ring-[#c97b39] outline-none resize-none mb-6 text-sm"
                  ></textarea>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-[#c97b39] text-white py-3 rounded-xl font-bold hover:bg-[#b76c2d] transition-colors disabled:opacity-50"
                    >
                      {submitting ? "..." : "ثبت بازخورد"}
                    </button>
                    <button
                      type="button"
                      onClick={closeFeedbackModal}
                      className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                    >
                      لغو
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
