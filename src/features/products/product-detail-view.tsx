'use client'

import { useContext, useState } from 'react'
import Image from 'next/image'
import { CloseIcon, MinusIcon, PlusIcon } from '@/components/icons'
import { useCart } from '@/features/cart/cart-provider'
import { ProductCartContext } from '@/features/cart/components/CartContext'
import { ProductType } from '@/features/cart/interface/Product'
import { ProductDetailStory } from '@/features/products/product-detail-story'
import { formatPrice, isProductSoldOut, mediaFrom, type StoreProduct } from '@/lib/store-shared'

interface ProductDetailViewProps {
  product: StoreProduct
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { openCart } = useCart()
  const { handleAddProduct } = useContext(ProductCartContext)

  // 갤러리 이미지 세트 (images 우선, 비어 있을 경우 galleryImages fallback)
  const rawImages = product.images.length
    ? product.images.map(mediaFrom).filter((image) => Boolean(image?.url))
    : (product.galleryImages || []).map((url, index) => ({
        id: index + 1,
        url,
        alt: product.name,
      }))

  const images = rawImages.map((image, index) => ({
    id: image?.id ?? index + 1,
    url: image!.url as string,
    alt: image?.alt || `${product.name} 이미지 ${index + 1}`,
  }))

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)
  const safeImageIndex = images.length > 0 ? selectedImageIndex % images.length : 0
  const currentImage = images[safeImageIndex]

  const handlePrevImage = () => {
    if (images.length <= 1) return
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleNextImage = () => {
    if (images.length <= 1) return
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  // 단일 상품 가격
  const unitPrice = product.basePrice

  // 수량
  const [quantity, setQuantity] = useState(1)

  // 품절 및 판매중지 상태 판정
  const isDiscontinued = product.status === 'DISCONTINUED'
  const isSoldOut = isProductSoldOut(product)
  const isUnavailable = isDiscontinued || isSoldOut

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => Math.min(product.stockQuantity || 99, prev + 1))
  }

  // 🛡️ [2-1번 방안]: 실제 백엔드 DB 장바구니 연동 로직 유지
  const handleAddToCart = () => {
    if (isUnavailable) return
    const cartProduct: ProductType = {
      productId: Number(product.id),
      name: product.name,
      price: unitPrice,
      quantity,
      shippingFee: 0,
      thumbnailUrl: currentImage?.url || null,
      stockQuantity: product.stockQuantity,
      description: product.description,
    }
    handleAddProduct(cartProduct, quantity)
    openCart()
  }

  return (
    <div>
      {/* 상단 2열 상세 영역 */}
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
        {/* 좌측: 인터랙티브 이미지 갤러리 */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          {/* 메인 뷰포트 (클릭 시 확대 팝업) */}
          <div
            className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl bg-zinc-100"
            onClick={() => currentImage?.url && setZoomOpen(true)}
          >
            {currentImage?.url ? (
              <Image
                alt={currentImage.alt}
                className="object-cover transition duration-500 group-hover:scale-105"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                src={currentImage.url}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs tracking-widest text-zinc-400">
                이미지 준비 중입니다.
              </div>
            )}

            {isDiscontinued ? (
              <span className="absolute right-4 top-4 rounded bg-zinc-700 px-3 py-1 text-xs font-semibold tracking-wider text-white">
                DISCONTINUED
              </span>
            ) : isSoldOut ? (
              <span className="absolute right-4 top-4 rounded bg-zinc-950 px-3 py-1 text-xs font-semibold tracking-wider text-white">
                SOLD OUT
              </span>
            ) : null}

            {images.length > 1 && (
              <>
                <button
                  aria-label="이전 이미지"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-zinc-800 shadow-md backdrop-blur-sm transition hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevImage()
                  }}
                  type="button"
                >
                  ‹
                </button>
                <button
                  aria-label="다음 이미지"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-zinc-800 shadow-md backdrop-blur-sm transition hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNextImage()
                  }}
                  type="button"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* 하단 썸네일 스트립 (다중 이미지일 때 표시) */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  aria-label={`이미지 ${idx + 1} 선택`}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    idx === safeImageIndex ? 'border-zinc-950' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  type="button"
                >
                  <Image alt={img.alt} className="object-cover" fill sizes="80px" src={img.url} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 우측: 상품 옵션 및 구매 액션 패널 */}
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <span className="font-mono text-xs font-semibold tracking-[0.16em] uppercase text-zinc-400">
              {product.category}
              {product.subCategoryName ? ` · ${product.subCategoryName}` : ''}
            </span>
            <h1 className="mt-2 text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
              {formatPrice(unitPrice)}
            </p>

            {/* 주요 스펙 배지 모음 */}
            <div className="mt-6 flex flex-wrap gap-2">
              {product.layout && (
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                  배열: {product.layout}%
                </span>
              )}
              {product.material && (
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                  소재: {product.material}
                </span>
              )}
              {product.switchType && (
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                  스위치: {product.switchType}
                </span>
              )}
              {product.isWireless !== undefined && product.isWireless !== null && (
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                  {product.isWireless ? '무선 지원' : '유선 전용'}
                </span>
              )}
              {product.pin && (
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                  {product.pin}핀
                </span>
              )}
              {product.supportPins && product.supportPins.length > 0 && (
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                  {product.supportPins.join('/')}핀 호환
                </span>
              )}
            </div>

            {/* 수량 선택기 */}
            <div className="mt-10">
              <label className="block text-xs font-bold tracking-wider text-zinc-900 uppercase">
                QUANTITY
              </label>
              <div className="mt-3 flex h-12 w-36 items-center justify-between rounded-lg border border-zinc-300 bg-white px-3">
                <button
                  aria-label="수량 감소"
                  className="flex h-8 w-8 items-center justify-center text-zinc-600 transition hover:text-zinc-950 disabled:opacity-30"
                  disabled={quantity <= 1 || isUnavailable}
                  onClick={handleDecreaseQuantity}
                  type="button"
                >
                  <MinusIcon />
                </button>
                <span className="font-mono text-sm font-semibold">{quantity}</span>
                <button
                  aria-label="수량 증가"
                  className="flex h-8 w-8 items-center justify-center text-zinc-600 transition hover:text-zinc-950 disabled:opacity-30"
                  disabled={quantity >= product.stockQuantity || isUnavailable}
                  onClick={handleIncreaseQuantity}
                  type="button"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

            {/* 재고 상태 알림 안내 */}
            <div className="mt-4 text-xs">
              {isDiscontinued ? (
                <span className="font-medium text-zinc-500">현재 판매가 중단된 상품입니다.</span>
              ) : isSoldOut ? (
                <span className="font-medium text-red-600">준비된 수량이 모두 소진되었습니다.</span>
              ) : (
                <span className="text-zinc-500">
                  남은 수량: <strong className="text-zinc-900">{product.stockQuantity}개</strong> (국내 무료배송)
                </span>
              )}
            </div>
          </div>

          {/* 장바구니 담기 액션 버튼 */}
          <div className="mt-10 flex flex-col gap-3">
            <button
              className="flex h-14 w-full items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-bold tracking-wider text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
              disabled={isUnavailable}
              onClick={handleAddToCart}
              type="button"
            >
              {isDiscontinued
                ? '판매 중단된 상품'
                : isSoldOut
                  ? '품절 (SOLD OUT)'
                  : `장바구니 담기 — ${formatPrice(unitPrice * quantity)}`}
            </button>
          </div>
        </div>
      </div>

      {/* 하단 상세 스토리 & 패키지 구성품 뷰 */}
      <ProductDetailStory gallery={images} product={product} />

      {/* 이미지 풀스크린 확대 모달 */}
      {zoomOpen && currentImage?.url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs"
          onClick={() => setZoomOpen(false)}
        >
          <button
            aria-label="확대창 닫기"
            className="absolute right-6 top-6 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/40"
            onClick={() => setZoomOpen(false)}
            type="button"
          >
            <CloseIcon />
          </button>
          <div className="relative aspect-square w-[800px] max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl">
            <Image
              alt={currentImage.alt}
              className="object-contain"
              fill
              sizes="90vw"
              src={currentImage.url}
            />
          </div>
        </div>
      )}
    </div>
  )
}
