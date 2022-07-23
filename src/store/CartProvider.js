import { useReducer } from 'react';
import CartContext from './cart-context';

const initialState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      let updatedItemsAfterAdd;
      if (state.items.find((item) => item.id === action.payload.id)) {
        // If item already exists in cart, increase the quantity
        updatedItemsAfterAdd = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // else, add new item to cart
        updatedItemsAfterAdd = [...state.items, action.payload];
      }
      return {
        items: updatedItemsAfterAdd,
        totalAmount:
          state.totalAmount + action.payload.price * action.payload.quantity,
      };
    case 'REMOVE_ITEM':
      const itemIndex = state.items.findIndex((item) => item.id === action.id);
      const itemToRemove = state.items[itemIndex];
      let updatedItemsAfterRemove;
      if (itemToRemove.quantity === 1) {
        // if it is the last item in the cart, remove it
        updatedItemsAfterRemove = state.items.filter(
          (item) => item.id !== action.id
        );
      } else {
        // else reduce the quantity by 1
        updatedItemsAfterRemove = [...state.items];
        updatedItemsAfterRemove[itemIndex] = {
          ...itemToRemove,
          quantity: itemToRemove.quantity - 1,
        };
      }

      return {
        items: updatedItemsAfterRemove,
        totalAmount: state.totalAmount - itemToRemove.price,
      };
    case 'CLEAR_CART':
      return {
        items: [],
        totalAmount: 0,
      };
    default:
      return state;
  }
};

const CartProvider = (props) => {
  const [cart, dispatchCart] = useReducer(cartReducer, initialState);

  const addItemsToCartHandler = (itemObject) => {
    dispatchCart({
      type: 'ADD_ITEM',
      payload: itemObject,
    });
  };

  const removeItemsFromCartHandler = (id) => {
    dispatchCart({
      type: 'REMOVE_ITEM',
      id: id,
    });
  };

  const cartContext = {
    items: cart.items,
    totalAmount: cart.totalAmount,
    addItem: addItemsToCartHandler,
    removeItem: removeItemsFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
