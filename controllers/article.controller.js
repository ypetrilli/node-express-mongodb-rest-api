const Article = require("../models/Article.js");

// Create and Save a new Article
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Article must have a title" });
    return;
  }

  // Create the Article object to save
  const article = new Article({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  });

  // Save the Article in the database
  article
    .save(article)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while creating the Article.",
      });
    });
};

// Retrieve all Articles from the database (Allows to filter by title). page= 0, size=5 as default
exports.findAll = (req, res) => {
  const { page, size, title } = req.query;
  const condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  const { limit, offset } = getPagination(page, size);

  Article.paginate(condition, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        articles: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving articles.",
      });
    });
};

// Find a single Article by the specified id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Article.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Article not found with ID: " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving article with ID: " + id,
      });
    });
};

// Find all published Articles
exports.findAllPublished = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Article.paginate({ published: true }, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        articles: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving articles.",
      });
    });
};

// Update an Article by the specified id
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Please provide the data of the Article to update",
    });
  }

  const id = req.params.id;

  Article.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Article with id=${id} not found`,
        });
      } else
        res.send({ message: `Article with ID ${id} updated successfully` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Article with ID " + id,
      });
    });
};

// Delete an Article by the specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  Article.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Article with ID ${id} not found`,
        });
      } else {
        res.send({
          message: `Article with ID ${id} deleted successfully`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `An error occurred while deleting Article with id=${id}`,
      });
    });
};

// Delete all Articles from the database
exports.deleteAll = (req, res) => {
  Article.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Articles were successfully deleted`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing the Articles.",
      });
    });
};

//Pagination
const getPagination = (page, size) => {
  const limit = size ? + size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};
