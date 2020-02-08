import React from 'react';
import { 
    StyleSheet, 
    Image, 
    Button, 
    Text, 
    View,
    ScrollView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = props => {
    // Menerima 'id' dari ProductsOverviewScreen.js
    const productId = props.navigation.getParam('productId');
    // Mencari data dengan 'id' yang didapatkan
    const selectedProducts = useSelector(state => 
        state.products.availableProducts.find(prod => prod.id === productId)
    );
    // initial dispatch
    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image style={styles.image} source={{uri: selectedProducts.imageUrl}}/>
            <View style={styles.actions}>
                <Button
                    color={Colors.primary} 
                    title= "Add to Cart" 
                    // Memanggil function addToCart dari actions/cart.js
                    onPress={() => {
                        dispatch(cartActions.addToCart(selectedProducts));
                    }}
                />
            </View>
            <Text style={styles.price}>${selectedProducts.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProducts.description}</Text>
        </ScrollView>
    );
};

ProductDetailScreen.navigationOptions = navData => {
    return {
        headerTitle: navData.navigation.getParam('productTitle')
    };
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    actions: {
        marginVertical: 10,
        alignItems: 'center'
    },
    price : {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        margin: 20,
        fontFamily: 'open-sans-bold'
    },
    description: {
        fontFamily: 'open-sans',
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20
    }
});

export default ProductDetailScreen;