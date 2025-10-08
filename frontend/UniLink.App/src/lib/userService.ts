const STORAGE_KEY = "unilink_profile"

const defaultProfile = {
  name: "Gabriel Barros",
  bio: "Criador de conteúdo e desenvolvedor",
  avatar: "/login-hero.jpg",
  theme: "padrão",
  username: "gabriel",
}

export const userService = {
  async getProfile() {
    let profile
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        profile = JSON.parse(raw)
      } else {
        profile = defaultProfile
      }
    } catch (e) {
      profile = defaultProfile
    }
    return Promise.resolve(profile)
  },
  async updateProfile(data: any) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      // ignore
    }
    return Promise.resolve({ success: true })
  },
}
