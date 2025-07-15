"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  hero_image: string;
  description?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface WishlistItem extends Product {}

interface CartContextType {
  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;

  // Wishlist
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();

  // Load cart from database or localStorage on mount
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      // If not logged in, load from localStorage
      const savedCart = localStorage.getItem("eljo-cart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
        }
      }
    }
  }, [user]);

  // Load wishlist from database when user logs in
  useEffect(() => {
    if (user) {
      loadWishlistFromDatabase();
    } else {
      // If not logged in, try to load from localStorage (for backwards compatibility)
      const savedWishlist = localStorage.getItem("eljo-wishlist");
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist));
        } catch (error) {
          console.error("Error loading wishlist from localStorage:", error);
        }
      } else {
        setWishlistItems([]);
      }
    }
  }, [user]);

  // Save cart to localStorage only if user is not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem("eljo-cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Save wishlist to localStorage only if user is not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem("eljo-wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("cart")
        .select(
          `
          quantity,
          products (
            id,
            title,
            brand,
            category,
            price,
            stock,
            hero_image,
            description
          )
        `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading cart:", error);
        return;
      }

      const cartProducts = data
        .map((item: any) => ({
          ...item.products,
          quantity: item.quantity,
        }))
        .filter(Boolean);

      setCartItems(cartProducts);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const loadWishlistFromDatabase = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select(
          `
          products (
            id,
            title,
            brand,
            category,
            price,
            stock,
            hero_image,
            description
          )
        `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading wishlist:", error);
        return;
      }

      const wishlistProducts = data
        .map((item: any) => item.products)
        .filter(Boolean);

      setWishlistItems(wishlistProducts);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };

  // Updated cart functions
  const addToCart = async (product: Product, quantity: number = 1) => {
    if (user) {
      // Add to database if logged in
      try {
        const { data: existingItem } = await supabase
          .from("cart")
          .select("quantity")
          .eq("user_id", user.id)
          .eq("product_id", product.id)
          .single();

        if (existingItem) {
          // Update existing item
          const newQuantity = Math.min(
            existingItem.quantity + quantity,
            product.stock
          );
          const { error } = await supabase
            .from("cart")
            .update({ quantity: newQuantity })
            .eq("user_id", user.id)
            .eq("product_id", product.id);

          if (error) {
            console.error("Error updating cart:", error);
            return;
          }
        } else {
          // Add new item
          const { error } = await supabase.from("cart").insert([
            {
              user_id: user.id,
              product_id: product.id,
              quantity: Math.min(quantity, product.stock),
            },
          ]);

          if (error) {
            console.error("Error adding to cart:", error);
            return;
          }
        }

        // Update local state
        setCartItems((prevItems) => {
          const existingItem = prevItems.find((item) => item.id === product.id);

          if (existingItem) {
            return prevItems.map((item) =>
              item.id === product.id
                ? {
                    ...item,
                    quantity: Math.min(item.quantity + quantity, product.stock),
                  }
                : item
            );
          } else {
            return [
              ...prevItems,
              { ...product, quantity: Math.min(quantity, product.stock) },
            ];
          }
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      // Add to localStorage if not logged in
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);

        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + quantity, product.stock),
                }
              : item
          );
        } else {
          return [
            ...prevItems,
            { ...product, quantity: Math.min(quantity, product.stock) },
          ];
        }
      });
    }
  };

  const removeFromCart = async (productId: number) => {
    if (user) {
      // Remove from database if logged in
      try {
        const { error } = await supabase
          .from("cart")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) {
          console.error("Error removing from cart:", error);
          return;
        }

        // Update local state
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== productId)
        );
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    } else {
      // Remove from localStorage if not logged in
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (user) {
      // Update in database if logged in
      try {
        const { error } = await supabase
          .from("cart")
          .update({ quantity })
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) {
          console.error("Error updating cart quantity:", error);
          return;
        }

        // Update local state
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.min(quantity, item.stock) }
              : item
          )
        );
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      }
    } else {
      // Update localStorage if not logged in
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      // Clear from database if logged in
      try {
        const { error } = await supabase
          .from("cart")
          .delete()
          .eq("user_id", user.id);

        if (error) {
          console.error("Error clearing cart:", error);
          return;
        }

        setCartItems([]);
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    } else {
      // Clear from localStorage if not logged in
      setCartItems([]);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Updated wishlist functions
  const addToWishlist = async (product: Product) => {
    if (user) {
      // Add to database if logged in
      try {
        const { error } = await supabase.from("wishlist").insert([
          {
            user_id: user.id,
            product_id: product.id,
          },
        ]);

        if (error && error.code !== "23505") {
          // 23505 is unique constraint violation (already exists)
          console.error("Error adding to wishlist:", error);
          return;
        }

        // Update local state
        setWishlistItems((prevItems) => {
          const exists = prevItems.find((item) => item.id === product.id);
          if (!exists) {
            return [...prevItems, product];
          }
          return prevItems;
        });
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    } else {
      // Add to localStorage if not logged in
      setWishlistItems((prevItems) => {
        const exists = prevItems.find((item) => item.id === product.id);
        if (!exists) {
          return [...prevItems, product];
        }
        return prevItems;
      });
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (user) {
      // Remove from database if logged in
      try {
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) {
          console.error("Error removing from wishlist:", error);
          return;
        }

        // Update local state
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.id !== productId)
        );
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    } else {
      // Remove from localStorage if not logged in
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const clearWishlist = async () => {
    if (user) {
      // Clear from database if logged in
      try {
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id);

        if (error) {
          console.error("Error clearing wishlist:", error);
          return;
        }

        setWishlistItems([]);
      } catch (error) {
        console.error("Error clearing wishlist:", error);
      }
    } else {
      // Clear from localStorage if not logged in
      setWishlistItems([]);
    }
  };

  const value: CartContextType = {
    // Cart
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,

    // Wishlist
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
