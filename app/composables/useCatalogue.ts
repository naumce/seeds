import categories from '~~/content/categories.json'
import products from '~~/content/products.json'
import type { Localized } from './useLocale'

export interface Category {
  slug: string
  name: Localized
  image: string
  blurb: Localized
}

export interface Spec {
  k: Localized
  v: string
}

export interface Product {
  slug: string
  category: string
  published: boolean
  featured: boolean
  name: Localized
  latin: string
  origin: Localized
  forms: Localized<string[]>
  packaging: string[]
  description: Localized
  applications: Localized<string[]>
  specs: Spec[]
  image: string
}

const CATEGORIES = categories as Category[]
const PRODUCTS = (products as Product[]).filter((p) => p.published)

/** Read-only catalogue backed by content/*.json. Swap for Supabase later. */
export const useCatalogue = () => {
  const allCategories = () => CATEGORIES
  const allProducts = () => PRODUCTS
  const featured = () => PRODUCTS.filter((p) => p.featured)
  const byCategory = (slug: string) => PRODUCTS.filter((p) => p.category === slug)
  const bySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug)
  const category = (slug: string) => CATEGORIES.find((c) => c.slug === slug)
  const related = (p: Product, limit = 3) =>
    PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, limit)

  return { allCategories, allProducts, featured, byCategory, bySlug, category, related }
}
