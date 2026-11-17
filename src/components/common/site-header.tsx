'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CloseIcon } from '@/components/icons'
import type { ApiUser } from '@/features/auth/api'

type SubCategoryItem = {
  name: string
  href: string
}

type CategoryItem = {
  label: string
  href: string
  children: SubCategoryItem[]
}

const categories: CategoryItem[] = [
  { label: '전체상품', href: '/products', children: [] },
  {
    label: 'HOUSING',
    href: '/products?category=housing',
    children: [
      { name: '알루미늄', href: '/products?category=housing&subcategory=housing-alu' },
      { name: '폴리카보네이트', href: '/products?category=housing&subcategory=housing-pc' },
      { name: '목재', href: '/products?category=housing&subcategory=housing-wood' },
      { name: '아크릴', href: '/products?category=housing&subcategory=housing-acrylic' },
      { name: '플라스틱', href: '/products?category=housing&subcategory=housing-plastic' },
    ],
  },
  {
    label: 'PCB',
    href: '/products?category=pcb',
    children: [
      { name: '65%', href: '/products?category=pcb&subcategory=kb-65' },
      { name: '75%', href: '/products?category=pcb&subcategory=kb-75' },
      { name: '텐키리스', href: '/products?category=pcb&subcategory=kb-tkl' },
      { name: '핫스왑', href: '/products?category=pcb&subcategory=pcb-hotswap' },
      { name: '유무선/블루투스', href: '/products?category=pcb&subcategory=pcb-wireless' },
    ],
  },
  {
    label: 'SWITCHES',
    href: '/products?category=switches',
    children: [
      { name: '리니어', href: '/products?category=switches&subcategory=switch-linear' },
      { name: '택타일', href: '/products?category=switches&subcategory=switch-tactile' },
      { name: '저소음', href: '/products?category=switches&subcategory=switch-silent' },
      { name: '클릭', href: '/products?category=switches&subcategory=switch-click' },
    ],
  },
  {
    label: 'KEYCAPS',
    href: '/products?category=keycaps',
    children: [
      { name: '체리 프로파일', href: '/products?category=keycaps&subcategory=keycap-cherry' },
      { name: 'OEM 프로파일', href: '/products?category=keycaps&subcategory=keycap-oem' },
      { name: 'PBT 소재', href: '/products?category=keycaps&subcategory=keycap-pbt' },
      { name: '한글 각인', href: '/products?category=keycaps&subcategory=keycap-korean' },
    ],
  },
]

export function SiteHeader({
  itemCount,
  onOpenCart,
  onOpenSearch,
  onOpenAuth,
  currentUser,
  onLogout,
}: {
  itemCount: number
  onOpenCart: () => void
  onOpenSearch: () => void
  onOpenAuth: () => void
  currentUser: ApiUser | null
  onLogout: () => void
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-[min(80%,1440px)] items-center justify-between gap-6 max-lg:w-[92%]">
        <div className="flex items-center gap-8">
          <Link className="text-sm font-semibold tracking-[0.22em] uppercase" href="/">
            MONO / KEYS
          </Link>
          <nav className="flex items-center gap-6 max-md:hidden">
            {categories.map((category) => (
              <div className="group relative py-4" key={category.label}>
                <Link
                  className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase transition hover:text-zinc-950"
                  href={category.href}
                >
                  {category.label}
                </Link>

                {category.children.length > 0 && (
                  <div className="invisible absolute left-0 top-full -mt-1 w-44 rounded-xl border border-zinc-200 bg-white p-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
                    {category.children.map((sub) => (
                      <Link
                        className="block rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
                        href={sub.href}
                        key={sub.name}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="Search catalog"
            className="rounded-full border border-zinc-300 px-3.5 py-1 text-xs font-semibold tracking-wider text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950 max-md:hidden"
            onClick={onOpenSearch}
            type="button"
          >
            검색
          </button>
          {currentUser ? (
            <div className="flex items-center gap-2 max-md:hidden">
              <span className="text-xs text-zinc-500">
                {currentUser.name || currentUser.email.split('@')[0]}님
              </span>
              <button
                className="rounded-full border border-zinc-300 px-3.5 py-1 text-xs font-semibold tracking-wider text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
                onClick={onLogout}
                type="button"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              className="rounded-full border border-zinc-300 px-3.5 py-1 text-xs font-semibold tracking-wider text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950 max-md:hidden"
              onClick={onOpenAuth}
              type="button"
            >
              로그인
            </button>
          )}
          <button
            aria-label={`Open cart with ${itemCount} items`}
            className="rounded-full bg-zinc-950 px-3.5 py-1 text-xs font-semibold tracking-wider text-white transition hover:bg-zinc-800"
            onClick={onOpenCart}
            type="button"
          >
            장바구니 ({itemCount})
          </button>
          <button
            aria-label="Toggle navigation menu"
            className="hidden p-2 text-zinc-700 hover:text-zinc-950 max-md:block"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            type="button"
          >
            {mobileMenuOpen ? <CloseIcon /> : '☰'}
          </button>
        </div>
      </div>

      {/* 모바일 네비게이션 드로어 */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-6 py-6 max-lg:w-full md:hidden">
          <div className="flex flex-col space-y-4">
            {categories.map((category) => (
              <div key={category.label}>
                <div className="flex items-center justify-between">
                  <Link
                    className="text-sm font-semibold tracking-wider uppercase text-zinc-900"
                    href={category.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.label}
                  </Link>
                  {category.children.length > 0 && (
                    <button
                      className="p-1 text-xs text-zinc-400"
                      onClick={() =>
                        setExpandedMobileCategory(
                          expandedMobileCategory === category.label ? null : category.label,
                        )
                      }
                      type="button"
                    >
                      {expandedMobileCategory === category.label ? '▲' : '▼'}
                    </button>
                  )}
                </div>

                {category.children.length > 0 && expandedMobileCategory === category.label && (
                  <div className="mt-2 ml-3 flex flex-col space-y-2 border-l border-zinc-200 pl-3">
                    {category.children.map((sub) => (
                      <Link
                        className="text-xs text-zinc-600"
                        href={sub.href}
                        key={sub.name}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="mt-6 border-t border-zinc-200 pt-4 flex flex-col gap-3">
              <button
                className="text-left text-xs font-semibold tracking-wider text-zinc-600"
                onClick={() => {
                  setMobileMenuOpen(false)
                  onOpenSearch()
                }}
                type="button"
              >
                검색창 열기
              </button>
              {currentUser ? (
                <button
                  className="text-left text-xs font-semibold tracking-wider text-zinc-600"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onLogout()
                  }}
                  type="button"
                >
                  로그아웃
                </button>
              ) : (
                <button
                  className="text-left text-xs font-semibold tracking-wider text-zinc-600"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenAuth()
                  }}
                  type="button"
                >
                  로그인 / 회원가입
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
