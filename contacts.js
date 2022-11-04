const fs = require("fs").promises;
const {uid} = require('uid')
const path = require("node:path");
const contactsPath = path.resolve("db/contacts.json");


// logs all contacts as a table
function listContacts() {

  getAllContacts().then(console.table).catch(console.log);
}

// receives contactsId from cl as process.argv 
//  logs one contact which id matches the contactsId
function getContactById(contactId) {
  getAllContacts()
    .then((data) => console.table(data.find(({ id }) => id === contactId)))
    .catch(console.log);
}


// receives contactsId from cl as process.argv 
// deletes the contact that matches the contactsId from db/contacts.json
function removeContact(contactId) {
    getAllContacts()
    .then((data) => {
        const newContacts = data.filter(({ id }) => id !== contactId);
        const stringifiedContacts = JSON.stringify(newContacts)
        fs.writeFile(contactsPath, stringifiedContacts, errorFirstCallback);
    })
    .catch(console.log);
}


// receive contact's name, email  and phone from cl as process.argv 
// add a unique id to the contact with uid() and writes it to db/contacts.json
function addContact(name, email, phone) {
    const id = uid();
    const newContact = {id, name, email, phone}
  getAllContacts()
    .then((data) => {
        const newContacts = [...data, newContact]
        const stringifiedContacts = JSON.stringify(newContacts)
      fs.writeFile(contactsPath, stringifiedContacts, errorFirstCallback);
    })
    .catch(console.log);
}


// gets all contacts from db/contacts.json and parses them
async function getAllContacts() {
  try {
    const data = await fs.readFile(contactsPath, { encoding: "utf8" });
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
}


function errorFirstCallback(err) {
  if (err) {
    throw err;
    console.log("The file has been saved!");
  }
}

module.exports = {
  contactsPath,
  listContacts,
  getContactById,
    removeContact,
  addContact,
};
