import React from "react";
import { useParams } from "react-router-dom";
import { useCategories } from "../context/CategoiresContext";
import Gallary from "../components/Gallary";

export default function CategoriesPage() {
  const { categories, products } = useCategories();

  const { categoryId, searchProduct } = useParams();
  if (categories.length === 0) return;

  let filteredProduct;
  const title =
    categoryId === undefined
      ? "best seller"
      : categories.find((category) =>
          category.id === categoryId ? true : false
        )?.name;

  if (searchProduct !== undefined) {
    const [, value] = searchProduct.split("=");
    // productsData = categories.map((category) => {
    //   return [category.projects, category.id];
    // });
    // for (let i = 0; i < products.length; i++) {

    filteredProduct = products.filter(({ title }) => {
      if (title.toLowerCase().includes(value.toLowerCase())) return true;
      return false;
    });
    // }
  }
  return (
    <div className="category-page container">
      {categoryId !== undefined ? (
        <Gallary
          title={title}
          products={products.filter((product) => {
            if (product.category.id === categoryId) return product;
            return null;
          })}
        />
      ) : (
        <Gallary title="Search" products={products} />
      )}
    </div>
  );
}
