const mongoose = require('mongoose');
const pagination = require("mongoose-paginate-v2");

const Article = new mongoose.Schema({
        title: { type: String, required: true },
        description: { type: String, required: false },
        published: { type: Boolean, required: false, default: false },
    },
    { timestamps: true }
);

//Replace the _id by id in the final response
Article.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

//add pagination to schema
Article.plugin(pagination);

//TODO: Try ‘virtuals’ as alternative to replace _id by id
// ‘virtuals’, which are essentially fake fields that Mongoose creates. 
// They’re not stored in the DB, they just get populated at run time

// Duplicate the ID field.
// Schema.virtual('id').get(function() {
//   return this._id.toHexString();
// });

// Ensure virtual fields are serialised.
// Schema.set('toJSON', {
//   virtuals: true
// });

module.exports = mongoose.model('Article', Article);