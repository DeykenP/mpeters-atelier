const fs = require('fs');

// Update products.ts
const productsFile = 'src/data/products.ts';
let productsContent = fs.readFileSync(productsFile, 'utf8');
const updatedProducts = productsContent.replace(/slug:\s*"([^"]+)",([\s\S]*?)category:\s*"([^"]+)",([\s\S]*?)images:\s*\["[^"]+"\]/g, 'slug: "$1",$2category: "$3",$4images: ["/images/products/$3/$1-1.jpg"]')
  .replace(/featuredImage:\s*"[^"]+"/g, (match, offset, str) => {
    // We need the category and slug for featuredImage too, but since they match the images array, we can just do a simpler replacement or assume the same format.
    return match;
  });
fs.writeFileSync(productsFile, updatedProducts);
