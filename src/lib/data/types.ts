
export type LocalizedString = {
    vi: string;
    en: string;
};

export type Product = {
    id: string;
    name: LocalizedString | string;
    description: LocalizedString | string;
    image: string;
    aiHint: string;
};

export type Event = {
    id: string;
    name: LocalizedString | string;
    startDate: string;
    endDate: string;
    status: boolean;
    description?: LocalizedString | string;
    image?: string;
    aiHint?: string;
};

export type Customer = {
    id: string;
    phone: string;
    shopName: string;
    joined: string;
};

export type OrderProduct = {
    id: string;
    quantity: number;
    name?: string;
}

export type Order = {
    orderId: string;
    shopName: string;
    products: OrderProduct[];
    total: number;
    orderDate: string;
    eventId: string;
};

export type CheckIn = {
    customerId: string;
    shopName: string;
    phone: string;
    eventId: string;
    checkInTime: string;
};

export type LeaderboardEntry = {
    shopName: string;
    eventId: string;
    products: {
        id: string;
        quantity: number;
    }[];
};

export type PackageType = 'Simple' | 'Complex';

export type PackageGroup = {
    id: string;
    name: string;
    packageId: string;
    requiredQuantity: number;
    products: Product[];
};

export type Package = {
    id: string;
    name: LocalizedString | string;
    description: LocalizedString | string;
    image: string;
    type: PackageType;
    eventId: string;
    eventName?: string;
    discount: number;
    groups: PackageGroup[];
};
