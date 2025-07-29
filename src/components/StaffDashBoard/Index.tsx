"use client";

import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Product {
  productId: string;
  productName: string;
  desc: string;
  category: string;
  costPrice: number;
  quantity: number;
}

export function StaffDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [totalSum, setTotalSum] = useState(0);
  const [totalStockQnt, setTotalStockQnt] = useState(0);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | null;
    direction: "ascending" | "descending" | null;
  }>({ key: null, direction: null });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [lowStockItems, setLowStockItems] = useState(0);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    // toast("Welcome");
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
          {
            method: "GET",
          }
        );

        if (response) {
          const data = await response.json();
          console.log(data);
          setProducts(data.data.products);
          setFilteredProducts(data);
          setLowStockItems(data.data.lowStocksItem);
          setTotalSum(data.data.totalSum);
          setTotalStockQnt(data.data.totalStockQnt);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.productName.toLowerCase().includes(lowerCaseQuery) ||
          product.desc.toLowerCase().includes(lowerCaseQuery) ||
          product.productId.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Sort products
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredProducts(result);
  }, [products, searchQuery, sortConfig, selectedCategory]);

  // Update stock for a selected product
  const updateStock = async () => {
    if (!selectedProduct || newQuantity < 0) return;

    try {
      // In a real app, adjust the URL as needed
      const response = await fetch(
        "https://groceries-to-go-back-end.vercel.app//api/product/fetchDashboardDetails",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: selectedProduct.productId,
            quantity: newQuantity,
          }),
        }
      );

      if (response.ok) {
        const updatedProduct: Product = await response.json();
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.productId === updatedProduct.productId
              ? { ...product, quantity: newQuantity }
              : product
          )
        );
        setIsUpdateModalOpen(false);
        setNewQuantity(0);
        setSelectedProduct(null);
      } else {
        console.error("Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);

      // For demo purposes, update the product locally
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === selectedProduct.productId
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
    let direction: "ascending" | "descending" | null = "ascending";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(new Set(products?.map((product) => product.category))),
  ];
  // console.log(products);

  // Calculate dashboard stats
  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
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
                          {selectedProduct.productName}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {selectedProduct.productId}
                        </p>
                        <p className="text-sm text-gray-500">
                          Current quantity: {selectedProduct.quantity}
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
                  onClick={updateStock}
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
