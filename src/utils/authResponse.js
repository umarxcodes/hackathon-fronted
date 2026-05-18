export function parseAuthResponse(response) {
  const data = response?.data || {};
  return {
    user: data.user || response?.user,
    token: data.token || response?.token,
  };
}
