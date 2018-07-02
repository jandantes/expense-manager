export default function getRootUrl() {
  const dev = process.env.NODE_ENV !== 'production';
  const port = dev ? 8585 : process.env.PORT;
  const ROOT_URL = dev ? `http://localhost:${port}` : 'https://expense-manager.now.sh';

  return ROOT_URL;
}
