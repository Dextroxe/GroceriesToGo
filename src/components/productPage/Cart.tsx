"use client";

import type React from "react";

import {  useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useCookies } from "react-cookie";
import { CreditCard, ShoppingBag, Truck, AlertCircle } from "lucide-react";
import Card from "./productList/Card";

interface Customer {
  name: string;
  phoneNumber: string;
  paymentMethod: string;
}

export default function Cart() {
  const [cookies] = useCookies(["token"]);
  const items = useSelector((state:any) => state.cart.items);
  const totalItems = useSelector((state:any) => state.cart.totalItems);
  const cartTotal = useSelector((state:any) => state.cart.cartTotal);
  const taxCostTotal = useSelector((state:any) => state.cart.taxCostTotal);
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phoneNumber: "",
    paymentMethod: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const subTotal = (
    Math.round((Number(taxCostTotal) + Number(cartTotal)) * 100) / 100
  ).toFixed(2);
  const formattedCartTotal = (Math.round(cartTotal * 100) / 100).toFixed(2);
  const formattedTaxTotal = (Math.round(taxCostTotal * 100) / 100).toFixed(2);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
    setErrorMessage("");
  };

  async function handleBuy() {
    if (totalItems === 0) {
      setErrorMessage("Your cart is empty");
      return;
    }

    if (!customer.name) {
      setErrorMessage("Please enter your name");
      return;
    }

    if (!customer.phoneNumber) {
      setErrorMessage("Please enter your phone number");
      return;
    }

    if (!customer.paymentMethod) {
      setErrorMessage("Please select a payment method");
      return;
    }

    try {
      setIsSubmitting(true);
      const order_id = nanoid();

      if (cookies.token) {
        const decodeCookie = await atob(cookies.token);
        const email = await JSON.parse(decodeCookie).email;

        const response = await fetch("https://groceries-to-go-back-end.vercel.app/api/buy", {
          method: "POST",
          body: JSON.stringify({
            user_id: email,
            order_id: order_id,
            subtotal: subTotal,
            quantity: totalItems,
            tax_cost: 0.02,
            payment_method: customer.paymentMethod,
            phone_number: customer.phoneNumber,
            received_by: customer.name,
          }),
        });

        if (response.ok) {
          localStorage.setItem("order_id", order_id);
          window.location.href = "/receipt";
          navigate("/receipt");
        } else {
          setErrorMessage("Failed to process your order. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error processing order:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 lg:mb-0">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-emerald-500" />
                  Cart Items ({totalItems})
                </h2>
              </div>

              {items.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {items.map((item:any) => (
                    <div key={item._id} className="p-6">
                      <Card {...item} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
              {/* Order Summary */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">
                      ${formattedCartTotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900 font-medium">
                      ${formattedTaxTotal}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-dashed border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-gray-900">
                        Total
                      </span>
                      <span className="text-base font-bold text-emerald-600">
                        ${subTotal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Customer Information
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={customer.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={customer.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        placeholder="Enter your phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="paymentMethod"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Payment Method
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="paymentMethod"
                        name="paymentMethod"
                        value={customer.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        placeholder="Credit Card, Cash, etc."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="px-6 py-3 bg-red-50 border-b border-gray-200">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <div className="p-6">
                <button
                  onClick={handleBuy}
                  disabled={isSubmitting || totalItems === 0}
                  className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors ${
                    (isSubmitting || totalItems === 0) &&
                    "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Truck className="h-5 w-5 mr-2" />
                      Complete Order
                    </>
                  )}
                </button>

                <p className="mt-3 text-xs text-center text-gray-500">
                  By completing your order, you agree to our Terms of Service
                  and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
