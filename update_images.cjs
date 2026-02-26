const fs = require('fs');

try {
    const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));

    const productImages = [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
        "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&q=80",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
        "https://images.unsplash.com/photo-1580870059868-fb86ed2872bc?w=800&q=80",
        "https://images.unsplash.com/photo-1615397323209-b4720e3a6a12?w=800&q=80",
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
        "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80"
    ];

    let pIndex = 0;
    data.products.forEach(p => {
        p.image = productImages[pIndex % productImages.length];
        if (Array.isArray(p.images)) {
            p.images = [productImages[(pIndex + 1) % productImages.length]];
        }
        pIndex++;
    });

    const catImages = [
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80",
        "https://images.unsplash.com/photo-1616683693504-3ea7e9add6fec?w=800&q=80",
        "https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?w=800&q=80",
        "https://images.unsplash.com/photo-1512496015851-a1abc2f2b3e8?w=800&q=80",
        "https://images.unsplash.com/photo-1580870059868-fb86ed2872bc?w=800&q=80"
    ];

    let cIndex = 0;
    data.categories.forEach(c => {
        c.image = catImages[cIndex % catImages.length];
        cIndex++;
    });

    if (data.banners && data.banners.length >= 2) {
        data.banners[0].imageUrl = "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1600&q=80";
        data.banners[1].imageUrl = "https://images.unsplash.com/photo-1571781926291-c477eb31f7d8?w=1600&q=80";
    }

    fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
    console.log('Successfully updated db.json with realistic images.');
} catch (e) {
    console.error('Error updating db.json:', e);
}
