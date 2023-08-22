export interface Payment {
  id?: number;
  userId: number;
  nameOnCard: string;
  accountNo: string;
  expiry: Date;
}
