const db = require("../firebase");
const { route } = require("../routes/search");

exports.findChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const chatRef = db.collection("Chat");

    // const snapshot = await chatRef
    //   .where("users", "array-contains", userId)
    //   .orderBy("latestMessage.createdAt", "desc")
    //   .get();

    // if (snapshot.empty) {
    //   console.log("No matching documents.");
    //   return;
    // }
    let chatsTobeSent = [];
    // snapshot.forEach(async (doc) => {
    //   console.log(doc.id, "=>", doc.data());
    //   const chatWithUserId = doc.id
    //     .split("-")
    //     .filter((email) => email !== userId)[0];
    //   console.log("chatWithUserId", chatWithUserId);
    //   const result = await fetchUserData(chatWithUserId);
    //   console.log("userInfo", result);
    //   chatsTobeSent.push({
    //     latestMessage: doc.data().latestMessage,
    //     name: result.name,
    //     id: result.email,
    //     profileImageLink: result.profileImageLink,
    //   });
    //   console.log(chatsTobeSent);
    // });

    const snapshot = await chatRef
      .where("users", "array-contains", userId)
      .orderBy("latestMessage.createdAt", "desc")
      .get()
      .then(async (querySnapshot) => {
        console.log(querySnapshot.docs);
        if (querySnapshot.docs.length > 0) {
          for (const doc of querySnapshot.docs) {
            //console.log("doc", doc.data());
            //console.log(doc.data());
            const chatWithUserId = doc.id
              .split("-")
              .filter((email) => email !== userId)[0];
            //console.log("chatWithUserId", chatWithUserId);
            const result = await fetchUserData(chatWithUserId);
            //console.log("userInfo", result);
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
