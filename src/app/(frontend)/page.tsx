import Image from 'next/image'
import Link from 'next/link'
import { BackendErrorState } from '@/components/common/backend-error-state'
import { ArrowIcon } from '@/components/icons'
import { ProductCard } from '@/components/common/product-card'
import { getPaginatedProducts } from '@/features/products/api'
import { mediaFrom, type StoreProduct } from '@/lib/store-shared'

export const dynamic = 'force-dynamic'

const categoryCards = [
  {
    label: 'PCB',
    detail: 'Precision PCBs & barebone kits',
    href: '/products?category=pcb',
  },
  { label: 'SWITCHES', detail: 'Find your perfect feel', href: '/products?category=switches' },
  { label: 'KEYCAPS', detail: 'A new texture for every key', href: '/products?category=keycaps' },
]

export default async function HomePage() {
  let products: StoreProduct[] = []
  let backendError: string | null = null

  try {
    const res = await getPaginatedProducts({ page: 0, size: 3 })
    products = res.content
  } catch (err) {
    backendError = err instanceof Error ? err.message : '알 수 없는 네트워크/서버 오류'
  }

  const hero = products[0]
  const heroImage = hero ? mediaFrom(hero.images[0]) : null

  return (
    <>
      <section className="mx-auto w-[min(80%,1440px)] py-8 max-lg:w-[92%]">
        <div className="relative min-h-[620px] overflow-hidden rounded-xl bg-zinc-900 max-md:min-h-[520px]">
          {heroImage?.url && (
            <Image
              alt={heroImage.alt || hero.name}
              className="object-cover grayscale"
              fill
              loading="eager"
              priority
              sizes="90vw"
              src={heroImage.url}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-12 text-white max-md:p-7">
            <p className="mb-5 text-xs font-semibold tracking-[0.2em]">DESIGNED FOR THE DESK</p>
            <h1 className="max-w-3xl text-6xl font-medium leading-[0.95] tracking-[-0.065em] max-md:text-4xl">
              Tools for better thinking.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/75">
              Considered keyboards, switches, and keycaps made to turn everyday work into a tactile,
              deliberate ritual.
            </p>
            <div className="mt-8">
              <Link
                className="inline-flex h-11 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                href="/products"
              >
                전체 컬렉션 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 백엔드 에러 발생 시 알림 표시 */}
      {backendError && (
        <section className="mx-auto w-[min(80%,1440px)] py-4 max-lg:w-[92%]">
          <BackendErrorState
            message={backendError}
            title="홈 화면 상품 목록을 백엔드에서 불러오지 못했습니다"
          />
        </section>
      )}

      {/* 카테고리 카드 3열 */}
      <section className="mx-auto w-[min(80%,1440px)] py-8 max-lg:w-[92%]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {categoryCards.map((card) => (
            <Link
              className="group flex min-h-64 flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-7 transition hover:border-zinc-300 hover:bg-zinc-100"
              href={card.href}
              key={card.label}
            >
              <div>
                <span className="text-xs font-semibold tracking-[0.16em] text-zinc-400">
                  CATEGORY
                </span>
                <p className="mt-4 text-2xl font-medium tracking-tight text-zinc-900">
                  {card.label}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{card.detail}</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-950 transition group-hover:translate-x-1">
                <span>카테고리 이동</span>
                <ArrowIcon />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 주요 상품 3열 그리드 */}
      {products.length > 0 && (
        <section className="mx-auto w-[min(80%,1440px)] py-12 max-lg:w-[92%]">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-zinc-400">FEATURED</p>
              <h2 className="mt-1 text-2xl font-medium tracking-tight text-zinc-950">
                주요 추천 부품
              </h2>
            </div>
            <Link
              className="text-xs font-semibold tracking-wider text-zinc-600 underline underline-offset-4 hover:text-zinc-950"
              href="/products"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-px bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, idx) => (
              <ProductCard key={product.id} priority={idx === 0} product={product} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
