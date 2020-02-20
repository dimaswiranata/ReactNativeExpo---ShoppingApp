import PRODUCTS from '../../data/dummy-data';
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  SET_PRODUCTS
} from '../actions/products';
import Product from '../../models/product';

const initialState = {
  availableProducts: [],
  userProducts: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    // Memanggil action tyoe pada function fetch di actions/products.js 
    case SET_PRODUCTS:
      return {
        // mereturn 'products' yang merupakan keseleruhan product
        availableProducts: action.products,
        // mereturn 'userProducts' yang merupakan product yang dimiliki user
        userProducts: action.userProducts
      };
    case CREATE_PRODUCT:
      // membuat product baru berdasarkan data yang didapatkan dari function 
      // createProduct pada actions/products.js
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct)
      };
    case UPDATE_PRODUCT:
      // Mencari index dari userProducts berdasarkan productId yang diterima lalu disimpan ke productIndex
      const productIndex = state.userProducts.findIndex(
        prod => prod.id === action.pid
      );

      // Memasukan update dari atribut product ke updatedProduct
      const updatedProduct = new Product(
        action.pid,
        state.userProducts[productIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[productIndex].price
      );

      // Inisialisasi userProducts ke updatedUserProducts
      const updatedUserProducts = [...state.userProducts];
      // Mengisi updatedUserProducts pada index yang tentukan dengan updatedProduct 
      updatedUserProducts[productIndex] = updatedProduct;
      // Mencari index dari availableProducts berdasarkan productId yang diterima lalu disimpan ke availableProductIndex
      const availableProductIndex = state.availableProducts.findIndex(
        prod => prod.id === action.pid
      );
      // Inisialisasi availableProducts ke updatedAvailableProducts
      const updatedAvailableProducts = [...state.availableProducts];
      // Mengisi updatedAvailableProducts pada index yang tentukan dengan updatedProduct
      updatedAvailableProducts[availableProductIndex] = updatedProduct;
      return {
        // Mereturn availableProducts dan userProducts dengan update data terbaru
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts
      };
    case DELETE_PRODUCT:
      return {
        // Menfilter Product yang tidak sama dengan productId yang didapatkan
        ...state,
        userProducts: state.userProducts.filter(
          product => product.id !== action.pid
        ),
        availableProducts: state.availableProducts.filter(
          product => product.id !== action.pid
        )
      };
  }
  return state;
};
