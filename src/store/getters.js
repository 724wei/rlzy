const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userinfo.username,
  userId: state => state.user.userinfo.userId,
  avatar: state => state.user.userinfo.staffPhoto,
  companyId: state => state.user.userinfo.id
  // name: state => state.user.name
}
export default getters
