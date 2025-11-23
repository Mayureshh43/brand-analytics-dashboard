import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { login, user, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Refs to track if it's the initial render
  const initialRender = useRef(true);

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  useEffect(() => {
    setError("");

    if (initialRender.current) {
      setFormErrors({});
      initialRender.current = false;
    }
  }, [setError]);

  useEffect(() => {
    if (!touched.email && !touched.password) return;

    const timer = setTimeout(() => {
      validateForm();
    }, 500);

    return () => clearTimeout(timer);
  }, [email, password, touched]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, field === "email" ? email : password);
  };

  const handleFocus = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateField = (name, value) => {
    const errors = { ...formErrors };

    switch (name) {
      case "email":
        if (!value) {
          errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email;
        }
        break;

      case "password":
        if (!value) {
          errors.password = "Password is required";
        } else if (value.length < 8) {
          errors.password = "Password must be at least 8 characters";
        } else {
          delete errors.password;
        }
        break;

      default:
        break;
    }

    setFormErrors(errors);
  };

  const handleInputChange = (field, value) => {
    if (field === "email") {
      value = value.toLowerCase().replace(/\s/g, "");
      setEmail(value);
    } else {
      setPassword(value);
    }

    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!email) {
      if (touched.email) errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (touched.email) errors.email = "Please enter a valid email address";
    }

    if (!password) {
      if (touched.password) errors.password = "Password is required";
    } else if (password.length < 8) {
      if (touched.password)
        errors.password = "Password must be at least 8 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const isFormValid = email && password && Object.keys(formErrors).length === 0;

  const getInputStyle = (field) => {
    if (!touched[field]) {
      return {};
    }

    if (formErrors[field]) {
      return {
        borderColor: "#dc2626",
        backgroundColor: "#fef2f2",
        boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.1)",
      };
    }

    return {
      borderColor: "#16a34a",
      backgroundColor: "#f0fdf4",
      boxShadow: "0 0 0 3px rgba(22, 163, 74, 0.1)",
    };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="card" style={{ width: "400px", margin: "20px" }}>
        <h2
          style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}
        >
          Brand Analytics Dashboard
        </h2>

        {error && (
          <div className="error" style={{ marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              onFocus={() => handleFocus("email")}
              disabled={isLoading}
              placeholder="Enter your email"
              style={getInputStyle("email")}
            />
            {touched.email && formErrors.email && (
              <div
                style={{
                  color: "#dc2626",
                  fontSize: "14px",
                  marginTop: "5px",
                  transition: "all 0.3s ease",
                }}
              >
                {formErrors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              onFocus={() => handleFocus("password")}
              disabled={isLoading}
              placeholder="Enter your password"
              style={getInputStyle("password")}
            />
            {touched.password && formErrors.password && (
              <div
                style={{
                  color: "#dc2626",
                  fontSize: "14px",
                  marginTop: "5px",
                  transition: "all 0.3s ease",
                }}
              >
                {formErrors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              opacity: isFormValid ? 1 : 0.6,
              transition: "opacity 0.3s ease",
            }}
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "4px",
            border: "1px solid #e9ecef",
          }}
        >
          <h4 style={{ marginBottom: "1rem", color: "#333", fontSize: "16px" }}>
            Test Accounts:
          </h4>
          <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#666" }}>
            <div>
              <strong>Admin:</strong> admin@brand.com / admin123
            </div>
            <div>
              <strong>Manager:</strong> manager@brand.com / manager123
            </div>
            <div>
              <strong>Viewer:</strong> viewer@brand.com / viewer123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
