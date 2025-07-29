"use client";

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

interface Product {
  product_id: string;
  product_name: string;
  description: string;
  category: string;
  cost_price: number;
  stock_quantity: number;
}

export function ManagerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | null;
    direction: "ascending" | "descriptionending" | null;
  }>({ key: null, direction: null });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterCategory, setFilteredCategory] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [totalStockQnt, setTotalStockQnt] = useState(0);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // In a real app, adjust the URL as needed
        const response = await fetch(
          "https://groceries-to-go-back-end.vercel.app//api/product/fetchDashboardDetails",
          { method: "GET" }
        );
        if (response.ok) {
          const data: Product[] = await response.json();
          setProducts([data]);
          setFilteredProducts([data]);
          setFilteredCategory(data?.data?.products);
          setLowStockItems(data.data.lowStocksItem);
          setTotalSum(data.data.totalSum);
          setTotalStockQnt(data.data.totalStockQnt);
          // const data= await response.json();
          // console.log(data);
          // setProducts(data.data.products);
          // setFilteredProducts(data);
          // setLowStockItems(data.data.setLowStockItems);
          // setTotalSum(data.data.totalSum);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate API call with mock data for demonstration
    setTimeout(() => {
      // setProducts(mockProducts);
      // setFilteredProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
    fetchProducts();
  }, [isUpdateModalOpen]);

  // Filter and sort products
  useEffect(() => {
    let result = filterCategory;
    // let newResult = [];
    // Filter by category
    if (selectedCategory !== "all") {
      // setFilteredCategory(products?.[0]?.data?.products);
      setFilteredCategory(
        products?.[0]?.data?.products.filter((product) =>
          product.category
            ?.toLowerCase()
            .includes(selectedCategory?.toLowerCase())
        )
      );
    } else {
      setFilteredCategory(products?.[0]?.data?.products);
    }
    // console.log(products?.[0]?.data?.products);
    // console.log({ result });
    // const copyFilter = filterCategory;
    // setFilteredCategory(
    //   copyFilter.filter((product) =>
    //     product.product_name.toLowerCase().includes(search.toLowerCase().trim())
    //   )
    // );
    // if (search === "") {
    //   setFilteredCategory(filterCategory);
    // }
    // Filter by search query
    if (search) {
      const lowerCaseQuery = search.toLowerCase();
      setFilteredCategory(
        products?.[0]?.data?.products?.filter((product) =>
          product.product_name.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
    // Sort products
    // if (sortConfig.key && sortConfig.direction) {
    //   result.sort((a, b) => {
    //     if (a[sortConfig.key!] < b[sortConfig.key!]) {
    //       return sortConfig.direction === "ascending" ? -1 : 1;
    //     }
    //     if (a[sortConfig.key!] > b[sortConfig.key!]) {
    //       return sortConfig.direction === "ascending" ? 1 : -1;
    //     }
    //     return 0;
    //   });
    // }
    // setFilteredProducts(result);
  }, [selectedCategory, search]);

  // Update stock for a selected product
  const updateStock = async (product_id, newQuantity) => {
    if (!selectedProduct || newQuantity < 0) return;
    console.log(product_id, newQuantity);
    try {
      const response = await fetch("https://groceries-to-go-back-end.vercel.app//api/product/update", {
        method: "POST",
        body: JSON.stringify({
          product_id: product_id,
          stock_quantity: newQuantity,
        }),
      });

      if (response.ok) {
        const updatedProduct: Product = await response.json();
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.product_id === updatedProduct.product_id
              ? { ...product, quantity: newQuantity }
              : product
          )
        );
        setIsUpdateModalOpen(false);
        setNewQuantity(0);
        setSelectedProduct(null);
        setIsUserMenuOpen(false);
      } else {
        console.error("Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);

      // For demo purposes, update the product locally
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.product_id === selectedProduct.product_id
            ? { ...product, quantity: newQuantity }
            : product
        )
      );
      setIsUpdateModalOpen(false);
      setNewQuantity(0);
      setSelectedProduct(null);
    }
  };

  // Handle sorting
  const requestSort = (key: keyof Product) => {
    let direction: "ascending" | "descriptionending" | null = "ascending";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descriptionending";
      } else if (sortConfig.direction === "descriptionending") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(
      new Set(products?.[0]?.data.products?.map((product) => product.category))
    ),
  ];
  console.log(categories);
  console.log(products);

  // Calculate dashboard stats
  const totalProducts =
    products.length > 0 && products[0].data.products
      ? products[0].data.products.length
      : 0;
  const totalStock = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
  const lowStockCount = products.filter(
    (product) => product.quantity < 10
  ).length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.costPrice * product.quantity,
    0
  );

  // Get sort indicator
  const getSortIndicator = (key: keyof Product) => {
    if (sortConfig.key !== key) return null;

    return sortConfig.direction === "ascending" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-1 h-4 w-4 inline"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-1 h-4 w-4 inline"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">
                Total Products
              </h3>
              <p className="mt-2 text-2xl font-bold">{totalProducts}</p>
              <p className="mt-1 text-xs text-gray-500">
                Across {categories.length - 1} categories
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">
                Total Stock Quantity
              </h3>
              <p className="mt-2 text-2xl font-bold">{totalStockQnt}</p>
              <p className="mt-1 text-xs text-gray-500">Items in inventory</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">
                Low Stock Items
              </h3>
              <p className="mt-2 text-2xl font-bold">{lowStockItems}</p>
              <p className="mt-1 text-xs text-gray-500">
                Items that need to reorder
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">
                Inventory Value
              </h3>
              <p className="mt-2 text-2xl font-bold">${totalSum.toFixed(2)}</p>
              <p className="mt-1 text-xs text-gray-500">
                Total cost of inventory
              </p>
            </div>
          </div>

          {/* Product Table */}
          <div className="mt-6">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Product Inventory
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your product stock and inventory details
                </p>
              </div>

              <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:max-w-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                      type="search"
                      placeholder="Search products..."
                      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative" ref={categoryDropdownRef}>
                      <button
                        onClick={() =>
                          setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                        }
                        className="inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-40"
                      >
                        {selectedCategory === "all"
                          ? "All Categories"
                          : selectedCategory}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-2 h-4 w-4"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                      {isCategoryDropdownOpen && (
                        <div className="absolute right-0 z-10 mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 overflow-auto">
                          {categories.map((category) => (
                            <button
                              key={category}
                              onClick={() => {
                                setSelectedCategory(category);
                                setIsCategoryDropdownOpen(false);
                              }}
                              className={`block w-full px-4 py-2 text-left text-sm ${
                                selectedCategory === category
                                  ? "bg-blue-100 text-blue-900"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {category === "all" ? "All Categories" : category}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* <div className="relative" ref={filterDropdownRef}>
                      <button
                        onClick={() =>
                          setIsFilterDropdownOpen(!isFilterDropdownOpen)
                        }
                        className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4"
                        >
                          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                        </svg>
                        Filter
                      </button>
                      {isFilterDropdownOpen && (
                        <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="py-1">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                              Filter by
                            </div>
                            <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              Low Stock First
                            </button>
                            <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              High Stock First
                            </button>
                            <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              Price: Low to High
                            </button>
                            <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              Price: High to Low
                            </button>
                          </div>
                        </div>
                      )}
                    </div> */}
                  </div>
                </div>

                {/* Product Table */}
                <div className="mt-6 overflow-hidden rounded-md border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {/* <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("product_id")}
                        >
                          <div className="flex items-center">
                            Product ID
                            {getSortIndicator("product_id")}
                          </div>
                        </th> */}
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("product_name")}
                        >
                          <div className="flex items-center">
                            Product Name
                            {getSortIndicator("product_name")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("category")}
                        >
                          <div className="flex items-center">
                            Category
                            {getSortIndicator("category")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("costPrice")}
                        >
                          <div className="flex items-center justify-end">
                            Cost Price
                            {getSortIndicator("costPrice")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          // onClick={() => requestSort("costPrice")}
                        >
                          <div className="flex items-center justify-end">
                            threshold qty
                            {/* {getSortIndicator("costPrice")} */}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("quantity")}
                        >
                          <div className="flex items-center justify-end">
                            Quantity
                            {getSortIndicator("quantity")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            Loading products...
                          </td>
                        </tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            No products found.
                          </td>
                        </tr>
                      ) : (
                        filterCategory?.map((product, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {product?.product_id}
                            </td> */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product?.product_name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {product?.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              ${product.cost_price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              {product.reorder_stock_level}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              <div className="flex items-center justify-end">
                                {product?.stock_quantity <
                                product?.reorder_stock_level ? (
                                  <span className="inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Low
                                  </span>
                                ) : null}
                                {product?.stock_quantity}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  console.log({ product });
                                  setNewQuantity(product?.stock_quantity);
                                  setIsUpdateModalOpen(true);
                                }}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Update Stock
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled
                    >
                      Previous
                    </button>
                    <button
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {filteredProducts.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">{products.length}</span>{" "}
                        products
                      </p>
                    </div>
                    <div>
                      <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                      >
                        <button
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled
                        >
                          <span className="sr-only">Previous</span>
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Stock Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsUpdateModalOpen(false)}
            ></div>
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Update Stock Quantity
                    </h3>
                    {selectedProduct && (
                      <div className="mt-2">
                        <p className="font-medium">
                          {selectedProduct?.product_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {selectedProduct?.product_id}
                        </p>
                        <p className="text-sm text-gray-500">
                          Current quantity: {selectedProduct.stock_quantity}
                        </p>
                      </div>
                    )}
                    <div className="mt-4">
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700"
                      >
                        New Quantity
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(Number(e.target.value))}
                        min={0}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                      />
                      {newQuantity < 0 && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mr-1"
                          >
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                          </svg>
                          Quantity cannot be negative
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    updateStock(selectedProduct?.product_id, newQuantity);
                  }}
                  disabled={newQuantity < 0}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Stock
                </button>
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
