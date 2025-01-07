// /pages/product/[productId].tsx

import React from 'react';
import { useRouter } from 'next/router';

const ProductDetail = () => {
  const router = useRouter();
  const { productId } = router.query;

  return (
    <div>
      <h1>Product Details</h1>
      <p>Showing details for Product ID: {productId}</p>
    </div>
  );
};

export default ProductDetail;
