const API_BASE_AUTH = "http://localhost:8080"

export async function apiFetch(
    endpoint: string,
    options: RequestInit = {},
    autoRetry = true
): Promise<Response> {
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData
    const headers = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
    }

    const res = await fetch(`${API_BASE_AUTH}${endpoint}`, {
        ...options,
        credentials: "include",
        headers,
    })

    if (res.status === 401 && autoRetry) {
        const refreshRes = await fetch(`${API_BASE_AUTH}/api/v1/auth/refresh`, {
            method: "POST",
            credentials: "include",
        })
        if (refreshRes.ok) {
            return apiFetch(endpoint, options, false)
        } else {
        }
    }
    return res
}