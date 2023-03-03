import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import Comment from './Comment';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import TextareaAutosize from 'react-textarea-autosize';
import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import UserContext from '../services/UserContext';
import {
  getSinglePost,
  createNewComment,
  deletePost,
  editPost,
  sendVote,
} from '../services/DBServices';

function SinglePost() {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [post, setPost] = useState();
  const [updatedKarma, setUpdatedKarma] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isTogglingVote, setIsTogglingVote] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownvote, setIsDownvote] = useState(false);
  const [isUpvote, setIsUpvote] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    text: '',
    published: undefined,
  });
  const [commentForm, setCommentForm] = useState({
    text: '',
  });

  let navigate = useNavigate();
  let url = useParams();

  const editorRef = useRef(null);

  const manageResponse = (response) => {
    if (response.user === false) {
      navigate('/login');
      return;
    }
    if (response.errors) {
      response.errors.forEach((error) => {
        console.log(error.msg);
      });
    }
  };

  const goToComments = () => {
    var y = document.querySelector('.post__comments').offsetTop;
    var subtract = document.querySelector('.navBar').offsetHeight;
    window.scrollTo({ top: y - subtract, left: 0, behavior: 'smooth' });
  };

  const submitDeletePost = async (e) => {
    const response = await deletePost(post.id);
    if (response.url) {
      navigate(response.url);
      return;
    }
    manageResponse(response);
  };

  const submitEditPost = async (e) => {
    let copyState = postForm;
    copyState = {
      ...copyState,
      id: post.id,
    };
    setPostForm(copyState);

    const response = await editPost(copyState);
    if (response.status === 'OK') {
      let copyState = post;
      copyState = {
        ...copyState,
        title: postForm.title,
        text: postForm.text,
      };
      setPost(copyState);
      setIsEditing(false);
      return;
    }
    manageResponse(response);
  };

  const submitComment = async (e) => {
    let copyState = commentForm;
    copyState = {
      ...copyState,
      author: currentUser._id,
      fatherPost: post.id,
    };
    setCommentForm(copyState);

    const response = await createNewComment(copyState);
    if (response.status === 'OK') {
      let copyArray = post.comments;
      copyArray.unshift(response.data);

      let copyState = post;
      copyState = {
        ...copyState,
        comments: copyArray,
      };
      setPost(copyState);
      setCommentForm({ text: '' });
      return;
    }
    manageResponse(response);
  };

  const handlePostFormChange = (e) => {
    let input = e.target.value;
    let key = e.target.name;
    let copyState = postForm;

    copyState = {
      ...copyState,
      [key]: input,
    };
    setPostForm(copyState);
  };

  const handleEditorChange = (e) => {
    let input = editorRef.current.getContent();
    let copyState = postForm;

    copyState = {
      ...copyState,
      text: input,
    };
    setPostForm(copyState);
  };

  const handleCheckboxChange = () => {
    postForm.published
      ? setPostForm({ ...postForm, published: false })
      : setPostForm({ ...postForm, published: true });
  };

  const handleCommentFormChange = (e) => {
    let input = e.target.value;
    let key = e.target.name;
    let copyState = commentForm;

    copyState = {
      ...copyState,
      [key]: input,
    };
    setCommentForm(copyState);
  };

  const toggleEditPost = () => {
    isEditing ? setIsEditing(false) : setIsEditing(true);
    setPostForm({
      title: post.title,
      text: post.text,
      published: post.published,
    });
  };

  const toggleDeleteModal = (e) => {
    e.stopPropagation();
    isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true);
  };

  const manageVote = async (e) => {
    if (isTogglingVote) {
      return;
    }
    setIsTogglingVote(true);

    const form = {
      postID: post.id,
      voteType: e.target.value,
      userID: currentUser.id,
    };
    const response = await sendVote(form);
    if (response.status !== 'OK') manageResponse(response);

    toggleVote(e.target.value);
    setTimeout(() => {
      setIsTogglingVote(false);
    }, 500);
  };

  const toggleVote = (voteType) => {
    let karmaUpdater = 0;
    if (voteType === '1') {
      if (isUpvote) {
        setIsUpvote(false);
        setUpdatedKarma(updatedKarma - 1);
        return;
      }
      if (isDownvote) {
        setIsDownvote(false);
        karmaUpdater += 1;
      }
      setIsUpvote(true);
      karmaUpdater += 1;
      setUpdatedKarma(updatedKarma + karmaUpdater);
    } else {
      if (isDownvote) {
        setIsDownvote(false);
        setUpdatedKarma(updatedKarma + 1);
        return;
      }
      if (isUpvote) {
        setIsUpvote(false);
        karmaUpdater -= 1;
      }
      setIsDownvote(true);
      karmaUpdater -= 1;
      setUpdatedKarma(updatedKarma + karmaUpdater);
    }
  };

  useEffect(() => {
    if (currentUser && post) {
      const foundVote = currentUser.votedPosts.find(
        (e) => e.postID.valueOf() === post.id
      );
      if (foundVote) {
        foundVote.voteType === 1 ? setIsUpvote(true) : setIsDownvote(true);
      }
    }
  }, [currentUser, post]);

  useEffect(() => {
    getSinglePost(url.id).then((e) => {
      setPost(e.data);
      setUpdatedKarma(e.data.karma);
    });
  }, []);

  if (!post) {
    return <div>Loading post...</div>;
  } else {
    return (
      <div className='postContainer'>
        <div
          className={`modalBackground ${isModalOpen ? 'show' : ''}`}
          onClick={toggleDeleteModal}
        >
          <div className='modalContent' onClick={(e) => e.stopPropagation()}>
            <div className='upper' title='Close' onClick={toggleDeleteModal}>
              <button className='material-icons icon'>close</button>
            </div>
            <div className='middle'>
              Are you sure you want to delete this post?
            </div>
            <div className='bottom'>
              <button
                className='button deletePostButton'
                onClick={submitDeletePost}
              >
                Delete post
              </button>
              <button className='button' onClick={toggleDeleteModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div className='leftBar'>
          <div className='karmaContainer'>
            <button
              className={`material-icons upvoteArrow ${
                isUpvote ? 'voted' : ''
              }`}
              onClick={manageVote}
              value={1}
              disabled={isTogglingVote}
              title='Upvote this post'
            >
              shift
            </button>
            <div className='post__karma'>{updatedKarma}</div>
            <button
              className={`material-icons downvoteArrow ${
                isDownvote ? 'voted' : ''
              }`}
              onClick={manageVote}
              value={-1}
              disabled={isTogglingVote}
              title='Downvote this post'
            >
              shift
            </button>
          </div>
          <div className='commentContainer'>
            <button
              className='material-icons commentIcon'
              title='Jump to comments'
              onClick={goToComments}
            >
              mode_comment
            </button>
            <div className=''>{post.commentQuantity}</div>
          </div>
          {currentUser.id === post.author.id ? (
            <div className='postOptionsContainer'>
              {isEditing ? (
                <div className='editContainer'>
                  {postForm.published ? (
                    <label
                      className='material-icons icon'
                      title='This post is published. Click to toggle.'
                      htmlFor='published'
                    >
                      visibility
                    </label>
                  ) : (
                    <label
                      className='material-icons icon'
                      title='This post is unpublished. Click to toggle.'
                      htmlFor='published'
                    >
                      visibility_off
                    </label>
                  )}
                  <input
                    className='hidden'
                    type='checkbox'
                    id='published'
                    name='published'
                    onChange={handleCheckboxChange}
                    checked={postForm.published}
                  />
                  <button
                    className='material-icons icon acceptButton'
                    title='Finish editing'
                    onClick={submitEditPost}
                  >
                    done
                  </button>
                  <button
                    className='material-icons icon cancelButton'
                    title='Cancel editing'
                    onClick={toggleEditPost}
                  >
                    close
                  </button>
                </div>
              ) : (
                <button
                  className='material-icons icon editButton'
                  title='Edit post'
                  onClick={toggleEditPost}
                >
                  edit
                </button>
              )}
              <button
                className='material-icons icon deleteButton'
                title='Delete post'
                onClick={toggleDeleteModal}
              >
                delete
              </button>
            </div>
          ) : null}
        </div>
        <div className='post' id={post.id}>
          <div className='post__author'>
            <div>
              <div className='material-icons'>person</div>{' '}
              <Link className='username' to={post.author.url}>
                {post.author.username}
              </Link>
            </div>
          </div>
          <div className='post__dates'>
            <div className='post__createTime'>
              {DateTime.fromISO(post.createTime).toLocaleString(
                DateTime.DATE_FULL
              )}
            </div>
            {post.editTime.includes('1970-01-01') ? null : (
              // Conditional rendering. 1970-01-01 is considered a null date.
              <div className='post__editTime'>
                &nbsp;· Edited:{' '}
                {DateTime.fromISO(post.editTime).toLocaleString(
                  DateTime.DATETIME_MED
                )}
              </div>
            )}
          </div>
          <div className='post__title'>
            <Link
              to={post.url}
              style={{ display: `${isEditing ? 'none' : ''}` }}
            >
              {post.title}
            </Link>
            <TextareaAutosize
              className='edit__title edit editing'
              type='text'
              name='title'
              maxLength={120}
              required
              value={postForm.title}
              onChange={handlePostFormChange}
              style={{ display: `${isEditing ? '' : 'none'}` }}
            ></TextareaAutosize>
          </div>
          <div className='post__text'>
            {isEditing ? (
              <Editor
                apiKey='your-api-key'
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={post.text}
                name='text'
                value={postForm.text}
                maxLength={5000}
                onEditorChange={handleEditorChange}
                init={{
                  menubar: false,
                  plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'code',
                    'help',
                    'wordcount',
                  ],
                  toolbar:
                    'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:22px;text-align: justify;line-height:36px; }',
                }}
              />
            ) : (
              <div
                className='text'
                dangerouslySetInnerHTML={{
                  __html: post.text,
                }}
              ></div>
            )}
          </div>
          <div className='singlePost__interactions'>
            <div className='post__interactions--karma'>
              <div>
                <div className='material-icons'>swap_vert</div>
                {post.karma}{' '}
                {post.karma === 1 || post.karma === -1 ? 'point' : 'points'}
              </div>
            </div>
            <div className='post__interactions--comments'>
              <div>
                <div className='material-icons'>mode_comment</div>
                {post.commentQuantity}{' '}
                {post.commentQuantity === 1 ? 'comment' : 'comments'}
              </div>
            </div>
          </div>
          <div className='commentSection'>
            <TextareaAutosize
              className='comment__input'
              name='text'
              type='text'
              placeholder='What do you think?'
              minLength={1}
              maxLength={500}
              required
              value={commentForm.text}
              onChange={handleCommentFormChange}
            ></TextareaAutosize>
            <button className='button comment__button' onClick={submitComment}>
              Comment post
            </button>
          </div>
          <div className='post__comments'>
            {post.comments.map((comment, index) => {
              return (
                <Comment
                  key={index}
                  comment={comment}
                  postID={post.id}
                  depth={0}
                ></Comment>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default SinglePost;
