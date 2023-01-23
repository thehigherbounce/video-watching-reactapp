export default function authMarketingHeader() {
  const user = JSON.parse(localStorage.getItem('marketing_user'));
  if (user && user.token) {

    const now = new Date();
    if (now.getTime() > user.expiry) {
      localStorage.removeItem('user');
      return {};
    }

    return { Authorization: 'Bearer ' + user.token }; // for Spring Boot back-end
    // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    return {};
  }
}
