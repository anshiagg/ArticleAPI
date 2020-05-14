const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")

app = express()
app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));

const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/articlesDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(function(req, res) {
        Article.find({}, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    })
    .post(function(req, res) {
        console.log(req.query);
        const title = req.body.title;
        const content = req.body.content;
        console.log(content);
    
        const newArticle = new Article({
            title: title,
            content: content
        });
    
        newArticle.save();
        res.redirect("/articles");
    })
    .delete(function(req, res) {
        Article.deleteMany({}, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully deleted all documents");
            }
        })
    });


app.route("/articles/:articleID")
    .get(function(req, res) {
        Article.find({title: req.params.articleID}, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                console.log(result);
                if (!result) {
                    res.send("Article not found");
                } else {
                    console.log(result);
                    res.send(result);
                }
            }
        });
    })
    .put(function(req, res) {
        Article.update({title: req.params.articleID}, {title: req.body.title, content: req.body.content}, {overwrite: true}, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully updated the article");
            }
        });
    })
    .patch(function(req, res) {
        Article.update({title: req.params.articleID}, {$set: req.body}, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully updated the article");
            }
        });
    })
    .delete(function(req, res) {
        Article.deleteOne({title: req.params.articleID}, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully deleted the article");
            }
        });
    });

app.listen(3003, function() {
    console.log("Server is running on port 30003");
});