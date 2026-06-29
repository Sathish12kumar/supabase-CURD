import { useEffect, useRef, useState } from "react";
import "./navbar.css";
import { supabase } from "./Supabase";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
const Navbar = ({ sendToParent, logged, email }) => {
  const [open, setOpen] = useState(false);

  const ref = useRef(null);
  const signout = async () => {
    await supabase.auth.signOut();
    toast.success("Signout successfully!");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <nav>
      <h1>Notes app</h1>
      <div className="btns">
        <div className="dropdown" ref={ref}>
          <button className="dropdown-btn" onClick={() => setOpen(!open)}>
            <div className="theme-btn"></div>
            Theme
          </button>

          {open && (
            <ul className="dropdown-menu" onClick={() => setOpen(!open)}>
              <li className="blue" onClick={() => sendToParent("blue")}></li>
              <li
                className="purple"
                onClick={() => sendToParent("purple")}
              ></li>
              <li className="teal" onClick={() => sendToParent("teal")}></li>
              <li
                className="orange"
                onClick={() => sendToParent("orange")}
              ></li>
              <li className="rose" onClick={() => sendToParent("rose")}></li>
            </ul>
          )}
        </div>
        {logged ? (
          <button>
            {email}
            <img
              src={`https://placehold.co/500x500/FFFFFF/000?text=${email.charAt(0)?.toUpperCase()}`}
              alt=""
            />
          </button>
        ) : (
          <button>
            <Link to={"/signup"}>Signin</Link>
          </button>
        )}
        <button onClick={signout}>
          signout <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
