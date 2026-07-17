export async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const raw = await response.text();
    let message = raw || 'Network response was not ok';
    let data = null;
    try {
      data = JSON.parse(raw);
      if (data && data.message) {
        message = data.message;
      }
    } catch {
      // Response body was not JSON; keep the raw text as the message.
    }
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return response.json();
}
