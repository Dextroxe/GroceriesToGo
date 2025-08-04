"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function SalesReport() {
  const [data, setData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [, setOrderData] = useState({ data: [] });
  const [barChartData, setBarChartData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [taxData, setTaxData] = useState([]);
  const [stockAlertData, setStockAlertData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalTax: 0,
  });

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [productsRes, monthlyRes, ordersRes] = await Promise.all([
        fetch("https://groceries-to-go-back-end.vercel.app/api/data"),
        fetch("https://groceries-to-go-back-end.vercel.app/api/monthlyreport"),
        fetch("https://groceries-to-go-back-end.vercel.app/api/order/orderdproduct"),
      ]);

      const productsData = await productsRes.json();
      const monthlyReportData = await monthlyRes.json();
      const ordersData = await ordersRes.json();

      setData(productsData);
      setMonthlyData(monthlyReportData);
      setOrderData(ordersData);

      // Process data for bar chart (order quantity by product)
      const barChartMap:any = {};
      ordersData?.data?.forEach((item:any) => {
        const name = item?.productInfo?.product_name;
        const quantity = item?.orderInfo?.quantity || 0;

        if (name) {
          if (barChartMap[name]) {
            barChartMap[name] += quantity;
          } else {
            barChartMap[name] = quantity;
          }
        }
      });

      const barChartProcessed:any = Object.entries(barChartMap).map(
        ([productName, quantity]) => ({
          productName,
          quantity,
        })
      );
      setBarChartData(barChartProcessed);

      // Process data for revenue chart
      const revenueMap:any = {};
      ordersData?.data?.forEach((item:any) => {
        const name = item?.productInfo?.product_name;
        const revenue = item?.orderInfo?.subtotal || 0;

        if (name) {
          if (revenueMap[name]) {
            revenueMap[name] += revenue;
          } else {
            revenueMap[name] = revenue;
          }
        }
      });

      const revenueProcessed:any = Object.entries(revenueMap).map(
        ([productName, revenue]:any) => ({
          productName,
          revenue: Number.parseFloat(revenue.toFixed(2)),
        })
      );
      setRevenueData(revenueProcessed);

      // Process data for tax contribution by category
      const taxMap:any = {};
      productsData.forEach((product:any) => {
        const category = product.category;
        const taxRate = product.tax_rate || 0;

        if (category) {
          if (taxMap[category]) {
            taxMap[category] += taxRate;
          } else {
            taxMap[category] = taxRate;
          }
        }
      });

      const taxProcessed:any = Object.entries(taxMap).map(
        ([category, taxRate]:any) => ({
          category,
          taxRate: Number.parseFloat(taxRate.toFixed(2)),
        })
      );
      setTaxData(taxProcessed);

      // Process data for stock alerts
      const stockAlerts = productsData
        .filter(
          (product:any) => product.stock_quantity <= product.reorder_stock_level
        )
        .map((product:any) => ({
          productName: product.product_name,
          currentStock: product.stock_quantity,
          reorderLevel: product.reorder_stock_level,
          stockDifference: product.reorder_stock_level - product.stock_quantity,
        }))
        .sort((a:any, b:any) => b.stockDifference - a.stockDifference);

      setStockAlertData(stockAlerts);

      // Calculate summary statistics
      const totalRevenue = ordersData?.data?.reduce(
        (sum:any, item:any) => sum + (item?.orderInfo?.subtotal || 0),
        0
      );
      const totalOrders = ordersData?.data?.length || 0;
      const totalProducts = productsData.length || 0;
      const totalTax = ordersData?.data?.reduce(
        (sum:any, item:any) => sum + (item?.orderInfo?.tax_cost || 0),
        0
      );

      setSummaryStats({
        totalRevenue: Number.parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        totalProducts,
        totalTax: Number.parseFloat(totalTax.toFixed(2)),
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Sales Performance Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Comprehensive overview of sales, inventory, and product performance
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-emerald-100 p-3 mr-4">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                ${summaryStats.totalRevenue}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">
                {summaryStats.totalOrders}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Products
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {summaryStats.totalProducts}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-amber-100 p-3 mr-4">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tax</p>
              <p className="text-2xl font-bold text-gray-800">
                ${summaryStats.totalTax}
              </p>
            </div>
          </div>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order Quantity Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Order Quantity by Product
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="productName"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} units`, "Quantity"]}
                  />
                  <Legend />
                  <Bar
                    dataKey="quantity"
                    fill="#8884d8"
                    activeBar={<Rectangle fill="#6366F1" stroke="#4F46E5" />}
                  >
                    {barChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}-${entry}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Revenue by Product
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="productName"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    fill="#10B981"
                    activeBar={<Rectangle fill="#059669" stroke="#047857" />}
                  >
                    {revenueData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}-${entry}`}
                        fill={COLORS[(index + 2) % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Stock Quantity Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Stock Quantity by Product
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="product_name"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} units`, "Stock"]} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="stock_quantity"
                    stroke="#6366F1"
                    fill="#A5B4FC"
                    activeDot={{ r: 8 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="reorder_stock_level"
                    stroke="#F59E0B"
                    fill="#FCD34D"
                    activeDot={{ r: 8 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Product Category Distribution
            </h2>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={monthlyData}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ category, count, percent }) =>
                      `${category}: ${count} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={true}
                  >
                    {monthlyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}-${entry}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, props:any) => [
                      `${value} products `,
                      props?.payload?.category,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tax Rate by Category */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Tax Rate by Category
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={taxData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                  <Radar
                    name="Tax Rate"
                    dataKey="taxRate"
                    stroke="#F97316"
                    fill="#FDBA74"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    formatter={(value:any) => [
                      `${(value * 100).toFixed(0)}%`,
                      "Tax Rate",
                    ]}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stock Alert */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Stock Alert
              <span className="ml-2 text-sm font-normal text-gray-500">
                (Products below reorder level)
              </span>
            </h2>
            {stockAlertData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reorder Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockAlertData.map((item:any, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.currentStock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.reorderLevel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.currentStock === 0 ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Out of Stock
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Low Stock
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>All products are above reorder levels</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
