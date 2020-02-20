import React, { useEffect, useState, useCallback } from 'react';
import { 
  FlatList, 
  Button, 
  Platform, 
  ActivityIndicator, 
  View, 
  StyleSheet, 
  Text
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  // useSelector untuk memanggil state availableProducts di reducers/products.js
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  // fungsi loadProducts untuk menampilkan semua Products
  const loadProducts = useCallback(async () => {
    console.log('LOAD PRODUCTS');
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    }catch(err){
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  // Fungsi yang dioper ke useEffect akan berjalan
  // setelah render dilakukan ke layar. 
  useEffect(() => {
    // addListener('willFocus'); berguna untuk untuk melakukan panggilan API 
    // tambahan saat pengguna mengunjungi kembali layar tertentu di Tab 
    // Navigator, atau untuk melacak pengguna saat mereka mengetuk 
    // aplikasi.
    const willFocusSub = props.navigation.addListener(
      'willFocus', 
      loadProducts
    );

    return () => {
      // Setelah masuk ke layar kemudian focus dilepaskan
      willFocusSub.remove();
    };
  }, [loadProducts]);

  // Ketika menLoad Products maka setIsLoading(true)
  // Setelah load selesai maka diset menjadi false lagi
  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  // Mengirim id dan title products ke ProductDetail
  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title
    });
  };

  // Ketika error message terisi maka
  // Mengeluarkan text dan button untuk reload product kembali
  if (error) {
    return(
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button 
          title='Try again' 
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    )
  }

  // Ketika isLoading bernilai true maka keluar ActivityIndicator
  if (isLoading){
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary}/>
      </View>
    )
  }

  // jika isLoading bernilai false dan products tidak terisi maka keluar pesan
  if (!isLoading && products.length === 0){
    return (
      <View style={styles.centered}>
        <Text>No product found. Maybe start adding some!</Text>
      </View>
    )
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'All Products',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ProductsOverviewScreen;
