"use client";

import { CalendarDays, MapPin, Phone, Printer, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export interface Root {
  success: boolean;
  data: Data;
}

export interface Data {
  receipts: Receipt[];
  items: Item[];
}

export interface Receipt {
  _id: string;
  order_id: string;
  internal_user_id: string;
  payment_method: { type: String };
  phone_number: { type: Number };
  received_by: string;
  tax_cost: number;
  subtotal: number;
  total: number;
  receipt_id: number;
  __v: number;
}

export interface Item {
  item: Item2;
  product: Product;
}

export interface Item2 {
  _id: string;
  order_id: string;
  // internal_user_id: string;

  createdAt: string;
  received_by: string;
  product_id: number;
  quantity: number;
  unit_cost: number;
  tax_cost: number;
  subtotal: number;
  ordered_item_id: number;
  __v: number;
}

export interface Product {
  _id: string;
  image_url: string;
  product_name: string;
  description: string;
  category: string;
  cost_price: number;
  tax_rate: number;
  stock_quantity: number;
  reorder_stock_level: number;
  lifespan: number;
  product_id: number;
  __v: number;
}

export default function ReceiptPage() {
  const [loading, setLoading] = useState(false);
  const [postsState, setPostsState] = useState<Data>([]);
  const orderId = localStorage.getItem("order_id");
  useEffect(() => {
    getData();
  }, [loading]);

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  let role = "";
  let email = "";
  if (cookies.token) {
    const decodeCookie = atob(cookies.token);
    role = JSON.parse(decodeCookie).role;
    email = JSON.parse(decodeCookie).email;
  }
  function printDiv(divId) {
    var printContents = document.getElementById(divId).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
  }

  async function getData() {
    const url = `https://groceries-to-go-back-end.vercel.app//api/receipt/fetch/${orderId}`;
    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      let Root: Root = await response.json();

      const { success, data } = Root;
      await setPostsState(data);
    } catch (error) {
      console.error(error.message);
    }
  }
  postsState?.receipts?.map((element) => {
    console.log(element._id);
  });
  // Sample data - in a real app, this would come from your database or state
  const receipt = {
    id: "INV-2023-1234",
    date: "March 20, 2025",
    cashier: "Someone Name",
    customer: {
      name: "Abhishek kr.",
      phone: "1234-561-233",
    },
    items: [
      {
        id: 1,
        name: "Item 1",
        quantity: 2,
        price: 24.99,
      },
      {
        id: 2,
        name: "Item 2",
        quantity: 1,
        price: 59.99,
      },
      {
        id: 3,
        name: "Item 3",
        quantity: 1,
        price: 29.99,
      },
      {
        id: 4,
        name: "Item 4",
        quantity: 1,
        price: 15.99,
      },
    ],
    subtotal: 155.95,
    tax: 12.48,
    total: 168.43,
    paymentMethod: "Credit Card",
  };

  // Calculate totals
  // const subtotal = receipt.items.reduce(
  //   (sum, item) => sum + item.price * item.quantity,
  //   0
  // );
  const createdAt = postsState.items?.[0].item.createdAt;
  var date = new Date(createdAt);
  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4 "
      id="printableArea"
    >
      <div className="bg-white max-w-2xl w-full mx-auto shadow-sm border rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-md">
                <Receipt className="h-6 w-6" />
              </div>
              <div className="flex flex-col ">
                <h1 className="text-xl font-bold">GroceriesToGo</h1>
                <p className="text-sm text-gray-500">Premium Apparel</p>
              </div>
            </div>
            <div className="flex flex-col items-end text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
                <span>TCS Vanarasi, Vanarasi Region, UP</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-gray-500" />
                <span>(+91) 098765333</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5 text-gray-500" />
                <span>
                  {date.toLocaleString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-gray-200"></div>

          {/* Receipt Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="font-semibold mb-1">Receipt Information</h2>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-500">Receipt No:</span>{" "}
                  {postsState?.receipts?.[0]._id}
                </p>
                <p>
                  <span className="text-gray-500">Cashier:</span> {email}
                </p>
              </div>
            </div>
            <div>
              <h2 className="font-semibold mb-1">Customer</h2>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-500">
                    Name: {postsState?.receipts?.[0].received_by}
                  </span>{" "}
                </p>
                <p>
                  <span className="text-gray-500">Phone:</span>{" "}
                  {postsState?.receipts?.[0].phone_number}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          {console.log(postsState?.items)}
          <div>
            <h2 className="font-semibold mb-2">Purchased Items</h2>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Item
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Qty
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {console.log(postsState)}
                  {postsState?.items?.map((item) => (
                    <tr key={item.item._id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.product.product_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.item.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        $
                        {(
                          Math.round(item.product.cost_price * 100) / 100
                        ).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        $
                        {(item.item.quantity * item.product.cost_price).toFixed(
                          2
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-2 text-sm text-gray-900 text-right font-medium"
                    >
                      Subtotal
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                      ${postsState?.receipts?.[0].subtotal}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-2 text-sm text-gray-900 text-right font-medium"
                    >
                      Tax (8%)
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                      ${postsState?.receipts?.[0].tax_cost}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-2 text-sm text-gray-900 text-right font-bold"
                    >
                      Total
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right font-bold">
                      $
                      {(
                        Math.round(postsState?.receipts?.[0].total * 100) / 100
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">Payment Method</h2>
                <p className="text-sm">
                  {postsState?.receipts?.[0].payment_method}
                </p>
              </div>
              <div className="text-right">
                <h2 className="font-semibold">Amount Paid</h2>
                <p className="text-xl font-bold">
                  $
                  {(
                    Math.round(postsState?.receipts?.[0].total * 100) / 100
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>Thank you for shopping with us!</p>
            <p>
              Returns accepted within 30 days with receipt and original tags.
            </p>
          </div>

          {/* Print Button */}
          <div className="flex justify-center">
            <button
              onClick={() => printDiv("printableArea")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
