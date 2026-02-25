import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Toast from "../components/Toast";
import "@fontsource/vazirmatn";

export default function LoginPage() {
  const navigate = useNavigate();
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    newPassword: "",
    organization: ""
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) navigate("/menu", { replace: true });
    
    api.get("organizations/")
      .then(res => setOrganizations(res.data))
      .catch(err => console.error("Error fetching orgs"));
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
      setTimeout(() => navigate("/menu"), 800);
    } catch (err) {
      showNotification(err.response?.data?.error || "اطلاعات ورود صحیح نیست");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.organization) {
      showNotification("تکمیل تمامی موارد الزامی است");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showNotification("رمز عبور با تکرار آن یکی نیست");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        organization: formData.organization
      };
      await api.post("register/", payload);
      showNotification("ثبت نام با موفقیت انجام شد", "success");
      setView("login");
    } catch (err) {
      showNotification("نام کاربری تکراری است یا خطایی رخ داده");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-[#fcfaf8] font-[Vazirmatn] px-4 relative">
      {/* دایره‌های لوکس پس‌زمینه */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-80"></div>

      <Toast show={showToast} message={toastMessage} type={toastType} />

      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white/70 backdrop-blur-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] rounded-[3rem] p-8 sm:p-12 w-full border border-white relative z-10 transition-all duration-500 ${view === "register" ? "max-w-2xl" : "max-w-md"}`}
      >
        <header className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#e67e22] to-[#f39c12] rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <span className="material-symbols-outlined text-white text-3xl">corporate_fare</span>
          </div>
          <h1 className="text-3xl font-black text-[#1e293b]">ریل‌پرداز نُوآفرین</h1>
          <p className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-widest">Employee Portal</p>
        </header>

        <AnimatePresence mode="wait">
          {view === "login" && (
            <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <form onSubmit={handleLogin} className="space-y-4">
                <input name="username" placeholder="نام کاربری" onChange={handleChange} className="luxury-input" required />
                <input name="password" type="password" placeholder="رمز عبور" onChange={handleChange} className="luxury-input" required />
                <button type="submit" disabled={loading} className="luxury-btn w-full mt-2">
                  {loading ? "در حال ورود..." : "ورود به حساب"}
                </button>
              </form>
              <div className="mt-8 text-sm font-bold text-gray-500">
                عضو نیستید؟ <button onClick={() => setView("register")} className="text-[#e67e22] hover:underline">ثبت نام کنید</button>
              </div>
            </motion.div>
          )}

          {view === "register" && (
            <motion.div key="register" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input name="firstName" placeholder="نام" onChange={handleChange} className="luxury-input" required />
                  <input name="lastName" placeholder="نام خانوادگی" onChange={handleChange} className="luxury-input" required />
                  
                  <div className="sm:col-span-2">
                    <select 
                      name="organization" 
                      value={formData.organization} 
                      onChange={handleChange} 
                      className="luxury-input appearance-none bg-no-repeat bg-[left_1rem_center] bg-[length:16px]"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
                      required
                    >
                      <option value="">انتخاب شعبه (بخارست / راه‌آهن ...)</option>
                      {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                    </select>
                  </div>

                  <input name="username" placeholder="نام کاربری (انگلیسی)" onChange={handleChange} className="luxury-input" required />
                  <input name="password" type="password" placeholder="رمز عبور" onChange={handleChange} className="luxury-input" required />
                  <div className="sm:col-span-2">
                    <input name="confirmPassword" type="password" placeholder="تکرار رمز عبور" onChange={handleChange} className="luxury-input" required />
                  </div>
                </div>
                
                <button type="submit" disabled={loading} className="luxury-btn w-full mt-2">
                  {loading ? "در حال ثبت..." : "تایید و ایجاد حساب"}
                </button>
              </form>
              <div className="mt-6 text-sm font-bold text-gray-500">
                قبلاً ثبت‌نام کرده‌اید؟ <button onClick={() => setView("login")} className="text-[#e67e22] hover:underline">وارد شوید</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .luxury-input {
          width: 100%;
          padding: 14px 20px;
          border-radius: 1.25rem;
          border: 2px solid #f1f5f9;
          background-color: #f8fafc;
          font-weight: 800;
          font-size: 0.85rem;
          color: #1e293b;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: right;
        }
        .luxury-input:focus {
          border-color: #e67e22;
          background-color: #ffffff;
          box-shadow: 0 8px 20px -10px rgba(230, 126, 34, 0.2);
        }
        .luxury-btn {
          background: linear-gradient(135deg, #e67e22 0%, #f39c12 100%);
          color: white;
          padding: 16px;
          border-radius: 1.25rem;
          font-weight: 900;
          font-size: 0.95rem;
          transition: all 0.3s;
          box-shadow: 0 10px 25px -5px rgba(230, 126, 34, 0.4);
        }
        .luxury-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
          box-shadow: 0 15px 30px -5px rgba(230, 126, 34, 0.5);
        }
        .luxury-btn:active { transform: translateY(0); }
      `}</style>
    </div>
  );
}