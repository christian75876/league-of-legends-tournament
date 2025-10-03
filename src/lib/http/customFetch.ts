class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

class ParseError extends Error {
  constructor(message = 'Failed to parse response') {
    super(message);
    this.name = 'ParseError';
  }
}

type FetchOptions = Omit<RequestInit, 'body'> & {
  json?: unknown; // body a serializar
  nextOptions?: { revalidate?: number | false; tags?: string[] };
};

async function baseFetch<T>(url: string, opts: FetchOptions = {}): Promise<T> {
  const { json, nextOptions, headers, ...rest } = opts;

  const init: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    next: nextOptions,
  };

  if (json !== undefined) init.body = JSON.stringify(json);

  const res = await fetch(url, init);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new HttpError(text || res.statusText, res.status);
  }

  // parseo defensivo
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return (await res.json()) as T;
    } catch {
      throw new ParseError();
    }
  }

  return (await res.text()) as T;
}

export function getJSON<T>(url: string, init?: Omit<FetchOptions, 'method' | 'json'>) {
  return baseFetch<T>(url, { ...init, method: 'GET' });
}

export function postJSON<T>(
  url: string,
  json?: unknown,
  init?: Omit<FetchOptions, 'method' | 'json'>
) {
  return baseFetch<T>(url, { ...init, method: 'POST', json });
}

export function putJSON<T>(
  url: string,
  json?: unknown,
  init?: Omit<FetchOptions, 'method' | 'json'>
) {
  return baseFetch<T>(url, { ...init, method: 'PUT', json });
}

export function del<T>(url: string, init?: Omit<FetchOptions, 'method' | 'json'>) {
  return baseFetch<T>(url, { ...init, method: 'DELETE' });
}
