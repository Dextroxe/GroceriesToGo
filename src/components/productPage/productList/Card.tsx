"use client";

import { useDispatch } from "react-redux";
import { cartActions } from "../../../store/cart";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

export default function ProductCard({
  _id,
  image_url,
  product_name,
  stock_quantity,
  cost_price,
  tax_rate,
  quantity = 0,
  setProducts,
  setFilteredProducts,
}) {
  const dispatch = useDispatch();
  const [cookies] = useCookies(["token"]);

  let role = "";
  let email = "";

  if (cookies.token) {
    const decodeCookie = atob(cookies.token);
    role = JSON.parse(decodeCookie).role;
    email = JSON.parse(decodeCookie).email;
  }

  function handleAddToCart() {
    dispatch(
      cartActions.addItem({
        _id,
        product_name,
        cost_price,
        image_url,
        tax_rate,
      })
    );
    axios
      .post(`https://groceries-to-go-back-end.vercel.app//api/cart?id=${_id}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  function handleIncrement() {
    dispatch(
      cartActions.addItem({
        _id,
        product_name,
        cost_price,
        image_url,
        tax_rate,
      })
    );
    axios
      .post(`https://groceries-to-go-back-end.vercel.app//api/cart?id=${_id}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  function handleDecrement() {
    dispatch(
      cartActions.removeItem({
        _id,
        product_name,
        cost_price,
        image_url,
        tax_rate,
      })
    );
    axios
      .delete(`https://groceries-to-go-back-end.vercel.app//api/cart?id=${_id}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  function handleDelete() {
    const confirmation = confirm(
      "Are your sure you want to delete the product?"
    );
    if (confirmation) {
      dispatch(
        cartActions.deleteItem({ _id, product_name, cost_price, image_url })
      );

      axios
        .delete(`https://groceries-to-go-back-end.vercel.app//api/product/${_id}`)
        .then((res) => {
          console.log(res);
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== _id)
          );
          setFilteredProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== _id)
          );
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Image container with overlay on hover */}
      <div className="relative overflow-hidden h-48">
        <img
          src={image_url || "/placeholder.svg"}
          alt={`${product_name}`}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div> */}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-1 line-clamp-1">
          {product_name}
        </h3>
        <div className="w-12 h-0.5 bg-emerald-500 mb-3"></div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xl font-bold text-emerald-600">
            ${Number.parseFloat(cost_price).toFixed(2)}
          </p>
          <span className="text-xs text-gray-500">
            Tax: {(tax_rate * 100).toFixed(0)}%
          </span>
        </div>

        <div className="mt-auto">
          {quantity !== 0 ? (
            <div className="flex items-center justify-center">
              <button
                onClick={handleDecrement}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={16} className="text-gray-700" />
              </button>

              <span className="mx-4 font-medium text-gray-800">{quantity}</span>

              <button
                onClick={handleIncrement}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={16} className="text-gray-700" />
              </button>
            </div>
          ) : (
            <>
              {role === "admin" ? (
                <button
                  onClick={handleDelete}
                  className="w-full py-2.5 px-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center font-medium"
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={stock_quantity <= 0 ? true : false}
                  className="w-full disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed py-2.5 px-4 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors flex items-center justify-center font-medium"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Add to cart
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
