const Task = ({
  value,
  editbtn,
  seteditbtn,
  setedited,
  editnote,
  deletenote,
}) => {
  const editnotes = (num) => {
    editnote(num);
    seteditbtn(0);
  };
  return (
    <div key={value.id} className="notes">
      <div className="btns">
        <button
          onClick={() => seteditbtn(Number(value.id))}
          className="edit-btn"
        >
          <i className="fa-regular fa-pen-to-square"></i>
        </button>
        <button onClick={() => deletenote(value.id)} className="drop-btn">
          <i className="fa-regular fa-trash-can"></i>
        </button>
      </div>
      <h1
        role="textbox"
        contentEditable={editbtn === Number(value.id) ? "true" : "false"}
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
        contentEditable={editbtn === Number(value.id) ? "true" : "false"}
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
        {editbtn == Number(value.id) && (
          <button onClick={() => editnotes(value.id)}>save</button>
        )}
      </div>
    </div>
  );
};

export default Task;
