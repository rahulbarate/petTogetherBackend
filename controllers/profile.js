const firebase = require("../firebase");
const db=firebase.db;

exports.getUserProfile = async (req, res, next) => {
  try {
    let email = req.body.email;
    if (!email) {
      email = req.body.userData.email;
    }
    // console.log(email);
    const result = await fetchUserData(email);

    if (!result) {
      res.status(404).json({ message: "Data not found" });
    } else {
      // console.log(result);
      res.status(201).json({ ...result });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const userData = req.body.userData;
    console.log(userData);
    const result = await updateDataInDatabse(userData);
    res.status(201).json({ success: true });

    // if (!result) {
    // res.status(404).json({ message: "Data not found" });
    // } else {
    // console.log(result);
    // }
  } catch (error) {
    console.log(error);
  }
};

const updateDataInDatabse = async (userData) => {
  // console.log(userData);
  const userType =
    userData.userType === "Shopkeeper"
      ? "shopkeeper"
      : userData.userType === "Organization"
      ? "organization"
      : "individualUser";
  try {
    db.collection("Users")
      .doc(userType)
      .collection("accounts")
      .doc(userData.email)
      .update(userData);
    // return "success";
  } catch (error) {
    return null;
  }

  // console.log(result);
  // return "Success";
  // const querySnapshot = await db
  //   .collectionGroup("accounts")
  //   .where("email", "==", userData.email).get();

  // if (!result.exists) {
  //   console.log(result.data());
  //   // console.log(querySnapshot.docs[0]);
  //   // querySnapshot.docs[0].update(userData);
  //   return "success";
  // } else {
  //   return null;
  // }
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
