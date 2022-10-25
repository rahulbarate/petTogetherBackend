const firebase = require("../firebase");
const db = firebase.db;
const Firestore = firebase.Firestore;
const uuid = require("uuid").v4;

exports.getUserPost = async (req, res, next) => {
  const email = req.body.emailId;
  const userType =
    req.body.userType === "Shopkeeper"
      ? "shopkeeper"
      : req.body.userType === "Organization"
      ? "organization"
      : "individualUser";

  try {
    const result = await fetchUserData(email, userType);
    if (!result) {
      res.status(404).json({ message: "Data not found" });
    } else {
      res.status(201).json(result);
    }
  } catch (error) {
    console.log("getUserPost: " + error.message);
  }
};

const postLikeupdate = async (
  email,
  postUserType,
  postId,
  postUserEmail,
  name,
  notificationType,
  profileImageLink,
  userType,
  isLiked,
  sendTime
) => {
  try {
    if (!isLiked) {
      db.collection("Users")
        .doc(postUserType)
        .collection("accounts")
        .doc(postUserEmail)
        .collection("posts")
        .doc(postId)
        .update({ userWhoLikedIds: Firestore.FieldValue.arrayUnion(email) });

      db.collection("Users")
        .doc(postUserType)
        .collection("accounts")
        .doc(postUserEmail)
        .update({
          notification: Firestore.FieldValue.arrayUnion({
            name: name,
            notificationType: notificationType,
            postId: postId,
            profileImageLink: profileImageLink,
            userId: email,
            userType: userType,
            sendTime: sendTime,
          }),
        });
    } else {
      db.collection("Users")
        .doc(postUserType)
        .collection("accounts")
        .doc(postUserEmail)
        .collection("posts")
        .doc(postId)
        .update({ userWhoLikedIds: Firestore.FieldValue.arrayRemove(email) });

      db.collection("Users")
        .doc(postUserType)
        .collection("accounts")
        .doc(postUserEmail)
        .update({
          notification: Firestore.FieldValue.arrayRemove({
            name: name,
            notificationType: notificationType,
            postId: postId,
            profileImageLink: profileImageLink,
            userId: email,
            userType: userType,
            sendTime: sendTime,
          }),
        });
    }
  } catch (err) {
    console.log("postLikeupdate: " + err.message);
  }
};

exports.setNotification = async (req, res, next) => {
  let name = req.body.name;
  let postId = req.body.postId;
  let profileImageLink = req.body.profileImageLink;
  let email = req.body.emailId;
  let userType = req.body.userType;
  let postUserEmail = req.body.postUserEmail;
  let sendTime = req.body.sendTime;
  const notificationType =
    req.body.notificationType === "petSellPost"
      ? "petBuyRequest"
      : req.body.notificationType === "reshelter"
      ? "reshelterRequest"
      : req.body.notificationType == "breedPost"
      ? "breedRequest"
      : "adoptionRequest";
  const postUserType =
    req.body.postUserType === "Shopkeeper"
      ? "shopkeeper"
      : req.body.postUserType === "Organization"
      ? "organization"
      : "individualUser";

  try {
    db.collection("Users")
      .doc(postUserType)
      .collection("accounts")
      .doc(postUserEmail)
      .update({
        notification: Firestore.FieldValue.arrayUnion({
          name: name,
          notificationType: notificationType,
          postId: postId,
          profileImageLink: profileImageLink,
          userId: email,
          userType: userType,
          sendTime: sendTime,
          requestStatus: "waiting",
        }),
      });

    //adding list of interested users in that post
    db.collection("Users")
      .doc(postUserType)
      .collection("accounts")
      .doc(postUserEmail)
      .collection("posts")
      .doc(postId)
      .update({ interestedUsers: Firestore.FieldValue.arrayUnion(email) });
  } catch (err) {
    console.log("setNotification: " + err.message);
  }
};
exports.setPostLike = async (req, res, next) => {
  let name = req.body.name;
  let notificationType = req.body.notificationType;
  let postId = req.body.postId;
  let profileImageLink = req.body.profileImageLink;
  let email = req.body.emailId;
  let userType = req.body.userType;
  let postUserEmail = req.body.postUserEmail;
  let isLiked = req.body.isLiked;

  let sendTime = req.body.sendTime;
  const postUserType =
    req.body.postUserType === "Shopkeeper"
      ? "shopkeeper"
      : req.body.postUserType === "Organization"
      ? "organization"
      : "individualUser";
  try {
    const postUpdate = await postLikeupdate(
      email,
      postUserType,
      postId,
      postUserEmail,
      name,
      notificationType,
      profileImageLink,
      userType,
      isLiked,
      sendTime
    );
    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

const individualPost = async (element) => {
  let query = await db
    .collection("Users")
    .doc("individualUser")
    .collection("accounts")
    .doc(element)
    .collection("posts")
    .get();
  let userType = "individualUser";
  if (query.docs.length == 0) {
    query = await db
      .collection("Users")
      .doc("shopkeeper")
      .collection("accounts")
      .doc(element)
      .collection("posts")
      .get();
    userType = "shopkeeper";
    if (query.docs.length == 0) {
      query = await db
        .collection("Users")
        .doc("organization")
        .collection("accounts")
        .doc(element)
        .collection("posts")
        .get();
      userType = "organization";
    }
  }

  let nameQuery = await db
    .collection("Users")
    .doc(userType)
    .collection("accounts")
    .doc(element)
    .get();
  let name;
  let profileImageLink;
  if (nameQuery.exists) {
    name = "name" in nameQuery.data() ? nameQuery.data().name : "";
    // let name = nameQuery.data().name;
    // let profileImageLink = nameQuery.data().profileImageLink;
    profileImageLink =
      "profileImageLink" in nameQuery.data()
        ? nameQuery.data().profileImageLink
        : "";
  }

  let returnData = [];
  query.docs.forEach((ele) => {
    const idData = ele.id;
    const postData = ele.data();

    returnData = [
      ...returnData,
      {
        postId: idData,
        name: name,
        postData,
        profileImageLink: profileImageLink,
      },
    ];
  });
  return returnData;
};

const fetchUserData = async (email, userType) => {
  const userData = await db
    .collection("Users")
    .doc(userType)
    .collection("accounts")
    .doc(email)
    .get();
  let followers =
    userType === "individualUser"
      ? userData.data().followingArray
      : userData.data().followersArray;
  let returnArray = [];
  if (!followers) {
    return null;
  }

  for (each of followers) {
    returnArray = [...returnArray, await individualPost(each)];
  }

  if (returnArray.length === 0) {
    return null;
  } else {
    //console.log("retArray", returnArray);
    return returnArray;
  }
};

exports.addComment = async (req, res) => {
  const {
    postUserEmail,
    postId,
    profileImageLink,
    content,
    name,
    commentUserEmail,
    userType,
    sendTime,
  } = req.body;
  const postUserType =
    req.body.postUserType === "Shopkeeper"
      ? "shopkeeper"
      : req.body.postUserType === "Organization"
      ? "organization"
      : "individualUser";

  let id = uuid();
  try {
    db.collection("Users")
      .doc(postUserType)
      .collection("accounts")
      .doc(postUserEmail)
      .collection("posts")
      .doc(postId)
      .update({
        comments: Firestore.FieldValue.arrayUnion({
          _id: id,
          name: name,
          commentUserId: commentUserEmail,
          content: content,
          profileImageLink: profileImageLink,
          date: Date.now(),
        }),
      });

    if (postUserEmail !== commentUserEmail) {
      db.collection("Users")
        .doc(postUserType)
        .collection("accounts")
        .doc(postUserEmail)
        .update({
          notification: Firestore.FieldValue.arrayUnion({
            name: name,
            notificationType: "comment",
            postId: postId,
            profileImageLink: profileImageLink,
            userId: commentUserEmail,
            userType: userType,
            sendTime,
          }),
        });
    }

    return res.send(id);
  } catch (error) {
    console.log(error);
  }
};
