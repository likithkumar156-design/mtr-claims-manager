/**
 * MTR Foods Complete Product Catalog
 * Organized by category with material codes
 */

const CATEGORIES = [
  {
    name: "3 Min NPD's",
    products: [
      { code: 'C9970060DP', name: 'Inst.Veggie Upma 120X 60g' },
      { code: 'C9970080', name: 'Inst.Veggie Upma Cup-36 X 80g' },
      { code: 'C9970230T', name: 'Inst.Veggie Upma BP-24 X 230g' },
      { code: 'C9990060DP', name: 'Inst.Kesari Halwa 120X 60g' },
      { code: 'C9990080', name: 'Inst.Kesari Halwa Cup 36 X 80g' },
      { code: 'C9990230T', name: 'Inst.Kesari Halwa BP 24 X 230g' },
      { code: 'C9820060DP', name: 'Inst. Regular Poha 90x60g 3Min' },
      { code: 'C9820080A', name: 'Inst. Regular Poha Cuppa 36x80g' },
      { code: 'C9820160A', name: 'Inst. Regular Poha 48x160g' },
      { code: 'C9830060DP', name: 'Inst. Khatta Meetha Poha 90x60g' },
      { code: 'C9830230T', name: 'Inst. Khatta Meetha Poha BP 24x230g' },
      { code: 'C9980060DP', name: 'Inst.Magic Masala Upma 120X 60g' },
      { code: 'C9980080', name: 'Inst.Magic Masala Upma Cup 36X80g' },
      { code: 'C9960060DP', name: 'Inst.Oats Homestyle Masala 120X60g' },
      { code: 'C9960080', name: 'Inst.Oats Homestyle Masala Cup 36X80g' },
      { code: 'C9960230BP', name: 'Inst.Oats Homestyle Masala BP 24X230g' },
      { code: 'MR-P-15', name: 'Miniute Rasam Pepper 15g' },
      { code: 'MR-PG-15', name: 'Miniute Rasam Pepper Garlic 15g' },
      { code: 'MR-G-15', name: 'Miniute Rasam Garlic 15g' }
    ]
  },
  {
    name: 'Laban',
    products: [
      { code: 'L0010022A', name: 'Laban Stretchy Man 160x22g' },
      { code: 'L0010065', name: 'Laban Stretchy Man 16x65g' }
    ]
  },
  {
    name: 'Breakfast Mix',
    products: [
      { code: 'C5010200', name: 'Inst. Rava Idli Mix 60x200g' },
      { code: 'C5010500L', name: 'Inst. Rava Idli Mix 30x500g' },
      { code: 'C5011000H', name: 'Inst. Rava Idli Mix 15x1kg' },
      { code: 'C5020170', name: 'Inst. Plain Upma Mix 65x180g' },
      { code: 'C5020500', name: 'Inst. Plain Upma Mix 30x500g' },
      { code: 'C5040200', name: 'Inst. Vada Mix 40x200g' },
      { code: 'C5040500A', name: 'Inst. Vada Mix 30x500g' },
      { code: 'C5050200C', name: 'Inst. Dosa Mix 40x200g' },
      { code: 'C5050500D', name: 'Inst. Dosa Mix 30x500g' },
      { code: 'C5030200C', name: 'Inst. Rice Idli Mix 40x200g' },
      { code: 'C5030500G', name: 'Inst. Rice Idli Mix 30x500g' },
      { code: 'C5110500A', name: 'Inst. Rava Dosa Mix 30x500g' },
      { code: 'C9840170', name: 'Inst. Vermicelli Upma 48x180g' },
      { code: 'C9650500', name: 'Instant Oats Idli Mix 30x500g' },
      { code: 'C9660500', name: 'Instant Multigrain Dosa Mix 30x500g' }
    ]
  },
  {
    name: 'Sweet Mix',
    products: [
      { code: 'R0140036', name: 'Inst. Gulab Jamun Mix 216x65g' },
      { code: 'R0140100', name: 'Inst. Gulab Jamun Mix 130x100g' },
      { code: 'R0140190', name: 'Inst Gulab Jamun Mix 75x190g' },
      { code: 'R0140175', name: 'Inst Gulab Jamun Mix 80x175g+free' },
      { code: 'R0140500C', name: 'Inst. Gulab Jamun Mix 26x500g' },
      { code: 'R0141000BA', name: 'Inst. Gulab Jamun Mix 15x1kg' },
      { code: 'V0030100', name: 'Inst. Vermicelli Payasam mix 72x100g' },
      { code: 'C7450200', name: 'Sweet Mix Jalebi 30x200g' }
    ]
  },
  {
    name: 'Health Drink Mix',
    products: [
      { code: 'C5130010', name: 'Inst.Badam Drink Mix 400x12g' },
      { code: 'C5130100', name: 'Inst.Badam Drink Mix 60x100g' },
      { code: 'C5140200ZO', name: 'Inst. Badam Drink 36x200g' },
      { code: 'C5130500D', name: 'Inst.Badam Drink Mix 24x500g' },
      { code: 'C5130500A', name: 'Inst.Badam Drink Mix 24x500g Pet Jar' },
      { code: 'C5131000A', name: 'Inst.Badam Drink Mix 12x1kg Pet Jar' }
    ]
  },
  {
    name: 'Snacks Mix',
    products: [
      { code: 'C5240200', name: 'Inst. Dhokla Mix 40x200g' },
      { code: 'C5250180', name: 'Inst. Khaman Dhokla Mix 40x180g' },
      { code: 'C5100200A', name: 'Inst. Sambar Mix 36x200g' },
      { code: 'C9150200', name: 'Inst.Bajji & Bonda Mix 40x200g' }
    ]
  },
  {
    name: 'RTE Rice',
    products: [
      { code: 'C6020300A', name: 'RTE Bisibelebath 24x300g' },
      { code: 'C6030300A', name: 'RTE Pongal 24x300g' },
      { code: 'C7530300A', name: 'RTE Sambar Rice 20x300g' },
      { code: 'C7520250', name: 'RTE Lemon Rice 24x250g' },
      { code: 'C7510250', name: 'RTE Tomato Rice 24x250g' },
      { code: 'C7560250', name: 'RTE Masala Rice 24x250g' },
      { code: 'C7590250', name: 'RTE Jeera Rice 24x250g' }
    ]
  },
  {
    name: 'RTE Curries',
    products: [
      { code: 'C606N0300', name: 'RTE Chana Masala 24x300g' },
      { code: 'C6110300A', name: 'RTE Rajma Masala 24x300g' },
      { code: 'C6070300A', name: 'RTE Dal Fry 24x300g' },
      { code: 'C6040300A', name: 'RTE Palak Paneer 24x300g' },
      { code: 'C6910300', name: 'RTE Paneer Butter Masala 24x300g' },
      { code: 'C6090300A', name: 'RTE Navarathan Kurma 24x300g' },
      { code: 'C6750300', name: 'RTE Pav Bhaji 24x300g' },
      { code: 'C6980300', name: 'RTE Dal Makhani 24x300g' },
      { code: 'C6050300A', name: 'RTE Mixed Vegetable Curry 24x300g' },
      { code: 'C5170300', name: 'RTE Shahi Paneer 24x300g' }
    ]
  },
  {
    name: 'RTE Sweets',
    products: [
      { code: 'C9290120', name: 'RTE Rasogolla Portion Pack 6x120g' },
      { code: 'C9290500A', name: 'RTE Rasogolla 500g x20 Tin' },
      { code: 'C9190100A', name: 'RTE Gulab Jamun Portion Pack 6x100g' },
      { code: 'C9190500A', name: 'RTE Gulab Jamun 500g x20 Tin' }
    ]
  },
  {
    name: 'Beverages',
    products: [
      { code: 'C9260180', name: 'RTD Badam Drink 180ml' },
      { code: 'C9350180', name: 'RTD Chocolate Drink 180ml' },
      { code: 'C9900180', name: 'RTD Rose Drink 180ml' },
      { code: 'C9890180', name: 'RTD Cardamom Drink 180ml' }
    ]
  },
  {
    name: 'Pure Spices',
    products: [
      { code: 'T6740025T', name: 'Spice Hing Powder 25g' },
      { code: 'T6740050T', name: 'Spice Hing Powder 50g' },
      { code: 'T6070050T', name: 'Spice Chilli Powder 50g' },
      { code: 'T6070100T', name: 'Spice Chilli Powder 100g' },
      { code: 'T6070200T', name: 'Spice Chilli Powder 200g' },
      { code: 'T6070500T', name: 'Spice Chilli Powder 500g' },
      { code: 'T6080050T', name: 'Spice Turmeric Powder 50g' },
      { code: 'T6080100T', name: 'Spice Turmeric Powder 100g' },
      { code: 'T6080200T', name: 'Spice Turmeric Powder 200g' },
      { code: 'T6090050T', name: 'Spice Dhaniya Powder 50g' },
      { code: 'T6090100T', name: 'Spice Dhaniya Powder 100g' },
      { code: 'T6090200T', name: 'Spice Dhaniya Powder 200g' },
      { code: 'T6090500T', name: 'Spice Dhaniya Powder 500g' },
      { code: 'T6100050G', name: 'Spice Jeera Powder 50g' },
      { code: 'T6100100G', name: 'Spice Jeera Powder 100g' },
      { code: 'T6110050G', name: 'Spice Pepper Powder 50g' },
      { code: 'T6110100G', name: 'Spice Pepper Powder 100g' }
    ]
  },
  {
    name: 'Masalas',
    products: [
      { code: 'T6760025', name: 'Spice Lemon Rice Powder 25g' },
      { code: 'T6760050', name: 'Spice Lemon Rice Powder 50g' },
      { code: 'T6770025', name: 'Spice Tomato Rice Powder 25g' },
      { code: 'T6050035G1', name: 'Spice Puliyogare Powder 35g' },
      { code: 'T6050100', name: 'Spice Puliyogare Powder 100g' },
      { code: 'T6050200', name: 'Spice Puliyogare Powder 200g' },
      { code: 'T6030020G1', name: 'Spice Vangibath Powder 20g' },
      { code: 'T6030100A', name: 'Spice Vangibath Powder 100g' },
      { code: 'T6010020G1', name: 'Spice Sambar Powder 20g' },
      { code: 'T6010100', name: 'Spice Sambar Powder 100g' },
      { code: 'T6010200', name: 'Spice Sambar Powder 200g' },
      { code: 'T6010500', name: 'Spice Sambar Powder 500g' },
      { code: 'T6020020G1', name: 'Spice Rasam Powder 20g' },
      { code: 'T6020100', name: 'Spice Rasam Powder 100g' },
      { code: 'T6020200', name: 'Spice Rasam Powder 200g' },
      { code: 'T6170020G1', name: 'Spice Bisibelebath Masala 20g' },
      { code: 'T6170100', name: 'Spice Bisibelebath Masala 100g' },
      { code: 'T6170200', name: 'Spice Bisibelebath Masala 200g' },
      { code: 'T6150010GA', name: 'Spice Biryani Pulao Masala 10g' },
      { code: 'T6150100A', name: 'Spice Biryani Pulao Masala 100g' },
      { code: 'T6060010H', name: 'Spice Special Garam Masala 10g' },
      { code: 'T6060100C', name: 'Spice Special Garam Masala 100g' },
      { code: 'T6700020', name: 'Spice Spl Biryani Masala 20g' },
      { code: 'T6250200PT', name: 'Spice Puliyogare Paste 200g' }
    ]
  },
  {
    name: 'Vermicelli',
    products: [
      { code: 'V0010050', name: 'Vermicelli 250x70g' },
      { code: 'V0010150', name: 'Vermicelli 112x165g' },
      { code: 'V0010400', name: 'Vermicelli 40x400g' },
      { code: 'V0010875', name: 'Vermicelli 20x850g' },
      { code: 'VR010165', name: 'Roasted Vermicelli 84x170g' },
      { code: 'VR010430', name: 'Roasted Vermicelli 30x430g' },
      { code: 'VR010900A', name: 'Roasted Vermicelli 16x900g' }
    ]
  },
  {
    name: 'Pickles',
    products: [
      { code: 'C0030300', name: 'Mango Sliced Pickle 24x300g' },
      { code: 'C0050300', name: 'Lime Pickle 24x300g' },
      { code: 'C0040300', name: 'Mixed Vegetable Pickle 24x300g' },
      { code: 'C0110300', name: 'Garlic Pickle 24x300g' },
      { code: 'C0260300', name: 'Tomato Pickle 24x300g' },
      { code: 'C0010300', name: 'Mango Full Tender Pickle 24x300g' },
      { code: 'C0100300', name: 'Mango Thokku 24x300g' },
      { code: 'C0030500', name: 'Mango Sliced Pickle 24x500g' },
      { code: 'C0050500', name: 'Lime Pickle 24x500g' },
      { code: 'C0040500', name: 'Mixed Vegetable Pickle 24x500g' },
      { code: 'C0100500', name: 'Mango Thokku 24x500g' },
      { code: 'C0010500', name: 'Mango Full Tender Pickle 24x500g' }
    ]
  }
];

module.exports = CATEGORIES;
