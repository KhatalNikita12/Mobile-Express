require('dotenv').config();
const supabase = require('./supabaseClient');

const initialCategories = [
  { name: 'Smartphones' },
  { name: 'Laptops' },
  { name: 'Washing Machines' }
];

const initialBrands = [
  // Smartphone Brands
  { categoryName: 'Smartphones', name: 'Samsung' },
  { categoryName: 'Smartphones', name: 'Apple' },
  { categoryName: 'Smartphones', name: 'OnePlus' },
  
  // Laptop Brands
  { categoryName: 'Laptops', name: 'Apple' },
  { categoryName: 'Laptops', name: 'Dell' },
  { categoryName: 'Laptops', name: 'HP' },
  
  // Washing Machine Brands
  { categoryName: 'Washing Machines', name: 'Samsung' },
  { categoryName: 'Washing Machines', name: 'LG' },
  { categoryName: 'Washing Machines', name: 'Whirlpool' }
];

const initialProducts = [
  {
    category: 'smartphones',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 129999,
    specs: '12GB RAM, 256GB Storage, Snapdragon 8 Gen 3, 200MP Camera',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    category: 'smartphones',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    price: 134900,
    specs: 'A17 Pro chip, Titanium design, 48MP Main Camera',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    category: 'laptops',
    name: 'MacBook Pro 16',
    brand: 'Apple',
    price: 249900,
    specs: 'M3 Pro chip, 18GB Unified Memory, 512GB SSD',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    category: 'washing machines',
    name: 'EcoBubble Front Load',
    brand: 'Samsung',
    price: 36990,
    specs: '8 kg, Wi-Fi connectivity, Hygiene Steam, Digital Inverter',
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80'
    ]
  }
];

const initialServices = [
  {
    category: 'smartphones',
    name: 'Screen Replacement',
    description: 'High-quality OEM display replacement with warranty.',
    price: 'Starts at ₹1,999'
  },
  {
    category: 'laptops',
    name: 'Battery & Thermal Service',
    description: 'Battery health replacement and thorough cooling fan dust cleaning with fresh thermal paste.',
    price: 'Starts at ₹1,499'
  },
  {
    category: 'washing machines',
    name: 'Drum Deep Cleaning',
    description: 'Complete internal sanitize flush and pressure pipe unblocking.',
    price: 'Starts at ₹799'
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Categories
  const { data: insertedCategories, error: catError } = await supabase
    .from('categories')
    .insert(initialCategories)
    .select();

  if (catError) {
    console.error('❌ Error seeding categories:', catError.message);
    return;
  }
  console.log('✅ Categories seeded successfully!');

  // Map category names to their generated Supabase UUIDs
  const categoryMap = {};
  insertedCategories.forEach(cat => {
    categoryMap[cat.name] = cat.id;
  });

  // 2. Prepare and Seed Brands using Category UUIDs
  const brandsWithForeignKeys = initialBrands.map(b => ({
    name: b.name,
    category_id: categoryMap[b.categoryName]
  })).filter(b => b.category_id); // Ensure valid match

  const { error: brandError } = await supabase.from('brands').insert(brandsWithForeignKeys);
  if (brandError) {
    console.error('❌ Error seeding brands:', brandError.message);
  } else {
    console.log('✅ Brands linked and seeded successfully!');
  }

  // 3. Seed Products
  const { error: productError } = await supabase.from('products').insert(initialProducts);
  if (productError) {
    console.error('❌ Error seeding products:', productError.message);
  } else {
    console.log('✅ Products seeded successfully with multi-image arrays!');
  }

  // 4. Seed Services
  const { error: serviceError } = await supabase.from('services').insert(initialServices);
  if (serviceError) {
    console.error('❌ Error seeding services:', serviceError.message);
  } else {
    console.log('✅ Services seeded successfully!');
  }

  console.log('🏁 Seeding process complete.');
}

seedDatabase();