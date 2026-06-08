const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getUserProfile(userId: string) {
  const response = await fetch(`${API_URL}/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return response.json();
}

export async function updateUserProfile(userId: string, data: any) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update user profile');
  }
  return response.json();
}

export async function uploadPhoto(userId: string, file: File) {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch(`${API_URL}/users/${userId}/photo`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload photo');
  }
  return response.json();
}

export async function uploadResume(userId: string, file: File) {
  const formData = new FormData();
  formData.append('resume', file);

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${userId}`,
  };

  const response = await fetch(`${API_URL}/users/${userId}/resume`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => null)
    throw new Error(text || 'Failed to upload resume');
  }
  return response.json();
}

export async function getResume(userId: string) {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${userId}`,
  };

  const response = await fetch(`${API_URL}/users/${userId}/resume`, {
    method: 'GET',
    headers,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => null)
    throw new Error(text || 'Failed to fetch resume info');
  }
  return response.json();
}

export async function removeResume(userId: string) {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${userId}`,
  };

  const response = await fetch(`${API_URL}/users/${userId}/resume`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => null)
    throw new Error(text || 'Failed to remove resume');
  }

  return response.status === 204 ? null : response.json().catch(() => null);
}
