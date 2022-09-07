var express = require('express');
var router = express.Router();

// Require controller modules.
var home_controller = require('../controllers/homeController');
var post_controller = require('../controllers/postController');
var comment_controller = require('../controllers/commentController');
var user_controller = require('../controllers/userController');

// HOME //

router.route('/home').get(home_controller.home_get);

// POST ROUTES

router.route('/post/:id').get(post_controller.post_detail_get);

router.route('/post/:id/delete').delete(post_controller.post_delete);

router
  .route('/post/:id/edit')
  .get(post_controller.post_edit_get)
  .post(post_controller.post_edit_post);

router
  .route('/post/create')
  .get(post_controller.post_create_get)
  .post(post_controller.post_create_post);

// COMMENT ROUTES

router
  .route('/post/:id/comment/onPost') // Comment on post
  .post(comment_controller.comment_on_post_post);
router
  .route('/post/:id/comment/onComment') // Comment on comment
  .post(comment_controller.comment_on_comment_post);

router
  .route('/post/:id/comment/delete')
  .delete(comment_controller.comment_delete_post);

router
  .route('/post/:id/comment/edit')
  .get(comment_controller.comment_edit_get)
  .post(comment_controller.comment_edit_post);

// USER ROUTES

router
  .route('/user/login')
  .get(user_controller.user_login_get)
  .post(user_controller.user_login_post);

router.route('/user/logout').get(user_controller.user_logout_get);

router
  .route('/user/signup')
  .get(user_controller.user_signup_get)
  .post(user_controller.user_signup_post);

router.route('/user/admin').get(user_controller.user_admin_get);

module.exports = router;
