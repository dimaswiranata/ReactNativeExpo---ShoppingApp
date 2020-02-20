import Order from "../../models/order";

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    // memanggil userId pada firebase
    const userId = getState().auth.userId;
    try{
      // memanggil respon dari firebase orders berdasarkan userId yang login
      const response = await fetch(
        `https://rn-complete-guide-b15d9.firebaseio.com/orders/${userId}.json`
      );

      // Jika respon tidak berhasil maka mengeluarkan pesan error
      if (!response.ok) {
        throw new Error('Somathing went wrong!');
      }

      // Menyimpan semua data yang ada di response ke resData
      // dalam bentuk json
      const resData = await response.json();
      console.log(resData);
      // Membuat array loadedProducts
      const loadedOrders = [];

      // Memasukan semua data dari resData yang sudah berbentuk JSON
      // ke loadedOrders berdasarkan key untuk membuat 'Orders' yang baru
      for(const key in resData){
        loadedOrders.push(
          new Order(
            key, 
            resData[key].cartItems,
            resData[key].totalAmount, 
            new Date(resData[key].date)
          )
        );
      }
      // Mereturn type, orders(berdasarkan userId)
      dispatch({type: SET_ORDERS, orders: loadedOrders});
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    // Mengambil token yang didapatkan setelah login
    const token = getState().auth.token;
    // memanggil userId pada firebase
    const userId = getState().auth.userId;
    // Membuat waktu order
    const date = new Date();
    // memanggil respon dari firebase orders berdasarkan token dan userId yang login
    const response = await fetch(`https://rn-complete-guide-b15d9.firebaseio.com/orders/${userId}.json?auth=${token}`, {
      // method POST untuk menpush data ke firebase
      method: 'POST',
      // data yang dipost dalam bentuk json
      headers: {
        'Content-Type': 'application/json'
      },
      // penyusunan json sebgai berikut
      body: JSON.stringify({
        cartItems,
        totalAmount,
        date: date.toISOString()
      })
    });

    // Jika respon tidak berhasil maka mengeluarkan pesan error
    if (!response.ok){
      throw new Error('Something went wrong!');
    }

    // Menyimpan semua data yang ada di response ke resData
    // dalam bentuk json
    const resData = await response.json();

    // mereturn type dan orderData beserta atributnya
    dispatch ({
      type: ADD_ORDER,
      orderData: { 
        id : resData.name,
        items: cartItems, 
        amount: totalAmount,
        date: date
      }
    });
  };
};
