import { useState } from "react";
import { supabase } from "./Supabase";
import toast from "react-hot-toast";

const Task = ({ value }) => {
  const [editbtn, seteditbtn] = useState("");
  const [edited, setedited] = useState({
    title: "",
    description: "",
  });

  const updatenote = (id) => {
    seteditbtn(id);
  };

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
    } else toast.error("Enter fields");
  };

  const deletenote = async (id) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      console.log(error.message);
    } else toast.success("Deleted successfully");
  };
  return (
    <div key={value.id} className="notes">
      <div className="btns">
        <button onClick={() => updatenote(value.id)} className="edit-btn">
          <i className="fa-regular fa-pen-to-square"></i>
        </button>
        <button onClick={() => deletenote(value.id)} className="drop-btn">
          <i className="fa-regular fa-trash-can"></i>
        </button>
      </div>
      <h1
        role="textbox"
        contentEditable={editbtn === value.id}
        suppressContentEditableWarning
        style={{ outlineColor: "blue" }}
        onInput={(e) => {
          const title = e.currentTarget.textContent;

          setedited((prev) => ({
            ...prev,
            title,
          }));
        }}
      >
        {value?.title}
      </h1>
      <p
        role="textbox"
        contentEditable={editbtn === value.id}
        suppressContentEditableWarning
        style={{ outlineColor: "blue" }}
        onInput={(e) => {
          const description = e.currentTarget.textContent;

          setedited((prev) => ({
            ...prev,
            description,
          }));
        }}
      >
        {value.description}
      </p>
      <div className="time-info">
        <div className="time">
          <i className="fa-regular fa-calendar"></i>
          {new Date(value?.created_at).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
        {editbtn == value.id ? (
          <button onClick={() => editnote(value.id)}>save</button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Task;
