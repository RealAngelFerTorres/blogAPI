export async function isAuthenticated() {
  try {
    const response = await fetch('/isAuth', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return await response.json();
  } catch (error) {
    alert('There was a problem when trying to authenticate:', error);
  }
}

export async function getAllPosts() {
  try {
    const response = await fetch('/home');
    return await response.json();
  } catch (error) {
    alert('There was a problem fetching the data:', error);
  }
}

export async function getSinglePost(id, form) {
  try {
    const response = await fetch(`/post/${id}/detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    return await response.json();
  } catch (error) {
    alert('There was a problem fetching the data:', error);
  }
}

export async function createNewPost(form) {
  try {
    const response = await fetch(`/post/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    return await response.json();
  } catch (error) {
    alert('There was a problem when trying to create new post:', error);
  }
}

export async function createNewComment(form) {
  try {
    const response = await fetch(`/post/comment/onPost`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    return await response.json();
  } catch (error) {
    alert('There was a problem when trying to create new comment:', error);
  }
}

export async function createNewReply(form) {
  try {
    const response = await fetch(`/post/comment/onComment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    return await response.json();
  } catch (error) {
    alert('There was a problem when trying to create new comment:', error);
  }
}

export async function editPost(form) {
  const response = await fetch(`/post/${form.id}/edit`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  });
  return await response.json();
}

export async function editComment(form) {
  const response = await fetch(`/comment/${form.id}/edit`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  });
  return await response.json();
}

export async function deletePost(id) {
  try {
    const response = await fetch(`/post/${id}/delete`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    alert('There was a problem when trying to delete post:', error);
  }
}

export async function deleteComment(id) {
  try {
    const response = await fetch(`/comment/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    alert('There was a problem when trying to delete post:', error);
  }
}

export async function getUserDetails(id) {
  try {
    const response = await fetch(`/user/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    alert('There was a problem fetching the data:', error);
  }
}

export async function getAllDrafts(id) {
  try {
    const response = await fetch(`/user/${id}/drafts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    alert('There was a problem fetching the data:', error);
  }
}

export async function loginUser(form) {
  try {
    const response = await fetch(`/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    return await response.json();
  } catch (error) {
    alert('There was a problem when trying to login:', error);
  }
}

export async function signupUser(form) {
  try {
    const response = await fetch(`/user/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    return await response.json();
  } catch (error) {
    alert('There was a problem when trying to signup:', error);
  }
}

export async function sendVote(form) {
  try {
    const response = await fetch(`/post/${form.postID}/vote`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    return await response.json();
  } catch (error) {
    alert('There was a problem when trying to vote:', error);
  }
}
