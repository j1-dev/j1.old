const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.test2 = functions.firestore
  .document('Posts/{PostId}/{Comments}/{LikedPostId}/Likes/{LikeId}')
  .onCreate((snap, context) => {
    functions.logger.info('aaaaaaaaaaaaaaaaaaaaa' + snap);
  });
