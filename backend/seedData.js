import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Shoe from "./models/Shoe.js";
import Analytics from "./models/Analytics.js";
import dotenv from "dotenv";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/brand-analytics"
    );

    // Clear existing data
    await User.deleteMany();
    await Shoe.deleteMany();
    await Analytics.deleteMany();

    console.log("🗑️ Old data cleared");

    // Create users
    const adminUser = new User({
      name: "Admin User",
      email: "admin@brand.com",
      password: await bcrypt.hash("admin123", 12),
      role: "admin",
    });

    const managerUser = new User({
      name: "Manager User",
      email: "manager@brand.com",
      password: await bcrypt.hash("manager123", 12),
      role: "manager",
    });

    const viewerUser = new User({
      name: "Viewer User",
      email: "viewer@brand.com",
      password: await bcrypt.hash("viewer123", 12),
      role: "viewer",
    });

    await adminUser.save();
    await managerUser.save();
    await viewerUser.save();

    console.log("👥 Test users created");

    // Create shoes with VALID categories based on your schema
    const shoes = [
      {
        name: "Nike Air Max 270",
        brand: "Nike",
        category: "running",
        price: 15000,
        description: "Comfortable running shoes with Max Air cushioning",
      },
      {
        name: "Adidas Ultraboost 5.0",
        brand: "Adidas",
        category: "running",
        price: 18000,
        description: "High-performance running shoes with Boost technology",
      },
      {
        name: "Puma RS-X Turbo",
        brand: "Puma",
        category: "casual",
        price: 12000,
        description: "Bold retro-style sneakers with chunky design",
      },
      {
        name: "Reebok Classic Leather",
        brand: "Reebok",
        category: "casual",
        price: 8500,
        description: "Timeless leather sneakers for everyday wear",
      },
      {
        name: "Nike Jordan 1 Retro",
        brand: "Nike",
        category: "sports",
        price: 17000,
        description: "Iconic basketball shoes with heritage design",
      },
      {
        name: "Adidas Stan Smith",
        brand: "Adidas",
        category: "casual",
        price: 9000,
        description: "Classic minimalist sneakers",
      },
      {
        name: "New Balance 574",
        brand: "New Balance",
        category: "casual",
        price: 11000,
        description: "Versatile everyday sneakers",
      },
      {
        name: "Nike Metcon 8",
        brand: "Nike",
        category: "sports",
        price: 13000,
        description: "Durable training shoes for crossfit",
      },
      {
        name: "Adidas Superstar",
        brand: "Adidas",
        category: "casual",
        price: 10000,
        description: "Iconic shell-toe sneakers",
      },
      {
        name: "Asics Gel-Kayano 30",
        brand: "Asics",
        category: "running",
        price: 16000,
        description: "Premium stability running shoes",
      },
      {
        name: "Nike Air Force 1",
        brand: "Nike",
        category: "casual",
        price: 10000,
        description: "Classic basketball-inspired sneakers",
      },
      {
        name: "Adidas Gazelle",
        brand: "Adidas",
        category: "casual",
        price: 9500,
        description: "Vintage-inspired suede sneakers",
      },
    ];

    const savedShoes = await Shoe.insertMany(shoes);
    console.log(`👟 ${savedShoes.length} shoes created`);

    // Create analytics data from Jan 2024 to Dec 2025
    const analyticsData = [];
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2025-12-31");

    // Generate data for each day in the range
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const date = new Date(currentDate);

      // Skip some dates randomly to make data more realistic (weekends have less data)
      const dayOfWeek = date.getDay();
      const skipProbability = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 0.1; // More skips on weekends

      if (Math.random() > skipProbability) {
        savedShoes.forEach((shoe, index) => {
        
          let baseSales, baseCost, baseImpressions, baseClicks;

          switch (shoe.category) {
            case "running":
              baseSales = 15 + Math.random() * 30;
              baseCost = 6000 + Math.random() * 10000;
              baseImpressions = 5000 + Math.random() * 8000;
              baseClicks = 200 + Math.random() * 400;
              break;
            case "sports":
              baseSales = 8 + Math.random() * 20;
              baseCost = 5000 + Math.random() * 7500;
              baseImpressions = 3000 + Math.random() * 6000;
              baseClicks = 150 + Math.random() * 300;
              break;
            default: // casual
              baseSales = 12 + Math.random() * 35;
              baseCost = 4000 + Math.random() * 7000;
              baseImpressions = 6000 + Math.random() * 10000;
              baseClicks = 250 + Math.random() * 500;
          }

          // Seasonal effects - higher sales in certain months
          const month = date.getMonth();
          let seasonalMultiplier = 1;
          if (month >= 10 || month <= 1) {
            // Nov-Feb (Holiday season)
            seasonalMultiplier = 1.3 + Math.random() * 0.4;
          } else if (month >= 4 && month <= 8) {
            // May-Sep (Summer)
            seasonalMultiplier = 1.1 + Math.random() * 0.3;
          }

          // Weekend effect
          const weekendMultiplier =
            dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.2;

          // Brand popularity multiplier
          const brandMultiplier =
            shoe.brand === "Nike" ? 1.4 : shoe.brand === "Adidas" ? 1.3 : 1.0;

          // Generate realistic data with variations
          const sales = Math.floor(
            baseSales * seasonalMultiplier * weekendMultiplier * brandMultiplier
          );
          const advertisingCost = Math.floor(
            baseCost * (0.8 + Math.random() * 0.4)
          );
          const impressions = Math.floor(
            baseImpressions * (0.7 + Math.random() * 0.6)
          );
          const clicks = Math.floor(baseClicks * (0.7 + Math.random() * 0.6));

          // Special events - big spikes on certain dates
          const specialEventMultiplier = getSpecialEventMultiplier(date);

          analyticsData.push({
            shoeId: shoe._id,
            date: date,
            sales: Math.floor(sales * specialEventMultiplier),
            advertisingCost: Math.floor(
              advertisingCost * (specialEventMultiplier > 1 ? 1.5 : 1)
            ),
            impressions: Math.floor(impressions * specialEventMultiplier),
            clicks: Math.floor(clicks * specialEventMultiplier),
          });
        });
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Insert analytics data in batches to avoid memory issues
    const batchSize = 1000;
    for (let i = 0; i < analyticsData.length; i += batchSize) {
      const batch = analyticsData.slice(i, i + batchSize);
      await Analytics.insertMany(batch);
      console.log(
        `📊 Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          analyticsData.length / batchSize
        )}`
      );
    }

    console.log("✅ Database seeded successfully!");
    console.log("📅 Data range: Jan 2024 - Dec 2025");
    console.log("📊 Total analytics records:", analyticsData.length);
    console.log("\n🔑 Test Accounts:");
    console.log("   Admin  - email: admin@brand.com, password: admin123");
    console.log("   Manager - email: manager@brand.com, password: manager123");
    console.log("   Viewer - email: viewer@brand.com, password: viewer123");

    console.log("\n👟 Available Shoes:");
    savedShoes.forEach((shoe) => {
      console.log(
        `   ${shoe.brand} ${shoe.name} - $${shoe.price} (${shoe.category})`
      );
    });

    // Show some sample data stats
    const totalSales = analyticsData.reduce(
      (sum, record) => sum + record.sales,
      0
    );
    const totalRevenue = analyticsData.reduce(
      (sum, record) =>
        sum +
        record.sales *
          (shoes.find((s) => s._id === record.shoeId)?.price || 100),
      0
    );
    console.log(`\n📈 Sample Data Stats:`);
    console.log(`   Total Sales: ${totalSales.toLocaleString()} units`);
    console.log(
      `   Estimated Revenue: $${Math.floor(totalRevenue).toLocaleString()}`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Helper function to simulate special events and sales
function getSpecialEventMultiplier(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Black Friday (November 29th)
  if (month === 11 && day === 29) return 3.5 + Math.random() * 1.5;

  // Christmas season (Dec 15-25)
  if (month === 12 && day >= 15 && day <= 25) return 2.5 + Math.random() * 1.0;

  // Summer sales (June 15-July 15)
  if (month === 6 && day >= 15) return 1.8 + Math.random() * 0.7;
  if (month === 7 && day <= 15) return 1.8 + Math.random() * 0.7;

  // New Year sales (Jan 1-7)
  if (month === 1 && day <= 7) return 2.0 + Math.random() * 0.8;

  // Back to school (August 20-31)
  if (month === 8 && day >= 20) return 1.6 + Math.random() * 0.6;

  // Regular day with some random spikes
  if (Math.random() < 0.02) {
    // 2% chance of random spike
    return 2.0 + Math.random() * 2.0;
  }

  return 1.0;
}

seedData();
