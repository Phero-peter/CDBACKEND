// Script để seed 30 xe mẫu vào database
// Chạy: node scripts/seed-cars.js

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const carSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  mileage: { type: Number, required: true },
  price: { type: Number, required: true },
  fuelType: { type: String, enum: ['xăng', 'diesel', 'hybrid', 'electric'], required: true },
  transmission: { type: String, enum: ['số sàn', 'số tự động', 'CVT'], required: true },
  color: { type: String, required: true },
  condition: { type: String, enum: ['mới', 'cũ'], required: true },
  description: { type: String, required: true },
  images: [String],
  location: {
    province: { type: String, required: true },
    city: { type: String, required: true },
  },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true });

const Car = mongoose.models.Car || mongoose.model('Car', carSchema);
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, default: 'user' },
}));

const provinces = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];
const cities = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận Hoàn Kiếm', 'Quận Ba Đình'];

function generateSlug(brand, model, year) {
  const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const modelSlug = model.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `${brandSlug}-${modelSlug}-${year}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const cars = [
  // Toyota
  { brand: 'Toyota', model: 'Vios', year: 2023, mileage: 5000, price: 520000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Trắng', condition: 'mới', description: 'Xe Toyota Vios 2023 mới, đầy đủ tiện nghi, bảo hành chính hãng.', images: ['/imgs/toyota-vios-1.png.webp'], featured: true },
  { brand: 'Toyota', model: 'Camry', year: 2024, mileage: 0, price: 1250000000, fuelType: 'hybrid', transmission: 'CVT', color: 'Xám', condition: 'mới', description: 'Toyota Camry 2024 Hybrid, tiết kiệm nhiên liệu, công nghệ hiện đại.', images: ['/imgs/thum-toyota-camry-2024-xam-anh-bac.png.webp'], featured: true },
  { brand: 'Toyota', model: 'Altis', year: 2023, mileage: 10000, price: 780000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Đen', condition: 'mới', description: 'Toyota Altis 2023, nội thất sang trọng, động cơ mạnh mẽ.', images: ['/imgs/toyota-altis.png.webp'] },
  { brand: 'Toyota', model: 'Hilux', year: 2023, mileage: 15000, price: 850000000, fuelType: 'diesel', transmission: 'số sàn', color: 'Đỏ', condition: 'mới', description: 'Toyota Hilux 2023, bán tải mạnh mẽ, phù hợp địa hình khó.', images: ['/imgs/toyota-hilux-do.png.webp'] },
  { brand: 'Toyota', model: 'Innova Cross', year: 2023, mileage: 8000, price: 950000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Bạc', condition: 'mới', description: 'Toyota Innova Cross 2023, 7 chỗ, không gian rộng rãi.', images: ['/imgs/toyota-innova-cross-300x173-1.png.webp'] },
  { brand: 'Toyota', model: 'Veloz', year: 2023, mileage: 12000, price: 680000000, fuelType: 'xăng', transmission: 'CVT', color: 'Xanh', condition: 'mới', description: 'Toyota Veloz 2023, SUV 7 chỗ, thiết kế trẻ trung.', images: ['/imgs/toyota-veloz-1.png.webp'] },
  { brand: 'Toyota', model: 'Yaris', year: 2023, mileage: 3000, price: 450000000, fuelType: 'xăng', transmission: 'CVT', color: 'Trắng', condition: 'mới', description: 'Toyota Yaris 2023, hatchback nhỏ gọn, tiết kiệm nhiên liệu.', images: ['/imgs/yaris-2023.jpg.webp'] },

  // Ford
  { brand: 'Ford', model: 'Mustang', year: 2023, mileage: 5000, price: 1850000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Đỏ', condition: 'mới', description: 'Ford Mustang 2023, thể thao, động cơ V8 mạnh mẽ.', images: ['/imgs/ford-mustang.jpg'], featured: true },
  { brand: 'Ford', model: 'Everest Platinum', year: 2023, mileage: 10000, price: 1450000000, fuelType: 'diesel', transmission: 'số tự động', color: 'Đen', condition: 'mới', description: 'Ford Everest Platinum 2023, SUV 7 chỗ cao cấp.', images: ['/imgs/ford-everest-platinum-20l-4x4-at-29591708414787.png'] },
  { brand: 'Ford', model: 'Everest Titanium', year: 2023, mileage: 8000, price: 1250000000, fuelType: 'diesel', transmission: 'số tự động', color: 'Bạc', condition: 'mới', description: 'Ford Everest Titanium 2023, đầy đủ tiện nghi.', images: ['/imgs/ford-everest-titanium-4x2-at-65191668672584.png'] },
  { brand: 'Ford', model: 'Everest Wildtrak', year: 2023, mileage: 12000, price: 1350000000, fuelType: 'diesel', transmission: 'số tự động', color: 'Cam', condition: 'mới', description: 'Ford Everest Wildtrak 2023, phiên bản thể thao.', images: ['/imgs/ford-everest-wildtrak-20l-4x4-at-61221682043528.png'] },
  { brand: 'Ford', model: 'Territory Sport', year: 2023, mileage: 6000, price: 750000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Xanh', condition: 'mới', description: 'Ford Territory Sport 2023, SUV 5 chỗ hiện đại.', images: ['/imgs/ford-territory-sport-15l-at-491725595724.png'] },
  { brand: 'Ford', model: 'Territory Titanium X', year: 2023, mileage: 7000, price: 850000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Trắng', condition: 'mới', description: 'Ford Territory Titanium X 2023, cao cấp.', images: ['/imgs/ford-territory-titanium-x-15l-at-72291755680335.png'] },

  // Kia
  { brand: 'Kia', model: 'Carens', year: 2023, mileage: 5000, price: 680000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Trắng', condition: 'mới', description: 'Kia Carens 2023, MPV 7 chỗ, không gian rộng rãi.', images: ['/imgs/carens-icon-3.png'] },
  { brand: 'Kia', model: 'Carnival', year: 2023, mileage: 4000, price: 1250000000, fuelType: 'hybrid', transmission: 'số tự động', color: 'Xanh', condition: 'mới', description: 'Kia Carnival 2023 Hybrid, MPV cao cấp 8 chỗ.', images: ['/imgs/carnival-xanhxam.png'] },
  { brand: 'Kia', model: 'Seltos', year: 2023, mileage: 8000, price: 650000000, fuelType: 'xăng', transmission: 'CVT', color: 'Đỏ', condition: 'mới', description: 'Kia Seltos 2023, SUV nhỏ gọn, thiết kế trẻ trung.', images: ['/imgs/hinh-xe-new-seltos-moi-1.png'] },
  { brand: 'Kia', model: 'K5', year: 2023, mileage: 6000, price: 850000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Xanh xám', condition: 'mới', description: 'Kia K5 2023, sedan thể thao, thiết kế hiện đại.', images: ['/imgs/k5-xanhsam.png'] },
  { brand: 'Kia', model: 'Morning', year: 2023, mileage: 3000, price: 380000000, fuelType: 'xăng', transmission: 'số sàn', color: 'Đỏ', condition: 'mới', description: 'Kia Morning 2023, hatchback nhỏ gọn, giá rẻ.', images: ['/imgs/l-newmorning-xline-do-edit.png'] },
  { brand: 'Kia', model: 'Soluto', year: 2023, mileage: 5000, price: 420000000, fuelType: 'xăng', transmission: 'số sàn', color: 'Trắng', condition: 'mới', description: 'Kia Soluto 2023, sedan giá rẻ, tiết kiệm nhiên liệu.', images: ['/imgs/soluto-pngicon.png'] },

  // BMW
  { brand: 'BMW', model: '4 Series GC', year: 2023, mileage: 5000, price: 1850000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Xanh', condition: 'mới', description: 'BMW 4 Series Gran Coupe 2023, thể thao, sang trọng.', images: ['/imgs/4_gc.avif'], featured: true },
  { brand: 'BMW', model: '7 Series', year: 2023, mileage: 3000, price: 4500000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Đen', condition: 'mới', description: 'BMW 7 Series 2023, sedan hạng sang, công nghệ cao cấp.', images: ['/imgs/7_series.avif'], featured: true },
  { brand: 'BMW', model: 'i4', year: 2023, mileage: 2000, price: 2200000000, fuelType: 'electric', transmission: 'số tự động', color: 'Xanh', condition: 'mới', description: 'BMW i4 2023, xe điện, hiệu năng cao.', images: ['/imgs/i4.avif'] },
  { brand: 'BMW', model: '3 Series', year: 2023, mileage: 8000, price: 1650000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Trắng', condition: 'mới', description: 'BMW 3 Series 2023, sedan thể thao, động cơ mạnh mẽ.', images: ['/imgs/new_bmw_3_series_sedan.avif'] },
  { brand: 'BMW', model: 'XM', year: 2023, mileage: 1000, price: 8500000000, fuelType: 'hybrid', transmission: 'số tự động', color: 'Đen', condition: 'mới', description: 'BMW XM 2023, SUV hạng sang, hybrid mạnh mẽ.', images: ['/imgs/new_bmw_xm_series.avif'], featured: true },
  { brand: 'BMW', model: 'X3', year: 2023, mileage: 6000, price: 1850000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Bạc', condition: 'mới', description: 'BMW X3 2023, SUV thể thao, không gian rộng rãi.', images: ['/imgs/x3_2_.avif'] },
  { brand: 'BMW', model: 'Z4', year: 2023, mileage: 3000, price: 3200000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Đỏ', condition: 'mới', description: 'BMW Z4 2023, roadster thể thao, thiết kế đẹp mắt.', images: ['/imgs/z4.avif'] },

  // Audi
  { brand: 'Audi', model: 'e-tron GT', year: 2023, mileage: 2000, price: 5500000000, fuelType: 'electric', transmission: 'số tự động', color: 'Xám', condition: 'mới', description: 'Audi e-tron GT 2023, xe điện hiệu năng cao, thiết kế thể thao.', images: ['/imgs/audi-e-tronGT.webp'], featured: true },
  { brand: 'Audi', model: 'A5', year: 2023, mileage: 5000, price: 1850000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Xanh', condition: 'mới', description: 'Audi A5 2023, coupe thể thao, nội thất sang trọng.', images: ['/imgs/audiA5.webp'] },
  { brand: 'Audi', model: 'A6', year: 2023, mileage: 6000, price: 2150000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Đen', condition: 'mới', description: 'Audi A6 2023, sedan hạng sang, công nghệ hiện đại.', images: ['/imgs/audiA6.webp'] },
  { brand: 'Audi', model: 'A7', year: 2023, mileage: 4000, price: 2850000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Bạc', condition: 'mới', description: 'Audi A7 2023, sportback thể thao, thiết kế độc đáo.', images: ['/imgs/audiA7.webp'] },
  { brand: 'Audi', model: 'A8', year: 2023, mileage: 3000, price: 4500000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Đen', condition: 'mới', description: 'Audi A8 2023, sedan hạng sang, nội thất xa xỉ.', images: ['/imgs/audiA8.webp'], featured: true },
  { brand: 'Audi', model: 'GT quattro', year: 2023, mileage: 1000, price: 5800000000, fuelType: 'electric', transmission: 'số tự động', color: 'Xám', condition: 'mới', description: 'Audi GT quattro 2023, xe điện hiệu năng cao, quattro AWD.', images: ['/imgs/audiGTquattro.webp'], featured: true },
  { brand: 'Audi', model: 'Q5', year: 2023, mileage: 7000, price: 1950000000, fuelType: 'xăng', transmission: 'số tự động', color: 'Trắng', condition: 'mới', description: 'Audi Q5 2023, SUV hạng sang, không gian rộng rãi.', images: ['/imgs/audiQ5.webp'] },
  { brand: 'Audi', model: 'Q6 e-tron', year: 2023, mileage: 1500, price: 3200000000, fuelType: 'electric', transmission: 'số tự động', color: 'Xanh', condition: 'mới', description: 'Audi Q6 e-tron 2023, SUV điện, công nghệ hiện đại.', images: ['/imgs/audiQ6.webp'] },
];

async function seedCars() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI không được tìm thấy trong .env.local');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB');

    // Tìm hoặc tạo user mẫu
    let seller = await User.findOne({ email: 'seller@example.com' });
    if (!seller) {
      seller = await User.create({
        name: 'Người bán mẫu',
        email: 'seller@example.com',
        role: 'user',
      });
      console.log('✅ Đã tạo user mẫu');
    }

    // Xóa các xe cũ (tùy chọn)
    const deleteOld = process.argv.includes('--delete');
    if (deleteOld) {
      await Car.deleteMany({});
      console.log('✅ Đã xóa các xe cũ');
    }

    // Tạo các xe mới
    const createdCars = [];
    for (const carData of cars) {
      const slug = generateSlug(carData.brand, carData.model, carData.year);
      const province = provinces[Math.floor(Math.random() * provinces.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];

      try {
        const car = await Car.create({
          ...carData,
          slug,
          location: { province, city },
          seller: seller._id,
        });
        createdCars.push(car);
        console.log(`✅ Đã tạo: ${carData.brand} ${carData.model} ${carData.year}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  Đã tồn tại: ${carData.brand} ${carData.model} ${carData.year}`);
        } else {
          console.error(`❌ Lỗi khi tạo ${carData.brand} ${carData.model}:`, error.message);
        }
      }
    }

    console.log(`\n✅ Hoàn thành! Đã tạo ${createdCars.length} xe mới.`);
    console.log(`📊 Tổng số xe trong database: ${await Car.countDocuments()}`);

    await mongoose.disconnect();
    console.log('✅ Đã ngắt kết nối MongoDB');
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

seedCars();


