// 个税计算器核心算法
// 支持：工资薪金所得税、年终奖计算、税后反推税前、专项附加扣除
// 计税方式：累计预扣法（中国特色）

const { TAX_CONFIG_2026, BONUS_CRITICAL_POINTS } = require('../config/cities-tax-2026');

/**
 * 计算社保公积金
 * @param {number} salary - 税前工资
 * @param {object} socialBase - 社保基数配置
 * @param {object} socialRate - 社保费率
 * @param {number} fundRatio - 公积金比例（5-12%）
 * @returns {object} 社保公积金明细
 */
function calculateSocialSecurity(salary, socialBase, socialRate, fundRatio = 6) {
  // 社保基数取值范围
  const base = Math.max(
    socialBase.min,
    Math.min(salary, socialBase.max)
  );

  // 各项社保
  const pension = base * socialRate.pension;                    // 养老保险
  const medical = base * socialRate.medical + (socialRate.medicalExtra || 0);  // 医疗保险
  const unemployment = base * socialRate.unemployment;          // 失业保险

  // 公积金
  const fundBase = base; // 公积金基数同社保基数
  const fund = fundBase * (fundRatio / 100);

  const totalSocial = pension + medical + unemployment;
  const total = totalSocial + fund;

  return {
    base: Math.round(base * 100) / 100,
    pension: Math.round(pension * 100) / 100,
    medical: Math.round(medical * 100) / 100,
    unemployment: Math.round(unemployment * 100) / 100,
    totalSocial: Math.round(totalSocial * 100) / 100,
    fund: Math.round(fund * 100) / 100,
    total: Math.round(total * 100) / 100
  };
}

/**
 * 计算累计个税（累计预扣法 - 中国特色）
 * @param {number} cumulativeIncome - 累计收入
 * @param {number} cumulativeSocial - 累计社保公积金
 * @param {number} cumulativeDeduction - 累计专项附加扣除
 * @param {number} cumulativePaidTax - 前几个月已缴税额
 * @returns {number} 本月应缴税额
 */
function calculateCumulativeTax(cumulativeIncome, cumulativeSocial, cumulativeDeduction, cumulativePaidTax, month) {
  // 累计应纳税所得额 = 累计收入 - 累计社保公积金 - 累计专项扣除 - 累计起征点
  // 累计起征点 = 月起征点(5000) × 月数
  const cumulativeThreshold = TAX_CONFIG_2026.taxThreshold * month;
  const taxableIncome = cumulativeIncome - cumulativeSocial - cumulativeDeduction - cumulativeThreshold;

  if (taxableIncome <= 0) {
    return 0;
  }

  // 查找适用税率
  const bracket = TAX_CONFIG_2026.taxBrackets.find(b => taxableIncome >= b.min && taxableIncome < b.max);
  if (!bracket) {
    return 0;
  }

  // 本月应纳税额 = (累计应纳税所得额 × 税率 - 速算扣除数) - 前几个月已缴税额
  const cumulativeTax = taxableIncome * (bracket.rate / 100) - bracket.deduction;
  const currentMonthTax = Math.max(0, cumulativeTax - cumulativePaidTax);

  return Math.round(currentMonthTax * 100) / 100;
}

/**
 * 计算月度工资个税（单月）
 * @param {object} params - 参数对象
 * @returns {object} 计算结果
 */
function calculateMonthlyTax(params) {
  const {
    grossSalary,         // 税前工资
    socialSecurity,      // 社保公积金
    specialDeductions,   // 专项附加扣除
    month = 1            // 当前月份（用于累计预扣法）
  } = params;

  // 累计收入
  const cumulativeIncome = grossSalary * month;

  // 累计社保公积金
  const cumulativeSocial = socialSecurity.total * month;

  // 累计专项附加扣除
  const cumulativeDeduction = specialDeductions * month;

  // 累计起征点
  const cumulativeThreshold = TAX_CONFIG_2026.taxThreshold * month;

  // 累计应纳税所得额
  const taxableIncome = cumulativeIncome - cumulativeSocial - cumulativeDeduction - cumulativeThreshold;

  if (taxableIncome <= 0) {
    return {
      grossSalary,
      socialSecurity: socialSecurity.total,
      specialDeductions,
      taxableIncome: 0,
      tax: 0,
      netSalary: grossSalary - socialSecurity.total,
      breakdown: {
        cumulativeIncome,
        cumulativeSocial,
        cumulativeDeduction,
        cumulativeThreshold,
        taxableIncome: 0,
        applicableRate: 0,
        quickDeduction: 0
      }
    };
  }

  // 查找适用税率
  const bracket = TAX_CONFIG_2026.taxBrackets.find(b => taxableIncome >= b.min && taxableIncome < b.max);

  // Cumulative withholding method:
  // Step 1: Calculate cumulative tax up to current month
  const cumulativeTax = taxableIncome * (bracket.rate / 100) - bracket.deduction;

  // Step 2: Calculate cumulative tax up to previous month (month - 1)
  let previousCumulativeTax = 0;
  if (month > 1) {
    const prevIncome = grossSalary * (month - 1);
    const prevSocial = socialSecurity.total * (month - 1);
    const prevDeduction = specialDeductions * (month - 1);
    const prevThreshold = TAX_CONFIG_2026.taxThreshold * (month - 1);
    const prevTaxable = prevIncome - prevSocial - prevDeduction - prevThreshold;

    if (prevTaxable > 0) {
      const prevBracket = TAX_CONFIG_2026.taxBrackets.find(b => prevTaxable >= b.min && prevTaxable < b.max);
      if (prevBracket) {
        previousCumulativeTax = prevTaxable * (prevBracket.rate / 100) - prevBracket.deduction;
      }
    }
  }

  // Step 3: Current month tax = cumulative tax (current) - cumulative tax (previous)
  const monthlyTax = Math.max(0, cumulativeTax - previousCumulativeTax);

  // 税后工资
  const netSalary = grossSalary - socialSecurity.total - monthlyTax;

  return {
    grossSalary,
    socialSecurity: Math.round(socialSecurity.total * 100) / 100,
    specialDeductions,
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    tax: Math.round(monthlyTax * 100) / 100,
    netSalary: Math.round(netSalary * 100) / 100,
    breakdown: {
      cumulativeIncome: Math.round(cumulativeIncome * 100) / 100,
      cumulativeSocial: Math.round(cumulativeSocial * 100) / 100,
      cumulativeDeduction: Math.round(cumulativeDeduction * 100) / 100,
      cumulativeThreshold: Math.round(cumulativeThreshold * 100) / 100,
      taxableIncome: Math.round(taxableIncome * 100) / 100,
      applicableRate: bracket.rate,
      quickDeduction: bracket.deduction
    }
  };
}

/**
 * 计算年终奖个税（单独计税）
 * @param {number} bonus - 年终奖金额
 * @returns {object} 计算结果
 */
function calculateBonusTax(bonus) {
  if (bonus <= 0) {
    return {
      bonus,
      tax: 0,
      netBonus: bonus,
      effectiveRate: 0,
      isCritical: false
    };
  }

  // 年终奖除以12,找对应的月度税率档位
  const monthlyBonus = bonus / 12;

  // 用月均年终奖查找适用税率(注意:这里要用月度档位)
  const bracket = TAX_CONFIG_2026.taxBrackets.find(b =>
    monthlyBonus >= b.min && monthlyBonus < b.max
  );

  if (!bracket) {
    // 超过最高档位,使用45%税率
    const highestBracket = TAX_CONFIG_2026.taxBrackets[TAX_CONFIG_2026.taxBrackets.length - 1];
    const tax = bonus * (highestBracket.rate / 100) - highestBracket.deduction;
    const netBonus = bonus - tax;
    return {
      bonus,
      tax: Math.round(tax * 100) / 100,
      netBonus: Math.round(netBonus * 100) / 100,
      effectiveRate: parseFloat((tax / bonus * 100).toFixed(2)),
      isCritical: false
    };
  }

  // 年终奖个税 = 年终奖总额 × 税率 - 速算扣除数
  const tax = bonus * (bracket.rate / 100) - bracket.deduction;
  const netBonus = bonus - tax;
  const effectiveRate = (tax / bonus * 100).toFixed(2);

  // 检查是否在临界点附近（多发1元，多扣很多税）
  const nearCritical = BONUS_CRITICAL_POINTS.find(point => {
    return bonus >= point.point - 1000 && bonus <= point.point + 1000;
  });

  return {
    bonus,
    tax: Math.round(tax * 100) / 100,
    netBonus: Math.round(netBonus * 100) / 100,
    effectiveRate: parseFloat(effectiveRate),
    bracket: {
      rate: bracket.rate,
      deduction: bracket.deduction
    },
    isCritical: !!nearCritical,
    criticalWarning: nearCritical ? {
      point: nearCritical.point,
      suggestion: bonus > nearCritical.point ?
        `⚠️ 超过临界点 ${nearCritical.point}元，建议调整至 ${nearCritical.point}元以下，可节省 ${Math.round(nearCritical.diff)}元税！` :
        `✅ 未超过临界点 ${nearCritical.point}元，继续保持`
    } : null
  };
}

/**
 * 税后反推税前
 * @param {object} params - 参数对象
 * @returns {object} 计算结果
 */
function calculateGrossFromNet(params) {
  const {
    netSalary,           // 期望税后工资
    socialSecurity,      // 社保公积金（需要提前计算）
    specialDeductions    // 专项附加扣除
  } = params;

  // 采用二分法逐步逼近
  let low = netSalary;
  let high = netSalary * 2;
  let grossSalary = 0;
  let iterations = 0;
  const maxIterations = 100;
  const tolerance = 0.01; // 精度容差

  while (iterations < maxIterations) {
    const mid = (low + high) / 2;

    // 用mid作为税前工资计算税后
    const result = calculateMonthlyTax({
      grossSalary: mid,
      socialSecurity,
      specialDeductions,
      month: 1
    });

    const diff = result.netSalary - netSalary;

    if (Math.abs(diff) < tolerance) {
      grossSalary = mid;
      break;
    }

    if (diff > 0) {
      // 计算出的税后工资太高，降低税前工资
      high = mid;
    } else {
      // 计算出的税后工资太低，提高税前工资
      low = mid;
    }

    iterations++;
  }

  // 用最终的税前工资重新计算
  const finalResult = calculateMonthlyTax({
    grossSalary,
    socialSecurity,
    specialDeductions,
    month: 1
  });

  return {
    netSalary,
    grossSalary: Math.round(grossSalary * 100) / 100,
    socialSecurity: finalResult.socialSecurity,
    tax: finalResult.tax,
    specialDeductions,
    totalDeduction: finalResult.socialSecurity + finalResult.tax,
    iterations
  };
}

/**
 * 年终奖优化计算（避开临界点）
 * @param {number} totalBonus - 总年终奖金额
 * @returns {object} 优化建议
 */
function optimizeBonusTax(totalBonus) {
  const directResult = calculateBonusTax(totalBonus);

  // 查找最近的临界点
  let nearestCritical = null;
  let minDistance = Infinity;

  BONUS_CRITICAL_POINTS.forEach(point => {
    const distance = Math.abs(totalBonus - point.point);
    if (distance < minDistance && totalBonus > point.point) {
      minDistance = distance;
      nearestCritical = point;
    }
  });

  if (!nearestCritical) {
    return {
      original: directResult,
      optimized: directResult,
      saved: 0,
      suggestion: '✅ 当前金额无需优化'
    };
  }

  // 如果超过临界点不多，建议降至临界点
  if (minDistance < nearestCritical.diff / 2) {
    const optimizedBonus = nearestCritical.point;
    const optimizedResult = calculateBonusTax(optimizedBonus);
    const saved = directResult.tax - optimizedResult.tax;

    return {
      original: directResult,
      optimized: optimizedResult,
      saved: Math.round(saved * 100) / 100,
      suggestion: `💡 建议将年终奖调整为 ${optimizedBonus}元，可节省 ${Math.round(saved)}元税！`
    };
  }

  return {
    original: directResult,
    optimized: directResult,
    saved: 0,
    suggestion: '✅ 当前金额已是较优方案'
  };
}

/**
 * 计算12个月累计个税明细
 * @param {object} params - 参数对象
 * @returns {array} 12个月明细
 */
function calculate12MonthsTax(params) {
  const {
    monthlyGrossSalary,  // 每月税前工资
    socialSecurity,      // 每月社保公积金
    specialDeductions    // 每月专项附加扣除
  } = params;

  const schedule = [];
  let cumulativePaidTax = 0;

  for (let month = 1; month <= 12; month++) {
    const cumulativeIncome = monthlyGrossSalary * month;
    const cumulativeSocial = socialSecurity.total * month;
    const cumulativeDeduction = specialDeductions * month;

    const monthlyTax = calculateCumulativeTax(
      cumulativeIncome,
      cumulativeSocial,
      cumulativeDeduction,
      cumulativePaidTax,
      month
    );

    cumulativePaidTax += monthlyTax;

    const netSalary = monthlyGrossSalary - socialSecurity.total - monthlyTax;

    schedule.push({
      month,
      grossSalary: monthlyGrossSalary,
      socialSecurity: Math.round(socialSecurity.total * 100) / 100,
      tax: Math.round(monthlyTax * 100) / 100,
      netSalary: Math.round(netSalary * 100) / 100,
      cumulativeTax: Math.round(cumulativePaidTax * 100) / 100
    });
  }

  return schedule;
}

/**
 * Calculate yearly total from monthly details
 * @param {array} monthlyDetails - Array of monthly detail objects
 * @param {number} totalMonths - Number of months to summarize
 * @returns {object} Yearly total summary
 */
function calculateYearlyTotal(monthlyDetails, totalMonths = 12) {
  const months = monthlyDetails.slice(0, totalMonths);

  if (months.length === 0) {
    return {
      grossIncome: '0.00',
      totalTax: '0.00',
      netIncome: '0.00',
      effectiveRate: '0.00'
    };
  }

  const grossIncome = months.reduce((sum, m) => {
    return sum + parseFloat(m.grossSalary || 0);
  }, 0);

  const totalTax = months.reduce((sum, m) => {
    return sum + parseFloat(m.tax || m.currentMonthTax || 0);
  }, 0);

  const totalSocial = months.reduce((sum, m) => {
    return sum + parseFloat(m.socialSecurity || m.socialInsurance || 0);
  }, 0);

  const netIncome = grossIncome - totalSocial - totalTax;

  const effectiveRate = grossIncome > 0
    ? ((totalTax / grossIncome) * 100).toFixed(2)
    : '0.00';

  return {
    grossIncome: grossIncome.toFixed(2),
    totalTax: totalTax.toFixed(2),
    totalSocial: totalSocial.toFixed(2),
    netIncome: netIncome.toFixed(2),
    effectiveRate
  };
}

/**
 * Calculate annual tax by annual bracket table
 * @param {number} taxableIncome - Annual taxable income
 * @returns {number} Annual tax amount
 */
function calculateByAnnualBracket(taxableIncome) {
  if (taxableIncome <= 0) return 0;

  const bracket = TAX_CONFIG_2026.taxBrackets.find(
    b => taxableIncome >= b.min && taxableIncome < b.max
  );

  if (!bracket) return 0;

  return taxableIncome * (bracket.rate / 100) - bracket.deduction;
}

/**
 * Calculate annual tax settlement (汇算清缴)
 * @param {object} params - Settlement parameters
 * @returns {object} Settlement result with refund/supplement info
 */
function calculateAnnualSettlement(params) {
  const {
    totalSalary,      // Total salary income for the year
    bonus,            // Annual bonus
    otherIncome,      // Other income (freelance, royalties, etc.)
    paidTax,          // Total tax already paid during the year
    totalSocial,      // Total social security paid during the year
    totalDeduction,   // Total special deductions during the year
    bonusMerged       // Whether bonus is merged into comprehensive income
  } = params;

  // Total comprehensive income
  const totalIncome = totalSalary + (bonusMerged ? (bonus || 0) : 0) + (otherIncome || 0);

  // Annual taxable income = total income - 60000 threshold - social security - special deductions
  const taxableIncome = totalIncome - 60000 - totalSocial - totalDeduction;

  // Annual tax (using annual bracket table)
  const annualTax = calculateByAnnualBracket(Math.max(taxableIncome, 0));

  // If bonus is separate, calculate bonus tax independently
  let bonusTax = 0;
  if (!bonusMerged && bonus > 0) {
    const bonusResult = calculateBonusTax(bonus);
    bonusTax = bonusResult.tax;
  }

  // Total annual tax payable
  const totalAnnualTax = Math.round((annualTax + bonusTax) * 100) / 100;

  // Settlement: positive = need to pay more, negative = refund
  const settlement = Math.round((totalAnnualTax - paidTax) * 100) / 100;

  // Find applicable bracket for display
  const effectiveTaxableIncome = Math.max(taxableIncome, 0);
  const bracket = TAX_CONFIG_2026.taxBrackets.find(
    b => effectiveTaxableIncome >= b.min && effectiveTaxableIncome < b.max
  );

  return {
    totalIncome: Math.round(totalIncome * 100) / 100,
    taxableIncome: Math.round(Math.max(taxableIncome, 0) * 100) / 100,
    annualTax: Math.round(annualTax * 100) / 100,
    bonusTax: Math.round(bonusTax * 100) / 100,
    totalAnnualTax,
    paidTax: Math.round(paidTax * 100) / 100,
    settlement,
    isRefund: settlement < 0,
    refundAmount: settlement < 0 ? Math.abs(settlement) : 0,
    supplementAmount: settlement > 0 ? settlement : 0,
    bracket: bracket ? { rate: bracket.rate, deduction: bracket.deduction } : null,
    breakdown: {
      totalSalary: Math.round(totalSalary * 100) / 100,
      bonus: Math.round((bonus || 0) * 100) / 100,
      otherIncome: Math.round((otherIncome || 0) * 100) / 100,
      threshold: 60000,
      totalSocial: Math.round(totalSocial * 100) / 100,
      totalDeduction: Math.round(totalDeduction * 100) / 100,
      bonusMerged: !!bonusMerged
    }
  };
}

module.exports = {
  calculateSocialSecurity,
  calculateCumulativeTax,
  calculateMonthlyTax,
  calculateBonusTax,
  calculateGrossFromNet,
  optimizeBonusTax,
  calculate12MonthsTax,
  calculateYearlyTotal,
  calculateAnnualSettlement,
  calculateByAnnualBracket
};
