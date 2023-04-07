var express = require('express');
var router = express.Router();

// Require controller modules.
var home_controller = require('../controllers/homeController');
var post_controller = require('../controllers/postController');
var comment_controller = require('../controllers/commentController');
var user_controller = require('../controllers/userController');

// HOME

router.route('/home').get(home_controller.home_get);

// POST ROUTES

router.route('/post/:id/detail').post(post_controller.post_detail_post);

router
  .route('/post/:id/vote')
  .post(user_controller.user_authentication, post_controller.post_vote_post);

router
  .route('/post/:id/delete')
  .delete(user_controller.user_authentication, post_controller.post_delete);

router
  .route('/post/:id/edit')
  .put(user_controller.user_authentication, post_controller.post_edit_put);

router
  .route('/post/create')
  .post(user_controller.user_authentication, post_controller.post_create_post);

// COMMENT ROUTES

router
  .route('/post/comment/onPost') // Comment on post
  .post(
    user_controller.user_authentication,
    comment_controller.comment_on_post_post
  );
router
  .route('/post/comment/onComment') // Comment on comment
  .post(
    user_controller.user_authentication,
    comment_controller.comment_on_comment_post
  );

router
  .route('/comment/delete/:id')
  .delete(
    user_controller.user_authentication,
    comment_controller.comment_delete_delete
  );

router
  .route('/comment/:id/edit')
  .put(
    user_controller.user_authentication,
    comment_controller.comment_edit_put
  );

// USER ROUTES

router
  .route('/user/:id/detail')
  .get(user_controller.user_authentication, user_controller.user_detail_get);

router
  .route('/user/:id/drafts/detail')
  .get(user_controller.user_authentication, user_controller.user_drafts_get);

router.route('/user/login').post(user_controller.user_login_post);

router.route('/user/signup').post(user_controller.user_signup_post);

router
  .route('/isAuth')
  .get(user_controller.user_authentication, user_controller.user_is_auth);

module.exports = router;
