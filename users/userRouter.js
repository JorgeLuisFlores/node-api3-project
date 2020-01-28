const express = require("express");
const userdb = require("./userDb.js");
const postdb = require("../posts/postDb.js");
const postRouter = require("../posts/postRouter.js");
const router = express.Router();

router.use("/:id/posts", postRouter);

router.post("/", validateUser, (req, res) => {
  userdb
    .insert(req.body)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      res.status(404).json({
        message: "Unable to post User!"
      });
    });
});

router.post("/:id/posts", validatePost, (req, res) => {
  const postInfo = {
    ...req.body,
    user_id: req.params.id
  }

  postdb
    .insert(postInfo)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Post cannot be created!"
      });
    });
});

router.get("/", (req, res) => {
  userdb
    .get(req.query)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(404).json({
        message: "Post cannot find Users!"
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  userdb.getById(req.params.id).then(data => {
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json({
        message: "The post with the specified ID does not exist!"
      });
    }
  });
});

router.get("/posts/:id", validateUserId, (req, res) => {
  userdb
    .getUserPosts(req.params.id)
    .then(userposts => {
      res.status(200).json(userposts);
    })
    .catch(err => {
      res.status(500).json({
        message: "Error retrieving User Posts!"
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  userdb.remove(req.params.id).then(user => {
    if (user > 0) {
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

router.put("/:id", validateUserId, validateUser, (req, res) => {
  userdb.update(req.params.id, req.body).then(data => {
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({
        message: "The post with the specified ID does not exist!"
      });
    }
  });
});

//custom middleware

function validateUserId(req, res, next) {
  const {
    id
  } = req.params;
  userdb.getById(id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({
        message: "ID does not exist!"
      });
    }
  });
}

function validateUser(req, res, next) {
  if (!req.body.name) {
    res.status(404).json({
      message: "Missing User Data!"
    });
  } else {
    next();
  }
}

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