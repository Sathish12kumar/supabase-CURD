import { useState } from "react";
import "./signin.css";
import { supabase } from "./Supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Signin = () => {
  const [signup, setsignup] = useState(true);
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });

  const formsubmit = async (e) => {
    e.preventDefault();

    if (signup) {
      const { data, error } = await supabase.auth.signUp({
        email: formdata.email,
        password: formdata.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success("Signup successful");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formdata.email,
        password: formdata.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.session) {
        navigate("/");
        toast.success("Signin successful");
      }
    }

    setformdata({ email: "", password: "" });
  };
  return (
    <div className="auth">
      <div className="signin">
        <h1>{signup ? "signup" : "signin"}</h1>
        <form onSubmit={formsubmit}>
          <div className="ipt">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              required
              onChange={(e) =>
                setformdata((val) => ({ ...val, email: e.target.value }))
              }
            />
          </div>
          <div className="ipt">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              minLength={6}
              pattern="^(?=.*[A-Za-z]).{6,}$"
              // maxLength={6}
              required
              placeholder="Enter Password"
              title="Enter atlest 1 letter"
              onChange={(e) =>
                setformdata((val) => ({ ...val, password: e.target.value }))
              }
            />
          </div>
          {signup ? (
            <p>
              Having trouble{" "}
              <span onClick={() => setsignup((val) => !val)}>signing in?</span>
            </p>
          ) : (
            <p>
              Don’t have an account?{" "}
              <span onClick={() => setsignup((val) => !val)}>Sign Up</span>
            </p>
          )}
          <button type="submit">{signup ? "signup" : "signin"}</button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
