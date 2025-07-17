import { create } from 'zustand';

type productForTicket = {
    id: number
    SKU: number,
    name: string,
    price: number,
    qty: number
}

interface Ticket {
    date: number;
    products: productForTicket[];
    state: string;
    total: number;
    payType: string;
    recivedCash: number;
    returnedCash: number;
}

interface TicketStore {
    ticket: Ticket;
    addProduct: (product: Omit<productForTicket, 'qty'>, qty?: number) => void;
    increaseQty: (id: number) => void;
    decreaseQty: (id: number) => void;
    removeProduct: (id: number) => void;
    clearTicket: () => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
    ticket: {
        date: Date.now(),
        products: [],
        state: 'PENDDING',
        payType: 'MONEY',
        total: 0,
        recivedCash: 0,
        returnedCash: 0
    },

    addProduct: (product, qty=1) => 
        set((state) => {
            const existing = state.ticket.products.find(p => p.id === product.id)
            let newProducts;

            if(existing) {
                newProducts = state.ticket.products.map(p => 
                    p.id === product.id ? {...p, qty: p.qty + qty} : p
                )
            } else {
                newProducts = [...state.ticket.products, {...product, qty}]
            }

            const newTotal = newProducts.reduce((sum, p) => sum + p.price * p.qty, 0)

            return {
                ticket: {
                    ...state.ticket,
                    products: newProducts,
                    total: newTotal
                }
            }
        }),

    increaseQty: (id) => 
        set((state) => {     
            const newProducts = state.ticket.products.map(p =>
                p.id === id ? { ...p, qty: p.qty + 1 } : p,
              )
              const newTotal = newProducts.reduce((sum, p) => sum + p.price * p.qty, 0)
              
            return {
                ticket: {...state.ticket, products: newProducts, total: newTotal},
            }
        }),

    decreaseQty: (id) => 
        set((state) =>   {
            let newProducts = state.ticket.products
            .map(p => p.id === id ? {...p, qty:p.qty - 1} : p)
            .filter(p => p.qty > 0)

            const newTotal = newProducts.reduce((sum, p) => sum + p.price * p.qty, 0)

            return {
                ticket: {...state.ticket, products: newProducts, total: newTotal},
            }
        }),

        removeProduct: (id) => 
            set((state) => {
                const newProducts = state.ticket.products.filter(p => p.id !== id)
                const newTotal = newProducts.reduce((sum, p) => sum + p.price * p.qty, 0)

            return {
                ticket: {...state.ticket, products: newProducts, total:newTotal},
            }
            }),

    clearTicket: () => 
        set(() => ({
            ticket: {
                date: Date.now(),
                products: [],
                state: 'PENDDING',
                payType: '',
                total: 0,
                recivedCash: 0,
                returnedCash: 0
            }
        }))
}))