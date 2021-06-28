const mongoose = require("mongoose");
const slugify = require("slugify");

const NoteSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
  },
  notebody: {
    type: String,
    required: [true, "Please add note body"],
    maxlength: [500, "note body must be under 5000 word"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    required: true,
    default: ["title"],
  },
  slug: {
    type: String,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    // required : true
  },
});

// create sluf from the title.
NoteSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Note", NoteSchema);
