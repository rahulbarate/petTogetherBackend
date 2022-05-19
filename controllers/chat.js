const firebase = require("../firebase");
const db = firebase.db;

exports.findChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const chatRef = db.collection("Chat");

    let chatsTobeSent = [];

    const snapshot = await chatRef
      .where("users", "array-contains", userId)
      .orderBy("latestMessage.createdAt", "desc")
      .get()
      .then(async (querySnapshot) => {
        console.log(querySnapshot.docs);
        if (querySnapshot.docs.length > 0) {
          for (const doc of querySnapshot.docs) {
            const chatWithUserId = doc.id
              .split("-")
              .filter((email) => email !== userId)[0];

            const result = await fetchUserData(chatWithUserId);

            chatsTobeSent.push({
              latestMessage: doc.data().latestMessage.text,
              createdAt: doc.data().latestMessage.createdAt.toDate(),
              name: result.name,
              id: result.email,
              profileImageLink: result.profileImageLink,
            });
          }
        } else {
        }
      });

    //console.log("chatsToBeSent", chatsTobeSent);

    return res.json(chatsTobeSent);
  } catch (error) {
    console.error(error);
  }
};

const fetchUserData = async (email) => {
  const querySnapshot = await db
    .collectionGroup("accounts")
    .where("email", "==", email)
    .get();

  // for (let each of querySnapshot.docs)
  // {
  //   console.log(each.data());
  // }
  if (!querySnapshot.empty) {
    // console.log(querySnapshot.docs[0].data());
    return querySnapshot.docs[0].data();
  } else {
    return null;
  }
};
