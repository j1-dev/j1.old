import React, { useState, useRef, useEffect } from "react";
import postServices from "../api/post.services";
import { auth } from "../api/firebase-config";
import { storage } from "../api/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { TbSend } from "react-icons/tb";
import { CgImage } from "react-icons/cg";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import { Tooltip } from "@mui/material";
import { Popover } from "@headlessui/react";
import { usePopper } from "react-popper";
import Picker from "emoji-picker-react";
import { doc, collection } from "firebase/firestore";
import { db } from "../api/firebase-config";
import { Avatar } from "@mui/material";

/**
 * @component
 * A React functional component that renders a post input area. It includes a text area for the post body,
 * an image upload button, a send button and a character countdown. The component also includes the option
 * to upload a photo to accompany the post. It has drag and drop functionality, and displays the image after
 * it has been selected. Additionally, the component has an emoji button, although this feature is currently
 * broken.
 *
 * @function
 * @name SendBox
 *
 * @param {Object} props - The props object.
 * @param {string} props.className - The class name for the SendBox component.
 * @param {string} props.path - The path for the SendBox component.
 *
 * @return {JSX.Element} JSX element representing the SendBox component.
 *
 * @requires React from react
 * @requires useState from react
 * @requires useRef from react
 * @requires useEffect from react
 * @requires postServices from ../api/post.services
 * @requires auth from ../api/firebase-config
 * @requires storage from ../api/firebase-config
 * @requires getDownloadURL from firebase/storage
 * @requires ref from firebase/storage
 * @requires uploadBytes from firebase/storage
 * @requires v4 from uuid
 * @requires TbSend from react-icons/tb
 * @requires CgImage from react-icons/cg
 * @requires BsFillEmojiSmileFill from react-icons/bs
 * @requires GrClose from react-icons/gr
 * @requires Tooltip from @mui/material
 * @requires Popper from @mui/material
 * @requires Picker from emoji-picker-react
 * @requires doc from firebase/firestore
 * @requires collection from firebase/firestore
 * @requires db from ../api/firebase-config
 *
 * @todo fix emoji picker
 */

const SendBox = ({ className, path }) => {
  /**
   * Reference of the button to open the emoji picker
   * @type {Reference}
   */
  const [referenceElement, setReferenceElement] = useState();

  /**
   * Reference of the emoji picker itself
   * @type {Reference}
   */
  const [popperElement, setPopperElement] = useState();

  /**
   * Styles and attributes values from usePopper hook
   * @type {CSSStyleSheet, Object}
   */
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom",
  });
  /**
   * The current authenticated user.
   * @type {firebase.User}
   */
  const user = auth.currentUser;

  /**
   * A ref object that refers to the post input field.
   * @type {React.MutableRefObject<null>}
   */
  const postRef = useRef(null);

  /**
   * A ref object that refers to the image input field.
   * @type {React.MutableRefObject<null>}
   */
  const imageRef = useRef(null);

  /**
   * A ref object that refers to the file input field.
   * @type {React.MutableRefObject<null>}
   */
  const fileRef = useRef(null);

  /**
   * A ref object that refers to the dropzone element.
   * @type {React.MutableRefObject<null>}
   */
  const drop = useRef(null);

  /**
   * A ref object that refers to the dragover element.
   * @type {React.MutableRefObject<null>}
   */
  const drag = useRef(null);

  /**
   * The URL of the currently selected image.
   * @type {string|null}
   */
  const [imageURL, setImageURL] = useState(null);

  /**
   * The current text content of the post input field.
   * @type {string}
   */
  const [post, setPost] = useState("");

  /**
   * The number of characters in the current text content of the post input field.
   * @type {number|null}
   */
  const [chars, setChars] = useState(null);

  /**
   * The currently selected image file.
   * @type {File|null}
   */
  const [image, setImage] = useState(null);

  /**
   * A boolean indicating whether or not an image is currently being dragged.
   * @type {boolean}
   */
  const [dragging, setDragging] = useState(false);

  /**
   * A boolean indicating whether or not the post input field is currently focused.
   * @type {boolean}
   */
  const [focused, setFocused] = useState(false);

  /**
   * Set up drag and drop event listeners for the file input
   *
   * @function
   * @return {void}
   */
  useEffect(() => {
    if (drop.current) {
      drop.current.addEventListener("dragenter", handleDragEnter);
      drop.current.addEventListener("dragleave", handleDragLeave);
    }
    return () => {
      drop.current?.removeEventListener("dragenter", handleDragEnter);
      drop.current?.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  /**
   * Handle drag enter event.
   *
   * @function
   * @param {Object} e - Drag event object.
   * @returns {undefined}
   */
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target !== drag.current) {
      setDragging(true);
    }
  };

  /**
   * Handle drag leave event.
   *
   * @function
   * @param {Object} e - Drag event object.
   * @returns {undefined}
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target === drag.current) {
      setDragging(false);
    }
  };

  /**
   * Handler for the click event of an emoji in the emoji picker.
   *
   * @function
   * @param {Object} emojiObject - The object containing the selected emoji.
   * @returns {void}
   */
  const onEmojiClick = (event, emojiData) => {
    event.preventDefault();
    setPost((post) => post + emojiData.emoji);
    console.log(emojiData);
  };

  /**
   * Handler for character limit of the post input field.
   *
   * @function
   * @param {Object} e - The input event object.
   * @returns {void}
   */
  const handleLimit = (e) => {
    e.preventDefault();
    setChars(e.target.maxLength - e.target.value.length);
    setPost(e.target.value);
  };

  /**
   * Handler for the focus event of the post input field.
   *
   * @function
   * @param {Object} e - The focus event object.
   * @returns {void}
   */
  const handleFocus = (e) => {
    e.preventDefault();
    setFocused(true);
  };

  /**
   * Handler for the blur event of the post input field.
   *
   * @function
   * @param {Object} e - The blur event object.
   * @returns {void}
   */
  const handleBlur = (e) => {
    e.preventDefault();
    setFocused(false);
  };

  /**
   * Handler for the click event of the "Add Image" button.
   *
   * @function
   * @param {Object} e - The click event object.
   * @returns {void}
   */
  const handleImageButton = (e) => {
    e.preventDefault();
    fileRef.current.click();
  };

  /**
   * This function checks if the current post has an image attached
   * to it. If it does, it uploads it and calls the uploadPost function
   * sith the url of the image. If it doesn't, it calls the uploadPost
   * function with an empty sting.
   *
   * @function
   * @param {event} e
   * @returns {void}
   */
  const handlePost = (e) => {
    e.preventDefault();
    if (image !== null) {
      const imageRef = ref(storage, `images/${image.name + v4()}`);
      uploadBytes(imageRef, image).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          uploadPost({ url });
        });
      });
    } else {
      uploadPost("");
    }
  };

  /**
   * This function creates the post object that will be uploaded
   * to the firestore database. it creates a timestamp of the
   * current instant, then it checks if the post if empty or there
   * is no image attached to it, in which case no post will be
   * uploaded. Then it will make the post object and uploads it
   * using a reference. After that it resets the image input and
   * the text area
   *
   * @function
   * @param {String} url url of the attached image
   * @returns {void}
   */
  const uploadPost = async ({ url }) => {
    const now = new Date();
    const time = {
      seconds: Math.round(now.getTime() / 1000),
    };

    if (post === "" && image === null) {
      return;
    }

    let newPost;
    const newDocRef = doc(collection(db, path));
    if (typeof url !== "undefined") {
      newPost = {
        post: post,
        createdAt: time,
        uid: user.uid,
        photoURL: url,
        id: newDocRef.id,
        likes: 0,
        dislikes: 0,
      };
    } else {
      newPost = {
        post: post,
        createdAt: time,
        uid: user.uid,
        photoURL: "",
        id: newDocRef.id,
        likes: 0,
        dislikes: 0,
      };
    }

    setChars(200);
    await postServices.setPosts(newDocRef, newPost);
    postRef.current.value = "";
    setPost("");
    setImage(null);
    setImageURL(null);
    imageRef.current.value = null;
  };

  /**
   * Preview selected image and store its URL to the state
   *
   * @function
   * @param {object} e - Event object
   * @returns {void}
   */
  const previewImage = (e) => {
    e.preventDefault();
    var file = e.target.files[0];
    console.log(file);
    setImageURL(URL.createObjectURL(file));
  };

  /**
   * A React functional component that renders a post input area. It includes a text area for the post body,
   * an image upload button, a send button and a character countdown. The component also includes the option
   * to upload a photo to accompany the post. It has drag and drop functionality, and displays the image after
   * it has been selected. Additionally, the component has an emoji button, although this feature is currently
   * broken.
   *
   * @returns {JSX.Element} - A JSX element that represents the component
   */
  return (
    <div className={className} ref={drop}>
      {/* Profile pic */}
      {/* <img
        alt=""
        src={user.photoURL}
        className="float-left mt-5 ml-3 w-[69px] rounded-full"
      ></img> */}
      <Avatar
        className="float-left mt-5 ml-5 rounded-full"
        alt="lol"
        src={user.photoURL}
        sx={{ width: "60px", height: "60px" }}
      />
      {dragging && (
        // div and input elements that are active while draggaing
        // an image into this element
        <div
          ref={drag}
          className="absolute h-56 w-full rounded-[50px] bg-gradient-to-b from-black to-white p-5 opacity-10"
        >
          <input
            id="image"
            type="file"
            accept="image/*"
            ref={imageRef}
            className="m-auto h-48 w-full p-5 opacity-0"
            onChange={(event) => {
              setImage(event.target.files[0]);
              setDragging(false);
              previewImage(event);
            }}
          />
        </div>
      )}
      {/* 
          Text area with a limit of 200 characters. It serves
          as an input for the post text body
        */}
      <textarea
        placeholder="Escribe lo que sea o arrastra una imagen..."
        maxLength="200"
        className="mt-5  h-44 w-9/12 resize-none text-2xl outline-none transition-all duration-200 ease-in-out"
        value={post}
        onChange={handleLimit}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={postRef}
      />
      {/*
          If imageURL is not null, it show the image and a button
          to close it if the user wanted to upload another photo. If 
          it is null, it show nothing
        */}
      {imageURL !== null ? (
        <div className="relative">
          <button
            className="button-still absolute top-0 left-5 bg-white text-base"
            onClick={() => {
              setImageURL(null);
              setImage(null);
            }}
          >
            <GrClose />
          </button>
          <img src={imageURL} className="mx-6 my-4 w-1/2 rounded-xl" alt="" />
        </div>
      ) : (
        <></>
      )}
      {/* 
        Show the characters thata are left in the post until 200
        when it reaches 50, it changes to red
      */}
      <Tooltip title="Carácteres restantes">
        <div
          className={
            chars >= 50 || chars === null
              ? focused
                ? "countdown"
                : "countdown opacity-0"
              : focused
              ? "countdown-active"
              : "countdown-active opacity-0"
          }
        >
          {chars === null ? "200" : chars}
        </div>
      </Tooltip>

      {/* 
        This div encapsulates the emoji, image and send buttons
      */}
      <div className="lg:xl:sendbox-button pb-[85px] ">
        {/* 
          Send Button
        */}
        <Tooltip title="Enviar">
          <button
            onClick={handlePost}
            className="button-still float-right mb-3 p-3 text-2xl hover:translate-x-0 hover:border-red-400"
          >
            <TbSend />
          </button>
        </Tooltip>
        {/* 
          Image button
        */}
        <Tooltip
          title={
            imageURL === null
              ? "Imagen no adjuntada"
              : "Imagen adjuntada con exito"
          }
        >
          <button
            onClick={handleImageButton}
            className={
              imageURL === null
                ? "button-still float-right mb-3 p-3 text-2xl hover:border-gray-400"
                : "button-still float-right mb-3 border-green-400 p-3 text-2xl hover:border-green-600"
            }
          >
            <CgImage />
          </button>
        </Tooltip>
        {/* 
          Emoji button - fucking broken
        */}
        <Tooltip title="Emojis">
          <Popover className="relative">
            <Popover.Button
              ref={setReferenceElement}
              className="button-still z-40 float-right mb-3 p-3 text-2xl hover:border-yellow-400"
            >
              <BsFillEmojiSmileFill />
            </Popover.Button>

            <Popover.Panel
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
            >
              <Picker
                onEmojiClick={onEmojiClick}
                pickerStyle={{ zIndex: 5000 }}
              />
            </Popover.Panel>
          </Popover>
        </Tooltip>
      </div>
      {/* 
        This image input is invisible and is linke to the image button
      */}
      <input
        id="image"
        type="file"
        accept="image/*"
        ref={fileRef}
        className="absolute left-0 top-0 z-0 h-1 w-1 opacity-0"
        onChange={(event) => {
          setImage(event.target.files[0]);
          previewImage(event);
        }}
      />
    </div>
  );
};

export default SendBox;
