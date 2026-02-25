import { Navigate } from "react-router-dom";

export default function OrdersGuard({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.is_staff) {
    return <Navigate to="/menu" replace />;
  }

  return children;
}
