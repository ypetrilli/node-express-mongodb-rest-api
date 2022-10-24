const express = require("express");
const router = express.Router();

const {
  addArticle,
  deleteArticle,
  findArticleById,
  findAllArticles,
  findAllPublished,
  updateArticle,
} = require("../services/article.service");

// Create a new Article
router.post("/article", async (req, res, next) => {
  if (!req.body.title) {
    res.status(400).send({ message: "Article must have a title" });
    return;
  }

  try {
    const article = await addArticle(req.body);

    res.json({
      message: "Article successfully added",
      article: article,
    });
  } catch (err) {
    next(err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving articles.",
    });
  }
});

// Retrieve all Articles from the database (Allows to filter by title). page= 0, size=5 as default
router.get("/articles", async (req, res, next) => {
  const { page, size, title } = req.query;
  const { limit, offset } = getPagination(page, size);
  const filters = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};
  try {
    const articles = await findAllArticles(filters, limit, offset);
    res.json({
      message: "Fetched Successfully",
      articles: articles,
    });
  } catch (err) {
    next(err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving articles.",
    });
  }
});

// Retrieve all published Articles
router.get("/articles/published", async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    const articles = await findAllPublished(limit, offset);
    res.json({
      message: "Fetched Successfully",
      articles: articles,
    });
  } catch (err) {
    next(err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving articles.",
    });
  }
});

// Retrieve a single Article by id
router.get("/article/:id", async (req, res, next) => {
  try {
    const articleId = req.params.id;

    if (!articleId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(404).send({ message: "Article id not valid: " + articleId });
    }

    const art = await findArticleById(articleId);
    res.json({
      message: "Fetched Successfully",
      article: art,
    });
  } catch (err) {
    next(err);
    res.status(404).send({ message: err.message });
  }
});

// Update a Article with id
router.put("/article/:id", async (req, res, next) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Please provide the data of the Article to update",
    });
  }

  const id = req.params.id;

  try {
    const response = await updateArticle(id, req.body);

    if (!response) {
      res.status(404).send({
        message: `Article with id=${id} not found`,
      });
    } else {
      res.send({
        message: `Article with ID ${id} updated successfully`,
        article: response,
      });
    }
  } catch (err) {
    next(err);
    res.status(500).send({
      message: err.message || "Some error occurred while updating the article.",
    });
  }
});

// Delete a Article with id
router.delete("/article/:id", async (req, res, next) => {
  const id = req.params.id;
  const response = await deleteArticle(id);

  if (!response) {
    res.status(404).send({
      message: `Article with ID ${id} not found`,
    });
  } else {
    res.send({
      message: `Article with ID ${id} deleted successfully`,
    });
  }
});

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

module.exports = router;
