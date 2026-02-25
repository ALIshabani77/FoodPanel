// import axios from "axios";

// // دریافت آدرس پایه از فایل .env
// // نکته: مطمئن شوید در فایل .env مقدار auth را حذف کرده‌اید (http://127.0.0.1:8000/api)
// const API_BASE = process.env.REACT_APP_API_BASE;

// if (!API_BASE) {
//   console.error("❌ خطای بحرانی: متغیر REACT_APP_API_BASE در فایل .env تعریف نشده است!");
// }

// const api = axios.create({
//   baseURL: API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 🔒 اینترسپتور برای اضافه کردن خودکار توکن JWT به تمام درخواست‌ها
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // ------------------ توابع مربوط به API (Endpoints) ------------------ //

// /**
//  * ورود کاربر به سیستم
//  */
// export async function loginUser(username, password) {
//   return api.post("login/", { username, password });
// }

// /**
//  * ثبت نام کاربر جدید
//  */
// export async function registerUser(payload) {
//   // payload شامل username, password, first_name, last_name
//   return api.post("register/", payload);
// }

// /**
//  * بازیابی رمز عبور
//  */
// export async function resetPassword(username, newPassword) {
//   return api.post("reset-password/", { 
//     username, 
//     new_password: newPassword 
//   });
// }

// /**
//  * دریافت لیست تمامی منوها (عمومی)
//  */
// export async function fetchAllMenus() {
//   const { data } = await api.get("menu/");
//   return data;
// }

// /**
//  * دریافت انتخاب‌های قبلی کاربر (نیاز به توکن دارد)
//  */
// export async function fetchUserSelections() {
//   const { data } = await api.get("user-selections/");
//   return data;
// }

// /**
//  * ثبت یا رزرو غذا برای یک روز خاص
//  */
// export async function selectFood(menuId, foodId) {
//   const { data } = await api.post("menu/select/", {
//     menu: menuId,
//     food: foodId,
//   });
//   return data;
// }

// /**
//  * دریافت اطلاعات پروفایل کاربر
//  */
// export async function fetchUserProfile() {
//   const { data } = await api.get("profile/");
//   return data;
// }

// export default api;



import axios from "axios";

// 🔹 آدرس پایه API از فایل .env
const API_BASE = process.env.REACT_APP_API_BASE;

if (!API_BASE) {
  console.error("❌ خطای بحرانی: متغیر REACT_APP_API_BASE در فایل .env تعریف نشده است!");
}

// 🔹 ایجاد instance اصلی Axios
const api = axios.create({
  baseURL: API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`,
  headers: { "Content-Type": "application/json" },
});

// -------------------- Request Interceptor -------------------- //
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------- Response Interceptor -------------------- //
api.interceptors.response.use(
  (response) => response, // پاسخ موفق → برگردان
  async (error) => {
    const originalRequest = error.config;

    // اگر خطای 401 دریافت شد و هنوز Refresh انجام نشده
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        try {
          // درخواست برای گرفتن Access Token جدید
          const { data } = await axios.post(`${API_BASE}/token/refresh/`, {
            refresh: refreshToken,
          });

          // ذخیره Access Token جدید
          localStorage.setItem("access", data.access);

          // ادامه درخواست قبلی با Token جدید
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.warn("❌ Refresh token نامعتبر یا منقضی شده!");
          localStorage.clear();
          window.location.href = "/login"; // هدایت به صفحه login
        }
      } else {
        // اگر Refresh Token وجود نداشت
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// -------------------- توابع API -------------------- //

/**
 * ورود کاربر به سیستم
 */
export async function loginUser(username, password) {
  return api.post("login/", { username, password });
}

/**
 * ثبت نام کاربر جدید
 */
export async function registerUser(payload) {
  // payload شامل username, password, first_name, last_name
  return api.post("register/", payload);
}

/**
 * بازیابی رمز عبور
 */
export async function resetPassword(username, newPassword) {
  return api.post("reset-password/", { username, new_password: newPassword });
}

/**
 * دریافت لیست تمامی منوها (عمومی)
 */
export async function fetchAllMenus() {
  const { data } = await api.get("menu/");
  return data;
}

/**
 * دریافت انتخاب‌های قبلی کاربر (نیاز به توکن دارد)
 */
export async function fetchUserSelections() {
  const { data } = await api.get("user-selections/");
  return data;
}

/**
 * ثبت یا رزرو غذا برای یک روز خاص
 */
export async function selectFood(menuId, foodId) {
  const { data } = await api.post("menu/select/", { menu: menuId, food: foodId });
  return data;
}

/**
 * دریافت اطلاعات پروفایل کاربر
 */
export async function fetchUserProfile() {
  const { data } = await api.get("profile/");
  return data;
}

export default api;
