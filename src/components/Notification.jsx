import { deleteDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import { db } from "../api/firebase-config";
import { RxCross1 } from "react-icons/rx";

const Notification = ({ data, key }) => {
  const type = data.type;
  const time = data.sentAt;
  const senderQ = doc(db, "users", data.from);
  const [value, loading] = useDocument(senderQ);
  const [classname, setClassname] = useState("notification-panel");

  useEffect(() => {
    console.log(typeof type);
    switch (type) {
      case "like":
        setClassname("notification-like");
        console.log("a");
        break;
      case "dislike":
        setClassname("notification-dislike");
        console.log("b");
        break;
      case "comment":
        setClassname("notification-comment");
        console.log("c");
        break;
      case "follow":
        setClassname("notification-follow");
        console.log("d");
        break;
      default:
        throw new Error("not a classname");
    }
  }, [data]);

  const handleDelete = () => {
    deleteDoc(doc(db, `users/${data.to}/notifications/`, data.id));
  };

  const renderNotificationMessage = () => {
    if (!loading) {
      switch (type) {
        case "like":
          return (
            <span className="absolute top-7 left-[80px]">
              A{" "}
              <Link
                className="font-semibold hover:underline"
                to={`/${value.data().displayName}`}
              >
                ~{value.data().displayName}
              </Link>{" "}
              le gusta tu{" "}
              <Link
                className="font-semibold hover:underline"
                to={`/post/${data.postId}`}
              >
                post
              </Link>
              .
            </span>
          );
        case "dislike":
          return (
            <span className="absolute top-7 left-[80px]">
              A{" "}
              <Link
                className="font-semibold hover:underline"
                to={`/${value.data().displayName}`}
              >
                ~{value.data().displayName}
              </Link>{" "}
              no le gusta tu{" "}
              <Link
                className="font-semibold hover:underline"
                to={`/post/${data.postId}`}
              >
                post
              </Link>
              .
            </span>
          );
        case "comment":
          return (
            <span className="absolute top-7 left-[80px]">
              <Link
                className="font-semibold hover:underline"
                to={`/${value.data().displayName}`}
              >
                ~{value.data().displayName}
              </Link>{" "}
              ha comentado en tu{" "}
              <Link
                className="font-semibold hover:underline"
                to={`/post/${data.postId}`}
              >
                post
              </Link>
              .
            </span>
          );
        case "follow":
          return (
            <span className="absolute top-7 left-[80px]">
              <Link
                className="font-semibold hover:underline"
                to={`/${value.data().displayName}`}
              >
                ~{value.data().displayName}
              </Link>{" "}
              te está siguiendo.
            </span>
          );
        default:
      }
    }
  };

  const timeDiff = (secs) => {
    let str = "";
    let ms = Date.now();
    let s = Math.floor(ms / 1000);
    let sDiff = s - secs;
    if (sDiff >= 0 && sDiff < 60) {
      str += Math.round(sDiff) + "s ago";
    } else if (sDiff >= 60 && sDiff < 3600) {
      sDiff /= 60;
      str += Math.round(sDiff) + "m ago";
    } else if (sDiff >= 3600 && sDiff < 86400) {
      sDiff /= 60;
      sDiff /= 60;
      str += Math.round(sDiff) + "h ago";
    } else if (sDiff >= 86400 && sDiff < 2.628e6) {
      sDiff /= 60;
      sDiff /= 60;
      sDiff /= 24;
      str += Math.round(sDiff) + "d ago";
    } else if (sDiff >= 2.628e6 && sDiff < 3.154e7) {
      sDiff /= 60;
      sDiff /= 60;
      sDiff /= 24;
      sDiff /= 30;
      str += Math.round(sDiff) + "M ago";
    } else {
      sDiff /= 60;
      sDiff /= 60;
      sDiff /= 24;
      sDiff /= 30;
      sDiff /= 12;
      str += Math.round(sDiff) + "y ago";
    }
    return str;
  };

  return (
    <div key={key} className={classname}>
      <div className="avatar top-0 left-0">
        <div className="w-10 rounded-full">
          <img src={loading ? null : value.data().photo} alt="loading..." />
        </div>
      </div>
      {renderNotificationMessage()}
      <p className="mt-3 text-sm text-gray-700">{timeDiff(time)}</p>
      <button
        onClick={handleDelete}
        className="absolute right-7 top-8 hover:text-red-600"
      >
        <RxCross1 />
      </button>
    </div>
  );
};

export default Notification;
