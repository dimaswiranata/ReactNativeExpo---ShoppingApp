import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import CartItem from '../../models/cart-item';
import { DELETE_PRODUCT } from '../actions/products';

const initialState = {
  //Initial 'items' sebagai tempat Cartitem baru dan
  //'totalAmount' sebagai total price 
  items: {},
  totalAmount: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      //Initial 'addedProduct' sebagai addToCart.product 
      // (pada actions/cart.js)
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;

      let updatedOrNewCartItem;

      if (state.items[addedProduct.id]) {
        // already have the item in the cart
        // CartItem dengan penambahan quantity dan sum
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
      } else {
        // Membuat CartItem baru
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }
      return {
        //Mengembalikan items dan totalAmount yang baru
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: state.totalAmount + prodPrice
      };
    case REMOVE_FROM_CART:
      // Memanggil 'items' sesuai dengan 'productId'
      const selectedCartItem = state.items[action.pid];
      // Initial 'items.quantity'
      const currentQty = selectedCartItem.quantity;
      let updatedCartItems;

      // Jika items.quantity > 1 maka mengurangi 'items'
      if (currentQty > 1) {
        // need to reduce it, not erase it
        // Membuat new CartItem() dengan mengurangi items.quantity dan items.sum
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
      } else {
        // Jika items.quantity = 1 maka langsung menghapus 'items'
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pid];
      }
      return {
        ...state,
        items: updatedCartItems,
        // Mengurangi Total Price
        totalAmount: state.totalAmount - selectedCartItem.productPrice
      };
    case ADD_ORDER:
      // Mengembalikan 'items' dan 'totalAmount' menjadi NULL
      return initialState;
    case DELETE_PRODUCT:
      if (!state.items[action.pid]){
        return state;
      }
      const updatedItems = {...state.items};
      const itemTotal = state.items[action.pid].sum;
      delete updatedItems[action.pid];
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal
      };
  }

  return state;
};