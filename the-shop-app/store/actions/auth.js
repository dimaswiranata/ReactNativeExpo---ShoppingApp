import { AsyncStorage } from 'react-native';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

export const authenticate = (userId, token) => {
  return { type: AUTHENTICATE, userId: userId, token: token };
};

export const signup = (email, password) => {
  return async dispatch => {
    // Memanggil Auth Firebase 
    // Dokumentasi => https://firebase.google.com/docs/reference/rest/auth
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAst2tlZEn3Sbyz_t1BoCdwSU4l3Pu9i6E',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    // Jika respon tidak berhasil maka mengeluarkan pesan error
    if (!response.ok) {
      const errorResData = await response.json();
      // Memasukan error message ( bisa dilihat diconsole log )
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email exists already!';
      }
      throw new Error(message);
    }

    // Menyimpan semua data yang ada di response ke resData
    // dalam bentuk json 
    const resData = await response.json();
    console.log(resData);
    // Memasukan userId(resData.localId) dan token(resData.idToken) 
    // ke authenticate (dilihat di console.log)
    dispatch(authenticate(resData.localId, resData.idToken));
    // Lama waktu biar autoLogin
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    // Menyimpan token, userId dan lama waktu biar autoLogin ke saveDataToStorage
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async dispatch => {
    // Memanggil Auth Firebase 
    // Dokumentasi => https://firebase.google.com/docs/reference/rest/auth
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAst2tlZEn3Sbyz_t1BoCdwSU4l3Pu9i6E',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    // Jika respon tidak berhasil maka mengeluarkan pesan error
    if (!response.ok) {
      const errorResData = await response.json();
      // Memasukan error message ( bisa dilihat diconsole log )
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found!';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid!';
      }
      throw new Error(message);
    }

    // Menyimpan semua data yang ada di response ke resData
    // dalam bentuk json
    const resData = await response.json();
    console.log(resData);
    // Memasukan userId(resData.localId) dan token(resData.idToken) 
    // ke authenticate (dilihat di console.log)
    dispatch(authenticate(resData.localId, resData.idToken));
    // Lama waktu biar autoLogin
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    // Menyimpan token, userId dan lama waktu biar autoLogin ke saveDataToStorage
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const logout = () => {
    return { type : LOGOUT }
};

const saveDataToStorage = (token, userId, expirationDate) => {
  // AsyncStorage adalah sistem penyimpanan nilai kunci yang tidak 
  // dienkripsi, asinkron, persisten, dan bersifat global untuk aplikasi.
  // https://facebook.github.io/react-native/docs/asyncstorage
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString()
    })
  );
};