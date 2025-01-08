"use client";

import React, { useState, useEffect, CSSProperties } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
}

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    _id: "",
    name: "",
    price: 0,
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.error || "Failed to fetch products.");
      }
    } catch (err) {
      setError("Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => [...prev, data.data]);
        setNewProduct({ _id: "", name: "", price: 0, description: "" });
      } else {
        setError(data.error || "Failed to add product.");
      }
    } catch (err) {
      setError("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((product) => (product._id === id ? data.data : product))
        );
      } else {
        setError(data.error || "Failed to update product.");
      }
    } catch (err) {
      setError("Error updating product.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } else {
        setError(data.error || "Failed to delete product.");
      }
    } catch (err) {
      setError("Error deleting product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Product Manager</h1>
      {loading && <p style={styles.loading}>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.formContainer}>
        <h2 style={styles.subtitle}>Add Product</h2>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
          }
          style={styles.input}
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          style={styles.textarea}
        />
        <button onClick={addProduct} style={styles.button}>
          Add Product
        </button>
      </div>

      <div style={styles.listContainer}>
        <h2 style={styles.subtitle}>Products</h2>
        {products.map((product) => (
          <div key={product._id} style={styles.productCard}>
            <p style={styles.productName}>
              <strong>{product.name}</strong>
            </p>
            <p style={styles.productDetail}>Price: ${product.price}</p>
            <p style={styles.productDetail}>{product.description}</p>
            <button
              onClick={() => updateProduct(product._id, { name: "Updated Name" })}
              style={styles.button}
            >
              Update
            </button>
            <button
              onClick={() => deleteProduct(product._id)}
              style={{ ...styles.button, backgroundColor: "#dc3545" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "1rem",
    fontFamily: "'Arial', sans-serif",
  },
  title: {
    textAlign: "center",
    color: "white",
  },
  loading: {
    textAlign: "center",
    color: "#007bff",
  },
  error: {
    textAlign: "center",
    color: "red",
  },
  formContainer: {
    backgroundColor: "black",
    padding: "1rem",
    borderRadius: "5px",
    marginBottom: "2rem",
  },
  subtitle: {
    color: "white",
  },
  input: {
    display: "block",
    width: "100%",
    marginBottom: "1rem",
    padding: "0.5rem",
    borderRadius: "5px",
    border: "1px solid black",
    color: "black"
  },
  textarea: {
    display: "block",
    width: "100%",
    marginBottom: "1rem",
    padding: "0.5rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    color: "black"
  },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  listContainer: {
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    borderRadius: "5px",
    color: "black"
  },
  productCard: {
    marginBottom: "1rem",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  productName: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
  },
  productDetail: {
    marginBottom: "0.5rem",
  },
};

export default ProductManager;
