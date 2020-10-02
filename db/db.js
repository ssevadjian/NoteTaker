class Db {

deleteNote(id) {
    console.log("delete note function is called");
    return this.getNotes().then((notes) => notes.filter((note) => note.id != id))
      .then((filterdNotes) => this.write(filteredNotes));
  }
}

module.exports = new Db();