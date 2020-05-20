import React, { useState } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [addedColor, setAddedColor] = useState(initialColor);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
    console.log("editing color");
  };

  const saveEdit = event => {
    event.preventDefault();
    const color = colors.find(item => colorToEdit.code.hex === item.code.hex);
    axiosWithAuth()
      .put(`/colors/${color}`, colorToEdit)
      .then(res => {
        console.log("this is the put request", res.data);
        setEditing(false);
        updateColors([...colors, res.data]);
        // window.location.href = `/BubblePage`;
      })
      .catch(err => {
        console.log(err);
      });
  };
  const deleteColor = color => {
    axiosWithAuth()
      .delete(`/colors/${color.id}`)
      .then(res => {
        console.log("this is inside the delete color function", res);
        setEditing(false);
      })
      .catch(err => {
        console.log("this is in the delete function, error", err);
      });
    updateColors(
      colors.filter(item => {
        return item.id !== color.id;
      })
    );
  };

  const changeHandler = event => {
    setAddedColor({ ...addedColor, [event.target.name]: event.target.value });
  };

  const newColor = event => {
    event.preventDefault();
    axiosWithAuth()
      .post("/colors", addedColor)
      .then(res => {
        console.log("this is in newColor", res);
      })
      .catch(err => {
        console.log("This is in newColor error", err);
      });

    updateColors([...colors, { ...addedColor, id: Date.now() }]);
  };
  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className="delete"
                onClick={e => {
                  e.stopPropagation();
                  deleteColor(color);
                }}
              >
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <form onSubmit={newColor}>
        <h4>Add another color!</h4>
        <input
          type="text"
          name="color"
          onChange={changeHandler}
          placeholder="Title"
        />
        <input
          type="text"
          name="addedColor.code.hex"
          onChange={event => {
            setAddedColor({
              ...addedColor,
              code: { hex: event.target.value }
            });
          }}
          placeholder="Hex"
        />
        <button type="submit">Add</button>
      </form>
      <div className="spacer" />
    </div>
  );
};

export default ColorList;
