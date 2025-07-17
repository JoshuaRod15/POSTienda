import {create} from 'zustand'

interface Product{
    id: number
    name: string
    price: number
    SKU: number
    saleType: string
    image?: string
}

interface ProductStore {
    products: Product[]
    setProducts: (products: Product[]) => void
    updateProduct: (updated: Product) => void
}

export const useProductsStore = create<ProductStore>((set) => ({
    products: [],
    setProducts: (products) => set({products}),
    updateProduct: (updated) => 
        set((state) => ({
        products: state.products.map(p => p.id === updated.id ? updated: p)
    }))
}))