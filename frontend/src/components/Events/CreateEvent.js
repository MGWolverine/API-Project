import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { createNewEvent, retrieveSingleEvent } from "../../store/events";
import "../Groups/GroupsList.css";

const CreateEvent = () => {
  const dispatch = useDispatch();
  const {groupId} = useParams();
  const history = useHistory();
  const [price, setPrice] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [eType, setEType] = useState("");
  const [vType, setVType] = useState("");
  const [image, setImage] = useState("");
  const [validationObject, setValidationObject] = useState({});

  const validateForm = () => {
    const errorsObject = {};
    if (!price) {
      errorsObject.price = "Price is required";
    }
    if (!startDate) {
      errorsObject.startDate = "Event start is required";
    }
    if (!endDate) {
      errorsObject.endDate = "Event end is required";
    }
    if (!name) {
      errorsObject.name = "Name is required";
    }
    if (description.length < 30) {
      errorsObject.description =
        "Description must be at least 30 characters long";
    }
    if (!eType) {
      errorsObject.EType = "Event Type is required";
    }
    if (!vType) {
      errorsObject.vType = "Visibility Type is required";
    }
    if (!image) {
      errorsObject.image = "Image URL must end in .png .jpg or .jpeg";
    }
    setValidationObject(errorsObject);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    validateForm();
    if (!Object.keys(validationObject).length) {
      const newEvent = {
        venueId: 1,
        price,
        startDate,
        endDate,
        capacity: 10,
        name,
        description,
        type: eType,
        // private: vType,
      };

      const newImage = {
        url: image,
        preview: true,
      };

      const response = await dispatch(createNewEvent(newEvent, groupId, newImage));
      history.push(`/events/${response.id}`);
    }
  };

  return (
    <form className="group-form" onSubmit={onSubmit}>
      <h1>Create an event for {}</h1>
      <p>What is the name of your event?</p>
      <label>
        <input
          id="name"
          type="text"
          name="name"
          value={name}
          placeholder="Event Name"
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      {validationObject.name && (
        <p className="errors">{validationObject.name}</p>
      )}
      <hr></hr>
      <p>Is this an in person or online event?</p>
      <select
        id="etype"
        onChange={(e) => setEType(e.target.value)}
        value={eType}
      >
        <option value="" disabled selected>
          (select one)
        </option>
        <option value="In person">In person</option>
        <option value="Online">Online</option>
        {validationObject.eType && (
          <p className="errors">{validationObject.eType}</p>
        )}
      </select>
      <p>Is this event private or public?</p>
      <select
        id="vtype"
        onChange={(e) => setVType(e.target.value)}
        value={vType}
      >
        <option value="" disabled selected>
          (select one)
        </option>
        <option value={true}>Private</option>
        <option value={false}>Public</option>
        {validationObject.vType && (
          <p className="errors">{validationObject.vType}</p>
        )}
      </select>
      <p>What is the price for your event?</p>
      <label>
        ${" "}
        <input
          id="price"
          type="number"
          name="price"
          value={price}
          placeholder={0}
          onChange={(e) => setPrice(e.target.value)}
        ></input>
      </label>
      <hr></hr>
      <p>When does your event start?</p>
      <input
        id="startDate"
        type="date"
        name="startDate"
        onChange={(e) => setStartDate(e.target.value)}
      ></input>
      <p>When does your event end?</p>
      <input
        id="endDate"
        type="date"
        name="endDate"
        onChange={(e) => setEndDate(e.target.value)}
      ></input>
      <hr></hr>
      <p>Please add in image url for your event below:</p>
      <label>
        <input
          id="image"
          placeholder="image url"
          type="url"
          onChange={(e) => setImage(e.target.value)}
        ></input>
      </label>
      {validationObject.image && (
        <p className="errors">{validationObject.image}</p>
      )}
      <hr></hr>
      <p>Please describe your event:</p>
      <textarea
        placeholder="Please write at least 30 characters"
        style={{ width: "300px", height: "150px" }}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <hr></hr>
      <button className="button" type="submit">
        Create Event
      </button>
    </form>
  );
};

export default CreateEvent;
