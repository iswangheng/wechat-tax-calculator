// Chart Drawing Utility for WeChat Mini Program
// Uses Canvas 2D API (type="2d") for rendering pie and line charts
// Color scheme: green finance series (#07C160 WeChat green as primary)

var { BONUS_TAX_BRACKETS } = require("../config/cities-tax-2026");

/**
 * Draw a pie chart with center text and legend
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {number} width - Canvas logical width
 * @param {number} height - Canvas logical height
 * @param {Array} data - [{label, value, color}]
 * @param {string} centerText - Text to display in the center
 * @param {string} centerSubText - Sub text below center text
 */
function drawPieChart(ctx, width, height, data, centerText, centerSubText) {
  ctx.clearRect(0, 0, width, height);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return;

  // Layout calculations
  const legendHeight = Math.ceil(data.length / 2) * 28 + 20;
  const chartAreaHeight = height - legendHeight - 10;
  const centerX = width / 2;
  const centerY = chartAreaHeight / 2 + 10;
  const radius = Math.min(centerX, chartAreaHeight / 2) * 0.65;
  const innerRadius = radius * 0.55; // Donut style

  // Draw pie slices
  var startAngle = -Math.PI / 2;

  data.forEach(function (item) {
    var sliceAngle = (item.value / total) * Math.PI * 2;
    var endAngle = startAngle + sliceAngle;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(
      centerX + innerRadius * Math.cos(startAngle),
      centerY + innerRadius * Math.sin(startAngle),
    );
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineTo(
      centerX + innerRadius * Math.cos(endAngle),
      centerY + innerRadius * Math.sin(endAngle),
    );
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();

    // Draw percentage label on slice
    var midAngle = startAngle + sliceAngle / 2;
    var labelRadius = radius + 18;
    var percentage = ((item.value / total) * 100).toFixed(1);

    if (parseFloat(percentage) > 3) {
      var labelX = centerX + labelRadius * Math.cos(midAngle);
      var labelY = centerY + labelRadius * Math.sin(midAngle);

      ctx.font = "11px sans-serif";
      ctx.fillStyle = item.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(percentage + "%", labelX, labelY);
    }

    startAngle = endAngle;
  });

  // Draw center text
  if (centerText) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#333333";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(centerText, centerX, centerY - 8);
  }
  if (centerSubText) {
    ctx.fillStyle = "#999999";
    ctx.font = "11px sans-serif";
    ctx.fillText(centerSubText, centerX, centerY + 12);
  }

  // Draw legend below chart
  var legendStartY = chartAreaHeight + 10;
  var legendStartX = 20;
  var legendColWidth = (width - 40) / 2;

  data.forEach(function (item, index) {
    var col = index % 2;
    var row = Math.floor(index / 2);
    var x = legendStartX + col * legendColWidth;
    var y = legendStartY + row * 28;

    // Color dot
    ctx.beginPath();
    ctx.arc(x + 6, y + 6, 5, 0, Math.PI * 2);
    ctx.fillStyle = item.color;
    ctx.fill();

    // Label
    ctx.fillStyle = "#666666";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    var amount = formatNumber(item.value);
    ctx.fillText(item.label + " " + amount, x + 16, y + 6);
  });
}

/**
 * Draw a line chart with axes, grid, and data points
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {number} width - Canvas logical width
 * @param {number} height - Canvas logical height
 * @param {object} config - Chart configuration
 */
function drawLineChart(ctx, width, height, config) {
  ctx.clearRect(0, 0, width, height);

  var labels = config.labels || [];
  var data = config.data || [];
  var lineColor = config.lineColor || "#07C160";
  var fillColor = config.fillColor || "rgba(7, 193, 96, 0.15)";
  var title = config.title || "";
  var markers = config.markers || [];
  var currentMarker = config.currentMarker || null;

  if (data.length === 0) return;

  // Layout padding
  var paddingLeft = 55;
  var paddingRight = 20;
  var paddingTop = title ? 40 : 20;
  var paddingBottom = 45;

  var chartWidth = width - paddingLeft - paddingRight;
  var chartHeight = height - paddingTop - paddingBottom;

  // Calculate Y-axis range
  var maxVal = Math.max.apply(null, data);
  var minVal = Math.min.apply(null, [].concat(data, [0]));
  var yRange = maxVal - minVal || 1;

  // Y-axis grid lines (5 lines)
  var ySteps = 5;
  var yStepVal = niceNumber(yRange / ySteps);
  var yMin = Math.floor(minVal / yStepVal) * yStepVal;
  var yMax = Math.ceil(maxVal / yStepVal) * yStepVal;
  var yActualRange = yMax - yMin || 1;

  // Draw title
  if (title) {
    ctx.fillStyle = "#333333";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(title, width / 2, 8);
  }

  // Draw grid and Y-axis labels
  ctx.strokeStyle = "#f0f0f0";
  ctx.lineWidth = 0.5;
  ctx.fillStyle = "#999999";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (var i = 0; i <= ySteps; i++) {
    var val = yMin + i * yStepVal;
    var y =
      paddingTop + chartHeight - ((val - yMin) / yActualRange) * chartHeight;

    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();

    ctx.fillText(formatShortNumber(val), paddingLeft - 8, y);
  }

  // Draw X-axis labels
  ctx.fillStyle = "#999999";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  var xStep = chartWidth / (labels.length - 1 || 1);

  labels.forEach(function (label, idx) {
    var x = paddingLeft + idx * xStep;
    ctx.fillText(label, x, paddingTop + chartHeight + 8);
  });

  // Compute point positions
  var points = data.map(function (val, idx) {
    return {
      x: paddingLeft + idx * xStep,
      y: paddingTop + chartHeight - ((val - yMin) / yActualRange) * chartHeight,
    };
  });

  // Draw gradient fill
  var gradient = ctx.createLinearGradient(
    0,
    paddingTop,
    0,
    paddingTop + chartHeight,
  );
  gradient.addColorStop(0, fillColor);
  gradient.addColorStop(1, "rgba(7, 193, 96, 0.02)");

  ctx.beginPath();
  ctx.moveTo(points[0].x, paddingTop + chartHeight);
  points.forEach(function (p) {
    ctx.lineTo(p.x, p.y);
  });
  ctx.lineTo(points[points.length - 1].x, paddingTop + chartHeight);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw line
  ctx.beginPath();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  points.forEach(function (p, idx) {
    if (idx === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // Draw data points
  points.forEach(function (p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Draw markers (key points like tax bracket changes)
  markers.forEach(function (marker) {
    if (marker.index >= 0 && marker.index < points.length) {
      var p = points[marker.index];

      // Highlighted dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#059048";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dashed vertical line
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = "#059048";
      ctx.lineWidth = 1;
      ctx.moveTo(p.x, p.y + 6);
      ctx.lineTo(p.x, paddingTop + chartHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      if (marker.label) {
        ctx.fillStyle = "#059048";
        ctx.font = "9px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(marker.label, p.x, p.y - 8);
      }
    }
  });

  // Draw current position marker
  if (
    currentMarker &&
    currentMarker.index >= 0 &&
    currentMarker.index < points.length
  ) {
    var cp = points[currentMarker.index];

    // Large highlight circle
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(7, 193, 96, 0.3)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cp.x, cp.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#07C160";
    ctx.fill();

    // Label with background
    if (currentMarker.label) {
      var labelText = currentMarker.label;
      ctx.font = "bold 10px sans-serif";
      var textWidth = ctx.measureText(labelText).width;
      var bgPadding = 4;
      var bgX = cp.x - textWidth / 2 - bgPadding;
      var bgY = cp.y - 24;

      ctx.fillStyle = "#07C160";
      roundRect(ctx, bgX, bgY, textWidth + bgPadding * 2, 16, 4);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labelText, cp.x, bgY + 8);
    }
  }
}

/**
 * Draw a line chart for bonus critical points visualization
 * Shows the "cliff effect" at critical bonus thresholds
 */
function drawBonusCliffChart(ctx, width, height, config) {
  ctx.clearRect(0, 0, width, height);

  var userBonus = config.userBonus || 0;

  // Critical thresholds derived from BONUS_TAX_BRACKETS boundaries × 12
  var thresholds = config.thresholds || [
    36000, 144000, 300000, 420000, 660000, 960000,
  ];

  // Layout
  var paddingLeft = 50;
  var paddingRight = 20;
  var paddingTop = 35;
  var paddingBottom = 55;

  var chartWidth = width - paddingLeft - paddingRight;
  var chartHeight = height - paddingTop - paddingBottom;

  // Generate data points for the chart
  var maxBonus = 1050000;
  var samplePoints = generateBonusSamples(thresholds, maxBonus);
  var dataPoints = samplePoints.map(function (bonus) {
    return { bonus: bonus, netIncome: calcBonusNet(bonus) };
  });

  // Calculate ranges
  var maxNet = 0;
  dataPoints.forEach(function (d) {
    if (d.netIncome > maxNet) maxNet = d.netIncome;
  });
  var minNet = 0;
  var netRange = maxNet - minNet || 1;

  // Title
  ctx.fillStyle = "#333333";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("年终奖到手金额 vs 年终奖金额", width / 2, 6);

  // Draw grid
  ctx.strokeStyle = "#f0f0f0";
  ctx.lineWidth = 0.5;

  // Y-axis grid and labels
  var ySteps = 5;
  ctx.fillStyle = "#999999";
  ctx.font = "9px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (var i = 0; i <= ySteps; i++) {
    var val = minNet + (netRange * i) / ySteps;
    var gy = paddingTop + chartHeight - (i / ySteps) * chartHeight;

    ctx.beginPath();
    ctx.moveTo(paddingLeft, gy);
    ctx.lineTo(width - paddingRight, gy);
    ctx.stroke();

    ctx.fillText(formatShortNumber(val), paddingLeft - 6, gy);
  }

  // X-axis labels for critical points
  var xLabels = [0].concat(thresholds);

  xLabels.forEach(function (labelVal) {
    if (labelVal > maxBonus) return;
    var x = paddingLeft + (labelVal / maxBonus) * chartWidth;

    // Dashed vertical line at critical points
    if (labelVal > 0) {
      ctx.beginPath();
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = "rgba(245, 87, 108, 0.3)";
      ctx.lineWidth = 0.5;
      ctx.moveTo(x, paddingTop);
      ctx.lineTo(x, paddingTop + chartHeight);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Rotated label
    ctx.save();
    ctx.translate(x, paddingTop + chartHeight + 6);
    ctx.rotate(-Math.PI / 6);
    ctx.fillStyle = labelVal > 0 ? "#059048" : "#999999";
    ctx.font = "8px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(formatShortNumber(labelVal), 0, 0);
    ctx.restore();
  });

  // Convert data points to canvas coordinates
  var points = dataPoints.map(function (d) {
    return {
      x: paddingLeft + (d.bonus / maxBonus) * chartWidth,
      y:
        paddingTop +
        chartHeight -
        ((d.netIncome - minNet) / netRange) * chartHeight,
      bonus: d.bonus,
      netIncome: d.netIncome,
    };
  });

  // Draw gradient fill
  var gradient = ctx.createLinearGradient(
    0,
    paddingTop,
    0,
    paddingTop + chartHeight,
  );
  gradient.addColorStop(0, "rgba(7, 193, 96, 0.2)");
  gradient.addColorStop(1, "rgba(7, 193, 96, 0.02)");

  ctx.beginPath();
  ctx.moveTo(points[0].x, paddingTop + chartHeight);
  points.forEach(function (p) {
    ctx.lineTo(p.x, p.y);
  });
  ctx.lineTo(points[points.length - 1].x, paddingTop + chartHeight);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw line segments (red near cliffs)
  for (var si = 1; si < points.length; si++) {
    var prev = points[si - 1];
    var curr = points[si];
    var isCliff = curr.netIncome < prev.netIncome - 100;

    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(curr.x, curr.y);
    ctx.strokeStyle = isCliff ? "#ef4444" : "#07C160";
    ctx.lineWidth = isCliff ? 2.5 : 1.5;
    ctx.stroke();
  }

  // Mark critical points with cliff labels
  thresholds.forEach(function (threshold) {
    if (threshold > maxBonus) return;

    var tx = paddingLeft + (threshold / maxBonus) * chartWidth;
    var netBefore = calcBonusNet(threshold);
    var tyBefore =
      paddingTop +
      chartHeight -
      ((netBefore - minNet) / netRange) * chartHeight;

    // Red dot at cliff point
    ctx.beginPath();
    ctx.arc(tx, tyBefore, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Draw user's current bonus position
  if (userBonus > 0 && userBonus <= maxBonus) {
    var userX = paddingLeft + (userBonus / maxBonus) * chartWidth;
    var userNet = calcBonusNet(userBonus);
    var userY =
      paddingTop + chartHeight - ((userNet - minNet) / netRange) * chartHeight;

    // Vertical dashed line
    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = "#07C160";
    ctx.lineWidth = 1.5;
    ctx.moveTo(userX, paddingTop);
    ctx.lineTo(userX, paddingTop + chartHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // Large marker
    ctx.beginPath();
    ctx.arc(userX, userY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(7, 193, 96, 0.3)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(userX, userY, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#07C160";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label with background
    var uLabelText = formatShortNumber(userBonus);
    ctx.font = "bold 10px sans-serif";
    var uTextW = ctx.measureText(uLabelText).width;
    var uBgPad = 5;
    var uBgX = userX - uTextW / 2 - uBgPad;
    var uBgY = userY - 26;

    ctx.fillStyle = "#07C160";
    roundRect(ctx, uBgX, uBgY, uTextW + uBgPad * 2, 18, 4);
    ctx.fill();

    // Arrow pointing down
    ctx.beginPath();
    ctx.moveTo(userX - 4, uBgY + 18);
    ctx.lineTo(userX, uBgY + 22);
    ctx.lineTo(userX + 4, uBgY + 18);
    ctx.fillStyle = "#07C160";
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText(uLabelText, userX, uBgY + 9);
  }
}

// ==================== Helper functions ====================

/**
 * Calculate net income for a given bonus amount (standalone taxation)
 * Uses BONUS_TAX_BRACKETS from config to stay in sync with tax-calculator.js
 */
function calcBonusNet(bonus) {
  if (bonus <= 0) return 0;

  var monthlyAvg = bonus / 12;

  var bracket = null;
  for (var i = 0; i < BONUS_TAX_BRACKETS.length; i++) {
    if (monthlyAvg >= BONUS_TAX_BRACKETS[i].min && monthlyAvg <= BONUS_TAX_BRACKETS[i].max) {
      bracket = BONUS_TAX_BRACKETS[i];
      break;
    }
  }
  if (!bracket) return bonus;

  var tax = bonus * (bracket.rate / 100) - bracket.deduction;
  return bonus - Math.max(0, tax);
}

/**
 * Generate sample points around critical thresholds for smooth chart
 */
function generateBonusSamples(thresholds, maxVal) {
  var samplesObj = {};

  samplesObj[0] = true;
  samplesObj[maxVal] = true;

  // Regular intervals
  var step = maxVal / 100;
  for (var i = 0; i <= 100; i++) {
    samplesObj[Math.round(i * step)] = true;
  }

  // Dense sampling around critical points
  thresholds.forEach(function (t) {
    for (var offset = -5000; offset <= 5000; offset += 200) {
      var v = t + offset;
      if (v >= 0 && v <= maxVal) samplesObj[v] = true;
    }
    if (t - 1 >= 0) samplesObj[t - 1] = true;
    samplesObj[t] = true;
    samplesObj[t + 1] = true;
    samplesObj[t + 2] = true;
  });

  return Object.keys(samplesObj)
    .map(Number)
    .sort(function (a, b) {
      return a - b;
    });
}

/**
 * Format number with K/W suffix
 */
function formatShortNumber(num) {
  if (num >= 10000) {
    var w = num / 10000;
    return (num % 10000 === 0 ? w.toFixed(0) : w.toFixed(1)) + "W";
  }
  if (num >= 1000) {
    var k = num / 1000;
    return (num % 1000 === 0 ? k.toFixed(0) : k.toFixed(1)) + "K";
  }
  return num.toFixed(0);
}

/**
 * Format number with comma separators
 */
function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return "0.00";
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Calculate a "nice" rounded number for axis steps
 */
function niceNumber(range) {
  var exponent = Math.floor(Math.log10(range));
  var fraction = range / Math.pow(10, exponent);
  var nice;

  if (fraction <= 1.5) nice = 1;
  else if (fraction <= 3) nice = 2;
  else if (fraction <= 7) nice = 5;
  else nice = 10;

  return nice * Math.pow(10, exponent);
}

/**
 * Draw a rounded rectangle path
 */
function roundRect(ctx, x, y, w, h, r) {
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
}

/**
 * Initialize a Canvas 2D node with proper DPR scaling
 * @param {object} pageInstance - The Page instance (this)
 * @param {string} canvasId - Canvas selector id
 * @param {function} drawCb - Callback(ctx, width, height, canvas) called when ready
 */
function initCanvas(pageInstance, canvasId, drawCb) {
  var query = wx.createSelectorQuery().in(pageInstance);
  query
    .select("#" + canvasId)
    .fields({ node: true, size: true })
    .exec(function (res) {
      if (!res || !res[0] || !res[0].node) {
        console.error("Canvas node not found: #" + canvasId);
        return;
      }

      var canvas = res[0].node;
      var ctx = canvas.getContext("2d");
      var dpr = wx.getSystemInfoSync().pixelRatio;

      var w = res[0].width;
      var h = res[0].height;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      if (typeof drawCb === "function") {
        drawCb(ctx, w, h, canvas);
      }
    });
}

module.exports = {
  drawPieChart: drawPieChart,
  drawLineChart: drawLineChart,
  drawBonusCliffChart: drawBonusCliffChart,
  initCanvas: initCanvas,
  calcBonusNet: calcBonusNet,
};
