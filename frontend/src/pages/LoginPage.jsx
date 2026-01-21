// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import api from "../api"; // استفاده از api.js
// import Toast from "../components/Toast";
// import "@fontsource/vazirmatn";

// export default function LoginPage() {
//   const navigate = useNavigate();
  
//   // view: 'login' | 'register' | 'reset'
//   const [view, setView] = useState("login");
//   const [loading, setLoading] = useState(false);

//   // فرم دیتا
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     confirmPassword: "",
//     firstName: "",
//     lastName: "",
//     newPassword: ""
//   });

//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("error");

//   // بررسی لاگین بودن
//   useEffect(() => {
//     const token = localStorage.getItem("access");
//     if (token) navigate("/menu", { replace: true });
//   }, [navigate]);

//   const showNotification = (message, type = "error") => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 3000);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // --- 1. لاگین (ورود) ---
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       // ✅ اصلاح شده: حذف auth/ اضافه
//       const res = await api.post("login/", {
//         username: formData.username,
//         password: formData.password
//       });
      
//       localStorage.setItem("access", res.data.access);
//       localStorage.setItem("refresh", res.data.refresh);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       showNotification("خوش آمدید!", "success");
//       setTimeout(() => navigate("/menu"), 1000);
//     } catch (err) {
//       console.error(err);
//       showNotification(err.response?.data?.error || "نام کاربری یا رمز عبور اشتباه است");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- 2. ثبت نام (Register) ---
//   const handleRegister = async (e) => {
//     e.preventDefault();
    
//     if (!formData.username || !formData.password) {
//         showNotification("لطفاً نام کاربری و رمز عبور را وارد کنید");
//         return;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       showNotification("رمز عبور و تکرار آن مطابقت ندارند");
//       return;
//     }

//     setLoading(true);
//     try {
//       // ✅ اصلاح شده: حذف auth/ اضافه
//       const payload = {
//           username: formData.username,
//           password: formData.password,
//           first_name: formData.firstName,
//           last_name: formData.lastName
//       };

//       const res = await api.post("register/", payload);

//       // لاگین خودکار بعد از ثبت نام
//       localStorage.setItem("access", res.data.access);
//       localStorage.setItem("refresh", res.data.refresh);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       showNotification("ثبت نام با موفقیت انجام شد!", "success");
//       setTimeout(() => navigate("/menu"), 1000);
//     } catch (err) {
//       console.error(err);
//       const errorMsg = err.response?.data?.error || "خطا در ثبت نام (نام کاربری تکراری است؟)";
//       showNotification(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- 3. فراموشی رمز (Reset) ---
//   const handleReset = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       // ✅ اصلاح شده: حذف auth/ اضافه
//       await api.post("reset-password/", {
//         username: formData.username,
//         new_password: formData.newPassword
//       });
//       showNotification("رمز عبور تغییر کرد. لطفاً وارد شوید.", "success");
//       setView("login");
//     } catch (err) {
//       showNotification(err.response?.data?.error || "کاربری با این نام پیدا نشد");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-[#f8f5f2] font-[Vazirmatn] px-4">
//       <Toast show={showToast} message={toastMessage} type={toastType} />

//       <motion.div 
//         layout
//         className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md text-center border border-[#e0d7cc]"
//       >
//         <div className="mb-6 flex justify-center text-[#c97b39]">
//           <span className="material-symbols-outlined text-6xl">restaurant_menu</span>
//         </div>
        
//         <AnimatePresence mode="wait">
          
//           {/* --- حالت ورود --- */}
//           {view === "login" && (
//             <motion.div
//               key="login"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//             >
//               <h1 className="text-2xl font-bold text-[#503a2f] mb-6">ورود به حساب</h1>
//               <form onSubmit={handleLogin} className="space-y-4">
//                 <input
//                   name="username"
//                   placeholder="نام کاربری"
//                   onChange={handleChange}
//                   className="input-field"
//                   required
//                 />
//                 <input
//                   name="password"
//                   type="password"
//                   placeholder="رمز عبور"
//                   onChange={handleChange}
//                   className="input-field"
//                   required
//                 />
//                 <div className="text-left">
//                   <button type="button" onClick={() => setView("reset")} className="text-sm text-[#c97b39] hover:underline">
//                     رمز عبور را فراموش کردید؟
//                   </button>
//                 </div>
//                 <button type="submit" disabled={loading} className="btn-primary w-full">
//                   {loading ? "..." : "ورود"}
//                 </button>
//               </form>
//               <div className="mt-6 text-sm text-gray-600">
//                 حساب کاربری ندارید؟{" "}
//                 <button onClick={() => setView("register")} className="text-[#c97b39] font-bold hover:underline">
//                   ثبت نام کنید
//                 </button>
//               </div>
//             </motion.div>
//           )}

//           {/* --- حالت ثبت نام --- */}
//           {view === "register" && (
//             <motion.div
//               key="register"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//             >
//               <h1 className="text-2xl font-bold text-[#503a2f] mb-6">ایجاد حساب جدید</h1>
//               <form onSubmit={handleRegister} className="space-y-4">
//                 <div className="flex gap-2">
//                   <input name="firstName" placeholder="نام" onChange={handleChange} className="input-field w-1/2" required />
//                   <input name="lastName" placeholder="نام خانوادگی" onChange={handleChange} className="input-field w-1/2" required />
//                 </div>
//                 <input name="username" placeholder="نام کاربری (انگلیسی)" onChange={handleChange} className="input-field" required />
//                 <input name="password" type="password" placeholder="رمز عبور" onChange={handleChange} className="input-field" required />
//                 <input name="confirmPassword" type="password" placeholder="تکرار رمز عبور" onChange={handleChange} className="input-field" required />
                
//                 <button type="submit" disabled={loading} className="btn-primary w-full">
//                   {loading ? "..." : "ثبت نام"}
//                 </button>
//               </form>
//               <div className="mt-6 text-sm text-gray-600">
//                 قبلاً ثبت نام کرده‌اید؟{" "}
//                 <button onClick={() => setView("login")} className="text-[#c97b39] font-bold hover:underline">
//                   وارد شوید
//                 </button>
//               </div>
//             </motion.div>
//           )}

//           {/* --- حالت فراموشی رمز --- */}
//           {view === "reset" && (
//             <motion.div
//               key="reset"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//             >
//               <h1 className="text-2xl font-bold text-[#503a2f] mb-2">بازیابی رمز عبور</h1>
//               <p className="text-sm text-gray-500 mb-6">نام کاربری خود را وارد کنید.</p>
//               <form onSubmit={handleReset} className="space-y-4">
//                 <input name="username" placeholder="نام کاربری" onChange={handleChange} className="input-field" required />
//                 <input name="newPassword" type="password" placeholder="رمز عبور جدید" onChange={handleChange} className="input-field" required />
                
//                 <button type="submit" disabled={loading} className="btn-primary w-full">
//                   {loading ? "..." : "تغییر رمز"}
//                 </button>
//               </form>
//               <div className="mt-6">
//                 <button onClick={() => setView("login")} className="text-gray-500 text-sm hover:text-[#503a2f]">
//                   بازگشت به ورود
//                 </button>
//               </div>
//             </motion.div>
//           )}

//         </AnimatePresence>
//       </motion.div>

//       <style>{`
//         .input-field {
//           width: 100%;
//           padding: 12px;
//           border-radius: 12px;
//           border: 1px solid #e0d7cc;
//           background-color: #fdfbf9;
//           outline: none;
//           transition: all 0.2s;
//         }
//         .input-field:focus {
//           border-color: #c97b39;
//           box-shadow: 0 0 0 3px rgba(201, 123, 57, 0.1);
//         }
//         .btn-primary {
//           background-color: #c97b39;
//           color: white;
//           padding: 12px;
//           border-radius: 12px;
//           font-weight: bold;
//           transition: background-color 0.2s;
//         }
//         .btn-primary:hover {
//           background-color: #b76c2d;
//         }
//         .btn-primary:disabled {
//           background-color: #d1d5db;
//           cursor: not-allowed;
//         }
//       `}</style>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api"; // استفاده از api.js بهینه‌شده
import Toast from "../components/Toast";
import "@fontsource/vazirmatn";

export default function LoginPage() {
  const navigate = useNavigate();

  const [view, setView] = useState("login"); // 'login' | 'register' | 'reset'
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    newPassword: ""
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  // بررسی لاگین بودن
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) navigate("/menu", { replace: true });
  }, [navigate]);

  const showNotification = (message, type = "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- ورود ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("login/", {
        username: formData.username,
        password: formData.password
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showNotification("خوش آمدید!", "success");
      setTimeout(() => navigate("/menu"), 1000);
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || "نام کاربری یا رمز عبور اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  // --- ثبت نام ---
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      showNotification("لطفاً نام کاربری و رمز عبور را وارد کنید");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showNotification("رمز عبور و تکرار آن مطابقت ندارند");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName
      };

      const res = await api.post("register/", payload);

      // لاگین خودکار بعد از ثبت نام
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showNotification("ثبت نام با موفقیت انجام شد!", "success");
      setTimeout(() => navigate("/menu"), 1000);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "خطا در ثبت نام (نام کاربری تکراری است؟)";
      showNotification(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- فراموشی رمز ---
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("reset-password/", {
        username: formData.username,
        new_password: formData.newPassword
      });
      showNotification("رمز عبور تغییر کرد. لطفاً وارد شوید.", "success");
      setView("login");
    } catch (err) {
      showNotification(err.response?.data?.error || "کاربری با این نام پیدا نشد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-[#f8f5f2] font-[Vazirmatn] px-4">
      <Toast show={showToast} message={toastMessage} type={toastType} />

      <motion.div layout className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md text-center border border-[#e0d7cc]">
        <div className="mb-6 flex justify-center text-[#c97b39]">
          <span className="material-symbols-outlined text-6xl">restaurant_menu</span>
        </div>

        <AnimatePresence mode="wait">
          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold text-[#503a2f] mb-6">ورود به حساب</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <input name="username" placeholder="نام کاربری" onChange={handleChange} className="input-field" required />
                <input name="password" type="password" placeholder="رمز عبور" onChange={handleChange} className="input-field" required />
                <div className="text-left">
                  <button type="button" onClick={() => setView("reset")} className="text-sm text-[#c97b39] hover:underline">
                    رمز عبور را فراموش کردید؟
                  </button>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "..." : "ورود"}</button>
              </form>
              <div className="mt-6 text-sm text-gray-600">
                حساب کاربری ندارید؟{" "}
                <button onClick={() => setView("register")} className="text-[#c97b39] font-bold hover:underline">ثبت نام کنید</button>
              </div>
            </motion.div>
          )}

          {view === "register" && (
            <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-bold text-[#503a2f] mb-6">ایجاد حساب جدید</h1>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="flex gap-2">
                  <input name="firstName" placeholder="نام" onChange={handleChange} className="input-field w-1/2" required />
                  <input name="lastName" placeholder="نام خانوادگی" onChange={handleChange} className="input-field w-1/2" required />
                </div>
                <input name="username" placeholder="نام کاربری (انگلیسی)" onChange={handleChange} className="input-field" required />
                <input name="password" type="password" placeholder="رمز عبور" onChange={handleChange} className="input-field" required />
                <input name="confirmPassword" type="password" placeholder="تکرار رمز عبور" onChange={handleChange} className="input-field" required />
                <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "..." : "ثبت نام"}</button>
              </form>
              <div className="mt-6 text-sm text-gray-600">
                قبلاً ثبت نام کرده‌اید؟{" "}
                <button onClick={() => setView("login")} className="text-[#c97b39] font-bold hover:underline">وارد شوید</button>
              </div>
            </motion.div>
          )}

          {view === "reset" && (
            <motion.div key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-bold text-[#503a2f] mb-2">بازیابی رمز عبور</h1>
              <p className="text-sm text-gray-500 mb-6">نام کاربری خود را وارد کنید.</p>
              <form onSubmit={handleReset} className="space-y-4">
                <input name="username" placeholder="نام کاربری" onChange={handleChange} className="input-field" required />
                <input name="newPassword" type="password" placeholder="رمز عبور جدید" onChange={handleChange} className="input-field" required />
                <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "..." : "تغییر رمز"}</button>
              </form>
              <div className="mt-6">
                <button onClick={() => setView("login")} className="text-gray-500 text-sm hover:text-[#503a2f]">بازگشت به ورود</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #e0d7cc;
          background-color: #fdfbf9;
          outline: none;
          transition: all 0.2s;
        }
        .input-field:focus {
          border-color: #c97b39;
          box-shadow: 0 0 0 3px rgba(201, 123, 57, 0.1);
        }
        .btn-primary {
          background-color: #c97b39;
          color: white;
          padding: 12px;
          border-radius: 12px;
          font-weight: bold;
          transition: background-color 0.2s;
        }
        .btn-primary:hover {
          background-color: #b76c2d;
        }
        .btn-primary:disabled {
          background-color: #d1d5db;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
