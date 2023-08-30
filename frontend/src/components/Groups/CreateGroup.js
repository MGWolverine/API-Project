import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createNewGroup } from "../../store/groups";
import "./GroupsList.css";

const CreateGroup = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gType, setGType] = useState("");
  const [vType, setVType] = useState("");
  const [image, setImage] = useState("");
  const [validationObject, setValidationObject] = useState({});
  // const [formSubmitted, setFormSubmitted] = useState(false);
  // useEffect(() => {
  //     if (!formSubmitted) {
  //         const errorsObject = {};

  //         if (!location) {
  //             errorsObject.location = "Location is required";
  //         }
  //         if (!name) {
  //             errorsObject.name = "Name is required";
  //         }
  //         if (description.length < 30) {
  //             errorsObject.description = "Description must be at least 30 characters long";
  //         }
  //         if (!gType) {
  //             errorsObject.gType = "Group Type is required";
  //         }
  //         if (!vType) {
  //             errorsObject.vType = "Visibility Type is required";
  //         }
  //         if (!image) {
  //             errorsObject.image = "Image URL must end in .png .jpg or .jpeg";
  //         }
  //         setValidationObject(errorsObject);
  //     }
  // }, [location, name, description, gType, vType, image, formSubmitted])
  const validateForm = () => {
    const errorsObject = {};
    if (!location) {
      errorsObject.location = "Location is required";
    }
    if (!name) {
      errorsObject.name = "Name is required";
    }
    if (description.length < 30) {
      errorsObject.description =
        "Description must be at least 30 characters long";
    }
    if (!gType) {
      errorsObject.gType = "Group Type is required";
    }
    if (!vType) {
      errorsObject.vType = "Visibility Type is required";
    }
    if (!image) {
      errorsObject.image = "Image URL must end in .png .jpg or .jpeg";
    }
    setValidationObject(errorsObject);
  };

  //   async function onSubmit(e) {
  //     e.preventDefault();
  //     validateForm();
  //     if (!Object.keys(validationObject).length) {
  //       console.log({
  //         location,
  //         name,
  //         description,
  //         gType,
  //         vType,
  //         image,
  //       });
  //       return;
  //     }
  //     if (!Object.keys(validationObject).length)
  //       dispatchEvent(createNewGroup(newGroup))
  //         .then((createdGroup) => {
  //           history.push(`/groups/${createdGroup.id}`);
  //         })
  //         .catch((error) => {
  //           console.error("Error creating the group:", error);
  //         });
  //         return
  //   }
  async function onSubmit(e) {
    e.preventDefault();
    validateForm();
    if (!Object.keys(validationObject).length) {
     const newGroup = {
        location,
        name,
        description,
        gType,
        vType,
        image,
      };
      dispatch(createNewGroup(newGroup));
      history.push(`/groups/${newGroup.id}`);
    }
  }

  return (
    <form className="group-form" onSubmit={onSubmit}>
      <h3>BECOME AN ORGANIZER</h3>
      <h2>We'll walk you through a few steps to build your local community</h2>
      <hr></hr>
      <h2>First, set your group's location.</h2>
      <p>
        Meetup groups meet locally, in person and online. We'll connect you with
        people in your area, and more can join you online.
      </p>
      <label>
        <input
          id="location"
          type="text"
          name="location"
          value={location}
          placeholder="City, STATE"
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>
      {validationObject.location && (
        <p className="errors">{validationObject.location}</p>
      )}
      <hr></hr>
      <h2>What will your group's name be?</h2>
      <p>
        Choose a name that will give people a clear idea of what the group is
        about. Feel free to get creative! You can edit this later if you change
        your mind.
      </p>
      <label>
        <input
          id="name"
          type="text"
          name="name"
          value={name}
          placeholder="What is your group name?"
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      {validationObject.name && (
        <p className="errors">{validationObject.name}</p>
      )}
      <hr></hr>
      <h2>Now describe what your group will be about.</h2>
      <p>
        People will see this when we promote your group, but you'll be able to
        add to it later, too.
      </p>
      <ol type="1">
        <li> What's the purpose of the group?</li>
        <li>Who should join?</li>
        <li>What will you do at your events?</li>
      </ol>
      <textarea
        placeholder="Please write at least 30 characters"
        style={{ width: "300px", height: "150px" }}
        onChange={(e) => setDescription(e.target.value)}
      />
      {validationObject.description && (
        <p className="errors">{validationObject.description}</p>
      )}
      <hr></hr>
      <h2>Final Steps...</h2>
      <p>Is this an in person or online group?</p>
      <select
        id="gtype"
        onChange={(e) => setGType(e.target.value)}
        value={gType}
      >
        <option value="" disabled selected>
          (select one)
        </option>
        <option value="In Person">In person</option>
        <option value="Online">Online</option>
      </select>
      {validationObject.gType && (
        <p className="errors">{validationObject.gType}</p>
      )}
      <p>Is this group private or public?</p>
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
      </select>
      {validationObject.vType && (
        <p className="errors">{validationObject.vType}</p>
      )}
      <p>Please add in image url for your group below:</p>
      <label>
        <input
          id="image"
          placeholder="image url"
          type="url"
          onChange={(e) => setImage(e.target.value)}
        />
      </label>
      {validationObject.image && (
        <p className="errors">{validationObject.image}</p>
      )}
      <hr></hr>
      <button className="button" type="submit">
        Create Group
      </button>
    </form>
  );
};

export default CreateGroup;