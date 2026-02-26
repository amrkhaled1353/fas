import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/storefront/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
    const { products, categories, banners, settings, loading } = useStore();

    if (loading) return <div className="loading">Loading...</div>;

    const activeBanners = banners.filter(b => b.active);
    const trendingProducts = products.filter(p => p.isTrending);
    const popularProducts = products.filter(p => p.isPopular);

    const isSliderMode = settings?.productDisplayMode === 'slider';

    const renderProducts = (productList) => {
        if (isSliderMode) {
            return (
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={30}
                    breakpoints={{
                        320: { slidesPerView: 2, spaceBetween: 15 },
                        768: { slidesPerView: settings?.desktopColumns || 4, spaceBetween: 30 },
                    }}
                    className="product-swiper"
                    style={{ paddingBottom: '40px' }} // Room for pagination dots
                >
                    {productList.map(product => (
                        <SwiperSlide key={product.id}>
                            <ProductCard product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            );
        }

        return (
            <div className="products-grid">
                {productList.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        );
    };

    return (
        <div className="home-page">
            {/* Hero Slider */}
            <section className="hero-slider">
                {activeBanners.length > 0 ? (
                    <Swiper
                        modules={[Navigation, Autoplay, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        loop={true}
                        className="hero-swiper"
                    >
                        {activeBanners.map((banner) => (
                            <SwiperSlide key={banner.id}>
                                <div className="slider-container">
                                    <Link to={banner.link}>
                                        <img src={banner.imageUrl} alt="Sale Banner" className="hero-image" />
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="no-banner">No Active Banners</div>
                )}
            </section>

            {/* Category Highlights */}
            <section className="category-highlights container animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="category-grid">
                    {categories.map(category => (
                        <Link to={`/collections/${category.id}`} key={category.id} className="category-card">
                            <img src={category.image} alt={category.name} />
                            <h3>{category.name}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Trending Products */}
            <section className="product-carousel container animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="section-header">
                    <h2>Trending Now</h2>
                    <Link to="/collections" className="view-all">View All</Link>
                </div>
                {renderProducts(trendingProducts)}
            </section>

            {/* Popular Products */}
            <section className="product-carousel container animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="section-header">
                    <h2>Popular Products</h2>
                    <Link to="/collections" className="view-all">View All</Link>
                </div>
                {renderProducts(popularProducts)}
            </section>
        </div>
    );
};

export default Home;
