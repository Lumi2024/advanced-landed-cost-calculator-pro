function checkAuth() {

    const token = localStorage.getItem("iit_token");

    if (!token) {
        const newToken = "PRO-" + Math.random().toString(36).substr(2,9);
        localStorage.setItem("iit_token", newToken);
    }
}
