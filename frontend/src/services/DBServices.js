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

export async function getUserDetails(id) {
  try {
    const response = await fetch(`/user/${id}`);
    return await response.json();
  } catch (error) {
    console.log('There was a problem fetching the data:', error);
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

export async function deleteTask(taskId) {
  const response = await fetch(`/api/todo/${taskId}`, { method: 'DELETE' });
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
