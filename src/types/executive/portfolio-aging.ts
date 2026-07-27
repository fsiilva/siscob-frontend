export interface PortfolioAgingMetric {
  count: number;
  amount: number;
}

export interface PortfolioAging {
  "0-30": PortfolioAgingMetric;
  "31-60": PortfolioAgingMetric;
  "61-90": PortfolioAgingMetric;
  "91-180": PortfolioAgingMetric;
  "181-365": PortfolioAgingMetric;
  "365+": PortfolioAgingMetric;
}
