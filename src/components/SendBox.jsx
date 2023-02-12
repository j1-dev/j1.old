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
import { Tooltip, Popper } from "@mui/material";
import Picker from "emoji-picker-react";
import { doc, collection } from "firebase/firestore";
import { db } from "../api/firebase-config";

const SendBox = ({ className, path }) => {
  // current user
  const user = auth.currentUser;
  // References
  const postRef = useRef(null);
  const imageRef = useRef(null);
  const fileRef = useRef(null);
  const drop = useRef(null);
  const drag = useRef(null);
  // State Variables
  const [imageURL, setImageURL] = useState(null);
  const [post, setPost] = useState("");
  const [chars, setChars] = useState(null);
  const [image, setImage] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);

  /**
   * Image drop events useEffect
   *
   * Handles the dragenter and dragleave events
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

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target !== drag.current) {
      setDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target === drag.current) {
      setDragging(false);
    }
  };

  /**
   * EmojiBox Sutff
   *
   * Currently broken af
   */
  const onEmojiClick = (e, emojiObject) => {
    setPost((post) => post + emojiObject.emoji);
  };

  const handleOpen = (e) => {
    e.preventDefault();
    setAnchorEl(anchorEl ? null : e.currentTarget);
    setShowPicker(!showPicker);
  };

  /**
   * Handles the character limit of the text area
   *
   * @param {event} e
   */
  const handleLimit = (e) => {
    e.preventDefault();
    setChars(e.target.maxLength - e.target.value.length);
    setPost(e.target.value);
  };

  /**
   * Checks if the text area is focused
   *
   * @param {event} e
   */
  const handleFocus = (e) => {
    e.preventDefault();
    setFocused(true);
  };

  /**
   * Checks if the text area is not focused
   *
   * @param {event} e
   */
  const handleBlur = (e) => {
    e.preventDefault();
    setFocused(false);
  };

  /**
   * Opens image selector menu
   *
   * @param {event} e
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
   * @param {event} e
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
   * @param {String} url url of the attached image
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
   * This function sets the image preview
   *
   * @param {event} e
   */
  const previewImage = (e) => {
    e.preventDefault();
    var file = e.target.files[0];
    console.log(file);
    setImageURL(URL.createObjectURL(file));
  };

  return (
    // Outter container
    <div className={className} ref={drop}>
      {/* Profile pic */}
      <img
        alt=""
        src={user.photoURL}
        className="float-left mt-5 ml-3 w-[69px] rounded-full"
      ></img>
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
          <div>
            <div>
              <button
                className="button-still z-40 float-right mb-3 p-3 text-2xl hover:border-yellow-400"
                onClick={handleOpen}
              >
                <BsFillEmojiSmileFill />
              </button>
            </div>

            {/* 
              El puto popper de los cojones me cago en sus putos muertos no funciona nunca cojones
            */}
            <Popper anchorEl={anchorEl} placement="bottom">
              <div>
                <Picker
                  pickerStyle={{ zIndex: 5000 }}
                  onEmojiClick={onEmojiClick}
                />
              </div>
            </Popper>
          </div>
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
