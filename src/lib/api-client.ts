// 공개 환경 변수로 Spring Boot API 주소를 설정하며, 끝의 슬래시는 제거합니다.
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')

// 서버 오류 응답에서 화면에 표시할 메시지를 읽을 때 사용하는 형식입니다.
export type ApiErrorBody = { message?: string; error?: string; fieldErrors?: Record<string, string> }

// HTTP 상태 코드와 서버 메시지를 함께 보관하는 API 오류입니다.
export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors?: Record<string, string>,
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

let refreshPromise: Promise<boolean> | null = null

async function requestTokenRefresh(): Promise<boolean> {
  
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    try {
      // credentials: 'include'로 브라우저의 refresh_token 쿠키를 전달
      const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      })
      return res.ok // 204 No Content면 새 access_token 쿠키 발급 성공
    } catch {
      return false
    } finally {
      refreshPromise = null // 완료 후 초기화
    }
  })()

  return refreshPromise
}

// 모든 API 요청에 JSON 헤더와 세션 쿠키를 공통 적용합니다.
export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  expectedStatus?: number,
  isRetry = false,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  })

  const isAuthEndpoint = path.startsWith('/api/auth/login') ||
                         path.startsWith('/api/auth/refresh') ||
                         path.startsWith('/api/auth/logout')
  if (response.status === 401 && !isRetry && !isAuthEndpoint) {
    const refreshSuccess = await requestTokenRefresh()
    if (refreshSuccess) {
      // 재발급 성공! 새 access_token 쿠키로 원래 요청 딱 1번 재시도
      return apiRequest<T>(path, init, expectedStatus, true)
    }
  }

  if (!response.ok) {
    let detail = ''
    let fieldErrors: Record<string, string> | undefined
    try {
      const body = (await response.json()) as ApiErrorBody
      detail = body.message || body.error || ''
      // 가입 폼이 입력란별 오류를 표시할 수 있도록 문자열 메시지만 전달합니다.
      if (body.fieldErrors && typeof body.fieldErrors === 'object' && !Array.isArray(body.fieldErrors)) {
        fieldErrors = Object.fromEntries(
          Object.entries(body.fieldErrors).filter(([, message]) => typeof message === 'string'),
        )
      }
    } catch {
      // 서버가 비어 있거나 JSON이 아닌 오류 응답을 보낼 수 있습니다.
    }
    throw new ApiRequestError(detail || `API request failed (${response.status})`, response.status, fieldErrors)
  }

  // 가입은 약속된 201 응답을 받은 경우에만 완료하며, 상태를 지정하지 않은 기존 호출은 그대로 처리합니다.
  if (expectedStatus !== undefined && response.status !== expectedStatus) {
    throw new ApiRequestError('서버 응답을 확인하지 못했습니다. 다시 시도해 주세요.', response.status)
  }

  // 선택한 결제 호출만 명시한 성공 상태를 요구하며 기존 호출 동작은 유지합니다.
  if (expectedStatus !== undefined && response.status !== expectedStatus) {
    throw new ApiRequestError('서버 응답을 확인하지 못했습니다. 다시 시도해 주세요.', response.status)
  }

  if (response.status === 204) return undefined as T
  
  return (await response.json()) as T
}
