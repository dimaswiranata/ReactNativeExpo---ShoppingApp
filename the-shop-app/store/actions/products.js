import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

// Function menampilkan product
export const fetchProducts = () => {
  return async (dispatch, getState) => {
    // memanggil userId pada forebase
    const userId = getState().auth.userId;
    // memanggil respon dari firebase products keseluruhan
    try{
      const response = await fetch(
        'https://rn-complete-guide-b15d9.firebaseio.com/products.json'
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
      const loadedProducts = [];
      
      // Memasukan semua data dari resData yang sudah berbentuk JSON
      // ke loadedProduct berdasarkan key untuk membuat 'Product' yang baru
      for(const key in resData){
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }

      // Mereturn type, products(keseluruhan product) dan 
      // userProducts (product yang hanya dimiliki oleh user dengan userId 
      // tercantum )
      dispatch({ 
        type: SET_PRODUCTS, 
        products: loadedProducts, 
        userProducts: loadedProducts.filter(prod => prod.ownerId === userId) 
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

// Function menghapus product yang hanya dimiliki oleh user
export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    // Mengambil token yang didapatkan setelah login
    const token = getState().auth.token;
    // memanggil respon dari firebase dengan mengambil productId berdasarkan token user yang login
    const response = await fetch(
      `https://rn-complete-guide-b15d9.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        // method DELETE untuk action menghapus product dengan productId yang didapatkan
        // dari database firebase
        method: 'DELETE'
      }
    );

    // Jika respon tidak berhasil maka mengeluarkan pesan error
    if (!response.ok){
      throw new Error('Something went wrong!');
    }

    // Mereturn type dan productId yang akan dihapus
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

// Funtion untuk membuat product baru
export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    // Mengambil token yang didapatkan setelah login
    const token = getState().auth.token;
    // memanggil userId pada firebase
    const userId = getState().auth.userId;
    // memanggil respon dari firebase products berdasarkan token user yang login
    const response = await fetch(`https://rn-complete-guide-b15d9.firebaseio.com/products.json?auth=${token}`, {
      // method POST untuk menpush data ke firebase
      method: 'POST',
      // data yang dipost dalam bentuk json
      headers: {
        'Content-Type': 'application/json'
      },
      // penyusunan json sebgai berikut
      // Note : userId yang telah didefinisikan sebagai ownerId 
      // untuk menandakan kepemilikan Product
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price,
        ownerId: userId
      })
    });

    // Menyimpan semua data yang ada di response ke resData
    // dalam bentuk json
    const resData = await response.json();

    // mereturn type dan productData beserta atributnya
    dispatch ({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price,
        ownerId: userId
      }
    });
  };
};

// Function untuk mengupdate atribut pada Product
export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    // Mengambil token yang didapatkan setelah login
    const token = getState().auth.token;
    // memanggil respon dari firebase products berdasarkan token user yang login dan id yang didapatkan
    const response = await fetch(
      `https://rn-complete-guide-b15d9.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        // method PATCH untuk mengupdate atribut dari Product ke firebase
        method: 'PATCH',
        // data yang dipost dalam bentuk json
        headers: {
          'Content-Type': 'application/json'
        },
        // penyusunan json sebgai berikut
        // Note : userId yang telah didefinisikan sebagai ownerId 
        // untuk menandakan kepemilikan Product
        body: JSON.stringify({
          title,
          description,
          imageUrl
        })
      }
    );
    
    // Jika respon tidak berhasil maka mengeluarkan pesan error
    if (!response.ok){
      throw new Error('Something went wrong!');
    }

    // Mereturn type, id dari Product dan atribut Product yang telah di update
    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl
      }
    });
  };
};