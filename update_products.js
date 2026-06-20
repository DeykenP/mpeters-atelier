const fs = require('fs');

const file = 'src/data/products.ts';
let content = fs.readFileSync(file, 'utf8');

const updated = content.replace(/slug:\s*"([^"]+)",([\s\S]*?)category:\s*"([^"]+)",([\s\S]*?)images:\s*\["([^"]+)"\],\s*featuredImage:\s*"([^"]+)",/g, (match, slug, group1, category, group2, img, fImg) => {
    return `slug: "${slug}",${group1}category: "${category}",${group2}images: ["/images/products/${category}/${slug}-1.jpg"],
    featuredImage: "/images/products/${category}/${slug}-1.jpg",`;
});

fs.writeFileSync(file, updated);
