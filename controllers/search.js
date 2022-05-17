const firebase = require("../firebase");
const db=firebase.db;
exports.findSearchedUsers = async (req, res) => {
  try {
    const { searchQuery } = req.params;
    const search = searchQuery.toString();
    const accountsRef = await db
      .collectionGroup("accounts")
      .where("name", ">=", search)
      .where("name", "<=", search + "\uf8ff");
    const querySnapshot = await accountsRef.get();

    let searchedDoc = [];

    querySnapshot.forEach((doc) => {
      searchedDoc.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(searchedDoc);
  } catch (error) {
    console.log(error);
  }
};
