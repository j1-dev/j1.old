import { doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import { db } from "../api/firebase-config";

const Notification = ({ data, key }) => {
  const type = data.type;
  const senderUid = data.uid;
  const time = data.sentAt;
  const senderQ = doc(db, "users", data.from);
  const [value, loading] = useDocument(senderQ);

  useEffect(() => {
    console.log(data.type);
  }, [data]);

  function timeDiff(secs) {
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
      str += Math.round(sDiff) + "m ago";
    } else {
      sDiff /= 60;
      sDiff /= 60;
      sDiff /= 24;
      sDiff /= 30;
      sDiff /= 12;
      str += Math.round(sDiff) + "y ago";
    }
    return str;
  }

  return (
    <div key={key} className="notification-panel">
      <hr />
      <p>{type}</p>
      <p>
        From: {loading ? <p>loading...</p> : <p>{value.data().displayName}</p>}
      </p>
      <p>{timeDiff(time)}</p>
      <hr />
    </div>
  );
};

export default Notification;
