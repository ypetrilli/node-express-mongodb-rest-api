const express = require('express');
const router = express.Router();

const controller = require("../controllers/article.controller.js");

// Create a new Article
router.post("/article", controller.create);

// Retrieve all Articles
router.get("/articles", controller.findAll);

// Retrieve all published Articles
router.get("/articles/published", controller.findAllPublished);

// Retrieve a single Article with id
router.get("/article/:id", controller.findOne);

// Update a Article with id
router.put("/article/:id", controller.update);

// Delete a Article with id
router.delete("/article/:id", controller.delete);

// Delete all articles
router.delete("/articles", controller.deleteAll);

module.exports = router;