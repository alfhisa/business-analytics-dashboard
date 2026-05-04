import { format, addDays } from 'date-fns';

const BRANCHES = ['Central Park', 'Sudirman', 'Senopati', 'Kemang', 'Kelapa Gading'];
const PLATFORMS = ['Android', 'iOS'];

export const generateData = () => {
  const data = [];
  const startDate = new Date(2026, 0, 1); // Jan 1st, 2026

  for (let d = 0; d < 120; d++) {
    const currentDate = addDays(startDate, d);
    const dateStr = format(currentDate, 'yyyy-MM-dd');

    BRANCHES.forEach((branch) => {
      PLATFORMS.forEach((platform) => {
        // Base values
        let dau = 500 + d * 5 + Math.random() * 100;
        if (platform === 'Android') dau *= 1.2; // Android higher DAU

        // Branch performance variation
        if (branch === 'Kemang') dau *= 0.7; // Underperforming branch
        if (branch === 'Central Park') dau *= 1.3; // Top performer

        const newUsers = dau * (0.1 + Math.random() * 0.05);
        const conversionRate = 0.05 + Math.random() * 0.03;
        const orders = Math.floor(dau * conversionRate);

        let avgOrderValue = platform === 'iOS' ? 65000 + Math.random() * 15000 : 45000 + Math.random() * 15000;
        let revenue = orders * avgOrderValue;

        // Discount increases after day 60
        let discountRate = d > 60 ? 0.15 + Math.random() * 0.1 : 0.05 + Math.random() * 0.03;
        const discountAmount = revenue * discountRate;

        // Operational cost increases after day 60
        let baseOpCost = revenue * 0.4;
        let operationalCost = d > 60 ? baseOpCost * 1.4 : baseOpCost;

        const marketingSpend = revenue * 0.1;

        const profit = revenue - discountAmount - operationalCost - marketingSpend;
        const margin = (profit / revenue) * 100;

        data.push({
          date: dateStr,
          day: d,
          branch,
          platform,
          dau: Math.floor(dau),
          newUsers: Math.floor(newUsers),
          orders,
          revenue,
          discountAmount,
          operationalCost,
          marketingSpend,
          avgOrderValue,
          conversionRate,
          profit,
          margin
        });
      });
    });
  }
  return data;
};
