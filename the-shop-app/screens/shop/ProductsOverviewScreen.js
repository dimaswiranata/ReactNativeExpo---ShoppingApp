import React from 'react';
import { FlatList, Platform, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
    // memanggil reducer products yang sudah didefnisikan di App.js
    // data yang diambil merupakan initial state dari reducer yaitu availableProducts 
    const products = useSelector(state => state.products.availableProducts);
    // initial dispatch
    const dispatch = useDispatch();

    // Navigasi ke screen 'ProductDetail' dengan membawa
    // parameter 'id' dan title
    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
    };
    
    return (
        // Penerapan FlatList sama seperti recyclerView di
        // android studio
        <FlatList 
            // FlatList Memakai data product
            data={products} 
            // Initialisasi keyExtractor
            keyExtractor={item => item.id}
            // Render setiap item pada FlatList 
            renderItem={itemData => (
                // FlatList memakai component 'ProductItem'
                <ProductItem
                    // Mengisi props image dengan Product.Image
                    image={itemData.item.imageUrl}
                    // Mengisi props image dengan Product.title
                    title={itemData.item.title}
                    // Mengisi props image dengan Product.price
                    price={itemData.item.price}
                    // Mengisi props onPress.onSelect dengan function selectItemHandler
                    onSelect={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title);
                    }}
                >
                    <Button
                        color={Colors.primary}
                        title="View Details"
                        onPress={() => {
                            // Mengisi props onPress dengan function selectItemHandler
                            selectItemHandler(itemData.item.id, itemData.item.title);
                        }}
                    />
                    <Button
                        color={Colors.primary}
                        title="To Cart"
                        onPress={() => {
                            // Memanggil function addToCart dari actions/cart.js
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
                    title='Menu' 
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress = {() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Cart' 
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress = {() => {
                        navData.navigation.navigate('Cart')
                    }}
                />
            </HeaderButtons>
        )
    }
};

export default ProductsOverviewScreen;