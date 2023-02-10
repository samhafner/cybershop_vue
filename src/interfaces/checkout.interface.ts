export interface UserAddress {
    firstName: string;
    lastName: string;
    street: string;
    streetNo: string;
    city: string;
    zip: string;
    country: string;
    phone: string;
    email: string;
}

export interface PaymentInfo {
    cardNumber: string;
    cardHolder: string;
    cardExpiry: string;
    cvv: string;
}
