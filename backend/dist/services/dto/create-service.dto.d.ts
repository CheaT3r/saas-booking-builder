export declare class CreateServiceDto {
    name: string;
    description: string;
    price: number;
    duration: number;
    isActive?: boolean;
    settings?: {
        requiresDeposit: boolean;
        depositAmount: number;
        allowOnlineBooking: boolean;
        bufferTime: number;
    };
}
