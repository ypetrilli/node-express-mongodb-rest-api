const Article = require("../models/article.model");

const addArticle = async (body) => {
  const article = new Article({
    title: body.title,
    description: body.description,
    published: body.published ?body.published : false,
  });
  const res = article.save(article);
  return res;
};

const deleteArticle = async (id) => {
  return Article.findByIdAndRemove(id);
};

const findArticleById = async (id) => {
  return Article.findById(id);
};

const findAllArticles = async (filters, limit, offset) => {
  return Article.paginate(filters, { offset, limit });
};

const findAllPublished = async (limit, offset) => {
  return Article.paginate({ published: true }, { offset, limit });
};

const updateArticle = async (id, article) => {
  return Article.findByIdAndUpdate(id, article, { useFindAndModify: false });
};

//findOneAndDelete({ _id: id });
//findByIdAndRemove

module.exports.addArticle = addArticle;
module.exports.deleteArticle = deleteArticle;
module.exports.findArticleById = findArticleById;
module.exports.findAllArticles = findAllArticles;
module.exports.findAllPublished = findAllPublished;
module.exports.updateArticle = updateArticle;
