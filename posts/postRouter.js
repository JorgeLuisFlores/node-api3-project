const express = require("express");
const postdb = require("./postDb.js");
const router = express.Router();

router.get("/", (req, res) => {
  postdb
    .get(req.querry)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(404).json({
        message: "Cannot find posts!"
      });
    });
});

router.get("/:id", (req, res) => {
  postdb
    .getById(req.params.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(404).json({
        message: "Post find posts using ID!"
      });
    });
});

router.delete("/:id", (req, res) => {
  postdb.remove(req.params.id).then(post => {
    if (post > 0) {
      res.status(200).json({
        message: "Post has been deleted!"
      });
    } else {
      res.status(404).json({
        message: "The post with the specified ID does not exist!"
      });
    }
  });
});

router.put("/:id", validatePost, (req, res) => {
  postdb.update(req.params.id, req.body).then(data => {
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    }
  });
});

// custom middleware

function validatePost(req, res, next) {
  if (!req.body.text) {
    res.status(404).json({
      message: "Missing Post Data!"
    });
  } else {
    next();
  }
}

module.exports = router;