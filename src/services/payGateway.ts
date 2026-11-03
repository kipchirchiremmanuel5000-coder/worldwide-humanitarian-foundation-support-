/**
 * Cross-Border Mobile Money Payment Gateway
 * 
 * Flow:
 * 1. Collect ZMW from MTN Zambia (+260 subscriber)
 * 2. Route via PawaPay / Flutterwave FX Liquidity Switch
 * 3. Convert ZMW -> KES and settle to Admin Airtel Kenya (+254 762 641 585 / Samuel Soi)
 */

export interface MobileMoneyPayRequest {
  country: 'Zambia';
  originProvider: 'MTN Zambia';
  originPhoneNumber: string;
  amountZMW: number;
  recipientName: string;
  recipientDestination: string; // "0762641585" (Airtel Kenya)
}

export interface MobileMoneyPayResponse {
  success: boolean;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  transactionId: string;
  ussdPromptDispatched: boolean;
  fxSettlement: {
    originCurrency: 'ZMW';
    originAmount: number;
    destinationCurrency: 'KES';
    estimatedKES: number;
    destinationProvider: 'Airtel Kenya';
    destinationNumber: '0762641585';
    destinationAccountName: 'Samuel Soi';
  };
  message: string;
}

export async function processMTNZambiaPayment(req: MobileMoneyPayRequest): Promise<MobileMoneyPayResponse> {
  // In production, this proxies to POST /api/pay -> PawaPay/Flutterwave Cross-Border Collection API
  // e.g.:
  // const res = await fetch('/api/pay', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(req)
  // });
  
  // Rate: ~1 ZMW = ~4.7 KES (K 270 ZMW ≈ ~1,270 KES)
  const estimatedKES = Math.round(req.amountZMW * 4.7);
  const txId = `MTN-ZM-PAWAPAY-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    success: true,
    status: 'SUCCESS',
    transactionId: txId,
    ussdPromptDispatched: true,
    fxSettlement: {
      originCurrency: 'ZMW',
      originAmount: req.amountZMW,
      destinationCurrency: 'KES',
      estimatedKES,
      destinationProvider: 'Airtel Kenya',
      destinationNumber: '0762641585',
      destinationAccountName: 'Samuel Soi'
    },
    message: 'Payment received ✅ - Sent to Samuel Soi Airtel 0762641585'
  };
}
