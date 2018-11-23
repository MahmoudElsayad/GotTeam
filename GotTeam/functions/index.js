const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


/**
 * Triggers when new subject added in the list and sends a notification.
 */
exports.newMessageNotification = functions.firestore.document('messages/{messageId}').onWrite((change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const document = change.after.data();
//   const subject = event.data.val();
  // Notification details.
  const payload = {
    notification: {
      title: document.subject,
      body: document.message,
      sound: 'default',
      // badge: '1'
    },
    data: {
      extra: document.time,
    },
  };

  // Set the message as high priority and have it expire after 24 hours.
  const options = {
    collapseKey: 'demo',
    contentAvailable: true,
    priority: 'high',
  };

  // Send a message to devices subscribed to the provided topic.
  const topic = `/topics/list`;
  return admin.messaging().sendToTopic(topic, payload, options)
    .then((response) => {
      console.log('Successfully sent message:', response);
    });
});