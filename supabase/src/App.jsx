import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./component/Supabase";
import TaskInput from "./component/TaskInput";
import Navbar from "./component/Navbar";
import Task from "./component/Task";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

function App() {
  const [notes, setnotes] = useState([]);
  const [logged, setlogged] = useState(false);
  const [email, setemail] = useState("");
  const [editbtn, seteditbtn] = useState(0);
  const [popup, setpopup] = useState(false);
  const [theme, setTheme] = useState("blue");

  const handleChildData = (value) => {
    setTheme(value);
  };

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

  const [edited, setedited] = useState({
    title: "",
    description: "",
  });

  const editnote = async (id) => {
    if (edited.description.trim() != "" && edited.title.trim() != "") {
      const { error } = await supabase
        .from("notes")
        .update(edited)
        .eq("id", id)
        .select();

      if (error) {
        toast.error(error.message);
      } else toast.success("Note Updated!");
    } else toast.error("Edit title & description fields");
  };

  const deletenote = async (id) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else toast.success("Deleted successfully");
  };

  useEffect(() => {
    const initial = async () => {
      await fetchdata();
      await auth();
    };
    initial();
  }, [editbtn]);

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
        () => {
          fetchdata();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <Navbar sendToParent={handleChildData} logged={logged} email={email} />

      {logged ? (
        <div className="group-notes">
          <div className="add-note" onClick={() => setpopup(true)}>
            <i className="fa-solid fa-circle-plus"></i>
            <span>new note</span>
          </div>

          {notes?.map((v) => (
            <Task
              key={v.id}
              value={v}
              editbtn={editbtn}
              seteditbtn={seteditbtn}
              edited={edited}
              setedited={setedited}
              editnote={editnote}
              deletenote={deletenote}
            />
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
