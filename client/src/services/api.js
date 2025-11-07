export const testAPI = async () => {
  const res = await fetch('/api/auth');
  return res.text();
};
