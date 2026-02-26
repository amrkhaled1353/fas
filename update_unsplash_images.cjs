const fs = require('fs');

try {
    const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));

    // Realistic banner images
    const bannerImages = [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=80",
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1600&q=80",
        "https://images.unsplash.com/photo-1615397323209-b4720e3a6a12?w=1600&q=80"
    ];

    if (data.banners) {
        data.banners.forEach((b, i) => {
            b.imageUrl = bannerImages[i % bannerImages.length];
        });
    }

    // Realistic category images
    const categoryImages = [
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80", // Trending Now
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80", // Best Sellers
        "https://images.unsplash.com/photo-1571781926291-c477eb31f7d8?w=800&q=80", // New Arrivals
        "https://images.unsplash.com/photo-1512496015851-a1abc2f2b3e8?w=800&q=80", // Lenses (Makeup placeholder)
        "https://images.unsplash.com/photo-1580870059868-fb86ed2872bc?w=800&q=80"  // Other
    ];

    if (data.categories) {
        data.categories.forEach((c, i) => {
            c.image = categoryImages[i % categoryImages.length];
        });
    }

    // Specific product images if possible, otherwise generic cosmetics
    const productImages = [
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80", // Splash/Perfume
        "https://images.unsplash.com/photo-1606502973842-f64bc2785fe5?w=800&q=80", // Smile/Teeth
        "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=800&q=80", // Spa/Socks
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80", // Brushes
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80", // Foam/Wash
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80", // Lipstick
        "https://images.unsplash.com/photo-1556228720-1c276c5f7e6f?w=800&q=80", // Sunscreen
        "https://images.unsplash.com/photo-1616683693504-3ea7e9add6fec?w=800&q=80", // Generic 1
        "https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?w=800&q=80", // Generic 2
    ];

    if (data.products) {
        data.products.forEach((p, i) => {
            p.image = productImages[i % productImages.length];
            p.images = [
                productImages[i % productImages.length],
                productImages[(i + 1) % productImages.length]
            ];
        });
    }

    fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
    console.log('Successfully updated db.json with realistic Unsplash images.');
} catch (e) {
    console.error('Error updating db.json:', e);
}
