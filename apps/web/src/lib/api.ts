// Petit client HTTP commun à tous les appels de l'interface.

// Une erreur qui garde le code de statut : l'écran peut réagir à un 404 ou un 409
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type QueryValue = string | number | boolean | undefined;

// Construit /api/plants?category=hedge&page=2, en ignorant les paramètres vides
export function withQuery(path: string, query: Record<string, QueryValue> = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.set(key, String(value));
  }
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    // On n'annonce du JSON que si on en envoie : un DELETE sans corps serait refusé (400)
    headers: init.body ? { 'Content-Type': 'application/json', ...init.headers } : init.headers,
  });
  // fetch ne lève pas d'erreur sur un 404 ou un 500 : c'est à nous de regarder response.ok
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body.message ?? response.statusText);
  }
  // 204 No Content : pas de corps à lire
  return (response.status === 204 ? undefined : await response.json()) as T;
}
