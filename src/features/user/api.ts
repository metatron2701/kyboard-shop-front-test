<<<<<<< HEAD
// TODO(담당 2): 회원가입·회원탈퇴 API를 구현하고 signup/mypage 화면에 연결합니다.
=======
import { apiRequest } from '@/lib/api-client'
>>>>>>> parent of 8e7c909 (no message)

export type CustomerSignupRequest = {
  email: string
  password: string
  name: string
<<<<<<< HEAD
  phone: string
  postalCode: string
  address: string
  detailAddress: string
}

export async function signUpCustomer(_input: CustomerSignupRequest): Promise<void> {
  throw new Error('TODO: 회원가입 API를 연결하세요.')
=======
  phoneNumber?: string
  phone?: string
  postalCode?: string
  address?: string
  detailAddress?: string
}

export type ApiResponse<T> = {
  success: boolean
  message: string | null
  data: T
}

export type UserResponse = {
  userId: number
  email: string
  name: string
  phoneNumber?: string
  role: string
  createdAt: string
}

export async function signUpCustomer(input: CustomerSignupRequest): Promise<UserResponse> {
  const cleanPhone = (input.phoneNumber || input.phone || '').replace(/[^0-9]/g, '')

  const res = await apiRequest<ApiResponse<UserResponse>>('/api/users/signup', {
    method: 'POST',
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      name: input.name,
      phoneNumber: cleanPhone,
    }),
  })

  return res.data
}

export async function getUserById(userId: number): Promise<UserResponse> {
  const res = await apiRequest<ApiResponse<UserResponse>>(`/api/users/${userId}`, {
    method: 'GET',
  })
  return res.data
>>>>>>> parent of 8e7c909 (no message)
}

export async function deleteCustomerAccount(): Promise<void> {
  // 회원 탈퇴는 백엔드에 아직 엔드포인트가 없으므로 로컬 세션 클리어
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mono_auth_user')
  }
}
