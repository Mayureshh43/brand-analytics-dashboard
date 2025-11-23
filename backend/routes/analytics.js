import express from "express";
import { body, query, validationResult } from "express-validator";
import Analytics from "../models/Analytics.js";
import Shoe from "../models/Shoe.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Simplified validation rules
const dateRangeValidation = [
  query("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid date (YYYY-MM-DD)")
    .notEmpty()
    .withMessage("Start date is required"),

  query("endDate")
    .isISO8601()
    .withMessage("End date must be a valid date (YYYY-MM-DD)")
    .notEmpty()
    .withMessage("End date is required")
    .custom((endDate, { req }) => {
      if (new Date(endDate) < new Date(req.query.startDate)) {
        throw new Error("End date cannot be before start date");
      }

      // Max date range: 2 years
      const start = new Date(req.query.startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 365 * 2) {
        throw new Error("Date range cannot exceed 2 years");
      }

      return true;
    }),
];

const shoeMetricsValidation = [
  ...dateRangeValidation,
  query("shoeId")
    .isMongoId()
    .withMessage("Valid shoe ID is required")
    .custom(async (shoeId) => {
      const shoe = await Shoe.findById(shoeId);
      if (!shoe) {
        throw new Error("Shoe not found");
      }
      return true;
    }),

  query("metrics").custom((metrics) => {
    const validMetrics = ["sales", "advertisingCost", "impressions", "clicks"];
    const metricsArray = Array.isArray(metrics) ? metrics : [metrics];

    if (metricsArray.length === 0) {
      throw new Error("At least one metric is required");
    }

    if (metricsArray.length > 2) {
      throw new Error("Maximum 2 metrics can be compared");
    }

    metricsArray.forEach((metric) => {
      if (!validMetrics.includes(metric)) {
        throw new Error(`Invalid metric: ${metric}`);
      }
    });

    return true;
  }),
];

// Simple business logic validation
const validateBasicDataRules = (analyticsData, shoe) => {
  const warnings = [];

  analyticsData.forEach((record) => {
    // Basic data consistency: clicks should not exceed impressions
    if (record.clicks > record.impressions) {
      warnings.push(
        `Data inconsistency: Clicks exceed impressions for ${shoe.name}`
      );
    }

    if (record.advertisingCost > 500000) {
      warnings.push(`Unusually high advertising cost for ${shoe.name}`);
    }
  });

  return warnings;
};

// Get summary metrics
router.get("/summary", auth, dateRangeValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { startDate, endDate } = req.query;

    const matchStage = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    const summary = await Analytics.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$sales" },
          totalAdvertisingCost: { $sum: "$advertisingCost" },
          totalImpressions: { $sum: "$impressions" },
          totalClicks: { $sum: "$clicks" },
        },
      },
    ]);

    const result =
      summary.length > 0
        ? summary[0]
        : {
            totalSales: 0,
            totalAdvertisingCost: 0,
            totalImpressions: 0,
            totalClicks: 0,
          };

    res.json(result);
  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching summary",
    });
  }
});

// Get analytics for specific shoe with metrics comparison
router.get("/shoe-metrics", auth, shoeMetricsValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { shoeId, startDate, endDate, metrics } = req.query;

    const metricsArray = Array.isArray(metrics) ? metrics : [metrics];

    const analytics = await Analytics.find({
      shoeId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: 1 });

    const shoe = await Shoe.findById(shoeId);

    // Simple data validation
    const dataWarnings = validateBasicDataRules(analytics, shoe);

    const result = analytics.map((entry) => {
      const dataPoint = { date: entry.date };
      metricsArray.forEach((metric) => {
        dataPoint[metric] = entry[metric];
      });
      return dataPoint;
    });

    res.json({
      data: result,
      shoe: {
        name: shoe.name,
        brand: shoe.brand,
        category: shoe.category,
      },
      warnings: dataWarnings.length > 0 ? dataWarnings.slice(0, 3) : undefined, // Limit warnings
    });
  } catch (error) {
    console.error("Shoe metrics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching shoe metrics",
    });
  }
});

// Get shoe-wise totals for table
router.get("/shoe-totals", auth, dateRangeValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { startDate, endDate } = req.query;

    const shoeTotals = await Analytics.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: "$shoeId",
          totalSales: { $sum: "$sales" },
          totalAdvertisingCost: { $sum: "$advertisingCost" },
          totalImpressions: { $sum: "$impressions" },
          totalClicks: { $sum: "$clicks" },
        },
      },
      {
        $lookup: {
          from: "shoes",
          localField: "_id",
          foreignField: "_id",
          as: "shoe",
        },
      },
      {
        $unwind: "$shoe",
      },
      {
        $project: {
          shoeName: "$shoe.name",
          shoeBrand: "$shoe.brand",
          shoeCategory: "$shoe.category",
          totalSales: 1,
          totalAdvertisingCost: 1,
          totalImpressions: 1,
          totalClicks: 1,
        },
      },
      {
        $sort: { totalSales: -1 },
      },
    ]);

    // Calculate grand totals
    const grandTotals = shoeTotals.reduce(
      (acc, curr) => ({
        totalSales: acc.totalSales + curr.totalSales,
        totalAdvertisingCost:
          acc.totalAdvertisingCost + curr.totalAdvertisingCost,
        totalImpressions: acc.totalImpressions + curr.totalImpressions,
        totalClicks: acc.totalClicks + curr.totalClicks,
      }),
      {
        totalSales: 0,
        totalAdvertisingCost: 0,
        totalImpressions: 0,
        totalClicks: 0,
      }
    );

    res.json({
      shoeTotals,
      grandTotals,
    });
  } catch (error) {
    console.error("Shoe totals error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching shoe totals",
    });
  }
});

export default router;
