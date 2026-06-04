export async function readConstructionApiJson<T>(response: Response): Promise<T & { error?: string }> {
  try {
    return (await response.json()) as T & { error?: string }
  } catch {
    return { error: "Resposta invalida do servidor Construction Intelligence." } as T & { error?: string }
  }
}

export function getConstructionRequestError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
