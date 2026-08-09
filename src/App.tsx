import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Menu } from './components/Menu';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { LocationSection } from './components/LocationSection';
import { ContactSection } from './components/ContactSection';
import { AdminConfigModal } from './components/AdminConfigModal';
import { Footer } from './components/Footer';

import { Product, CartItem, BusinessConfig, Order } from './types';
import { INITIAL_PRODUCTS, INITIAL_CONFIG } from './data/initialData';

export default function App() {
  // Products state with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cafeking_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved products', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Business Config state with localStorage persistence
  const [config, setConfig] = useState<BusinessConfig>(() => {
    const saved = localStorage.getItem('cafeking_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved config', e);
      }
    }
    return INITIAL_CONFIG;
  });

  // Cart state with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cafeking_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved cart', e);
      }
    }
    return [];
  });

  // Modals visibility state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('cafeking_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cafeking_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('cafeking_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart Actions
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  const handleCompleteOrder = (order: Order) => {
    setIsPaymentOpen(false);
    setCompletedOrder(order);
    handleClearCart();
  };

  // Admin Actions
  const handleSaveConfig = (updatedConfig: BusinessConfig) => {
    setConfig(updatedConfig);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF3E3] text-[#3B2418] font-sans selection:bg-[#F3E5C8] selection:text-[#3B2418]">
      
      {/* Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        config={config}
      />

      {/* Main Content Sections */}
      <main>
        <Hero />
        <About />
        <Menu
          products={products}
          onAddToCart={handleAddToCart}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
        <LocationSection config={config} />
        <ContactSection config={config} />
      </main>

      {/* Footer */}
      <Footer config={config} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout & Payment Method Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        cartItems={cart}
        config={config}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* Order Confirmation Receipt Modal */}
      <OrderConfirmationModal
        order={completedOrder}
        config={config}
        onClose={() => setCompletedOrder(null)}
      />

      {/* Admin Settings Modal */}
      <AdminConfigModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
      />

    </div>
  );
}
