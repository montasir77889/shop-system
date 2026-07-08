import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const register = async () => {
    try {
      setError("");

      await api.register(form);

      alert("Registration Successful!");

      navigate("/");

    } catch (err) {

      setError(err.message);

    }
  };

  return (
    <div
      style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        height:"100vh"
      }}
    >
      <div className="panel" style={{width:"380px"}}>

        <h1>Register</h1>

        {error && <p className="error">{error}</p>}

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <br /><br />

        <button
          className="btn-primary"
          onClick={register}
          style={{width:"100%"}}
        >
          Register
        </button>

        <p style={{marginTop:20}}>
          Already have an account?

          <Link to="/"> Login</Link>
        </p>

      </div>
    </div>
  );
}