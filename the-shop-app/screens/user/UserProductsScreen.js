import React from 'react';
import { StyleSheet, Text, View, FlatList, Platform, Button, Alert} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = props => {

    // Memanggil reducer products yang sudah didefnisikan di App.js
    // data yang diambil merupakan initial state dari reducer yaitu userProducts
    const UserProducts = useSelector(state => state.products.userProducts);

    //Inisialisasi useDispatch
    const dispatch = useDispatch();

    // Function editProductHandler dengan parameter id dari userProducts
    // menavigasikan ke EditProduct pada ShopNavigator.js
    // dengan mengirimkan productId yang berisikan id userProducts
    const editProductHandler = (id) => {
        props.navigation.navigate('EditProduct', {productId: id});
    };

    // Function deleteHandler dengan parameter id dari userProducts
    // menampilkan Alert untuk memperingatkan apakah yakin ingin 
    // menghapus atau tidak
    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
            {text: 'No', style: 'default'},
            {
                text: 'Yes', 
                style: 'destructive',
                onPress: () => {
                    // Ketika mengklik button maka 
                    // memanggil function deleteProduct pada actions/product.js
                    // dan case DELETE_PRODUCT pada reducers/product.js
                    dispatch(productsActions.deleteProduct(id));
                }
            }
        ]);
    };

    return (
        <FlatList
            // FlatList Memakai data product
            data={UserProducts}
            // Initialisasi keyExtractor
            keyExtractor={item => item.id}
            // Render setiap item pada FlatList 
            renderItem={itemData => (
                // FlatList memakai component 'ProductItem'
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {
                        editProductHandler(itemData.item.id);
                    }}
                >
                    <Button
                        color={Colors.primary}
                        title="Edit"
                        onPress={() => {
                            editProductHandler(itemData.item.id);
                        }}
                    />
                    <Button
                        color={Colors.primary}
                        title="Delete"
                        onPress={deleteHandler.bind(this, itemData.item.id)}
                    />
                </ProductItem>
            )}
        />
    );
};

UserProductsScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Product',
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
                    title='Add' 
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    onPress = {() => {
                        // menavigasikan ke EditProduct pada ShopNavigator.js
                        // tanpa mengirim apapun 
                        navData.navigation.navigate('EditProduct');
                    }}
                />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({});

export default UserProductsScreen;