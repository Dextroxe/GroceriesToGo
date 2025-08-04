"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import axios from "axios";
import Card from "./Card";
import {
  MicroscopeIcon as MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { useCookies } from "react-cookie";

interface Product {
  _id: string;
  product_name: string;
  price: number;
  description: string;
  image: string;
  // Add other product properties as needed
}

export default function ProdList() {
  const totalItems = useSelector((state: any) => state.cart.totalItems);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cookies, ,] = useCookies(["token"]);
  let role = "";
  let email = "";
  console.warn(role,email)
  if (cookies.token) {
    const decodeCookie = atob(cookies.token);
    role = JSON.parse(decodeCookie).role;
    email = JSON.parse(decodeCookie).email;
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await axios("https://groceries-to-go-back-end.vercel.app/api/product");
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.product_name.toLowerCase().includes(search.toLowerCase().trim())
      )
    );
  }, [search, products]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header with search and buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64 md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* <Link
              to="/newproduct"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Product
            </Link> */}
            {role !== "admin" ? (
              <Link
                to="/cart"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto relative"
              >
                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* No products found */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No products found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {search
                ? `No results for "${search}"`
                : "Try adding some products to get started"}
            </p>
          </div>
        )}

        {/* Product grid */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product._id}
                {...product}
                setProducts={setProducts}
                setFilteredProducts={setFilteredProducts}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
