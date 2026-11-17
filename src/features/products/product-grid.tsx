'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { BackendErrorState } from '@/components/common/backend-error-state'
import { ProductCard } from '@/components/common/product-card'
import { getPaginatedProducts } from '@/features/products/api'
import type { StoreProduct } from '@/lib/store-shared'

export function ProductGrid() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') || 'all'
  const currentSubcategory = searchParams.get('subcategory') || ''
  const pageParam = parseInt(searchParams.get('page') || '0', 10)
  const currentPage = isNaN(pageParam) ? 0 : pageParam

  const [products, setProducts] = useState<StoreProduct[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // URL 파라미터가 바뀔 때마다 백엔드 API에서 실시간 데이터 로드
  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(null)

    getPaginatedProducts({
      categoryId: currentCategory === 'all' ? undefined : currentCategory,
      subcategoryId: currentSubcategory || undefined,
      page: currentPage,
      size: 16,
    })
      .then((res) => {
        if (!ignore) {
          setProducts(res.content)
          setTotalPages(res.totalPages)
          setTotalElements(res.totalElements)
        }
      })
      .catch((err) => {
        console.error('Failed to load products:', err)
        if (!ignore) {
          setProducts([])
          setError(
            err instanceof Error
              ? err.message
              : '상품 목록을 불러오는 중 네트워크 또는 서버 오류가 발생했습니다.',
          )
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [currentCategory, currentSubcategory, currentPage, retryCount])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  // 1. 에러 발생 시 백엔드 미연결 에러 화면 렌더링
  if (error) {
    return (
      <div className="py-12">
        <BackendErrorState
          message={error}
          onRetry={() => setRetryCount((prev) => prev + 1)}
          title="상품 목록을 백엔드에서 불러오지 못했습니다"
        />
      </div>
    )
  }

  // 2. 초기 로딩 스피너
  if (loading && products.length === 0) {
    return (
      <div className="py-32 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-zinc-900 border-r-transparent align-[-0.125em]" />
        <p className="mt-4 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
          Loading products from database...
        </p>
      </div>
    )
  }

  // 3. 상품이 하나도 없을 때
  if (!loading && products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 py-32 text-center">
        <p className="text-base font-medium text-zinc-800">해당 분류에 등록된 상품이 없습니다.</p>
        <p className="mt-1 text-xs text-zinc-400">
          다른 카테고리를 선택하거나 필터를 초기화해 보세요.
        </p>
      </div>
    )
  }

  return (
    <div className={`transition-opacity duration-200 ${isPending || loading ? 'opacity-60' : ''}`}>
      {/* 검색 결과 카운트 안내 */}
      <div className="mb-6 flex items-center justify-between text-xs text-zinc-500">
        <span>
          총 <strong className="text-zinc-900">{totalElements}</strong>개의 부품
        </span>
        {currentSubcategory && (
          <span className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-700">
            필터: {currentSubcategory}
          </span>
        )}
      </div>

      {/* 상품 카드 그리드 (반응형 4열) */}
      <div className="grid grid-cols-1 gap-px bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* 페이지네이션 컨트롤 */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-30"
            disabled={currentPage <= 0}
            onClick={() => handlePageChange(currentPage - 1)}
            type="button"
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                currentPage === i
                  ? 'bg-zinc-950 font-bold text-white'
                  : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
              }`}
              key={i}
              onClick={() => handlePageChange(i)}
              type="button"
            >
              {i + 1}
            </button>
          ))}

          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-30"
            disabled={currentPage >= totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
            type="button"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
