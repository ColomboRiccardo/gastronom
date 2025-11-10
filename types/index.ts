export interface ProductType {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    category: string;
    image: string;
    description: string;
    badge?: string;
    weight: string;
    rating: number;
    reviews: number;
    inStock: boolean;
}

export type CategoryType = {
    id: number,
    name: string,
    image: string,
    count: string
}

export type GastronomHomepageProps = Record<string, never>;

export interface CartProductType extends ProductType {
    quantity: number;
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
export type CollectionType = 'caviar' | 'vodka' | 'pickles';

export type CartContextType = {
    cartOpen: boolean;
    setCartOpen: (open: boolean) => void;
    cart: CartProductType[];
    setCart: (cart: CartProductType[]) => void;
    addToCart: (product: ProductType) => void;
    updateQuantity: (productId: string, delta: number) => void;
    removeFromCart: (productId: string) => void;
    cartTotal: number;
    cartCount: number;
}