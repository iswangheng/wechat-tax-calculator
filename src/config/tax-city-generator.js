// 个税计算器 - 城市社保配置生成器
// 基于省份模板快速生成全国主要城市配置

// 省份模板（基于各省平均水平）
const PROVINCE_TAX_TEMPLATES = {
  '江苏': {
    socialBase: { min: 2280, max: 25800 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 1100
  },
  '浙江': {
    socialBase: { min: 3957, max: 23766 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.10,
    rentDeduction: 1100
  },
  '山东': {
    socialBase: { min: 3980, max: 21900 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 1100
  },
  '安徽': {
    socialBase: { min: 3429, max: 18930 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 1100
  },
  '福建': {
    socialBase: { min: 1720, max: 22311 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 1100
  },
  '江西': {
    socialBase: { min: 3224, max: 16119 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 800
  },
  '河北': {
    socialBase: { min: 3368, max: 19849 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 1100
  },
  '河南': {
    socialBase: { min: 3179, max: 17455 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.003 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.103 + 0.08,
    rentDeduction: 1100
  },
  '山西': {
    socialBase: { min: 3235, max: 16173 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 800
  },
  '内蒙古': {
    socialBase: { min: 3462, max: 19008 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 800
  },
  '广东': {
    socialBase: { min: 2300, max: 36072 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.002 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.102 + 0.10,
    rentDeduction: 1100
  },
  '广西': {
    socialBase: { min: 3323, max: 19938 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 1100
  },
  '海南': {
    socialBase: { min: 1830, max: 21843 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 1100
  },
  '湖北': {
    socialBase: { min: 3739.8, max: 18699 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.003 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.103 + 0.08,
    rentDeduction: 1100
  },
  '湖南': {
    socialBase: { min: 3263, max: 16314 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.003 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.103 + 0.08,
    rentDeduction: 1100
  },
  '四川': {
    socialBase: { min: 3726, max: 18630 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.004 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.104 + 0.08,
    rentDeduction: 1100
  },
  '贵州': {
    socialBase: { min: 3712.8, max: 18564 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 1100
  },
  '云南': {
    socialBase: { min: 3770, max: 18849 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 1100
  },
  '陕西': {
    socialBase: { min: 4172, max: 20862 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.003 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.103 + 0.08,
    rentDeduction: 1100
  },
  '甘肃': {
    socialBase: { min: 3678, max: 18390 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 800
  },
  '青海': {
    socialBase: { min: 3800, max: 19000 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 800
  },
  '宁夏': {
    socialBase: { min: 3523, max: 17615 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 800
  },
  '新疆': {
    socialBase: { min: 3682, max: 18409 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 800
  },
  '辽宁': {
    socialBase: { min: 3500, max: 19557 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 1100
  },
  '吉林': {
    socialBase: { min: 3250, max: 18239 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 800
  },
  '黑龙江': {
    socialBase: { min: 3184, max: 17919 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 0.05, max: 0.12 },
    totalRate: 0.105 + 0.08,
    rentDeduction: 800
  }
};

// 按省份分类的城市（排除已有的35个城市）
const TAX_CITIES_BY_PROVINCE = {
  '江苏': ['镇江', '扬州', '泰州', '盐城', '淮安', '宿迁', '连云港'],
  '浙江': ['温州', '湖州', '金华', '衢州', '舟山', '台州', '丽水'],
  '山东': ['淄博', '枣庄', '东营', '烟台', '潍坊', '威海', '泰安', '临沂', '德州', '聊城', '滨州', '菏泽'],
  '安徽': ['淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '六安', '亳州', '池州', '宣城'],
  '福建': ['三明', '莆田', '泉州', '漳州', '南平', '龙岩', '宁德'],
  '江西': ['景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶'],
  '河北': ['唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'],
  '河南': ['洛阳', '开封', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店'],
  '山西': ['大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'],
  '内蒙古': ['包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布'],
  '广东': ['珠海', '汕头', '韶关', '湛江', '肇庆', '江门', '茂名', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '潮州', '揭阳', '云浮'],
  '广西': ['柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左'],
  '海南': ['三亚', '三沙', '儋州', '五指山', '琼海', '文昌', '万宁', '东方'],
  '湖北': ['黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州'],
  '湖南': ['株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底'],
  '四川': ['自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳'],
  '贵州': ['六盘水', '遵义', '安顺', '毕节', '铜仁'],
  '云南': ['曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧'],
  '陕西': ['铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛'],
  '甘肃': ['嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南'],
  '青海': ['西宁', '海东'],
  '宁夏': ['银川', '石嘴山', '吴忠', '固原', '中卫'],
  '新疆': ['克拉玛依', '吐鲁番', '哈密', '昌吉', '博尔塔拉', '巴音郭楞', '阿克苏', '喀什', '和田'],
  '辽宁': ['鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'],
  '吉林': ['吉林', '四平', '辽源', '通化', '白山', '松原', '白城'],
  '黑龙江': ['齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化']
};

// 生成单个城市配置
function generateTaxCityConfig(cityName, province) {
  const template = PROVINCE_TAX_TEMPLATES[province];

  return {
    name: cityName,
    level: '三线',
    socialBase: template.socialBase,
    socialRate: template.socialRate,
    fundRate: template.fundRate,
    totalRate: template.totalRate,
    rentDeduction: template.rentDeduction
  };
}

// 生成所有城市配置代码
function generateAllTaxCitiesCode() {
  let code = '';
  let totalCities = 0;

  for (const [province, cities] of Object.entries(TAX_CITIES_BY_PROVINCE)) {
    code += `\n  // ${province}省\n`;

    for (const city of cities) {
      const config = generateTaxCityConfig(city, province);

      code += `  '${city}': {\n`;
      code += `    name: '${config.name}',\n`;
      code += `    level: '${config.level}',\n`;
      code += `    socialBase: {\n`;
      code += `      min: ${config.socialBase.min},\n`;
      code += `      max: ${config.socialBase.max}\n`;
      code += `    },\n`;
      code += `    socialRate: {\n`;
      code += `      pension: ${config.socialRate.pension},\n`;
      code += `      medical: ${config.socialRate.medical},\n`;
      code += `      unemployment: ${config.socialRate.unemployment}\n`;
      code += `    },\n`;
      code += `    fundRate: {\n`;
      code += `      min: ${config.fundRate.min},\n`;
      code += `      max: ${config.fundRate.max}\n`;
      code += `    },\n`;
      code += `    totalRate: ${config.totalRate},  // ${(config.totalRate * 100).toFixed(1)}%\n`;
      code += `    rentDeduction: ${config.rentDeduction}\n`;
      code += `  },\n\n`;

      totalCities++;
    }
  }

  return code;
}

// 导出函数（供外部调用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateAllTaxCitiesCode,
    generateTaxCityConfig,
    PROVINCE_TAX_TEMPLATES,
    TAX_CITIES_BY_PROVINCE
  };
}

// 如果直接运行，打印统计信息
if (require.main === module) {
  console.log('========================================');
  console.log('个税计算器 - 城市配置生成器');
  console.log('========================================\n');

  let totalCities = 0;
  for (const cities of Object.values(TAX_CITIES_BY_PROVINCE)) {
    totalCities += cities.length;
  }

  console.log(`📊 统计信息:`);
  console.log(`   - 覆盖省份: ${Object.keys(TAX_CITIES_BY_PROVINCE).length} 个`);
  console.log(`   - 新增城市: ${totalCities} 个`);
  console.log(`   - 已有城市: 35 个`);
  console.log(`   - 总计城市: ${35 + totalCities} 个\n`);

  console.log('生成的配置代码已保存到 /tmp/tax-cities-insert.txt\n');

  const fs = require('fs');
  fs.writeFileSync('/tmp/tax-cities-insert.txt', generateAllTaxCitiesCode());

  console.log('✅ 完成！');
}
