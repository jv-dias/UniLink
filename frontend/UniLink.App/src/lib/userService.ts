export const userService = {
  async getProfile() {
    console.log('userService.getProfile called');
    return Promise.resolve({
      name: 'Gabriel Barros',
      bio: 'Criador de conteúdo e desenvolvedor',
      avatar: '/avatars/user.jpg',
      theme: 'padrão',
      username: 'gabriel',
    });
  },
  async updateProfile(data: any) {
    console.log('userService.updateProfile', data);
    return Promise.resolve({ success: true });
  },
};
