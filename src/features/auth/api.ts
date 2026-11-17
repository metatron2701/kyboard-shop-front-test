<<<<<<< HEAD
// TODO(담당 1): 로그인/로그아웃/현재 사용자 API를 구현하고 아래 화면에 연결합니다.
=======
import { apiRequest } from '@/lib/api-client'
import type { ApiResponse, UserResponse } from '@/features/user/api'
>>>>>>> parent of 8e7c909 (no message)

export type ApiUser = {
  id: string | number
  email: string
  name?: string
  role: 'admin' | 'user'
}

export async function getCurrentUser(): Promise<{ user: ApiUser | null }> {
<<<<<<< HEAD
  throw new Error('TODO: 현재 로그인 사용자 조회 API를 연결하세요.')
}

export async function logIn(_email: string, _password: string): Promise<{ user: ApiUser }> {
  throw new Error('TODO: 로그인 API를 연결하세요.')
}

export async function logOut(): Promise<void> {
  throw new Error('TODO: 로그아웃 API를 연결하세요.')
=======
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('mono_auth_user')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ApiUser
        return { user: parsed }
      } catch {
        localStorage.removeItem('mono_auth_user')
      }
    }
  }
  return { user: null }
}

export async function logIn(email: string, password: string): Promise<{ user: ApiUser }> {
  const res = await apiRequest<ApiResponse<UserResponse>>('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  const user = res.data
  const apiUser: ApiUser = {
    id: user.userId,
    email: user.email,
    name: user.name,
    role: user.role && user.role.toUpperCase() === 'ADMIN' ? 'admin' : 'user',
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('mono_auth_user', JSON.stringify(apiUser))
  }

  return { user: apiUser }
}

export async function logOut(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mono_auth_user')
  }
>>>>>>> parent of 8e7c909 (no message)
}
