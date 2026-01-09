export interface CategoryData {
  id: string;
  label: string;
  items: string[];
}

export const DATABASE: CategoryData[] = [
  {
    id: 'food',
    label: 'Hôm nay ăn gì? 🍜',
    items: [
      'Cv thống nhất',
      'Xôi thịt kho',
      'Cơm tấm',
      'Kem mochi vị socola hình con gấu',
      'Quán gà và mì lạnh hansarang đống đa',
      'Gà lu đống đa',
      'Thịt xiên nướng cầu giấy',
      'Há cảo hấp',
      'Bmi nướng mật ong',
      'Family 99 130 xuân thuỷ',
      'Chicken street',
      'Chicken88',
      'Buffet viên chiên lạp xưởng 18 ngõ 22 Trung kính',
      'Nem chua ngõ tạm thương',
      'Lẩu ếch',
      'Nướng',
      'Buffet gà rán pop chick 19 ngõ 104 Cổ Nhuế',
      'Xôi gà nấm 28 ngõ 56 Lê Văn Hiển'
    ]
  },
  {
    id: 'drink',
    label: 'Uống gì cho mát? 🧋',
    items: [
      'Sữa chua dẻo Sam cafe 39 đường Thành'
    ]
  },
  {
    id: 'nail',
    label: 'Nail màu nào xinh? 💅',
    items: [
      '(trống)'
    ]
  },
  {
    id: 'activity',
    label: 'Cuối tuần đi đâu? 🚗',
    items: [
      'Music box',
      'Photobooth',
      'Vẽ mực',
      'Chụp ảnh hà đông'
    ]
  }
];
