const { expect } = require("chai");
const sinon = require("sinon");

const Article = require("../src/models/article.model");
const {
  addArticle,
  findArticleById,
} = require("../src/services/article.service");

describe("Article Service unit testing", function () {
  this.afterEach(() => {
    sinon.restore();
  });

  describe("Save Article", function () {
    it("Should successfully add an article", async function () {
      const article = {
        title: "article test",
        description: "345sdfghnm2",
        published: false,
      };

      sinon.stub(Article.prototype, "save").returns(article);
      const returnedArticle = await addArticle(article);
      expect(returnedArticle.title).to.equal("article test");
      expect(returnedArticle.description).to.equal("345sdfghnm2");
    });
  });

  describe("Get Article by ID", function () {
    it("Should return the article detail info based on the given id", async function () {
      const id = 1;
      const fakeObject = {
        _id: 1,
        title: "Akshay",
        description: "ABCD",
      };
      sinon.stub(Article, "findById").returns(fakeObject);
      const returnedArticle = await findArticleById({ id });
      expect(returnedArticle).to.have.property("title");
      expect(returnedArticle.title).to.equal(fakeObject.title);
      expect(returnedArticle.description).to.equal(fakeObject.description);
    });

    it("Should give error if there is no article found with provided id", async function () {
      const id = 5;
      sinon.stub(Article, "findById").returns(null);
      const returnedArticle = await findArticleById({ id });
      expect(returnedArticle).to.equal(null);
    });
  });
});
