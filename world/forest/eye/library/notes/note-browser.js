class NoteBrowser extends Browser {
    constructor(id) {
        super(id, ["title", "content"], "save-notes");

        this.$read.title = $("<h4>Title</h4>").appendTo(this.$read.div);
        this.$read.content = $("<p>Content</p>").appendTo(this.$read.div);

        this.$read.new = $(`<button id="new">New</button>`).appendTo(this.$read.div).on("click", this.new);
        this.$read.edit = $(`<button id="edit">Edit</button>`).appendTo(this.$read.div).on("click", this.edit);
        this.$read.delete = $(`<button id="delete">Delete</button>`).appendTo(this.$read.div).on("click", this.delete);

        this.$edit.title = $(`<input type="text" id="title" placeholder="Title">`).appendTo(this.$edit.div.append("<h6>Title:</h6>"));
        this.$edit.content = $(`<textarea id="content" cols="30" rows="10">Your Notes Here</textarea>`).appendTo(this.$edit.div.append("<h6>Notes:</h6>"));

        this.$edit.save = $(`<button id="save">Save</button>`).appendTo(this.$edit.div).on("click", this.save);
        this.$edit.cancel = $(`<button id="cancel">Cancel</button>`).appendTo(this.$edit.div).on("click", this.cancel);
    }
}