import { useState } from "react";
import { useAuth } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export default function RegisterForm() {
  // 1. एक ही useState में पूरा ऑब्जेक्ट इनिशियलाइज़ करें

  const { signUp } = useAuth();
   
  const [error,setError] = useState(null)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // 2. सभी इनपुट को एक ही फंक्शन से हैंडल करें
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData, // पुराना डेटा कॉपी करें
      [name]: value, // सिर्फ बदलते हुए इनपुट को अपडेट करें
    }));
  };

 const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const { data, error } = await signUp({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message || "Registration failed");
      return;
    }

    // On success, navigate to login page
    navigate("/login");
  } catch (err) {
    setError(err.message || "Registration error");
  }
};
  return (

      <form onSubmit={handleSubmit}>
        {error?<div>{error}</div>:<div></div>}
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />

      <button type="submit">Submit</button>
    </form>
  );
}
