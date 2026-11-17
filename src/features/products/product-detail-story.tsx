'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { StoreMedia, StoreProduct } from '@/lib/store-shared'

interface FeatureHighlight {
  badge: string
  title: string
  detail: string
}

function getCategoryStory(product: StoreProduct): {
  eyebrow: string
  headline: string
  highlights: FeatureHighlight[]
  packageContents: string[]
} {
  const sub = product.subCategoryName || ''
  const mat = product.material || sub || '프리미엄 소재'

  if (product.category === 'housing') {
    return {
      eyebrow: 'HOUSING ARCHITECTURE',
      headline: `${mat} 바디가 완성하는 단단한 타건감과 데스크 위 존재감.`,
      highlights: [
        {
          badge: '01 · MATERIAL',
          title: `${mat} 정밀 가공 바디`,
          detail: sub.includes('알루미늄')
            ? '고강도 알루미늄 블록을 CNC 절삭 후 아노다이징 마감하여 통울림을 억제하고 묵직한 타건음을 구현합니다.'
            : sub.includes('목재')
              ? '천연 원목 고유의 나뭇결과 따뜻하고 깊은 울림을 그대로 살린 오가닉 데스크테리어 하우징입니다.'
              : `${mat} 소재 특유의 경쾌한 반발력과 깔끔한 사운드 프로파일을 균형 있게 조율했습니다.`,
        },
        {
          badge: '02 · LAYOUT FIT',
          title: `${product.layout ? `${product.layout}% 배열` : '표준 배열'} 전용 설계`,
          detail: `동일한 ${product.layout ? `${product.layout}%` : '표준'} 규격의 PCB 기판과 1:1로 체결되도록 나사 홀 및 USB 포트 위치를 정밀하게 설계했습니다.`,
        },
        {
          badge: '03 · ACOUSTICS',
          title: '안정적인 마운트 & 흡음 구조',
          detail: '타이핑 시 손끝에 전달되는 불필요한 진동을 줄이고 스위치 본연의 소리를 선명하게 끌어올립니다.',
        },
      ],
      packageContents: [
        `${product.name} 상·하판 바디`,
        '전용 보강판 및 흡음 폼 세트',
        '실리콘 범폰 및 조립용 정밀 볼트 일체',
      ],
    }
  }

  if (product.category === 'pcb' || product.category === 'keyboards') {
    const isWireless = product.isWireless ? '유무선 3-모드' : '유선 전용'
    const pins = product.supportPins?.length ? `${product.supportPins.join(' / ')}핀 지원` : '범용 핫스왑'
    return {
      eyebrow: 'CIRCUIT ENGINE',
      headline: `${product.layout || '커스텀'} 레이아웃, 반응 속도와 호환성을 겸비한 메인보드.`,
      highlights: [
        {
          badge: '01 · CONNECTIVITY',
          title: `${isWireless} 연결성`,
          detail: product.isWireless
            ? '초저지연 2.4GHz 무선, 블루투스 5.0, Type-C 유선 연결을 모두 지원해 다양한 환경에서 끊김 없이 작동합니다.'
            : '안정적인 Type-C 유선 연결로 1,000Hz 폴링레이트를 완벽하게 지원해 빠른 입력과 게이밍에 최적화되었습니다.',
        },
        {
          badge: '02 · HOT-SWAP',
          title: `소켓 체결식 ${pins}`,
          detail: '납땜(Soldering) 없이 스위치 풀러만으로 언제든지 원하는 스위치를 자유롭게 교체하고 빌드할 수 있습니다.',
        },
        {
          badge: '03 · PROGRAMMABLE',
          title: '키 매핑 및 매크로 지원',
          detail: '키보드 매핑 웹 GUI를 통해 모든 키의 기능, 레이어 전환, 복합 매크로를 취향대로 커스터마이징할 수 있습니다.',
        },
      ],
      packageContents: [
        `${product.name} PCB 기판`,
        'Type-C 연결 케이블',
        '배터리 연결 케이블 (무선 지원 모델 한정)',
      ],
    }
  }

  if (product.category === 'switches') {
    const swType = product.switchType || '기계식'
    const pinCount = product.pin ? `${product.pin}핀` : '3/5핀 호환'
    return {
      eyebrow: 'TACTILE SENSATION',
      headline: `매 스트로크마다 손끝에 전달되는 ${swType} 스위치 고유의 피드백.`,
      highlights: [
        {
          badge: '01 · ACTUATION',
          title: `${swType} 메커니즘`,
          detail: swType.includes('리니어')
            ? '걸림 없이 매끄럽게 내려가는 스트로크와 정갈한 바닥 타건음으로 장시간 타이핑에도 피로감이 적습니다.'
            : swType.includes('택타일')
              ? '눌리는 순간 확실한 구분감을 주어 오타를 줄이고 리드미컬한 타건의 즐거움을 극대화합니다.'
              : `${swType} 특유의 뚜렷한 피드백과 조화로운 사운드로 타이핑의 몰입감을 높여줍니다.`,
        },
        {
          badge: '02 · MOUNTING',
          title: `${pinCount} 안정적 고정 구조`,
          detail: '스위치 체결 시 흔들림을 억제하고 스템 유격을 최소화하여 균일한 키감을 유지합니다.',
        },
        {
          badge: '03 · FACTORY LUBE',
          title: '정밀 팩토리 윤활',
          detail: '공장 출고 단계에서 스템 및 스프링에 균일한 윤활 처리가 적용되어 서걱임과 스프링 소음을 획기적으로 줄였습니다.',
        },
      ],
      packageContents: [
        `${product.name} 팩 (옵션 지정 수량)`,
        '보관용 스위치 트레이 패키지',
      ],
    }
  }

  // Keycaps
  const keyMat = product.material || 'PBT'
  return {
    eyebrow: 'SURFACE & PROFILE',
    headline: `내구성과 디자인을 겸비한 ${keyMat} 프로파일 키캡 세트.`,
    highlights: [
      {
        badge: '01 · MATERIAL',
        title: `${keyMat} 프리미엄 소재`,
        detail: '오랜 시간 사용해도 번들거림(마모)에 강하며 뽀송뽀송하고 매트한 텍스처를 오랫동안 유지합니다.',
      },
      {
        badge: '02 · PRINTING',
        title: '선명한 각인 & 변색 방지',
        detail: '염료승화 또는 이중사출 공정으로 각인이 지워지지 않고 미세한 폰트 디테일까지 선명하게 표현됩니다.',
      },
      {
        badge: '03 · COMPATIBILITY',
        title: '다양한 레이아웃 풀 세트',
        detail: '표준 104키뿐 아니라 65%, 75%, 텐키리스, 윈도우/맥 전용 모디열까지 폭넓게 호환되는 풍부한 키 구성을 제공합니다.',
      },
    ],
    packageContents: [
      `${product.name} 키캡 세트`,
      '와이어 키캡 풀러',
      '전용 2단 블리스터 보관 트레이',
    ],
  }
}

export function ProductDetailStory({
  product,
  gallery,
}: {
  product: StoreProduct
  gallery: StoreMedia[]
}) {
  const story = getCategoryStory(product)
  const visualImage = gallery[1] || gallery[0]

  return (
    <div className="mt-28 space-y-24 border-t border-zinc-200 pt-20">
      {/* 1. 아키텍처 / 콘셉트 헤더 */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400">
          {story.eyebrow}
        </span>
        <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-zinc-950 sm:text-4xl">
          {story.headline}
        </h2>
        {product.description && (
          <p className="mt-5 text-sm leading-relaxed text-zinc-600 sm:text-base">
            {product.description}
          </p>
        )}
      </div>

      {/* 2. 대형 비주얼 컷 (서브 갤러리 활용) */}
      {visualImage?.url && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-sm sm:aspect-[21/9]">
          <Image
            alt={visualImage.alt || product.name}
            className="object-cover"
            fill
            sizes="(max-width: 1440px) 90vw, 1300px"
            src={visualImage.url}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-white sm:bottom-10 sm:left-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/80">
              {product.brand}
            </p>
            <p className="mt-1 text-lg font-medium tracking-tight sm:text-2xl">{product.name}</p>
          </div>
        </div>
      )}

      {/* 3. 3단 스펙 하이라이트 카드 그리드 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {story.highlights.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-7 transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            <div>
              <span className="font-mono text-[11px] font-bold tracking-wider text-zinc-400">
                {item.badge}
              </span>
              <h3 className="mt-3 text-base font-semibold tracking-tight text-zinc-900">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 sm:text-sm">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 4. 상세 스펙 테이블 & 패키지 구성품 */}
      <div className="grid grid-cols-1 gap-12 rounded-2xl border border-zinc-200 bg-white p-8 sm:grid-cols-2 sm:p-12">
        {/* 좌측: 기술 사양 요약 */}
        <div>
          <h3 className="text-xs font-bold tracking-[0.16em] text-zinc-400 uppercase">
            SPECIFICATIONS
          </h3>
          <p className="mt-1 text-xl font-medium tracking-tight text-zinc-900">기술 사양</p>
          <dl className="mt-6 divide-y divide-zinc-100 text-sm">
            <div className="flex justify-between py-3">
              <dt className="text-zinc-500">부품 분류</dt>
              <dd className="font-medium text-zinc-900 uppercase">{product.category}</dd>
            </div>
            {product.subCategoryName && (
              <div className="flex justify-between py-3">
                <dt className="text-zinc-500">소분류</dt>
                <dd className="font-medium text-zinc-900">{product.subCategoryName}</dd>
              </div>
            )}
            {product.layout && (
              <div className="flex justify-between py-3">
                <dt className="text-zinc-500">지원 배열</dt>
                <dd className="font-medium text-zinc-900">{product.layout}% Layout</dd>
              </div>
            )}
            {product.material && (
              <div className="flex justify-between py-3">
                <dt className="text-zinc-500">하우징 / 키캡 소재</dt>
                <dd className="font-medium text-zinc-900">{product.material}</dd>
              </div>
            )}
            {product.switchType && (
              <div className="flex justify-between py-3">
                <dt className="text-zinc-500">스위치 타입</dt>
                <dd className="font-medium text-zinc-900">{product.switchType}</dd>
              </div>
            )}
            {product.pin !== undefined && product.pin !== null && (
              <div className="flex justify-between py-3">
                <dt className="text-zinc-500">스위치 핀</dt>
                <dd className="font-medium text-zinc-900">{product.pin} Pin</dd>
              </div>
            )}
            {product.supportPins && product.supportPins.length > 0 && (
              <div className="flex justify-between py-3">
                <dt className="text-zinc-500">지원 핀 호환</dt>
                <dd className="font-medium text-zinc-900">
                  {product.supportPins.join(' / ')} Pin 호환
                </dd>
              </div>
            )}
            {product.isWireless !== undefined && product.isWireless !== null && (
              <div className="flex justify-between py-3">
                <dt className="text-zinc-500">무선 지원</dt>
                <dd className="font-medium text-zinc-900">
                  {product.isWireless ? '블루투스 & 2.4GHz 무선 지원' : 'Type-C 유선 전용'}
                </dd>
              </div>
            )}
            <div className="flex justify-between py-3">
              <dt className="text-zinc-500">브랜드</dt>
              <dd className="font-medium text-zinc-900">{product.brand}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-zinc-500">재고 수량</dt>
              <dd className="font-medium text-zinc-900">{product.stockQuantity}개 남음</dd>
            </div>
          </dl>
        </div>

        {/* 우측: 패키지 구성품 및 안내 */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold tracking-[0.16em] text-zinc-400 uppercase">
              PACKAGE CONTENTS
            </h3>
            <p className="mt-1 text-xl font-medium tracking-tight text-zinc-900">기본 구성품</p>
            <ul className="mt-6 space-y-3">
              {story.packageContents.map((content, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-zinc-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-700">
                    {idx + 1}
                  </span>
                  <span>{content}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-xl bg-zinc-50 p-5 text-xs text-zinc-500">
            <p className="font-semibold text-zinc-700">배송 및 조립 유의사항</p>
            <p className="mt-1 leading-relaxed">
              본 제품은 커스텀 키보드 DIY 부품으로 사용자의 규격(배열, 핀, 보강판 호환성) 확인 후
              구매를 권장합니다. 안전한 에어캡 완충 포장으로 발송됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 5. 하단 CTA */}
      <div className="border-t border-zinc-200 pt-16 text-center">
        <Link
          className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 px-8 text-xs font-semibold tracking-wider text-zinc-800 transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
          href={`/products?category=${product.category}`}
        >
          같은 {product.category.toUpperCase()} 카테고리 상품 더보기
        </Link>
      </div>
    </div>
  )
}
