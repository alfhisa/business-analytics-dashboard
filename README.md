# BeanStream Analytics Dashboard ☕️📈

A premium, interactive business analytics dashboard designed for educational simulations. This project helps students and aspiring data analysts understand real-world business KPIs, trend analysis, and the impact of operational decisions on profitability.

## 🌟 Overview

**BeanStream** is a fictional coffee shop chain with 5 branches. This dashboard provides a 120-day simulation of their performance across multiple platforms (Android & iOS). The simulation is specifically crafted to tell a story: **"The Challenge of Scaling and Profitability."**

### Key Narrative:
*   **Days 1-60**: Healthy growth in users (DAU) and revenue.
*   **Days 61-120**: Aggressive discounting and rising operational costs lead to a significant decline in profit margins, despite continued revenue growth.

## 🚀 Features

### 📊 Business Intelligence Dashboard
*   **Real-time KPIs**: Track Total DAU, Revenue, Orders, and Average Margin with trend comparisons.
*   **Advanced Visualizations**:
    *   **DAU Trend**: Area chart showing user growth over time.
    *   **Revenue vs Profit**: Line chart comparing top-line growth with bottom-line health.
    *   **Discount vs Margin**: Correlation chart showing how promotions impact profitability.
    *   **Conversion Rate**: Analysis of user-to-customer conversion percentages.
    *   **Platform Breakdown**: Pie chart showing user distribution between Android and iOS.
    *   **Branch Performance**: Bar chart ranking branches by total profit.

### 🔍 Interactive Filtering
*   **Branch Filter**: Analyze specific locations (Central Park, Sudirman, Senopati, Kemang, Kelapa Gading).
*   **Platform Filter**: Compare performance between mobile operating systems.
*   **Date Range Selector**: Focus on specific periods to identify turning points in the business.

### 🎓 Educational Tools
*   **Student Activity Questions**: A curated list of questions to guide data analysis and critical thinking.
*   **Teaching Insights**: A toggleable "Revealed" section for instructors to highlight the core learning points and root causes of business trends.

## 🛠 Tech Stack

*   **Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Utilities**: `date-fns`, `clsx`, `tailwind-merge`

## 📂 Project Structure

```text
revou-simulation/
├── src/
│   ├── data.js        # Synthetic data generation logic (the "simulation engine")
│   ├── App.jsx        # Main dashboard component and UI logic
│   ├── index.css      # Tailwind CSS entry point
│   └── main.jsx       # React application entry point
├── public/            # Static assets
└── index.html         # HTML template
```

## ⚙️ Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

---

**© 2026 BeanStream Analytics Dashboard • Crafted by Alfhi**
