import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import ReduxThunk from 'redux-thunk';

import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import ordersReducer from './store/reducers/orders';
import ShopNavigator from './navigation/ShopNavigator';

// Fetching Font
const fetchFonts = () => {
  return Font.loadAsync({
      'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
      'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

//Mendefinikan reducer
const rootReducer = combineReducers({
  products: productsReducer,
  cart : cartReducer,
  orders : ordersReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}  
      />
    );
  }
  
  return (
    <Provider store={store}>
      <ShopNavigator/>
    </Provider>
  );
}

// const styles = StyleSheet.create({});
