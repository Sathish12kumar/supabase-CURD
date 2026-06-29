import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./component/Supabase";
import TaskInput from "./component/TaskInput";
import Navbar from "./component/Navbar";
import Task from "./component/Task";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

function App() {
  const [notes, setnotes] = useState([]);
  const [logged, setlogged] = useState(false);
  const [email, setemail] = useState("");

  const [theme, setTheme] = useState("blue");

  const handleChildData = (value) => {
    setTheme(value);
  };

  const [popup, setpopup] = useState(false);

  const auth = async () => {
    const authlayer = await supabase.auth.getSession();
    if (authlayer.data.session) {
      setlogged(true);
      setemail(authlayer.data.session.user.email);
      return;
    } else {
      setlogged(false);
      toast.error("Loggin first!");
    }
  };

  const fetchdata = async () => {
    const { data, error } = await supabase.from("notes").select("*");
    if (error) {
      console.log(error.message);
    }
    setnotes(data);
  };

  useEffect(() => {
    const initial = async () => {
      await fetchdata();
      await auth();
    };
    initial();
  }, []);

  useEffect(() => {
    document.documentElement.className = `${theme}-theme`;
  }, [theme]);

  useEffect(() => {
    const channel = supabase
      .channel("notes-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
        },
        (res) => {
          const newNote = res.new;
          setnotes((prev) => [...prev, newNote]);
        },
      )
      .subscribe((status) => {
        console.log("subscribe:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
        }}
      />
      <Navbar sendToParent={handleChildData} logged={logged} email={email} />

      {logged ? (
        <div className="group-notes">
          <div className="add-note" onClick={() => setpopup(true)}>
            <i className="fa-solid fa-circle-plus"></i>
            <span>new note</span>
          </div>

          {notes?.map((v) => (
            <Task value={v} key={v.id} />
          ))}
        </div>
      ) : (
        <div className="log">
          Go to
          <span>
            <Link to={"/signup"}>sign up</Link>
          </span>
          or
          <span>
            <Link to={"/signup"}> sign in</Link>
          </span>
          to continue
        </div>
      )}

      {popup && <TaskInput setpopup={setpopup} />}
    </>
  );
}

export default App;
