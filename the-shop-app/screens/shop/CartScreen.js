import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/orders';

const CartScreen = props => {
  // Mendapatkan 'totalAmount' dari reducers/cart.js
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
  // Mendapatkan 'items' dari reducers/cart.js
  const cartItems = useSelector(state => {
    // Initial array transformedCartItems
    const transformedCartItems = [];
    // Perulangan untuk mengambil semua 'items' dari reducers/cart.js
    // ke cartItems
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  // initial dispatch
  const dispatch = useDispatch();

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{' '}
          <Text 
            style={styles.amount}
            // Function Math untuk menjaga total print tetap positif
          >
            ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        <Button
          color={Colors.accent}
          title="Order Now"
          // Button 'Order Now' akan disabled ketika cartItems kosong
          disabled={cartItems.length === 0}
          onPress={() => {
            // Memanggil function addOrder pada actions/orders.js 
            // dengan mengosongkan 'items' dan 'totalAmount'
            // dan membuat new Order()
            dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
          }}
        />
      </Card>
      <FlatList
        // FlatList Memakai data cartItems
        data={cartItems}
        // Initialisasi keyExtractor
        keyExtractor={item => item.productId}
        // Render setiap item pada FlatList
        renderItem={itemData => (
          <CartItem
            // Mengisi props image dengan CartItem.quantity
            quantity={itemData.item.quantity}
            // Mengisi props image dengan CartItem.productTitle
            title={itemData.item.productTitle}
            // Mengisi props image dengan CartItem.sum
            amount={itemData.item.sum}
            deletable
            onRemove={() => {
              // Memanggil function removeFromCart() pada actions/cart.js
              // dengan mengurangi atau menghapus 
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: 'Your Cart'
};

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10
  },
  summaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18
  },
  amount: {
    color: Colors.primary
  }
});

export default CartScreen;