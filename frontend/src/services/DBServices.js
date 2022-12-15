export async function getAllPosts() {
  try {
    const response = await fetch('/home');
    return await response.json();
  } catch (error) {
    console.log('There was a problem fetching the data:', error);
  }
}

export async function getSinglePost(id) {
  try {
    const response = await fetch(`/post/${id}`);
    return await response.json();
  } catch (error) {
    console.log('There was a problem fetching the data:', error);
  }
}

export async function createNewPost(form) {
  try {
    const response = await fetch(`/post/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    return await response.json();
  } catch (error) {
    console.log('There was a problem when trying to create new post:', error);
  }
}

export async function createNewComment(form) {
  try {
    const response = await fetch(`/post/comment/onPost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    return await response.json();
  } catch (error) {
    console.log(
      'There was a problem when trying to create new comment:',
      error
    );
  }
}

export async function createNewReply(form) {
  try {
    const response = await fetch(`/post/comment/onComment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    return response;
  } catch (error) {
    console.log(
      'There was a problem when trying to create new comment:',
      error
    );
  }
}

export async function deletePost(id) {
  try {
    const response = await fetch(`/post/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.log('There was a problem when trying to delete post:', error);
  }
}

export async function getUserDetails(id) {
  try {
    const response = await fetch(`/user/${id}`);
    return await response.json();
  } catch (error) {
    console.log('There was a problem fetching the data:', error);
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
    console.log('There was a problem when trying to login:', error);
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
    return response;
  } catch (error) {
    console.log('There was a problem when trying to signup:', error);
  }
}

export async function isAuthenticated() {
  try {
    const response = await fetch('/isAuth', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.log('There was a problem when trying to login:', error);
  }
}

/*
export async function createTask(data) {
  const response = await fetch(`/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: data }),
  });
  return await response.json();
}

export async function editTask(data) {
  const response = await fetch(`/api/todo`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: data }),
  });
  return await response.json();
}
*/
