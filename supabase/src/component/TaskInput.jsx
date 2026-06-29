import { useEffect, useState } from "react";
import { supabase } from "./Supabase";
import toast from "react-hot-toast";

const TaskInput = ({ setpopup }) => {
  const [formdata, setformdata] = useState({ title: "", description: "" });
  const [session, setsession] = useState(null);

  const auth = async () => {
    const authlayer = await supabase.auth.getSession();
    setsession(authlayer.data.session.user.email);
  };

  const addtask = async () => {
    if (formdata.title.trim() != "" && formdata.description.trim() != "") {
      const { data, error } = await supabase
        .from("notes")
        .insert({ ...formdata, email: session });

      if (error) {
        console.log(error.message);
      } else {
        toast.success("Note added!");
        setpopup(false);
        console.log(data);
      }
    } else toast.error("Enter inputs");
  };

  useEffect(() => {
    const initial = async () => {
      await auth();
    };
    initial();
  }, []);

  return (
    <div className="popup-task">
      <div className="user-ipt">
        <div className="cancel" onClick={() => setpopup((prev) => !prev)}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <h1>add task</h1>
        <div className="ipt">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="enter title"
            onChange={(e) =>
              setformdata((v) => ({ ...v, title: e.target.value }))
            }
          />
        </div>
        <div className="ipt">
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            id="description"
            placeholder="enter description"
            onChange={(e) =>
              setformdata((v) => ({ ...v, description: e.target.value }))
            }
          />
        </div>
        <button onClick={addtask}>add task</button>
      </div>
    </div>
  );
};

export default TaskInput;
