/**
 * API client configuration
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface FetchOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Generic API fetch function
 */
async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, headers, ...rest } = options;

    // Build URL with query params
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': 'ru',
            ...headers,
        },
        ...rest,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Catalog API
 */
export const catalogApi = {
    // Categories
    getCategories: () => apiFetch<Category[]>('/categories/'),
    getCategory: (slug: string) => apiFetch<Category>(`/categories/${slug}/`),

    // Brands
    getBrands: () => apiFetch<Brand[]>('/brands/'),
    getFeaturedBrands: () => apiFetch<Brand[]>('/brands/featured/'),

    // Products
    getProducts: (params?: ProductsParams) =>
        apiFetch<PaginatedResponse<Product>>('/products/', { params }),
    getProduct: (slug: string) => apiFetch<ProductDetail>(`/products/${slug}/`),
    getFeaturedProducts: () => apiFetch<Product[]>('/products/featured/'),
    getRelatedProducts: (slug: string) => apiFetch<Product[]>(`/products/${slug}/related/`),

    // Search
    search: (query: string) =>
        apiFetch<SearchResults>('/search/', { params: { q: query } }),
};

/**
 * Regions API
 */
export const regionsApi = {
    getRegions: () => apiFetch<Region[]>('/regions/'),
};

// Types
export interface Category {
    id: number;
    slug: string;
    name: string;
    name_ru: string;
    icon?: string;
    image?: string;
    children?: Category[];
    product_count?: number;
}

export interface Brand {
    id: number;
    slug: string;
    name: string;
    country: string;
    logo?: string;
    is_verified?: boolean;
}

export interface Product {
    id: number;
    sku: string;
    slug: string;
    product_type: 'machinery' | 'attachment' | 'spare_part';
    name: string;
    short_description?: string;
    main_image?: string;
    category: Category;
    brand: Brand;
    pricing: {
        show_to_guests: boolean;
        can_see_price: boolean;
        price_usd: number | null;
        price_uzs: number | null;
    };
    stock_status: 'in_stock' | 'low_stock' | 'pre_order' | 'out_of_stock';
    is_featured: boolean;
}

export interface ProductDetail extends Product {
    full_description?: string;
    specifications: Record<string, { value: string | number; unit?: string }>;
    specifications_formatted: { key: string; label: string; value: string }[];
    images: { id: number; image: string; alt_text?: string }[];
    documents: { id: number; doc_type: string; title: string; file: string }[];
    video_url?: string;
    weight_kg?: number;
    ships_from?: string;
    estimated_delivery_days?: number;
    view_count: number;
}

export interface Region {
    id: number;
    code: string;
    name: string;
    name_ru: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface ProductsParams {
    page?: number;
    page_size?: number;
    category?: string;
    brand?: string;
    search?: string;
    ordering?: string;
    stock_status?: string;
    min_price?: number;
    max_price?: number;
    is_featured?: boolean;
}

export interface SearchResults {
    products: Product[];
    categories: Category[];
    brands: Brand[];
}
