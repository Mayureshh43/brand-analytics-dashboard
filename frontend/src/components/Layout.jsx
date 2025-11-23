import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleStyles = (role) => {
    const styles = {
      admin: {
        backgroundColor: "#dc2626",
        color: "white",
        icon: "👑",
      },
      manager: {
        backgroundColor: "#2563eb",
        color: "white",
        icon: "💼",
      },
      viewer: {
        backgroundColor: "#16a34a",
        color: "white",
        icon: "👀",
      },
    };
    return styles[role] || styles.viewer;
  };

  const roleStyle = getRoleStyles(user?.role);

  return (
    <div>
      <header
        style={{
          backgroundColor: "white",
          padding: "1rem 0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold" style={{ color: "#333" }}>
              Brand Sales Analytics Dashboard
            </h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    Welcome, <strong>{user?.name}</strong>
                  </div>
                  <div style={{ fontSize: "12px", color: "#999" }}>
                    {user?.email}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: roleStyle.backgroundColor,
                    color: roleStyle.color,
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginRight: "16px",
                  }}
                  title={`Current role: ${user?.role}`}
                >
                  <span>{roleStyle.icon}</span>
                  <span style={{ textTransform: "capitalize" }}>
                    {user?.role}
                  </span>
                </div>
              </div>

              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  );
};

export default Layout;
