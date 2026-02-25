// import React, { useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom"; // ✅ اضافه شد
// import api from "../api";
// import Navbar from "../components/Navbar";
// import Toast from "../components/Toast";
// import "@fontsource/vazir";

// export default function ProfilePage() {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [avatar, setAvatar] = useState(null); 
//   const [avatarFile, setAvatarFile] = useState(null); 
  
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const fileInputRef = useRef(null);
//   const navigate = useNavigate(); // ✅ تعریف navigate

//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   const showNotification = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 3000);
//   };

//   // 1. دریافت اطلاعات پروفایل
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await api.get("profile/"); 
//         const { first_name, last_name, avatar } = res.data;
        
//         setFirstName(first_name || "");
//         setLastName(last_name || "");
//         setAvatar(avatar);
        
//         updateLocalStorage(first_name, last_name, avatar);

//       } catch (err) {
//         console.error("Profile Fetch Error:", err);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const updateLocalStorage = (fName, lName, userAvatar) => {
//     const userData = JSON.parse(localStorage.getItem("user") || "{}");
//     userData.first_name = fName;
//     userData.last_name = lName;
//     if (userAvatar) userData.avatar = userAvatar;
    
//     localStorage.setItem("user", JSON.stringify(userData));
//     window.dispatchEvent(new Event("userUpdated"));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setAvatarFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatar(reader.result);
//       };
//       reader.readAsDataURL(file);
//       setIsModalOpen(false);
//     }
//   };

//   // 3. ارسال و ذخیره اطلاعات
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("first_name", firstName);
//     formData.append("last_name", lastName);
    
//     if (avatarFile) {
//         formData.append("avatar", avatarFile);
//     }

//     try {
//       const res = await api.patch("profile/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
      
//       showNotification("تغییرات با موفقیت ذخیره شد!", "success");
      
//       const newAvatarUrl = res.data.avatar;
//       setAvatar(newAvatarUrl);
//       setAvatarFile(null);
      
//       updateLocalStorage(firstName, lastName, newAvatarUrl);

//     } catch (err) {
//       console.error("Upload Error:", err.response?.data || err);
//       if (err.response && err.response.status === 400) {
//           showNotification("اطلاعات ارسال شده معتبر نیست.", "error");
//       } else {
//           showNotification("خطا در ذخیره تغییرات.", "error");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ تابع خروج
//   const handleLogout = () => {
//     localStorage.clear(); // پاک کردن اطلاعات
//     navigate("/login", { replace: true }); // رفتن به صفحه لاگین
//   };

//   return (
//     <div dir="rtl" className="min-h-screen bg-[#f8f5f2] font-[Vazir] flex flex-col">
//       <Navbar active="profile" />
//       <Toast show={showToast} message={toastMessage} type={toastType} />

//       <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-20">
//         <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-[#e0d7cc]">
//           <div className="mb-8 border-b border-[#e0d7cc] pb-4 flex justify-between items-center">
//             <div>
//                 <h2 className="text-3xl font-bold tracking-tight text-[#503a2f]">پروفایل کاربری</h2>
//                 <p className="mt-2 text-[#897561]">ویرایش اطلاعات شخصی و تصویر نمایه</p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
            
//             {/* --- بخش عکس پروفایل --- */}
//             <div className="flex flex-col sm:flex-row items-center gap-6">
//               <div className="relative w-28 h-28 rounded-full bg-[#e6e0db] flex items-center justify-center overflow-hidden border-4 border-[#c97b39] shadow-md">
//                 {avatar ? (
//                   <img
//                     src={avatar}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <img 
//                     src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
//                     alt="Default"
//                     className="w-full h-full object-cover opacity-60"
//                   />
//                 )}
//               </div>

//               <div className="flex flex-col gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(true)}
//                   className="px-5 py-2 text-sm rounded-xl bg-[#c97b39] text-white font-bold hover:bg-[#b76c2d] transition-all shadow-sm"
//                 >
//                   تغییر عکس پروفایل 📸
//                 </button>
//                 <p className="text-xs text-gray-400 text-center sm:text-right">فرمت‌های مجاز: JPG, PNG</p>
//               </div>
//             </div>

//             {/* --- ورودی‌های متن --- */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                 <label className="block text-sm font-bold mb-2 text-[#503a2f]" htmlFor="firstName">
//                     نام
//                 </label>
//                 <input
//                     id="firstName"
//                     type="text"
//                     value={firstName}
//                     onChange={(e) => setFirstName(e.target.value)}
//                     className="w-full rounded-xl border border-[#e0d7cc] bg-[#f8f7f6] p-3 focus:ring-2 focus:ring-[#c97b39] focus:border-[#c97b39] outline-none transition"
//                 />
//                 </div>

//                 <div>
//                 <label className="block text-sm font-bold mb-2 text-[#503a2f]" htmlFor="lastName">
//                     نام خانوادگی
//                 </label>
//                 <input
//                     id="lastName"
//                     type="text"
//                     value={lastName}
//                     onChange={(e) => setLastName(e.target.value)}
//                     className="w-full rounded-xl border border-[#e0d7cc] bg-[#f8f7f6] p-3 focus:ring-2 focus:ring-[#c97b39] focus:border-[#c97b39] outline-none transition"
//                 />
//                 </div>
//             </div>

//             {/* --- دکمه‌های عملیات --- */}
//             <div className="pt-6 flex flex-wrap items-center justify-start gap-4 border-t border-[#e0d7cc]">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-8 py-3 rounded-xl bg-[#c97b39] text-white font-bold hover:bg-[#b76c2d] transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
//               >
//                 {loading ? "در حال پردازش..." : "ذخیره تغییرات"}
//               </button>
              
//               <button
//                 type="button"
//                 onClick={() => window.history.back()}
//                 className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
//               >
//                 بازگشت
//               </button>

//               {/* ✅ دکمه جدید خروج */}
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="px-6 py-3 rounded-xl bg-red-100 text-red-600 font-bold hover:bg-red-200 transition-colors mr-auto"
//               >
//                 خروج از حساب
//               </button>
//             </div>
//           </form>
//         </div>
//       </main>

//       {/* --- مودال انتخاب عکس --- */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             onClick={() => setIsModalOpen(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center border-t-4 border-[#c97b39]"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h3 className="text-xl font-bold mb-6 text-[#503a2f]">انتخاب تصویر جدید</h3>
              
//               <div className="space-y-4">
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current.click()}
//                   className="w-full px-4 py-3 text-base rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 border-2 border-dashed border-gray-300 transition-colors"
//                 >
//                   📂 انتخاب از گالری
//                 </button>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleFileChange}
//                   accept="image/*"
//                   className="hidden"
//                 />
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="mt-6 text-sm text-gray-500 hover:text-red-500 font-medium"
//               >
//                 لغو
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import "@fontsource/vazirmatn";

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    organizationName: "", 
    newPassword: "",
    confirmPassword: "", 
  });
  
  const [showPassword, setShowPassword] = useState(false); 
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Notifications
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
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("profile/");
      const { first_name, last_name, username, organization_name, avatar } = res.data;

      setFormData(prev => ({
        ...prev,
        firstName: first_name || "",
        lastName: last_name || "",
        username: username || "",
        organizationName: organization_name || "بدون سازمان",
      }));
      setAvatar(avatar);
      updateLocalStorage(first_name, last_name, username, avatar);
    } catch (err) {
      showNotification("خطا در دریافت اطلاعات پروفایل.", "error");
    }
  };

  const updateLocalStorage = (fName, lName, uName, userAvatar) => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    userData.first_name = fName;
    userData.last_name = lName;
    userData.username = uName;
    if (userAvatar) userData.avatar = userAvatar;
    localStorage.setItem("user", JSON.stringify(userData));
    window.dispatchEvent(new Event("userUpdated"));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ⭐ محدودیت ۲ مگابایت طبق درخواست شما حذف شد
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
      setIsModalOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return showNotification("رمز عبور و تکرار آن مطابقت ندارند.", "error");
    }

    setLoading(true);
    const data = new FormData();
    data.append("first_name", formData.firstName);
    data.append("last_name", formData.lastName);
    data.append("username", formData.username);
    if (avatarFile) data.append("avatar", avatarFile);
    if (formData.newPassword) data.append("new_password", formData.newPassword);

    try {
      const res = await api.patch("profile/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showNotification("تغییرات با موفقیت ذخیره شد!", "success");
      setAvatar(res.data.avatar);
      setAvatarFile(null);
      setFormData(prev => ({ ...prev, newPassword: "", confirmPassword: "" }));
      updateLocalStorage(formData.firstName, formData.lastName, formData.username, res.data.avatar);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "خطا در ثبت تغییرات.";
      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#fcfaf8] font-[Vazirmatn] pb-10 relative overflow-hidden">
      <Navbar active="profile" />
      <Toast show={showToast} message={toastMessage} type={toastType} />

      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-[100px] -z-10"></div>
      
      {/* ⭐ اصلاح mt-32 در موبایل برای جلوگیری از رفتن زیر Navbar */}
      <main className="max-w-4xl mx-auto px-4 mt-32 sm:mt-28 lg:mt-24 relative z-10">
        
        <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 px-2 text-center md:text-right">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1e293b]">حساب کاربری</h1>
            <p className="text-gray-400 font-bold mt-1 text-xs sm:text-sm italic">مدیریت مشخصات پرسنلی شرکت ریل‌پرداز نُوآفرین</p>
          </div>
          <div className="bg-white/70 backdrop-blur-md border border-white px-5 py-2.5 rounded-2xl shadow-sm flex items-center justify-center gap-3 self-center md:self-end">
             <span className="material-symbols-outlined text-orange-500 text-xl">location_on</span>
             <span className="text-xs sm:text-sm font-black text-[#1e293b]">شعبه: {formData.organizationName}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-5 sm:p-7 shadow-xl border border-gray-50 text-center space-y-6">
               {/* ⭐ اصلاح کادر عکس: تغییر از w-24 h-24 به ابعاد افقی طبق عکس شما */}
               <div className="relative w-32 h-24 sm:w-36 sm:h-28 mx-auto group">
                 <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-orange-50 shadow-inner">
                    <img src={avatar || "https://via.placeholder.com/150"} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 </div>
                 <button onClick={() => setIsModalOpen(true)} className="absolute -bottom-1 -right-1 w-8 h-8 sm:w-10 sm:h-10 bg-[#e67e22] text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-all">
                   <span className="material-symbols-outlined text-base sm:text-lg">photo_camera</span>
                 </button>
               </div>
               <div>
                  <h3 className="text-xl font-black text-[#1e293b]">{formData.firstName} {formData.lastName}</h3>
                  <p className="text-[10px] text-orange-400 font-black mt-2 bg-orange-50 py-1 px-2 rounded-lg inline-block">فرمت های مجاز: JPG, PNG</p>
               </div>
               <button onClick={handleLogout} className="w-full py-3 rounded-2xl bg-red-50 text-red-500 font-black text-xs sm:text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                 <span className="material-symbols-outlined text-lg">logout</span> خروج
               </button>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.form 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit} 
              className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-white space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-orange-500 border-r-4 border-orange-500 pr-3 font-black text-xs uppercase tracking-widest">
                   <span className="material-symbols-outlined">person</span> مشخصات فردی
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-black text-gray-400 mr-2 uppercase">نام</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} className="modern-input" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-black text-gray-400 mr-2 uppercase">نام خانوادگی</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} className="modern-input" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-orange-500 border-r-4 border-orange-500 pr-3 font-black text-xs uppercase tracking-widest">
                   <span className="material-symbols-outlined">security</span> امنیت و حساب
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-black text-gray-400 mr-2 uppercase">نام کاربری (ID)</label>
                    <input name="username" value={formData.username} onChange={handleChange} className="modern-input" />
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-[13px] font-black text-gray-400 mr-2 uppercase">رمز عبور جدید</label>
                    <div className="relative">
                        <input name="newPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.newPassword} onChange={handleChange} className="modern-input pl-10" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors">
                            <span className="material-symbols-outlined !text-lg">{showPassword ? "visibility" : "visibility_off"}</span>
                        </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[13px] font-black text-gray-400 mr-2 uppercase">تایید رمز عبور جدید</label>
                    <input name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="تکرار رمز عبور..." value={formData.confirmPassword} onChange={handleChange} className="modern-input" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full h-14 bg-gradient-to-r from-[#e67e22] to-[#f39c12] text-white text-base font-black rounded-2xl shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:grayscale">
                  {loading ? "در حال ثبت..." : "ذخیره تغییرات ✅"}
                </button>
              </div>
            </motion.form>
          </div>

        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2rem] shadow-2xl p-7 sm:p-8 w-full max-w-sm text-center border border-white" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-black mb-6 text-[#1e293b]">بروزرسانی تصویر</h3>
              <div onClick={() => fileInputRef.current.click()} className="py-8 sm:py-10 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50 cursor-pointer hover:bg-orange-50 transition-all group">
                <span className="material-symbols-outlined text-4xl text-gray-300 group-hover:text-orange-400">upload_file</span>
                <p className="text-sm font-bold text-gray-400 mt-2">انتخاب فایل</p>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <button onClick={() => setIsModalOpen(false)} className="mt-6 text-gray-400 text-xs font-black hover:text-red-500">انصراف</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .modern-input { width: 100%; padding: 10px 16px; sm:padding: 12px 18px; border-radius: 1.1rem; border: 2px solid #f8fafc; background-color: #f8fafc; font-weight: 800; font-size: 0.85rem; color: #1e293b; outline: none; transition: all 0.3s; text-align: right; }
        .modern-input:focus { border-color: #e67e22; background-color: #ffffff; box-shadow: 0 10px 20px -10px rgba(230, 126, 34, 0.1); }
      `}</style>
    </div>
  );
}