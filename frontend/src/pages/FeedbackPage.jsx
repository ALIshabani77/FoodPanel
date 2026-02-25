import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import moment from "moment-jalaali";
import api from "../api";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import "@fontsource/vazirmatn";

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [pendingMeals, setPendingMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMealId, setSelectedMealId] = useState("");
  const [selectedMealObject, setSelectedMealObject] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) navigate("/login", { replace: true });
    fetchPendingMeals();
  }, [navigate]);

  const fetchPendingMeals = async () => {
    try {
      const res = await api.get("feedback/pending/");
      setPendingMeals(res.data);
    } catch (err) {
      showNotification("خطا در دریافت لیست ناهارها", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMealChange = (e) => {
    const id = e.target.value;
    setSelectedMealId(id);
    const meal = pendingMeals.find(m => String(m.selection_id) === String(id));
    setSelectedMealObject(meal || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMealId) return showNotification("لطفاً یک وعده را انتخاب کنید", "error");
    if (rating === 0) return showNotification("امتیاز خود را ثبت نکرده‌اید", "error");
    
    setSubmitting(true);
    try {
      await api.post("feedback/create/", {
        selection_id: selectedMealId,
        rating: rating,
        comment: comment,
      });
      setFeedbackSubmitted(true);
      showNotification("بازخورد شما با موفقیت ثبت شد", "success");
    } catch (err) {
      showNotification("خطا در ارتباط با سرور", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#fcfaf8] font-[Vazirmatn] flex flex-col items-center">
      <Navbar active="feedback" />
      <Toast show={showToast} message={toastMessage} type={toastType} />

      {/* بخش هدر (تنظیم فاصله برای موبایل و دسکتاپ) */}
      <main className="w-full max-w-2xl px-4 sm:px-6 mt-24 sm:mt-32 space-y-6">
        <header className="text-center space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-black text-[#1e293b]"
          >
            ارزیابی کیفی خدمات غذایی
          </motion.h1>
          <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed px-2 sm:px-4">
            ثبت دیدگاه‌های شما، گامی بلند در جهت ارتقای سطح رفاهی شرکت ریل‌پرداز نُوآفرین است.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {!feedbackSubmitted ? (
            <motion.div
              key="lux-form"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl sm:rounded-[2.5rem] shadow-xl sm:shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                
                {/* 📱 بخش تصویر مخصوص موبایل (فقط موبایل نمایش داده می‌شود) */}
                <AnimatePresence>
                  {selectedMealObject && (
                    <motion.div 
                      initial={{ height: 0 }} animate={{ height: 160 }} exit={{ height: 0 }}
                      className="block md:hidden w-full overflow-hidden relative shadow-inner"
                    >
                      <img src={selectedMealObject.food_image} className="w-full h-full object-cover" alt="food" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                        <span className="text-white font-bold text-sm">{selectedMealObject.food_name}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 📝 بخش فرم (ریسپانسیو شده) */}
                <div className="flex-1 p-5 sm:p-10 space-y-6 sm:space-y-7">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm sm:text-base font-black text-[#334155] mb-2 block">وعده غذایی را انتخاب کنید:</label>
                      <select
                        id="meal-select"
                        value={selectedMealId}
                        onChange={handleMealChange}
                        className="w-full bg-[#f8fafc] border-2 border-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-sm sm:text-base font-black text-[#1e293b] focus:border-[#e67e22] focus:ring-0 transition-all outline-none"
                      >
                        <option value="">مشاهده تاریخچه سفارش‌ها...</option>
                        {pendingMeals.map((meal) => (
                          <option key={meal.selection_id} value={meal.selection_id}>
                            {meal.food_name} — {moment(meal.date).format("jYYYY/jMM/jDD")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm sm:text-base font-black text-[#334155] mb-3 block text-center">کیفیت سرویس چطور بود؟</label>
                      <div className="flex flex-row-reverse justify-center gap-2 sm:gap-3 py-1">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="transition-transform active:scale-90">
                            <span className="material-symbols-outlined !text-3xl sm:!text-5xl" style={{ fontVariationSettings: "'FILL' 1", color: (hoverRating || rating) >= star ? "#fbbf24" : "#e2e8f0" }}>star</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm sm:text-base font-black text-[#334155] mb-2 block">توضیحات (اختیاری):</label>
                      <textarea
                        rows="2"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="نظر شما برای ما ارزشمند است..."
                        className="w-full bg-[#f8fafc] border-2 border-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs sm:text-sm font-medium focus:border-[#e67e22] outline-none transition-all resize-none shadow-inner"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting || loading}
                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-[#e67e22] to-[#f39c12] text-white text-base sm:text-lg font-black rounded-xl sm:rounded-2xl shadow-lg active:scale-[0.98] transition-all disabled:grayscale"
                  >
                    {submitting ? "در حال ثبت..." : "تایید و ارسال نهایی"}
                  </button>
                </div>

                {/* 🖥️ بخش تصویر دسکتاپ (بدون تغییر) */}
                <div className="hidden md:flex w-72 bg-[#f8fafc] border-r border-gray-50 flex-col items-center justify-center relative group">
                  <AnimatePresence mode="wait">
                    {selectedMealObject ? (
                      <motion.div key={selectedMealObject.selection_id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full w-full">
                        <img 
                          src={selectedMealObject.food_image || "https://via.placeholder.com/400x600"} 
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          alt="food" 
                        />
                        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white text-lg font-black">{selectedMealObject.food_name}</p>
                          <p className="text-white/70 text-[10px] mt-1">نُوآفرین - ریل‌پرداز</p>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center p-8 space-y-4 opacity-30">
                        <span className="material-symbols-outlined !text-7xl">restaurant_menu</span>
                        <p className="text-sm font-bold uppercase tracking-widest">Select</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          ) : (
            /* 🏆 بخش موفقیت (ریسپانسیو شده) */
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl sm:rounded-[3rem] p-10 sm:p-16 text-center shadow-2xl border border-orange-50"
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-green-500 !text-4xl sm:!text-6xl">done_all</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1e293b]">بازخورد شما با موفقیت ثبت شد</h2>
              <p className="text-gray-400 mt-3 text-sm sm:text-base px-2">از همراهی شما در ارتقای کیفیت خدمات رفاهی متشکریم.</p>
              <button 
                onClick={() => { setFeedbackSubmitted(false); setSelectedMealId(""); setSelectedMealObject(null); setRating(0); setComment(""); fetchPendingMeals(); }}
                className="mt-8 px-10 py-3 sm:py-4 bg-[#fcfaf8] text-[#e67e22] text-sm sm:text-base font-black rounded-full border-2 border-[#e67e22] hover:bg-orange-50 transition-all"
              >
                ثبت نظر برای وعده‌ای دیگر
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}