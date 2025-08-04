import { useRef } from "react";
import styles from "./NewProduct.module.css";
import { useNavigate } from "react-router";
import axios from "axios";

export default function UpdateProduct() {
  const nameRef: any = useRef(null);
  const priceRef: any = useRef(null);
  const descRef: any = useRef(null);
  const categoriesRef: any = useRef(null);
  const imageRef: any = useRef(null);

  const navigate = useNavigate();

  function handleSubmit(e:any) {
    e.preventDefault();
    axios
      .post("https://groceries-to-go-back-end.vercel.app/api/product", {
        name: nameRef.current.value,
        price: priceRef.current.value,
        description: descRef.current.value,
        category: categoriesRef.current.value,
        image_url: imageRef.current.value,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    navigate("/");
  }

  return (
    <main className={styles.main}>
      <h2 className={styles.header}>Update Product</h2>
      <form
        action={`https://groceries-to-go-back-end.vercel.app/api/product`}
        method="post"
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">Product Name</label>
        <input type="text" name="name" id="name" ref={nameRef} />
        <label htmlFor="price">Price</label>
        <input type="text" name="price" id="price" ref={priceRef} />
        <label htmlFor="description">Description</label>
        <input type="text" name="description" id="description" ref={descRef} />
        <label htmlFor="categories">Category</label>
        <input
          type="text"
          name="categories"
          id="categories"
          ref={categoriesRef}
        />
        <label htmlFor="imageURL">Image URL</label>
        <input type="text" name="imageUrl" id="imageURL" ref={imageRef} />
        <button className={styles.btn}>Submit</button>
      </form>
    </main>
  );
}
