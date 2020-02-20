import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import CartItem from '../../models/cart-item';
import { DELETE_PRODUCT } from '../actions/products';

const initialState = {
  items: {},
  totalAmount: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      // definisi product dari function addToCart di actions/cart.js
      const addedProduct = action.product;
      // mengambil atribut price dan title dari Product
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;

      let updatedOrNewCartItem;

      //Jika id Product sudah ada maka membuat CartItem yang baru
      // dengan menambah Quantity dan Sum dengan harga product
      if (state.items[addedProduct.id]) {
        // already have the item in the cart
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
      } else {
        //Jika masing kosong maka Quantity di define 1 dan sum diisi price Product
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }
      return {
        ...state,
        // Mengupdate items dengan updatedOrNewCartItem sesuai dengan id product yang di update
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        // totalAmount yang merupakan total harga ditambahkan lagi dengan harga product
        totalAmount: state.totalAmount + prodPrice
      };
    case REMOVE_FROM_CART:
      // Mengambil id yang diterima removeFromCart di actions/cart.js
      // Kemudian mengambil id product yang berada di Items
      // kemudian disimpan ke selectedCartItem
      const selectedCartItem = state.items[action.pid];
      // mengambil atribut quatity di cart berdasarkan id product
      const currentQty = selectedCartItem.quantity;
      let updatedCartItems;
      // Jika quantity product lebih dari 1
      // maka mengurangi Quantity dan Sum
      if (currentQty > 1) {
        // need to reduce it, not erase it
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
      } else {
        // Jika quantity sama 0
        // definisi updatedCartItems sebagai items
        updatedCartItems = { ...state.items };
        // menghapus Items dengan id product
        delete updatedCartItems[action.pid];
      }
      return {
        ...state,
        // Mengupdate isi items dengan updatedCartItems
        items: updatedCartItems,
        // Mengurangi totalAmount dengan harga product yang dihapus
        totalAmount: state.totalAmount - selectedCartItem.productPrice
      };
    case ADD_ORDER:
      // Ketika mengklik order now maka maka mengosongkan semua cart 
      return initialState;
    case DELETE_PRODUCT:
      // Ketika product utama dihapus maka menghapus juga product yang ada di cart
      // jika id product tidak ada maka maka dibiarkan
      if (!state.items[action.pid]) {
        return state;
      }
      // Jika id product ada didalam items maka product dihapus
      const updatedItems = { ...state.items };
      // mengambil sum dari id product
      const itemTotal = state.items[action.pid].sum;
      // kemudian baru menghapus product
      delete updatedItems[action.pid];
      return {
        // mereturn updatedItems dan mengurangi totalAmount dengan itemTotal yang didapatkan 
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal
      };
  }

  return state;
};
