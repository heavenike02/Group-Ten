export interface Transaction {
  date: string;
  rdate: string;
  currency: string;
  value: number;
  original_wording: string;
  id: number;
}

export interface Account {
  transactions: Transaction[];
  balance: number;
  last_update: string;
  iban: string;
  bic: string;
  currency: { id: string };
  type: string;
  usage: string;
  id: number;
}

export interface Connection {
  accounts: Account[];
}

export interface BankingData {
  format: string;
  connections: Connection[];
}

export interface CreditEvaluationResult {
  creditScore: number;
  metrics: {
    totalIncome: number;
    totalExpenditure: number;
    netIncome: number;
    averageSalary: number;
    salaryFrequency: number;
    expenditureRatio: number;
    overdraftCount: number;
    currentBalance: number;
  };
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export function evaluateCreditRisk(data: BankingData): CreditEvaluationResult {
  // Assume we're working with the first connection and account

  console.log(data);
  const account = data.connections[0].accounts[0];
  const transactions = account.transactions || [];
  const currentBalance = account.balance;

  const evaluationPeriodDays = 90;
  const evaluationPeriodStart = new Date(
    Date.now() - evaluationPeriodDays * 24 * 60 * 60 * 1000
  );

  let totalIncome = 0;
  let totalExpenditure = 0;
  const salaryTransactions: number[] = [];
  let overdraftCount = 0;

  transactions.forEach((txn) => {
    const txnDate = new Date(txn.date);
    if (txnDate < evaluationPeriodStart) return;

    const value = txn.value;
    const description = txn.original_wording.toUpperCase();

    if (value > 0) {
      totalIncome += value;
      if (description.includes("SALARY")) {
        salaryTransactions.push(value);
      }
    } else {
      totalExpenditure += Math.abs(value);
      if (description.includes("OVERDRAFT") || description.includes("FEE")) {
        overdraftCount++;
      }
    }
  });

  const netIncome = totalIncome - totalExpenditure;
  const expenditureRatio = totalIncome > 0 ? totalExpenditure / totalIncome : 1;
  const averageSalary =
    salaryTransactions.length > 0
      ? salaryTransactions.reduce((sum, s) => sum + s, 0) / salaryTransactions.length
      : 0;

  const months = evaluationPeriodDays / 30;
  const salaryFrequency = salaryTransactions.length / months;

  const normalizedNetIncome = normalize(netIncome, -5000, 5000);
  const normalizedSalaryFrequency = normalize(salaryFrequency, 0, 2);
  const normalizedBalance = currentBalance >= 0 ? 1 : 0;
  const normalizedOverdraftPenalty = 1 - Math.min(overdraftCount / 3, 1);

  const weight_netIncome = 0.4;
  const weight_salaryStability = 0.3;
  const weight_balance = 0.2;
  const weight_overdraft = 0.1;

  const compositeScore =
    weight_netIncome * normalizedNetIncome +
    weight_salaryStability * normalizedSalaryFrequency +
    weight_balance * normalizedBalance +
    weight_overdraft * normalizedOverdraftPenalty;

  const creditScore = Math.round((1 - compositeScore) * 10);

  return {
    creditScore,
    metrics: {
      totalIncome,
      totalExpenditure,
      netIncome,
      averageSalary,
      salaryFrequency,
      expenditureRatio,
      overdraftCount,
      currentBalance,
    },
  };
}

export const banking_data : BankingData = {
  format: "BUDGET_INSIGHT_V2_0",
  connections: [
    {
      accounts: [
        {
          transactions: [
            {
              date: "2024-11-04T12:00:00.000Z",
              rdate: "2024-11-04T12:00:00.000Z",
              currency: "GBP",
              value: -50.26,
              original_wording: "WAGEDAY ADVANCE  Type: Direct Debit - D/D",
              id: 596,
            },
            {
              date: "2024-11-10T12:00:00.000Z",
              rdate: "2024-11-10T12:00:00.000Z",
              currency: "GBP",
              value: -350,
              original_wording: "LeoVegas CD 4130",
              id: 323,
            },
            {
              date: "2024-11-19T12:00:00.000Z",
              rdate: "2024-11-19T12:00:00.000Z",
              currency: "GBP",
              value: 1356.53,
              original_wording: "ALGOAN SALARY 00000005532BCKRD",
              id: 68,
            },
            {
              date: "2024-11-20T12:00:00.000Z",
              rdate: "2024-11-20T12:00:00.000Z",
              currency: "GBP",
              value: -96.53,
              original_wording: "SAFETYNET CREDIT",
              id: 343,
            },
            {
              date: "2024-11-21T12:00:00.000Z",
              rdate: "2024-11-21T12:00:00.000Z",
              currency: "GBP",
              value: -350,
              original_wording: "MR HARRY POTTER - Rent - BP",
              id: 690,
            },
            {
              date: "2024-11-21T12:00:00.000Z",
              rdate: "2024-11-21T12:00:00.000Z",
              currency: "GBP",
              value: -70.66,
              original_wording: "TESCO PAY AT PUMP CD 4130",
              id: 349,
            },
            {
              date: "2024-11-21T12:00:00.000Z",
              rdate: "2024-11-21T12:00:00.000Z",
              currency: "GBP",
              value: -5.99,
              original_wording: "Microsoft*Xbox CD 4130 DEB",
              id: 112,
            },
            {
              date: "2024-11-22T12:00:00.000Z",
              rdate: "2024-11-22T12:00:00.000Z",
              currency: "GBP",
              value: -59.55,
              original_wording: "ASDA SUPERSTORE CD 4130 DEB",
              id: 564,
            },
            {
              date: "2024-11-23T12:00:00.000Z",
              rdate: "2024-11-23T12:00:00.000Z",
              currency: "GBP",
              value: -29.09,
              original_wording: "HOME INSURANCELBIS HAP000000625-Z31CZ",
              id: 131,
            },
            {
              date: "2024-11-24T12:00:00.000Z",
              rdate: "2024-11-24T12:00:00.000Z",
              currency: "GBP",
              value: -32.5,
              original_wording: "THE COACH & HORSES WALLINGFORD O",
              id: 820,
            },
            {
              date: "2024-11-24T12:00:00.000Z",
              rdate: "2024-11-24T12:00:00.000Z",
              currency: "GBP",
              value: -27.77,
              original_wording:
                "CARD PAYMENT TO TESCO STORE 3332 ON 0000-x8-30",
              id: 302,
            },
            {
              date: "2024-11-25T12:00:00.000Z",
              rdate: "2024-11-25T12:00:00.000Z",
              currency: "GBP",
              value: -99,
              original_wording: "SHAFTESBURY-THEATR CD 4130",
              id: 328,
            },
            {
              date: "2024-11-26T12:00:00.000Z",
              rdate: "2024-11-26T12:00:00.000Z",
              currency: "GBP",
              value: -71,
              original_wording: "CARD PAYMENT TO SPORTS HOUSE",
              id: 656,
            },
            {
              date: "2024-11-26T12:00:00.000Z",
              rdate: "2024-11-26T12:00:00.000Z",
              currency: "GBP",
              value: -15.23,
              original_wording: "ALDI CD 4130",
              id: 733,
            },
            {
              date: "2024-11-27T12:00:00.000Z",
              rdate: "2024-11-27T12:00:00.000Z",
              currency: "GBP",
              value: -13.55,
              original_wording: "SAINSBURYS S/MKTS CD 4130",
              id: 332,
            },
            {
              date: "2024-11-29T12:00:00.000Z",
              rdate: "2024-11-29T12:00:00.000Z",
              currency: "GBP",
              value: -29.92,
              original_wording: "SAINSBURYS S/MKTS CD 4130",
              id: 57,
            },
            {
              date: "2024-12-02T12:00:00.000Z",
              rdate: "2024-12-02T12:00:00.000Z",
              currency: "GBP",
              value: -142.76,
              original_wording: "SAFETYNET CREDIT CD 236232736",
              id: 996,
            },
            {
              date: "2024-12-05T12:00:00.000Z",
              rdate: "2024-12-05T12:00:00.000Z",
              currency: "GBP",
              value: -50.26,
              original_wording: "WAGEDAY ADVANCE  Type: Direct Debit - D/D",
              id: 877,
            },
            {
              date: "2024-12-05T12:00:00.000Z",
              rdate: "2024-12-05T12:00:00.000Z",
              currency: "GBP",
              value: -17,
              original_wording: "SMOKE MART Debit card ending: 4130",
              id: 941,
            },
            {
              date: "2024-12-06T12:00:00.000Z",
              rdate: "2024-12-06T12:00:00.000Z",
              currency: "GBP",
              value: -13.6,
              original_wording: "TESCO MOBILE REFERENCE: 300000004200A-003",
              id: 943,
            },
            {
              date: "2024-12-07T12:00:00.000Z",
              rdate: "2024-12-07T12:00:00.000Z",
              currency: "GBP",
              value: -292,
              original_wording: "SHARRON RACE CAR PAYMENT",
              id: 598,
            },
            {
              date: "2025-02-08T12:00:00.000Z",
              rdate: "2025-02-08T12:00:00.000Z",
              currency: "GBP",
              value: -10,
              original_wording: "Visa purchase - B365 SKY BET GB",
              id: 667,
            },
            {
              date: "2024-12-10T12:00:00.000Z",
              rdate: "2024-12-10T12:00:00.000Z",
              currency: "GBP",
              value: -10,
              original_wording: "WWW.TOMBOLA.CO.UK Debit card ending: 4130",
              id: 215,
            },
            {
              date: "2024-12-11T12:00:00.000Z",
              rdate: "2024-12-11T12:00:00.000Z",
              currency: "GBP",
              value: -20,
              original_wording: "DEBIT CRD43B365 SKY BET",
              id: 67,
            },
            {
              date: "2025-01-20T12:00:00.000Z",
              rdate: "2025-01-20T12:00:00.000Z",
              currency: "GBP",
              value: -50,
              original_wording: "DEBIT CRD43B365 SKY BET",
              id: 483,
            },
            {
              date: "2025-02-04T12:00:00.000Z",
              rdate: "2025-02-04T12:00:00.000Z",
              currency: "GBP",
              value: -30,
              original_wording: "DEBIT CRD43B365 SKY BET",
              id: 142,
            },
            {
              date: "2024-12-12T12:00:00.000Z",
              rdate: "2024-12-12T12:00:00.000Z",
              currency: "GBP",
              value: -20,
              original_wording: "BETWAY Debit card ending: 4130 Transaction",
              id: 108,
            },
            {
              date: "2024-12-14T12:00:00.000Z",
              rdate: "2024-12-14T12:00:00.000Z",
              currency: "GBP",
              value: -18,
              original_wording: "UNARRANGED OVERDRAFT USAGE FEE",
              id: 785,
            },
            {
              date: "2024-12-16T12:00:00.000Z",
              rdate: "2024-12-16T12:00:00.000Z",
              currency: "GBP",
              value: -17,
              original_wording: "E CIGARETTE OUTLET",
              id: 606,
            },
            {
              date: "2024-12-18T12:00:00.000Z",
              rdate: "2024-12-18T12:00:00.000Z",
              currency: "GBP",
              value: -78,
              original_wording: "SELFRIDGES LONDON",
              id: 132,
            },
            {
              date: "2024-12-19T12:00:00.000Z",
              rdate: "2024-12-19T12:00:00.000Z",
              currency: "GBP",
              value: 1357.43,
              original_wording: "ALGOAN SALARY 00000005532BCKRD",
              id: 976,
            },
            {
              date: "2024-12-21T12:00:00.000Z",
              rdate: "2024-12-21T12:00:00.000Z",
              currency: "GBP",
              value: -96.53,
              original_wording: "SAFETYNET CREDIT",
              id: 727,
            },
            {
              date: "2024-12-21T12:00:00.000Z",
              rdate: "2024-12-21T12:00:00.000Z",
              currency: "GBP",
              value: -350,
              original_wording: "MR HARRY POTTER - Rent - BP",
              id: 599,
            },
            {
              date: "2024-12-21T12:00:00.000Z",
              rdate: "2024-12-21T12:00:00.000Z",
              currency: "GBP",
              value: -4.49,
              original_wording: "Prime Video CD 4130 DEB",
              id: 854,
            },
            {
              date: "2025-01-20T12:00:00.000Z",
              rdate: "2025-01-20T12:00:00.000Z",
              currency: "GBP",
              value: -4.49,
              original_wording: "Prime Video CD 4130 DEB",
              id: 263,
            },
            {
              date: "2024-12-21T12:00:00.000Z",
              rdate: "2024-12-21T12:00:00.000Z",
              currency: "GBP",
              value: -10.82,
              original_wording: "SAINSBURYS S/MKTS CD 4130",
              id: 314,
            },
            {
              date: "2024-12-22T12:00:00.000Z",
              rdate: "2024-12-22T12:00:00.000Z",
              currency: "GBP",
              value: -70.62,
              original_wording: "TESCO PAY AT PUMP 4130 CD 4130",
              id: 242,
            },
            {
              date: "2024-12-22T12:00:00.000Z",
              rdate: "2024-12-22T12:00:00.000Z",
              currency: "GBP",
              value: -30.99,
              original_wording: "AMAZON.COM",
              id: 909,
            },
            {
              date: "2024-12-22T12:00:00.000Z",
              rdate: "2024-12-22T12:00:00.000Z",
              currency: "GBP",
              value: -19.99,
              original_wording: "PAYPAL *GOOGLE GOO CD 4130 DEB",
              id: 430,
            },
            {
              date: "2024-12-22T12:00:00.000Z",
              rdate: "2024-12-22T12:00:00.000Z",
              currency: "GBP",
              value: -8.24,
              original_wording: "ALDI CD 4130",
              id: 525,
            },
            {
              date: "2024-12-23T12:00:00.000Z",
              rdate: "2024-12-23T12:00:00.000Z",
              currency: "GBP",
              value: -29.09,
              original_wording: "HOME INSURANCELBIS HAP000000625-Z31CZ",
              id: 193,
            },
            {
              date: "2024-12-26T12:00:00.000Z",
              rdate: "2024-12-26T12:00:00.000Z",
              currency: "GBP",
              value: -19,
              original_wording: "SMOKE MART Debit card ending: 4130",
              id: 250,
            },
            {
              date: "2024-12-27T12:00:00.000Z",
              rdate: "2024-12-27T12:00:00.000Z",
              currency: "GBP",
              value: -71,
              original_wording: "CARD PAYMENT TO SPORTS HOUSE",
              id: 270,
            },
            {
              date: "2024-12-27T12:00:00.000Z",
              rdate: "2024-12-27T12:00:00.000Z",
              currency: "GBP",
              value: -14.78,
              original_wording: "MORRISONS STORES CD 4130",
              id: 820,
            },
            {
              date: "2024-12-27T12:00:00.000Z",
              rdate: "2024-12-27T12:00:00.000Z",
              currency: "GBP",
              value: -41.95,
              original_wording: "ASDA GROCERIES ONL CD 4130 DEB",
              id: 494,
            },
            {
              date: "2024-11-27T12:00:00.000Z",
              rdate: "2024-11-27T12:00:00.000Z",
              currency: "GBP",
              value: -50,
              original_wording: "POCKETWIN.CO.UK CD 4130",
              id: 400,
            },
            {
              date: "2025-01-28T12:00:00.000Z",
              rdate: "2025-01-28T12:00:00.000Z",
              currency: "GBP",
              value: -80,
              original_wording: "MECCA BINGO x3014 CD 4130",
              id: 742,
            },
            {
              date: "2024-11-29T12:00:00.000Z",
              rdate: "2024-11-29T12:00:00.000Z",
              currency: "GBP",
              value: -50,
              original_wording: "Debit NATIONAL LOTTERY 4x3907E0-00NK3D BYT",
              id: 118,
            },
            {
              date: "2024-12-30T12:00:00.000Z",
              rdate: "2024-12-30T12:00:00.000Z",
              currency: "GBP",
              value: -20,
              original_wording: "PAYPAL *SKY BET",
              id: 913,
            },
            {
              date: "2024-12-30T12:00:00.000Z",
              rdate: "2024-12-30T12:00:00.000Z",
              currency: "GBP",
              value: -49.6,
              original_wording: "SAINSBURYS S/MKTS CD 4130",
              id: 832,
            },
            {
              date: "2025-01-01T12:00:00.000Z",
              rdate: "2025-01-01T12:00:00.000Z",
              currency: "GBP",
              value: -142.76,
              original_wording: "SAFETYNET CREDIT CD 236232736",
              id: 131,
            },
            {
              date: "2025-01-04T12:00:00.000Z",
              rdate: "2025-01-04T12:00:00.000Z",
              currency: "GBP",
              value: -50.26,
              original_wording: "WAGEDAY ADVANCE  Type: Direct Debit - D/D",
              id: 442,
            },
            {
              date: "2025-01-04T12:00:00.000Z",
              rdate: "2025-01-04T12:00:00.000Z",
              currency: "GBP",
              value: -13.6,
              original_wording: "TESCO MOBILE REFERENCE: 300000004200A-003",
              id: 816,
            },
            {
              date: "2025-01-12T12:00:00.000Z",
              rdate: "2025-01-12T12:00:00.000Z",
              currency: "GBP",
              value: -26,
              original_wording: "ARRANGED OVERDRAFT USAGE FEE",
              id: 627,
            },
            {
              date: "2025-01-17T12:00:00.000Z",
              rdate: "2025-01-17T12:00:00.000Z",
              currency: "GBP",
              value: -250,
              original_wording: "LeoVegas CD 4130",
              id: 362,
            },
            {
              date: "2025-01-18T12:00:00.000Z",
              rdate: "2025-01-18T12:00:00.000Z",
              currency: "GBP",
              value: -5.23,
              original_wording: "ALDI CD 4130",
              id: 139,
            },
            {
              date: "2025-01-19T12:00:00.000Z",
              rdate: "2025-01-19T12:00:00.000Z",
              currency: "GBP",
              value: -49.9,
              original_wording: "Card Purchase WESTERNUNION.CO.UK BCC",
              id: 811,
            },
            {
              date: "2025-01-20T12:00:00.000Z",
              rdate: "2025-01-20T12:00:00.000Z",
              currency: "GBP",
              value: 1352.53,
              original_wording: "ALGOAN SALARY 00000005532BCKRD",
              id: 87,
            },
            {
              date: "2025-01-20T12:00:00.000Z",
              rdate: "2025-01-20T12:00:00.000Z",
              currency: "GBP",
              value: -150,
              original_wording: "BETWAY Debit card ending: 4130 Transaction",
              id: 3,
            },
            {
              date: "2025-01-20T12:00:00.000Z",
              rdate: "2025-01-20T12:00:00.000Z",
              currency: "GBP",
              value: -96.53,
              original_wording: "SAFETYNET CREDIT",
              id: 625,
            },
            {
              date: "2025-01-20T12:00:00.000Z",
              rdate: "2025-01-20T12:00:00.000Z",
              currency: "GBP",
              value: -15.9,
              original_wording: "E CIGARETTE OUTLET",
              id: 92,
            },
            {
              date: "2025-01-21T12:00:00.000Z",
              rdate: "2025-01-21T12:00:00.000Z",
              currency: "GBP",
              value: -150,
              original_wording: "LeoVegas CD 4130",
              id: 991,
            },
            {
              date: "2025-01-21T12:00:00.000Z",
              rdate: "2025-01-21T12:00:00.000Z",
              currency: "GBP",
              value: -350,
              original_wording: "MR HARRY POTTER - Rent - BP",
              id: 555,
            },
            {
              date: "2025-01-21T12:00:00.000Z",
              rdate: "2025-01-21T12:00:00.000Z",
              currency: "GBP",
              value: -5.99,
              original_wording: "Microsoft*Xbox CD 4130 DEB",
              id: 998,
            },
            {
              date: "2024-12-22T12:00:00.000Z",
              rdate: "2024-12-22T12:00:00.000Z",
              currency: "GBP",
              value: -5.99,
              original_wording: "Microsoft*Xbox CD 4130 DEB",
              id: 767,
            },
            {
              date: "2025-01-22T12:00:00.000Z",
              rdate: "2025-01-22T12:00:00.000Z",
              currency: "GBP",
              value: -70.66,
              original_wording: "TESCO PAY AT PUMP CD 4130",
              id: 586,
            },
            {
              date: "2025-01-22T12:00:00.000Z",
              rdate: "2025-01-22T12:00:00.000Z",
              currency: "GBP",
              value: -69.55,
              original_wording: "ASDA SUPERSTORE CD 4130 DEB",
              id: 607,
            },
            {
              date: "2025-01-23T12:00:00.000Z",
              rdate: "2025-01-23T12:00:00.000Z",
              currency: "GBP",
              value: 96.53,
              original_wording: "Unpaid direct debit SAFETYNET CREDIT",
              id: 328,
            },
            {
              date: "2025-01-23T12:00:00.000Z",
              rdate: "2025-01-23T12:00:00.000Z",
              currency: "GBP",
              value: -29.09,
              original_wording: "HOME INSURANCELBIS HAP000000625-Z31CZ",
              id: 66,
            },
            {
              date: "2025-01-23T12:00:00.000Z",
              rdate: "2025-01-23T12:00:00.000Z",
              currency: "GBP",
              value: -55.23,
              original_wording: "ALDI CD 4130",
              id: 666,
            },
            {
              date: "2025-01-26T12:00:00.000Z",
              rdate: "2025-01-26T12:00:00.000Z",
              currency: "GBP",
              value: -96.53,
              original_wording: "SAFETYNET CREDIT",
              id: 936,
            },
            {
              date: "2025-01-26T12:00:00.000Z",
              rdate: "2025-01-26T12:00:00.000Z",
              currency: "GBP",
              value: -48.43,
              original_wording: "ASDA SUPERSTORE CD 4130 DEB",
              id: 633,
            },
            {
              date: "2025-01-27T12:00:00.000Z",
              rdate: "2025-01-27T12:00:00.000Z",
              currency: "GBP",
              value: -71,
              original_wording: "CARD PAYMENT TO SPORTS HOUSE",
              id: 789,
            },
            {
              date: "2025-01-30T12:00:00.000Z",
              rdate: "2025-01-30T12:00:00.000Z",
              currency: "GBP",
              value: -142.76,
              original_wording: "SAFETYNET CREDIT CD 236232736",
              id: 63,
            },
            {
              date: "2025-01-31T12:00:00.000Z",
              rdate: "2025-01-31T12:00:00.000Z",
              currency: "GBP",
              value: -17,
              original_wording: "SMOKE MART Debit card ending: 4130",
              id: 616,
            },
            {
              date: "2025-02-02T12:00:00.000Z",
              rdate: "2025-02-02T12:00:00.000Z",
              currency: "GBP",
              value: 200,
              original_wording: "WATSON MUM CBBPI0000008869 FPI",
              id: 552,
            },
            {
              date: "2025-02-03T12:00:00.000Z",
              rdate: "2025-02-03T12:00:00.000Z",
              currency: "GBP",
              value: -60,
              original_wording: "Fee - Unpaid Direct Debit",
              id: 221,
            },
            {
              date: "2025-02-04T12:00:00.000Z",
              rdate: "2025-02-04T12:00:00.000Z",
              currency: "GBP",
              value: -50.26,
              original_wording: "WAGEDAY ADVANCE  Type: Direct Debit - D/D",
              id: 881,
            },
            {
              date: "2025-02-05T12:00:00.000Z",
              rdate: "2025-02-05T12:00:00.000Z",
              currency: "GBP",
              value: -13.6,
              original_wording: "TESCO MOBILE REFERENCE: 300000004200A-003",
              id: 744,
            },
            {
              date: "2025-02-07T12:00:00.000Z",
              rdate: "2025-02-07T12:00:00.000Z",
              currency: "GBP",
              value: 13.6,
              original_wording: "TESCO MOBILE REFERENCE: 300000004200A-003 UNP",
              id: 317,
            },
            {
              date: "2025-02-10T12:00:00.000Z",
              rdate: "2025-02-10T12:00:00.000Z",
              currency: "GBP",
              value: -7.8,
              original_wording: "ONE STOP 3013 CD 4130",
              id: 908,
            },
            {
              date: "2025-02-13T12:00:00.000Z",
              rdate: "2025-02-13T12:00:00.000Z",
              currency: "GBP",
              value: -20,
              original_wording: "UNPAID TRANSAC FEE",
              id: 520,
            },
            {
              date: "2025-02-15T12:00:00.000Z",
              rdate: "2025-02-15T12:00:00.000Z",
              currency: "GBP",
              value: -80,
              original_wording: "UNPLANNED O/D FEES",
              id: 742,
            },
            {
              date: "2025-02-17T12:00:00.000Z",
              rdate: "2025-02-17T12:00:00.000Z",
              currency: "GBP",
              value: -9.43,
              original_wording: "ASDA SUPERSTORE CD 4130 DEB",
              id: 942,
            },
            {
              date: "2025-02-19T12:00:00.000Z",
              rdate: "2025-02-19T12:00:00.000Z",
              currency: "GBP",
              value: 200,
              original_wording: "WAGEDAY ADVANCE 00003476 000000000000007301",
              id: 906,
            },
          ],
          balance: -362.05,
          last_update: "2025-02-21T12:00:00.000Z",
          iban: "GB05GQKQ13065644352477",
          bic: "HBUKGB4BXXX",
          currency: {
            id: "GBP",
          },
          type: "checking",
          usage: "PRIV",
          id: 185,
        },
      ],
    },
  ],
};
