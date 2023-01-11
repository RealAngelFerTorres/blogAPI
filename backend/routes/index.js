var express = require('express');
var router = express.Router();

// Require controller modules.
var home_controller = require('../controllers/homeController');
var post_controller = require('../controllers/postController');
var comment_controller = require('../controllers/commentController');
var user_controller = require('../controllers/userController');

// Require auth services
var authJwt = require('../services/auth');

// HOME //

router.route('/home').get(home_controller.home_get);

// POST ROUTES

router.route('/post/:id').get(post_controller.post_detail_get);

router.route('/post/:id/vote').post(post_controller.post_vote_post);

router.route('/post/:id/delete').delete(post_controller.post_delete);

router
  .route('/post/:id/edit')
  .get(post_controller.post_edit_get) // Delete this later if a new page is loaded
  .put(authJwt.authJwt, post_controller.post_edit_put);

router
  .route('/post/create')
  .get(post_controller.post_create_get)
  .post(post_controller.post_create_post);

// COMMENT ROUTES

router
  .route('/post/comment/onPost') // Comment on post
  .post(comment_controller.comment_on_post_post);
router
  .route('/post/comment/onComment') // Comment on comment
  .post(comment_controller.comment_on_comment_post);

router
  .route('/comment/delete/:id')
  .delete(comment_controller.comment_delete_delete);

router
  .route('/comment/:id/edit')
  .get(comment_controller.comment_edit_get) // Delete this later if a new page is loaded
  .put(comment_controller.comment_edit_put);

// USER ROUTES
router.route('/user/:id').get(user_controller.user_detail_get);

router.route('/user/:id/drafts').get(user_controller.user_drafts_get);

router
  .route('/user/login')
  .get(user_controller.user_login_get)
  .post(user_controller.user_login_post);

router.route('/user/logout').get(user_controller.user_logout_get);

router
  .route('/user/signup')
  .get(user_controller.user_signup_get)
  .post(user_controller.user_signup_post);

router.route('/isAuth').get(authJwt.authJwt, user_controller.user_is_auth);

module.exports = router;
