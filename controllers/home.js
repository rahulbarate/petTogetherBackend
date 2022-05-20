const firebase = require("../firebase");
const db = firebase.db;
const Firestore = firebase.Firestore;

exports.getUserPost = async (req, res, next) => {
  const email = req.body.emailId;
  const userType =
    req.body.userType === "Shopkeeper"
      ? "shopkeeper"
      : req.body.userType === "Organization"
      ? "organization"
      : "individualUser";
  // console.log(email);
  // console.log(userType);
  const result = await fetchUserData(email, userType);
  try {
    if (!result) {
      res.status(404).json({ message: "Data not found" });
    } else {
      res.status(201).json(result);
    }
  } catch (error) {
    console.log(error);
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
  userType
) => {
  db.collection("Users")
    .doc(postUserType)
    .collection("accounts")
    .doc(postUserEmail)
    .collection("posts")
    .doc(postId)
    .update({ userWhoLikedIds: [email] });

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
      }),
    });
};

exports.setPostLike = async (req, res, next) => {
  let name = req.body.name;
  let notificationType = req.body.notificationType;
  let postId = req.body.postId;
  let profileImageLink = req.body.profileImageLink;
  let email = req.body.emailId;
  let userType = req.body.userType;
  let postUserEmail = req.body.postUserEmail;
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
      userType
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
  if (query == null) {
    query = await db
      .collection("Users")
      .doc("shopkeeper")
      .collection("accounts")
      .doc(element)
      .collection("posts")
      .get();
    if (query == null) {
      query = await db
        .collection("Users")
        .doc("organization")
        .collection("accounts")
        .doc(element)
        .collection("posts")
        .get();
    }
  }
  // console.log(element);
  let nameQuery = await db
    .collection("Users")
    .doc("individualUser")
    .collection("accounts")
    .doc(element)
    .get();
  if (nameQuery == null) {
    nameQuery = await db
      .collection("Users")
      .doc("shopkeeper")
      .collection("accounts")
      .doc(element)
      .get();
    if (nameQuery == null) {
      nameQuery = await db
        .collection("Users")
        .doc("organization")
        .collection("accounts")
        .doc(element)
        .get();
    }
  }
  let name;
  if ("name" in nameQuery.data()) {
    name = nameQuery.data().name;
  }
  let profileImageLink;
  if ("profileImageLink" in nameQuery.data()) {
    profileImageLink = nameQuery.data().profileImageLink;
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
    // returnData.push({idData:postData});
  });
  return returnData;
};

const fetchUserData = async (email, userType) => {
  // const querySnapshot = await db
  //   .collectionGroup("accounts")
  //   .where("email", "==", email)
  //   .get();
  let returnArray = [];
  const userData = await db
    .collection("Users")
    .doc(userType)
    .collection("accounts")
    .doc(email)
    .get(); //.collection("posts").get()
  if ("followingArray" in userData.data()) {
    const followers = userData.data().followingArray;
    for (each of followers) {
      returnArray = [...returnArray, await individualPost(each)];
    }
  }

  //console.log(followers);

  if (returnArray.length === 0) {
    //console.log(posts.docs[0]);
    return null;
  } else {
    return returnArray;
  }
};
