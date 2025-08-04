"use client";

import type React from "react";
import { useRef, useState } from "react";
// import { useRouter } from "next/navigation"
import axios from "axios";
import productImg from "../../assets/productImg.png";
import { useNavigate } from "react-router-dom";

export default function NewProduct() {
  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const categoriesRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const taxRateRef = useRef<HTMLInputElement>(null);
  const stockQuantityRef = useRef<HTMLInputElement>(null);
  const stockThresholdRef = useRef<HTMLInputElement>(null);
  const lifespanRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageError, setImageError] = useState<boolean>(false);

  // Handle image URL change
  const handleImageUrlChange = () => {
    if (imageRef.current) {
      setImageUrl(imageRef.current.value);
      setImageError(false);
    }
  };

  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    axios
      .post("https://groceries-to-go-back-end.vercel.app/api/product", {
        image_url: imageRef.current?.value,
        product_name: nameRef.current?.value,
        description: descRef.current?.value,
        category: categoriesRef.current?.value,
        cost_price: priceRef.current?.value,
        tax_rate: taxRateRef.current?.value,
        stock_quantity: stockQuantityRef.current?.value,
        reorder_stock_level: stockThresholdRef.current?.value,
        lifespan: lifespanRef.current?.value,
      })
      .then((res) => {
        console.log(res);
        navigate("/products");
        // router.push("/products")
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="container mx-auto px-4 h-full flex w-full flex-row gap-4">
      {imageUrl ? (
        <div className="flex-1 w-[8rem] h-[49rem]">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Product preview"
            className="object-cover w-full h-full"
            onError={() => setImageError(true)}
            style={{ display: imageError ? "none" : "block" }}
          />
          {imageError && (
            <div className="flex-1 w-[8rem] h-[49rem]">
              <img src={productImg} className="object-cover w-full h-full " />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 w-[8rem] h-[49rem]">
          <img src={productImg} className="object-cover w-full h-full " />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden flex-1 h-full">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Product Name
                </label>
                <input
                  id="name"
                  ref={nameRef}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Price
                </label>
                <input
                  id="price"
                  ref={priceRef}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Description
                </label>
                <input
                  id="description"
                  ref={descRef}
                  placeholder="Product description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="categories"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Category
                </label>
                <input
                  id="categories"
                  ref={categoriesRef}
                  placeholder="Product category"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="imageURL"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Image URL
                </label>
                <input
                  id="imageURL"
                  ref={imageRef}
                  placeholder="https://example.com/image.jpg"
                  onChange={handleImageUrlChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="taxRate"
                    className="block text-sm font-medium text-gray-700 text-left"
                  >
                    Tax Rate (%)
                  </label>
                  <input
                    id="taxRate"
                    ref={taxRateRef}
                    placeholder="0.00"
                    className="w-full text-left px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="stockQuantity"
                    className="block text-sm font-medium text-gray-700 text-left"
                  >
                    Stock Quantity
                  </label>
                  <input
                    id="stockQuantity"
                    ref={stockQuantityRef}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="stockThreshold"
                    className="block text-sm font-medium text-gray-700 text-left"
                  >
                    Reorder Level
                  </label>
                  <input
                    id="stockThreshold"
                    ref={stockThresholdRef}
                    placeholder="0"
                    className="w-full px-4 text-left py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lifespan"
                    className="block text-sm font-medium text-gray-700 text-left"
                  >
                    Lifespan (days)
                  </label>
                  <input
                    id="lifespan"
                    ref={lifespanRef}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
