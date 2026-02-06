import { apiFetch } from "@/lib/api";

const URL_AUTH = "http://localhost:8080/api/v1/auth";
export async function login(username: string, password: string) {
  const res = await fetch(`${URL_AUTH}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Login failed");
  } else {
    const data = await res.json();
    return data;
  }
}

export async function logout() {
  const res = await apiFetch(`/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to logout");
  }
  window.location.href = "/login";
}
async function registerCometChatUser(
  username: string,
  displayname: string,
  email: string,
  maxRetries: number = 3,
): Promise<void> {
  const appID = process.env.NEXT_PUBLIC_COMETCHAT_APP_ID;
  const region = process.env.NEXT_PUBLIC_COMETCHAT_REGION;
  const apiKey = process.env.NEXT_PUBLIC_COMETCHAT_API_KEY;

  if (!appID || !region || !apiKey) {
    throw new Error(
      "CometChat environment variables are not configured. Please set NEXT_PUBLIC_COMETCHAT_APP_ID, NEXT_PUBLIC_COMETCHAT_REGION, and NEXT_PUBLIC_COMETCHAT_API_KEY.",
    );
  }

  const cometChatUrl = `https://${appID}.api-${region}.cometchat.io/v3/users`;
  const cometChatBody = {
    uid: username,
    name: displayname,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayname)}&background=random`,
    metadata: {
      "@private": {
        email: email,
      },
    },
    withAuthToken: true,
  };

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const cometRes = await fetch(cometChatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Accept: "application/json",
        },
        body: JSON.stringify(cometChatBody),
      });

      const cometData = await cometRes.json().catch(() => null);

      if (cometRes.ok) {
        console.log("CometChat registration successful for user:", username);
        return;
      }
      if (
        cometRes.status === 409 ||
        cometData?.error?.code === "ERR_UID_ALREADY_EXISTS"
      ) {
        console.log("CometChat user already exists:", username);
        return;
      }
      if (
        cometRes.status >= 400 &&
        cometRes.status < 500 &&
        cometRes.status !== 408 &&
        cometRes.status !== 429
      ) {
        throw new Error(
          `CometChat registration failed (${cometRes.status}): ${cometData?.error?.message || cometData?.message || "Unknown error"}`,
        );
      }
      lastError = new Error(
        `CometChat registration attempt ${attempt}/${maxRetries} failed (${cometRes.status}): ${cometData?.error?.message || "Server error"}`,
      );
      console.warn(lastError.message);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (lastError.message.startsWith("CometChat registration failed")) {
        throw lastError;
      }
      console.warn(
        `CometChat registration attempt ${attempt}/${maxRetries} network error:`,
        lastError.message,
      );
    }
    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  throw new Error(
    `CometChat registration failed after ${maxRetries} attempts: ${lastError?.message || "Unknown error"}`,
  );
}

export async function register(
  username: string,
  displayname: string,
  email: string,
  password: string,
) {
  await registerCometChatUser(username, displayname, email);
  const res = await fetch(`${URL_AUTH}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, displayname, email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Registration failed");
  }

  const data = await res.json();
  return data;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const res = await apiFetch(`/api/v1/auth/change-password`, {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Failed to change password");
  }
  return res.json();
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${URL_AUTH}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Failed to send reset link");
  }
  return res.json();
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await fetch(`${URL_AUTH}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Failed to reset password");
  }
  return res.json();
}
