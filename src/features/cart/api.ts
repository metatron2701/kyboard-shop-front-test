<<<<<<< HEAD
// TODO(담당 3): 장바구니 담기/수량 변경/삭제 API를 구현하고 cart-provider.tsx에 연결합니다.
=======
import { apiRequest } from '@/lib/api-client'
>>>>>>> parent of 8e7c909 (no message)

export type AddCartItemRequest = {
  productId: string
  quantity: number
  optionValue: string | null
}

export async function addCartItem(_input: AddCartItemRequest): Promise<void> {
  throw new Error('TODO: 장바구니 추가 API를 연결하세요.')
}
<<<<<<< HEAD

export async function updateCart(_input: AddCartItemRequest): Promise<void> {
  throw new Error('TODO: 장바구니 수정 API를 연결하세요.')
}

export async function deleteCart(): Promise<void> {
  throw new Error('TODO: 장바구니 삭제 API를 연결하세요.')
}
=======
// 1. 내 장바구니 목록 조회 (GET /api/cart)
export async function getCartApi(): Promise<CartItemResponse[]> {
  try {
    // credentials: 'include'가 기본 적용되어 있어 쿠키(access_token)가 자동 전송됩니다.
    const res = await apiRequest<any>('/api/cart')
    return res.data || res || []
  } catch (error) {
    console.error('장바구니 조회 실패:', error)
    return []
  }
}

// 2. 장바구니에 상품 담기 (POST /api/cart)
export async function addCartItemApi(productId: number, quantity: number): Promise<boolean> {
  try {
    await apiRequest('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    })
    return true
  } catch (error) {
    console.error('장바구니 담기 실패:', error)
    return false
  }
}
>>>>>>> parent of 8e7c909 (no message)
