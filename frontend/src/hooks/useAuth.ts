export const isLoggedIn = () => {
    return localStorage.getItem("access_token") !== null
}

export const logout = () => {
    localStorage.removeItem("access_token")
}