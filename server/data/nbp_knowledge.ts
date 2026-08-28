export interface DocumentChunk {
  id: string;
  doc_id: string;
  document: string;
  page?: number;
  url?: string;
  source_type: "pdf" | "docx" | "txt" | "website";
  chunk_text: string;
  vector?: number[];
  created_at: string;
}

export const INITIAL_NBP_DOCUMENTS = [
  {
    id: "doc-nbp-digital",
    title: "nbp_digital_faq.pdf",
    source_type: "pdf" as const,
    pages: [
      {
        page: 1,
        content: `National Bank of Pakistan (NBP) Digital Banking Guide & FAQs.
What is NBP Digital?
NBP Digital is the official next-generation mobile banking application developed by the National Bank of Pakistan. It enables NBP account holders to conveniently access their accounts 24/7, perform inter-bank funds transfers, pay utility bills, recharge mobile balances, manage debit cards, and link with Raast instant payment system.
Eligibility & Registration:
All individual NBP account holders maintaining an active account with a valid Computerized National Identity Card (CNIC) and registered mobile number are eligible. Users can download the app from Google Play Store, Apple App Store, or Huawei AppGallery and register instantly using their Account Number / Debit Card details and OTP verification.`
      },
      {
        page: 2,
        content: `NBP Digital Features & Services:
1. Raast Instant Payments: Link CNIC or Mobile Number as Raast ID for instant, free-of-cost real-time peer-to-peer (P2P) transfers across all Pakistani banks.
2. Funds Transfer: Intra-bank (NBP to NBP) transfer and Inter-Bank Funds Transfer (1Link 1IBFT) to all commercial banks and microfinance institutions.
3. Bill Payments: Pay electricity (LESCO, K-Electric, IESCO, FESCO, GEPCO, PESCO, QESCO, HESCO), gas (SNGPL, SSGC), water & sanitation bills, broadband/landline bills (PTCL, Nayatel, StormFiber), and government dues (FBR taxes, provincial taxes, traffic challans, passport fees).
4. Mobile Top-ups: Instant prepaid mobile recharges and postpaid bill payments for Jazz, Telenor, Zong, and Ufone.`
      },
      {
        page: 3,
        content: `Transaction Limits & Security Guidelines:
Daily Transaction Limits:
- Inter-Bank Funds Transfer (IBFT): Default standard limit is PKR 250,000 per day (can be enhanced up to PKR 1,000,000 via biometric verification in-app or helpline).
- Raast P2P Transfers: Up to PKR 250,000 per transaction and PKR 1,000,000 per day.
- Bill Payments & Government Fees: Up to PKR 1,000,000 per day.
Security Features:
- Two-Factor Authentication (2FA) with SMS/Email One-Time Password (OTP).
- Biometric Login (Fingerprint & Face ID) support for supported smartphones.
- In-App Card Management: Instantly block/unblock debit cards, enable/disable international transactions, and activate e-Commerce (e-com/online shopping) 3D Secure session.`
      },
      {
        page: 4,
        content: `NBP Digital Troubleshooting & Helpline:
If an OTP is not received, verify network connectivity or check if your mobile number is ported to another network (MNP). For ported numbers, ensure network prefix routing is updated.
Helpline: NBP 24/7 Contact Center: 021-111-627-627 (021-111-NBP-NBP) or +92-21-111-627-627 for overseas callers.
Official Support Email: digital.banking@nbp.com.pk
Website: https://www.nbp.com.pk`
      }
    ]
  },
  {
    id: "doc-nbp-debit-cards",
    title: "debit_cards_guide.pdf",
    source_type: "pdf" as const,
    pages: [
      {
        page: 1,
        content: `NBP Debit Cards Portfolio:
National Bank of Pakistan offers a comprehensive range of EMV Chip & PIN enabled debit cards powered by PayPak, UnionPay International (UPI), and Visa.
1. NBP PayPak Debit Card:
- Ideal for domestic banking needs within Pakistan.
- Widely accepted at all 1Link ATM networks and Point-of-Sale (POS) merchant terminals nationwide.
- High security with EMV Chip technology.
- Daily ATM cash withdrawal limit: PKR 50,000.
- Daily POS shopping limit: PKR 100,000.`
      },
      {
        page: 2,
        content: `2. NBP Visa Classic Debit Card:
- Globally accepted for ATM cash withdrawals, retail POS shopping, and online e-Commerce transactions.
- Contactless Tap & Pay enabled.
- Daily ATM withdrawal limit: PKR 50,000.
- Daily POS purchase limit: PKR 100,000.
- E-Commerce limit: PKR 100,000 per day.
3. NBP Visa Gold Debit Card:
- Enhanced limits and exclusive merchant discounts.
- Daily ATM withdrawal limit: PKR 75,000.
- Daily POS purchase limit: PKR 200,000.
- E-Commerce limit: PKR 150,000 per day.`
      },
      {
        page: 3,
        content: `4. NBP Visa Platinum Debit Card:
- Premium lifestyle debit card with complimentary airport lounge access at Karachi, Lahore, and Islamabad airports.
- Highest daily transaction allowances: ATM cash withdrawal up to PKR 100,000 per day; POS merchant spend limit up to PKR 500,000 per day; E-commerce limit up to PKR 300,000 per day.
- Comprehensive purchase protection and international travel insurance discounts.
Card Activation:
Debit cards can be activated via NBP Digital App, NBP ATM (by entering OTP received on registered mobile number), or by calling the 24/7 Helpline at 021-111-627-627.`
      }
    ]
  },
  {
    id: "doc-nbp-consumer-loans",
    title: "loans_and_financing.pdf",
    source_type: "pdf" as const,
    pages: [
      {
        page: 1,
        content: `NBP Consumer Loans & Financing Schemes:
1. NBP Advance Plus (Salary Advance Loan):
- Purpose: Short to medium-term revolving/personal cash advance for salaried individuals, permanent government employees, semi-government, and armed forces personnel having their salary credited to NBP accounts.
- Loan Amount: Up to 15 to 20 net salaries, with a maximum financing limit of PKR 3,000,000 (PKR 3 Million).
- Repayment Tenure: Flexible installment repayment terms ranging from 1 year up to 5 years (12 to 60 months).
- Minimum Salary Requirement: PKR 20,000 per month for government employees; PKR 35,000 for private corporate employees.`
      },
      {
        page: 2,
        content: `2. NBP Saibaan Home Loan:
- Purpose: Purchase of residential flat/house, construction of home on owned plot, purchase of land + construction, or home renovation.
- Financing Limit: Up to PKR 50 Million (PKR 50,000,000) depending on repayment capacity and property valuation.
- Repayment Tenure: Up to 20 years (240 months).
- Debt Burden Ratio (DBR): Maximum 50% of verified net disposable monthly income.
- Co-borrower: Spouse, parents, or adult working children can be added to enhance income eligibility.`
      },
      {
        page: 3,
        content: `3. NBP Karobar SME & Commercial Financing:
- Specialized credit lines for small & medium enterprises (SMEs) to meet working capital, raw material procurement, and equipment expansion requirements.
- Subsidized loan schemes aligned with State Bank of Pakistan (SBP) refinance facilities for renewable energy, agriculture modernization, and women entrepreneurs.
- Required Documentation: CNIC copies, 2 passport size photographs, salary slip / business tax returns (last 2 years), bank statement for previous 12 months, and property ownership deeds for collateral.`
      }
    ]
  },
  {
    id: "doc-nbp-accounts",
    title: "accounts_and_deposits.txt",
    source_type: "txt" as const,
    pages: [
      {
        page: 1,
        content: `NBP Accounts & Deposit Products:
1. NBP Asaan Account:
Designed for unbanked and low-income individuals seeking simple banking without complex documentation.
- Account Opening: Requires only original CNIC and an initial opening deposit as low as PKR 100.
- No minimum balance penalty fee.
- Monthly total debit limit: PKR 1,000,000. Total credit balance limit: PKR 1,000,000.
- Free first chequebook and optional PayPak debit card.

2. NBP Current Account:
Standard checking account with zero deduction of zakat and unlimited transactions for businesses and individuals.`
      },
      {
        page: 2,
        content: `3. NBP PLS (Profit & Loss Sharing) Savings Account:
- Rupee savings account earning semi-annual profit payout.
- Profit calculation based on monthly average balance as per State Bank of Pakistan minimum savings rate regulations.
- Online banking access across 1,500+ branches.

4. NBP Asaan Digital Remittance Account:
- Tailored for recipients of home foreign remittances sent by overseas Pakistanis.
- Zero account opening deposit, free SMS alerts on remittance arrival, and free ATM debit card.`
      },
      {
        page: 3,
        content: `5. NBP Prime Plus Term Deposit Certificates:
- Fixed-term investment product for individuals, corporate bodies, and provident funds.
- Available Tenures: 1 Month, 3 Months, 6 Months, 1 Year, 2 Years, 3 Years, and 5 Years.
- Profit Payment Options: Monthly, Quarterly, Semi-Annually, or at Maturity.
- Higher profit yield for Senior Citizens, Widows, and Pensioners.
- Financing facility: Loan / overdraft against deposit up to 90% of certificate face value.`
      }
    ]
  },
  {
    id: "doc-nbp-islamic",
    title: "nbp_aitemaad_islamic_banking.docx",
    source_type: "docx" as const,
    pages: [
      {
        page: 1,
        content: `NBP Aitemaad Islamic Banking:
National Bank of Pakistan operates a dedicated Islamic Banking Group under the brand name 'NBP Aitemaad'. All products and operations are supervised by an independent Shariah Board comprising renowned Shariah scholars.
Core Islamic Principles:
- Strict prohibition of Riba (interest), Gharar (excessive uncertainty), and Maysir (gambling).
- All funds are segregated from conventional banking operations and invested solely in Shariah-compliant businesses and Sukuk bonds.`
      },
      {
        page: 2,
        content: `NBP Aitemaad Deposit & Financing Products:
1. Aitemaad Asaan Savings Account: Operates on the Shariah concept of Mudarabah (partnership). The bank acts as Mudarib (fund manager) and customer as Rab-ul-Maal (investor). Weightages and profit-sharing ratios are announced monthly in advance.
2. Aitemaad Murabaha Financing: Cost-plus markup financing for trade and raw material procurement where the bank purchases the goods and sells them to the customer at a pre-agreed profit margin with deferred payment terms.
3. Aitemaad Diminishing Musharakah (Home & Vehicle Financing): Co-ownership structure where the customer gradually purchases the bank's units of share while paying rent for utilizing the bank's portion of the property.`
      }
    ]
  },
  {
    id: "doc-nbp-official-website",
    title: "NBP Official Portal — Overview & Network",
    source_type: "website" as const,
    url: "https://www.nbp.com.pk/about-us",
    pages: [
      {
        page: 1,
        content: `National Bank of Pakistan (NBP) Corporate Overview:
Established in 1949 under the National Bank of Pakistan Ordinance, NBP is Pakistan's largest state-owned commercial bank with majority shareholding held by the Government of Pakistan / State Bank of Pakistan.
Key Mandates & Operations:
- Agent to the State Bank of Pakistan (SBP) for handling government treasury receipts, federal and provincial tax collection, utility collections, customs duties, and pension disbursements to millions of pensioners across Pakistan.
- Extensive branch network with over 1,500+ branches across urban, rural, and remote areas of Pakistan, Azad Jammu & Kashmir, and Gilgit-Baltistan.
- International presence in regional financial hubs including United States (New York), Germany (Frankfurt), Japan (Tokyo), China (Beijing representative office), Bahrain, Kingdom of Saudi Arabia, and Central Asian Republics.`
      }
    ]
  }
];
