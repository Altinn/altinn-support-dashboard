/* eslint-disable */
export function getBaseUrl(environment?: string): string {
  if (environment === "TT02" || environment === "PROD") {
    return `/api/${environment === "TT02" ? "TT02" : "Production"}`;
  }
  return "/api";
}
export async function authorizedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  const headers = {
    ...options.headers,
    Authorization: `Basic ${token}`,
    "Content-Type": "application/json",
  };
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
  return response;
}

// temporary, might change later
export async function authorizedPost<T>(
  url: string,
  body: T,
  options: RequestInit = {},
): Promise<Response> {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
    credentials: "include",
    ...options,
  });

  return response;
}

export const getFormattedDateTime = (date: Date) => {
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formattedTime = date.toLocaleTimeString("no-NO", optionsTime);
  const weekday = date.toLocaleDateString("no-NO", { weekday: "long" });
  const day = date.getDate();
  const month = date.toLocaleDateString("no-NO", { month: "long" });
  const year = date.getFullYear();
  const capitalizedWeekday = capitalizeFirstCharacter(weekday);
  const capitalizedMonth = capitalizeFirstCharacter(month);
  const formattedDate = `${capitalizedWeekday}, ${day}. ${capitalizedMonth} ${year}`;
  return { formattedTime, formattedDate };
};

export function capitalizeFirstCharacter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function filterUserClaims(user: any, claimType: string) {
  return user.user_claims.find(
    (claim: { typ: string; val: string }) => claim.typ === claimType,
  );
}

export async function fetchUserDetails(): Promise<{
  name: string;
  email: string;
}> {
  try {
    const response = await fetch("/.auth/me");
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      const user = data[0];
      const nameClaim = filterUserClaims(user, "name");
      const emailClaim = filterUserClaims(user, "preferred_username");
      return {
        name: nameClaim ? nameClaim.val : "Ukjent Bruker",
        email: emailClaim ? emailClaim.val : "Ingen e-post funnet",
      };
    }
    return { name: "Ukjent Bruker", email: "Ingen e-post funnet" };
  } catch (error) {
    console.error("Error fetching user info:", error);
    return { name: "Ukjent Bruker", email: "Ingen e-post funnet" };
  }
}
