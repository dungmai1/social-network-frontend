const API_BASE_AUTH = "http://localhost:8080"
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  autoRetry = true
): Promise<Response> {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_BASE_AUTH}${endpoint}`, {
        ...options,
        credentials: "include",
        headers:{
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers
        }
    });
    if(res.status === 401 && autoRetry){
        const refreshRes = await fetch(`${API_BASE_AUTH}/api/v1/auth/refresh`,{
            method: "POST",
            credentials: "include",
        });
        if (refreshRes.ok){
            const data = await refreshRes.json();
            localStorage.setItem("accessToken", data.accessToken);
            return apiFetch(endpoint,options,false);
        }else{
            localStorage.removeItem("accessToken");
            window.location.href = "/";
        }
    }
    return res;
}