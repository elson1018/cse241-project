import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import RoleWrapper from '../components/RoleWrapper';
import Toast from '../components/Toast';
import { ShoppingCart, Plus, Edit, Trash2, Ban, Search, Star, Store, Settings } from 'lucide-react';

const Marketplace = () => {
  const { currentUser, appData, updateData } = useAuth();
  const isAdmin = currentUser.role === 'admin';
  const isEntrepreneur = currentUser.role === 'entrepreneur';
  const [selfPromoted, setSelfPromoted] = useState(false);
  const canUseEntrepreneurTools = isEntrepreneur || selfPromoted;

  const [roleView, setRoleView] = useState(
    isEntrepreneur ? 'entrepreneur' : 'user'
  );
  const [activeTab, setActiveTab] = useState(
    isEntrepreneur ? 'storefront' : 'browse'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStorefrontModal, setShowStorefrontModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Handmade Goods',
    price: '',
    image: '',
    description: '',
    isSuspended: false
  });
  const [storefrontData, setStorefrontData] = useState({
    shopName: currentUser?.shopName || '',
    shopDescription: currentUser?.shopDescription || '',
    logo: ''
  });
  const [review, setReview] = useState({ rating: 5, comment: '' });

  const products = appData.products || [];
  const orders = appData.orders || [];

  const categories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category))],
    [products]
  );

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'storefront' && canUseEntrepreneurTools) {
      if (product.isBanned || product.isSuspended) return false;
      return (
        product.sellerId === currentUser.id &&
        matchesCategory &&
        matchesSearch
      );
    }

    if (product.isBanned) return false;
    if (!isAdmin && product.isSuspended) return false;
    return matchesCategory && matchesSearch;
  });

  // Get user's orders
  const userOrders = orders.filter(order => order.buyerId === currentUser.id);
  const entrepreneurOrders = orders.filter(order => {
    const product = products.find(p => p.id === order.productId);
    return product?.sellerId === currentUser.id;
  });

  const handleBuyNow = (product) => {
    if (isAdmin) {
      setToast({ message: 'Administrators can browse only and cannot purchase.', type: 'info' });
      return;
    }
    setSelectedProduct(product);
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = () => {
    if (isAdmin) {
      setToast({ message: 'Administrators cannot complete purchases.', type: 'error' });
      setShowPurchaseModal(false);
      return;
    }

    const newOrder = {
      id: Date.now(),
      buyerId: currentUser.id,
      productId: selectedProduct.id,
      status: 'paid',
      date: new Date().toISOString().split('T')[0],
      total: selectedProduct.price
    };

    updateData('orders', [...orders, newOrder]);
    setShowPurchaseModal(false);
    setSelectedProduct(null);
    setToast({ message: 'Order Processed', type: 'success' });
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    updateData('orders', updatedOrders);
    setToast({ message: `Order status updated to ${newStatus}`, type: 'success' });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      setToast({ message: 'Please fill all required fields', type: 'error' });
      return;
    }

    const product = {
      id: Date.now(),
      ...newProduct,
      price: parseFloat(newProduct.price),
      sellerId: currentUser.id,
      sellerName: currentUser.shopName || currentUser.name,
      reviews: [],
      isBanned: false
    };

    updateData('products', [...products, product]);
    setShowAddModal(false);
    setNewProduct({ name: '', category: 'Handmade Goods', price: '', image: '', description: '' });
    setToast({ message: 'Product added successfully!', type: 'success' });
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      image: product.image,
      description: product.description || ''
    });
    setShowAddModal(true);
  };

  const handleUpdateProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      setToast({ message: 'Please fill all required fields', type: 'error' });
      return;
    }

    const updatedProducts = products.map(p =>
      p.id === selectedProduct.id
        ? {
            ...p,
            name: newProduct.name,
            category: newProduct.category,
            price: parseFloat(newProduct.price),
            image: newProduct.image,
            description: newProduct.description
          }
        : p
    );

    updateData('products', updatedProducts);
    setShowAddModal(false);
    setSelectedProduct(null);
    setNewProduct({ name: '', category: 'Handmade Goods', price: '', image: '', description: '' });
    setToast({ message: 'Product updated successfully!', type: 'success' });
  };

  const handleDeleteProduct = (productId) => {
    updateData('products', products.filter(p => p.id !== productId));
    setToast({ message: 'Product deleted', type: 'success' });
  };

  const handleBanProduct = (productId) => {
    const updatedProducts = products.map(p =>
      p.id === productId ? { ...p, isBanned: true } : p
    );
    updateData('products', updatedProducts);
    setToast({ message: 'Product banned', type: 'info' });
  };

  const handleSuspendProduct = (productId) => {
    const updatedProducts = products.map(p =>
      p.id === productId ? { ...p, isSuspended: true } : p
    );
    updateData('products', updatedProducts);
    setToast({ message: 'Product suspended', type: 'info' });
  };

  const handleUnsuspendProduct = (productId) => {
    const updatedProducts = products.map(p =>
      p.id === productId ? { ...p, isSuspended: false } : p
    );
    updateData('products', updatedProducts);
    setToast({ message: 'Product unsuspended', type: 'success' });
  };

  const handleUpdateStorefront = () => {
    const updatedUsers = appData.users.map(user =>
      user.id === currentUser.id
        ? {
            ...user,
            shopName: storefrontData.shopName,
            shopDescription: storefrontData.shopDescription
          }
        : user
    );
    updateData('users', updatedUsers);
    setShowStorefrontModal(false);
    setToast({ message: 'Storefront updated!', type: 'success' });
  };

  const handleSubmitReview = () => {
    if (!review.comment) {
      setToast({ message: 'Please write a comment', type: 'error' });
      return;
    }

    const updatedProducts = products.map(product => {
      if (product.id === selectedProduct.id) {
        return {
          ...product,
          reviews: [
            ...(product.reviews || []),
            {
              user: currentUser.name,
              userId: currentUser.id,
              rating: review.rating,
              comment: review.comment,
              date: new Date().toISOString()
            }
          ]
        };
      }
      return product;
    });

    updateData('products', updatedProducts);
    setShowReviewModal(false);
    setSelectedProduct(null);
    setReview({ rating: 5, comment: '' });
    setToast({ message: 'Review submitted!', type: 'success' });
  };

  const canReview = (productId) => {
    const order = userOrders.find(o => o.productId === productId && o.status === 'delivered');
    const product = products.find(p => p.id === productId);
    const hasReviewed = product?.reviews?.some(r => r.userId === currentUser.id);
    return order && !hasReviewed;
  };

  const getAverageRating = (product) => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / product.reviews.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Marketplace</h1>
            <p className="text-text-main">Support women entrepreneurs and discover unique products</p>
          </div>
          {canUseEntrepreneurTools && (
            <div className="flex gap-2">
              <Button onClick={() => {
                setStorefrontData({
                  shopName: currentUser.shopName || '',
                  shopDescription: currentUser.shopDescription || '',
                  logo: ''
                });
                setShowStorefrontModal(true);
              }} variant="outline">
                <Settings size={18} className="inline mr-2" />
                Customize Storefront
              </Button>
              <Button onClick={() => {
                setSelectedProduct(null);
                setNewProduct({ name: '', category: 'Handmade Goods', price: '', image: '', description: '' });
                setShowAddModal(true);
              }}>
                <Plus size={20} className="inline mr-2" />
                Add Product
              </Button>
            </div>
          )}
        </div>

        {!isAdmin && (
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-text-main">View as:</span>
            <button
              onClick={() => {
                setRoleView('user');
                setActiveTab('browse');
              }}
              className={`text-sm font-semibold underline-offset-4 ${
                roleView === 'user' ? 'text-primary underline' : 'text-text-main hover:text-primary'
              }`}
            >
              User
            </button>
            <button
              onClick={() => {
                if (!canUseEntrepreneurTools) return;
                setRoleView('entrepreneur');
                setActiveTab('storefront');
              }}
              className={`text-sm font-semibold underline-offset-4 ${
                roleView === 'entrepreneur'
                  ? 'text-primary underline'
                  : canUseEntrepreneurTools
                    ? 'text-text-main hover:text-primary'
                    : 'text-gray-400 cursor-not-allowed'
              }`}
              title={canUseEntrepreneurTools ? 'Switch to entrepreneur tools' : 'Become an entrepreneur to manage storefront'}
            >
              Entrepreneur
            </button>
            {!canUseEntrepreneurTools && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelfPromoted(true);
                  setRoleView('entrepreneur');
                  setActiveTab('storefront');
                }}
              >
                Become an Entrepreneur
              </Button>
            )}
          </div>
        )}

        <div className="flex gap-2 mb-6 border-b border-accent">
          {roleView === 'user' && (
            <>
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                  activeTab === 'browse'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-main hover:text-primary'
                }`}
              >
                Browse Products
              </button>
              {!isAdmin && (
                <button
                  onClick={() => setActiveTab('myOrders')}
                  className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                    activeTab === 'myOrders'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-main hover:text-primary'
                  }`}
                >
                  My Purchases ({userOrders.length})
                </button>
              )}
            </>
          )}

          {roleView === 'entrepreneur' && canUseEntrepreneurTools && (
            <>
              <button
                onClick={() => setActiveTab('storefront')}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                  activeTab === 'storefront'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-main hover:text-primary'
                }`}
              >
                My Storefront
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                  activeTab === 'orders'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-main hover:text-primary'
                }`}
              >
                My Orders ({entrepreneurOrders.length})
              </button>
            </>
          )}
        </div>

        {/* Search Bar + Category Filter */}
        {activeTab === 'browse' && (
          <>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              />
            </div>
            <div className="mb-6 flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedCategory === category
                      ? 'bg-primary text-white border-primary'
                      : 'border-accent text-text-main hover:border-primary'
                  } text-sm font-semibold transition-colors`}
                >
                  {category}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Product Grid */}
        {(activeTab === 'browse' || activeTab === 'storefront') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const avgRating = getAverageRating(product);
              return (
                <Card key={product.id}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold text-primary mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-1">Seller: {product.sellerName}</p>
                  <p className="text-sm text-secondary mb-2">Category: {product.category}</p>
                  
                  {/* Rating Display */}
                  {product.reviews && product.reviews.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= avgRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        {avgRating} ({product.reviews.length})
                      </span>
                    </div>
                  )}

                  <p className="text-2xl font-bold text-primary mb-4">${product.price.toFixed(2)}</p>

                  <div className="flex gap-2 flex-wrap">
                    {activeTab === 'browse' && !isAdmin && (
                      <>
                        <Button
                          variant="primary"
                          onClick={() => handleBuyNow(product)}
                          className="flex-1"
                        >
                          <ShoppingCart size={18} className="inline mr-2" />
                          Buy Now
                        </Button>
                        {canReview(product.id) && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedProduct(product);
                              setReview({ rating: 5, comment: '' });
                              setShowReviewModal(true);
                            }}
                          >
                            <Star size={18} />
                          </Button>
                        )}
                      </>
                    )}
                    {canUseEntrepreneurTools && activeTab === 'storefront' && (
                        <>
                          <Button
                            variant="secondary"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit size={18} />
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </>
                      )}
                    {isAdmin && !product.isBanned && (
                      <>
                        {!product.isSuspended ? (
                          <Button
                            variant="secondary"
                            onClick={() => handleSuspendProduct(product.id)}
                          >
                            <Ban size={18} className="inline mr-1" />
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            onClick={() => handleUnsuspendProduct(product.id)}
                          >
                            <Ban size={18} className="inline mr-1" />
                            Unsuspend
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          onClick={() => handleBanProduct(product.id)}
                        >
                          <Ban size={18} className="inline mr-1" />
                          Ban
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Orders Tab (Entrepreneur) */}
        {activeTab === 'orders' && canUseEntrepreneurTools && (
          <div className="space-y-4">
            {entrepreneurOrders.length === 0 ? (
              <Card>
                <p className="text-center text-text-main py-8">No orders yet</p>
              </Card>
            ) : (
              entrepreneurOrders.map((order) => {
                const product = products.find(p => p.id === order.productId);
                const buyer = appData.users.find(u => u.id === order.buyerId);
                return (
                  <Card key={order.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-text-main">{product?.name || 'Unknown Product'}</h3>
                        <p className="text-sm text-gray-600">Buyer: {buyer?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-600">Date: {order.date}</p>
                        <p className="text-lg font-bold text-primary mt-2">${order.total?.toFixed(2) || product?.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'shipped' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                        {order.status === 'paid' && (
                          <Button
                            variant="secondary"
                            onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                            className="text-sm"
                          >
                            Mark as Shipped
                          </Button>
                        )}
                        {order.status === 'shipped' && (
                          <Button
                            variant="primary"
                            onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                            className="text-sm"
                          >
                            Mark as Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* My Orders Tab (Buyer) */}
        {activeTab === 'myOrders' && (
          <div className="space-y-4">
            {userOrders.length === 0 ? (
              <Card>
                <p className="text-center text-text-main py-8">No orders yet</p>
              </Card>
            ) : (
              userOrders.map((order) => {
                const product = products.find(p => p.id === order.productId);
                return (
                  <Card key={order.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-text-main">{product?.name || 'Unknown Product'}</h3>
                        <p className="text-sm text-gray-600">Seller: {product?.sellerName || 'Unknown'}</p>
                        <p className="text-sm text-gray-600">Date: {order.date}</p>
                        <p className="text-lg font-bold text-primary mt-2">${order.total?.toFixed(2) || product?.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'shipped' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                        {order.status === 'delivered' && canReview(order.productId) && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedProduct(product);
                              setReview({ rating: 5, comment: '' });
                              setShowReviewModal(true);
                            }}
                            className="text-sm"
                          >
                            <Star size={16} className="inline mr-1" />
                            Leave Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {filteredProducts.length === 0 && (activeTab === 'browse' || activeTab === 'storefront') && (
          <div className="text-center py-12">
            <p className="text-text-main text-lg">
              {activeTab === 'storefront' ? 'No products in your storefront yet.' : 'No products found.'}
            </p>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      <Modal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        title="Confirm Purchase"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-xl font-bold text-primary">{selectedProduct.name}</h3>
                <p className="text-gray-600">Seller: {selectedProduct.sellerName}</p>
                <p className="text-2xl font-bold text-primary mt-2">${selectedProduct.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="border-t border-accent pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-text-main">Subtotal</span>
                <span className="font-semibold">${selectedProduct.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-text-main">Shipping</span>
                <span className="font-semibold">$5.00</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-primary border-t border-accent pt-2">
                <span>Total</span>
                <span>${(selectedProduct.price + 5).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="primary" onClick={handleConfirmPurchase} className="flex-1">
                Confirm Purchase
              </Button>
              <Button variant="outline" onClick={() => setShowPurchaseModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedProduct(null);
          setNewProduct({ name: '', category: 'Handmade Goods', price: '', image: '', description: '' });
        }}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Product Name *</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Category</label>
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Handmade Goods">Handmade Goods</option>
              <option value="Food">Food</option>
              <option value="Services">Services</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Price ($) *</label>
            <input
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Description</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Product description"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Image URL</label>
            <input
              type="text"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter image URL"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              onClick={selectedProduct ? handleUpdateProduct : handleAddProduct}
              className="flex-1"
            >
              {selectedProduct ? 'Update Product' : 'Add Product'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setSelectedProduct(null);
                setNewProduct({ name: '', category: 'Handmade Goods', price: '', image: '', description: '' });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Storefront Customization Modal */}
      <Modal
        isOpen={showStorefrontModal}
        onClose={() => setShowStorefrontModal(false)}
        title="Customize Storefront"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Shop Name</label>
            <input
              type="text"
              value={storefrontData.shopName}
              onChange={(e) => setStorefrontData({ ...storefrontData, shopName: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your shop name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Shop Description</label>
            <textarea
              value={storefrontData.shopDescription}
              onChange={(e) => setStorefrontData({ ...storefrontData, shopDescription: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Describe your shop..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Logo URL (Optional)</label>
            <input
              type="text"
              value={storefrontData.logo}
              onChange={(e) => setStorefrontData({ ...storefrontData, logo: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter logo image URL"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleUpdateStorefront} className="flex-1">
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setShowStorefrontModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={`Rate & Review: ${selectedProduct?.name}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReview({ ...review, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Comment</label>
            <textarea
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Share your thoughts about this product..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleSubmitReview} className="flex-1">Submit Review</Button>
            <Button variant="outline" onClick={() => setShowReviewModal(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Marketplace;
