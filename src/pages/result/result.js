// 12个月工资明细页面
const {
  calculateMonthlyTax,
  calculateYearlyTotal,
} = require("../../utils/tax-calculator");
const {
  drawPieChart,
  drawLineChart,
  initCanvas,
} = require("../../utils/chart-utils");

Page({
  data: {
    // View mode: 'table' or 'card'
    viewMode: "card",

    // Parameters from previous page
    params: {
      monthlySalary: 0,
      socialInsurance: 0,
      specialDeduction: 0,
      currentMonth: 12,
    },

    // Monthly details for 12 months
    monthlyDetails: [],

    // Yearly total
    yearlyTotal: {
      grossIncome: "0.00",
      totalTax: "0.00",
      netIncome: "0.00",
      effectiveRate: "0.00",
    },

    // Tax rate analysis
    analysis: {
      currentRate: 0,
      effectiveRate: 0,
      avgMonthlyTax: "0.00",
      brackets: [],
    },

    // Deductions breakdown
    deductions: {
      threshold: 5000,
      socialInsurance: 0,
      specialDeduction: 0,
      total: 0,
      items: [],
    },
  },

  onLoad(options) {
    // Read params from globalData first, fall back to URL options
    const app = getApp();
    const globalCalc = (app.globalData && app.globalData.taxCalculation) || {};

    const params = {
      monthlySalary: globalCalc.grossSalary || parseFloat(options.salary) || 0,
      socialInsurance:
        globalCalc.socialSecurity || parseFloat(options.social) || 0,
      specialDeduction:
        globalCalc.specialDeductions || parseFloat(options.deduction) || 0,
      currentMonth: parseInt(options.month) || 12,
    };

    this.setData({ params });

    // Calculate monthly details
    this.calculateMonthlyDetails();

    // Load deduction items
    this.loadDeductionItems();
  },

  onReady() {
    // Render charts after page layout is ready
    var that = this;
    setTimeout(function () {
      that.renderCharts();
    }, 300);
  },

  // Render all charts on canvas
  renderCharts() {
    var that = this;

    // Salary composition donut chart
    initCanvas(this, "pieCanvas", function (ctx, w, h) {
      that.renderSalaryDonut(ctx, w, h);
    });

    // Monthly tax trend line chart
    initCanvas(this, "lineCanvas", function (ctx, w, h) {
      that.renderTaxTrend(ctx, w, h);
    });
  },

  // Render salary composition donut chart
  renderSalaryDonut(ctx, width, height) {
    var monthlyDetails = this.data.monthlyDetails;
    var params = this.data.params;
    if (!monthlyDetails || monthlyDetails.length === 0) return;

    var lastMonth = monthlyDetails[monthlyDetails.length - 1];
    var monthlySalary = params.monthlySalary;
    // Extract numeric value from socialInsurance (may be object or number)
    var socialIns =
      typeof params.socialInsurance === "object" &&
      params.socialInsurance !== null
        ? params.socialInsurance.total || 0
        : params.socialInsurance || 0;
    var monthTax = parseFloat(lastMonth.currentMonthTax) || 0;
    var netSalary = parseFloat(lastMonth.netSalary) || 0;

    var data = [
      { label: "税后工资", value: netSalary, color: "#10b981" },
      { label: "五险一金", value: socialIns, color: "#3b82f6" },
      { label: "个人所得税", value: monthTax, color: "#ef4444" },
    ];

    drawPieChart(
      ctx,
      width,
      height,
      data,
      monthlySalary.toFixed(0),
      "税前工资",
    );
  },

  // Render monthly tax trend line chart
  renderTaxTrend(ctx, width, height) {
    var monthlyDetails = this.data.monthlyDetails;
    if (!monthlyDetails || monthlyDetails.length === 0) return;

    var labels = monthlyDetails.map(function (d) {
      return d.month + "月";
    });
    var taxData = monthlyDetails.map(function (d) {
      return parseFloat(d.currentMonthTax) || 0;
    });

    // Detect bracket jump months
    var markers = [];
    for (var i = 1; i < taxData.length; i++) {
      var prev = taxData[i - 1];
      var curr = taxData[i];
      if (prev > 0 && (curr - prev) / prev > 0.5) {
        markers.push({ index: i, label: "跳档" });
      }
    }

    drawLineChart(ctx, width, height, {
      labels: labels,
      data: taxData,
      lineColor: "#07C160",
      fillColor: "rgba(7, 193, 96, 0.15)",
      title: "每月应缴个税趋势",
      markers: markers,
    });
  },

  // Calculate monthly details for all 12 months
  calculateMonthlyDetails() {
    const { monthlySalary, socialInsurance, specialDeduction, currentMonth } =
      this.data.params;

    // Ensure socialInsurance is an object with .total for calculateMonthlyTax
    const socialSecurityParam =
      typeof socialInsurance === "object" && socialInsurance !== null
        ? socialInsurance
        : { total: socialInsurance };
    const socialTotal = socialSecurityParam.total || 0;

    const monthlyDetails = [];
    let cumulativePaidTax = 0;

    // Calculate for each month up to current month
    for (let month = 1; month <= currentMonth; month++) {
      const result = calculateMonthlyTax({
        grossSalary: monthlySalary,
        socialSecurity: socialSecurityParam,
        specialDeductions: specialDeduction,
        month,
      });

      const currentMonthTax = result.tax;
      cumulativePaidTax += currentMonthTax;

      monthlyDetails.push({
        month,
        grossSalary: monthlySalary.toFixed(2),
        socialInsurance: socialTotal.toFixed(2),
        specialDeduction: (specialDeduction || 0).toFixed(2),
        taxableIncome: result.breakdown.taxableIncome.toFixed(2),
        cumulativeTax: cumulativePaidTax.toFixed(2),
        paidTax: (cumulativePaidTax - currentMonthTax).toFixed(2),
        currentMonthTax: currentMonthTax.toFixed(2),
        netSalary: result.netSalary.toFixed(2),
      });
    }

    // Calculate yearly total
    const yearlyTotal = calculateYearlyTotal(monthlyDetails, currentMonth);

    // Calculate tax analysis
    const analysis = this.calculateTaxAnalysis(yearlyTotal);

    this.setData({
      monthlyDetails,
      yearlyTotal,
      analysis,
      deductions: {
        ...this.data.deductions,
        socialInsurance: socialTotal.toFixed(2),
        specialDeduction: (specialDeduction || 0).toFixed(2),
        total: (5000 + socialTotal + (specialDeduction || 0)).toFixed(2),
      },
    });
  },

  // Calculate tax rate analysis
  calculateTaxAnalysis(yearlyTotal) {
    const { monthlySalary, socialInsurance, specialDeduction, currentMonth } =
      this.data.params;

    // Extract numeric social total from object or number
    const socialTotal =
      typeof socialInsurance === "object" && socialInsurance !== null
        ? socialInsurance.total || 0
        : socialInsurance || 0;
    const cumulativeTaxable =
      (monthlySalary - socialTotal - (specialDeduction || 0) - 5000) *
      currentMonth;
    const totalTax = parseFloat(yearlyTotal.totalTax);

    // Determine current tax bracket
    const brackets = [
      { range: "0 - 36,000", rate: 3, min: 0, max: 36000 },
      { range: "36,000 - 144,000", rate: 10, min: 36000, max: 144000 },
      { range: "144,000 - 300,000", rate: 20, min: 144000, max: 300000 },
      { range: "300,000 - 420,000", rate: 25, min: 300000, max: 420000 },
      { range: "420,000 - 660,000", rate: 30, min: 420000, max: 660000 },
      { range: "660,000 - 960,000", rate: 35, min: 660000, max: 960000 },
      { range: "960,000+", rate: 45, min: 960000, max: Infinity },
    ];

    let currentRate = 3;
    const bracketsWithStatus = brackets.map((bracket) => {
      const active =
        cumulativeTaxable >= bracket.min && cumulativeTaxable < bracket.max;
      if (active) {
        currentRate = bracket.rate;
      }
      return { ...bracket, active };
    });

    const effectiveRate =
      cumulativeTaxable > 0
        ? ((totalTax / cumulativeTaxable) * 100).toFixed(2)
        : "0.00";

    const avgMonthlyTax =
      currentMonth > 0 ? (totalTax / currentMonth).toFixed(2) : "0.00";

    return {
      currentRate,
      effectiveRate,
      avgMonthlyTax,
      brackets: bracketsWithStatus,
    };
  },

  // Load deduction items from storage
  loadDeductionItems() {
    try {
      const savedDeductions = wx.getStorageSync("specialDeductions");
      if (savedDeductions && savedDeductions.totalDeduction > 0) {
        const items = [];

        if (savedDeductions.childCount > 0) {
          items.push({
            name: "子女教育",
            amount:
              savedDeductions.childCount *
              1000 *
              (savedDeductions.childRatio / 100),
          });
        }

        if (savedDeductions.infantCount > 0) {
          items.push({
            name: "婴幼儿照护",
            amount:
              savedDeductions.infantCount *
              1000 *
              (savedDeductions.infantRatio / 100),
          });
        }

        if (savedDeductions.hasContinuingEducation) {
          items.push({ name: "继续教育", amount: 400 });
        }

        if (savedDeductions.hasHousingLoan) {
          items.push({
            name: "房贷利息",
            amount: 1000 * (savedDeductions.loanRatio / 100),
          });
        }

        if (savedDeductions.hasHousingRent) {
          const rentAmounts = [1500, 1100, 800];
          items.push({
            name: "住房租金",
            amount: rentAmounts[savedDeductions.rentCityIndex],
          });
        }

        if (savedDeductions.hasElderCare) {
          const amount =
            savedDeductions.elderType === "only"
              ? 2000
              : savedDeductions.elderShareAmount;
          items.push({ name: "赡养老人", amount });
        }

        this.setData({
          "deductions.items": items,
        });
      }
    } catch (error) {
      console.error("Failed to load deduction items:", error);
    }
  },

  // Switch view mode
  switchViewMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ viewMode: mode });
  },

  // Edit deductions
  onEditDeductions() {
    wx.navigateTo({
      url: "/pages/deductions/deductions",
    });
  },

  // Export report as image
  onExport() {
    wx.showLoading({ title: "生成图片中..." });
    this.drawExportCanvas();
  },

  // Draw export canvas with salary details
  drawExportCanvas() {
    const that = this;
    const query = wx.createSelectorQuery();
    query
      .select("#exportCanvas")
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0] || !res[0].node) {
          wx.hideLoading();
          wx.showToast({ title: "生成失败", icon: "none" });
          return;
        }
        const canvas = res[0].node;
        const ctx = canvas.getContext("2d");
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = 600 * dpr;
        canvas.height = 800 * dpr;
        ctx.scale(dpr, dpr);

        that.drawCardContent(ctx, canvas);
      });
  },

  // Draw the card content on canvas
  drawCardContent(ctx, canvas) {
    const that = this;
    const W = 600;
    const H = 800;
    const params = this.data.params;
    const yearlyTotal = this.data.yearlyTotal;
    const deductions = this.data.deductions;
    const monthlyDetails = this.data.monthlyDetails;
    const lastMonth =
      monthlyDetails.length > 0
        ? monthlyDetails[monthlyDetails.length - 1]
        : null;

    // Extract socialInsurance numeric value
    const socialTotal =
      typeof params.socialInsurance === "object" &&
      params.socialInsurance !== null
        ? params.socialInsurance.total || 0
        : params.socialInsurance || 0;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, "#07C160");
    gradient.addColorStop(1, "#059048");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    // Semi-transparent card area
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    that.roundRect(ctx, 30, 30, W - 60, H - 60, 20);
    ctx.fill();

    // Title
    ctx.fillStyle = "#333333";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("个税计算报告", W / 2, 80);

    // Subtitle with date
    ctx.fillStyle = "#999999";
    ctx.font = "14px sans-serif";
    const now = new Date();
    const dateStr =
      now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
    ctx.fillText("生成日期: " + dateStr, W / 2, 105);

    // Divider
    ctx.strokeStyle = "#eeeeee";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 120);
    ctx.lineTo(W - 50, 120);
    ctx.stroke();

    // Salary info section
    let y = 160;
    ctx.textAlign = "left";
    ctx.fillStyle = "#059048";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("工资明细", 60, y);

    y += 35;
    const rows = [
      ["税前工资", params.monthlySalary.toFixed(2) + " 元"],
      ["五险一金", socialTotal.toFixed(2) + " 元"],
      ["专项扣除", (params.specialDeduction || 0).toFixed(2) + " 元"],
      ["起征点", "5,000.00 元"],
    ];

    ctx.font = "15px sans-serif";
    for (let i = 0; i < rows.length; i++) {
      ctx.fillStyle = "#666666";
      ctx.textAlign = "left";
      ctx.fillText(rows[i][0], 60, y);
      ctx.textAlign = "right";
      ctx.fillText(rows[i][1], W - 60, y);
      y += 30;
    }

    // Divider
    y += 5;
    ctx.strokeStyle = "#eeeeee";
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(W - 50, y);
    ctx.stroke();
    y += 25;

    // Current month tax
    ctx.textAlign = "left";
    ctx.fillStyle = "#059048";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("本月纳税", 60, y);
    y += 35;

    if (lastMonth) {
      const taxRows = [
        ["当月个税", lastMonth.currentMonthTax + " 元"],
        ["实发工资", lastMonth.netSalary + " 元"],
      ];

      ctx.font = "15px sans-serif";
      for (let i = 0; i < taxRows.length; i++) {
        ctx.fillStyle = "#666666";
        ctx.textAlign = "left";
        ctx.fillText(taxRows[i][0], 60, y);
        ctx.textAlign = "right";
        if (i === 1) {
          ctx.fillStyle = "#10b981";
          ctx.font = "bold 16px sans-serif";
        }
        ctx.fillText(taxRows[i][1], W - 60, y);
        ctx.font = "15px sans-serif";
        y += 30;
      }
    }

    // Divider
    y += 5;
    ctx.strokeStyle = "#eeeeee";
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(W - 50, y);
    ctx.stroke();
    y += 25;

    // Yearly summary
    ctx.textAlign = "left";
    ctx.fillStyle = "#059048";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("年度汇总 (" + params.currentMonth + "个月)", 60, y);
    y += 35;

    const yearRows = [
      ["年度总收入", yearlyTotal.grossIncome + " 元"],
      ["年度纳税", yearlyTotal.totalTax + " 元"],
      ["年度到手", yearlyTotal.netIncome + " 元"],
      ["实际税率", yearlyTotal.effectiveRate + "%"],
    ];

    ctx.font = "15px sans-serif";
    for (let i = 0; i < yearRows.length; i++) {
      ctx.fillStyle = "#666666";
      ctx.textAlign = "left";
      ctx.fillText(yearRows[i][0], 60, y);
      ctx.textAlign = "right";
      if (i === 2) {
        ctx.fillStyle = "#10b981";
        ctx.font = "bold 16px sans-serif";
      } else if (i === 1) {
        ctx.fillStyle = "#ef4444";
      }
      ctx.fillText(yearRows[i][1], W - 60, y);
      ctx.fillStyle = "#666666";
      ctx.font = "15px sans-serif";
      y += 30;
    }

    // Bottom watermark
    ctx.textAlign = "center";
    ctx.fillStyle = "#cccccc";
    ctx.font = "12px sans-serif";
    ctx.fillText("以上数据仅供参考，实际以税务机关核定为准", W / 2, H - 55);
    ctx.fillText("个税计算器 2026", W / 2, H - 38);

    // Save canvas to image
    setTimeout(() => {
      that.saveCanvasToImage(canvas);
    }, 200);
  },

  // Draw rounded rectangle helper
  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  },

  // Save canvas to photo album
  saveCanvasToImage(canvas) {
    const that = this;
    wx.canvasToTempFilePath({
      canvas: canvas,
      fileType: "png",
      quality: 1,
      success(res) {
        wx.hideLoading();
        that.saveToAlbum(res.tempFilePath);
      },
      fail(err) {
        wx.hideLoading();
        console.error("Canvas to temp file failed:", err);
        wx.showToast({ title: "生成图片失败", icon: "none" });
      },
    });
  },

  // Save image to photo album with authorization handling
  saveToAlbum(tempFilePath) {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success() {
        // Analytics: track save image
        try {
          wx.reportAnalytics("save_image", { page: "result" });
        } catch (e) {
          /* ignore analytics error */
        }
        wx.showToast({ title: "已保存到相册", icon: "success" });
      },
      fail(err) {
        if (
          err.errMsg.indexOf("auth deny") !== -1 ||
          err.errMsg.indexOf("authorize") !== -1
        ) {
          // User denied permission, prompt to open settings
          wx.showModal({
            title: "需要相册权限",
            content: "请在设置中允许访问相册，以便保存图片",
            confirmText: "去设置",
            success(modalRes) {
              if (modalRes.confirm) {
                wx.openSetting();
              }
            },
          });
        } else {
          wx.showToast({ title: "保存失败", icon: "none" });
        }
      },
    });
  },

  // Go back
  onBack() {
    wx.switchTab({
      url: "/pages/index/index",
    });
  },

  // Share
  onShareAppMessage() {
    return {
      title: "个税计算器 - 全年工资明细",
      path: "/pages/index/index",
      imageUrl: "",
    };
  },
});
