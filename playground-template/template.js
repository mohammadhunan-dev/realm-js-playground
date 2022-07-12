const Realm = require("realm");
const BSON = require("bson");
// Update this with your App ID
const app = new Realm.App({ id: "playground-kmcdm" });
const TaskSchema = {
  name: "Task",
  properties: {
    _id: "objectId",
    _partition: "string?",
    name: "string",
    status: "string",
  },
  primaryKey: "_id",
};
async function run() {
  const credentials = Realm.Credentials.anonymous();
  await app.logIn(credentials);
  console.log(`Logged in anonymously with user id: ${app.currentUser.id}`);
  const realm = await Realm.open({
    schema: [TaskSchema],
    sync: {
      user: app.currentUser,
      partitionValue: "quickstart",
    },
  });
  // Get all Tasks in the realm
  const tasks = realm.objects("Task");
 
  let task1, task2;
  realm.write(() => {
    task1 = realm.create("Task", {
      _id: new BSON.ObjectID(),
      name: "go grocery shopping",
      status: "Open",
    });
    
    task2 = realm.create("Task", {
      _id: new BSON.ObjectID(),
      name: "go exercise",
      status: "Open",
    });
    console.log(`created two tasks: ${task1.name} & ${task2.name}`);
  });
 

  // Delete the Tasks
  realm.write(() => {
    realm.delete(task1);
    realm.delete(task2);
    task1 = null;
    task2 = null;
  });
  realm.close();
  app.currentUser.logOut();
}

run().catch(err => {
  console.error(err)
});
