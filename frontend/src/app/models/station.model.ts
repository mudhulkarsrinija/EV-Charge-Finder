export interface ChargingStation {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  chargerType: string;
  chargingSpeed: string;
  pricePerUnit: number;
  available: boolean;
}

export interface StationResponse {
  success: boolean;
  count: number;
  data: ChargingStation[];
}