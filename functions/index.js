const functions = require('firebase-functions');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

exports.notificationLike = functions.firestore
  .document('Posts/{PostId}/Likes/{LikeId}')
  .onCreate((snap, context) => {
    // const post = snap.data();
    // const now = new Date();
    // const time = Math.round(now.getTime() / 1000);
    const postId = context.params.PostId;
    const likeId = context.params.LikeId;
    const likedPost = admin.firestore.doc(`Posts/id/**/Posts/${postId}`);
    return listenToPostsSubcollections(likedPost);

    // const notification = {
    //   createdAt: time,
    // };
    //stuff
  });

function listenToPostsSubcollections(postRef) {
  return postRef.listCollections().then((collections) => {
    collections.forEach((collection) => {
      if (collection.id === 'Posts') {
        // Listen to changes in the Posts subcollection
        collection.onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const postId = change.doc.id;
            const data = change.doc.data();
            console.log(`Post ${postId} was changed:`, data);
            // Do something with the changed data
          });
        });
      } else {
        // Recursively listen to changes in subcollections of this collection
        collection.onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const docRef = change.doc.ref;
            listenToPostsSubcollections(docRef);
          });
        });
      }
    });
  });
}
