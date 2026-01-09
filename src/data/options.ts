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
      'Phở bò', 'Bún chả', 'Bún đậu mắm tôm', 'Cơm tấm', 'Pizza', 'Sushi',
      'Lẩu Haidilao', 'Mì cay', 'Gà rán', 'Bò bít tết', 'Bánh mì chảo',
      'Cơm rang dưa bò', 'Bún riêu', 'Bánh xèo', 'Nem nướng Nha Trang'
    ]
  },
  {
    id: 'drink',
    label: 'Uống gì cho mát? 🧋',
    items: [
      'Trà sữa trân châu đường đen', 'Trà mãng cầu', 'Cà phê muối', 'Trà đào cam sả',
      'Nước ép cam', 'Sinh tố bơ', 'Matcha đá xay', 'Trà lài đác thơm',
      'Phê La', 'Katinat', 'Highlands', 'Phúc Long'
    ]
  },
  {
    id: 'nail',
    label: 'Nail màu nào xinh? 💅',
    items: [
      'Pastel Pink', 'Ombre Trắng Hồng', 'Đỏ Rượu Vang (Sexy)', 'Nude Thanh Lịch',
      'Xanh Bơ (Trendy)', 'Đính đá lấp lánh', 'Mắt mèo kim cương', 'Tráng gương bạc',
      'Họa tiết bò sữa', 'French đầu móng'
    ]
  },
  {
    id: 'activity',
    label: 'Cuối tuần đi đâu? 🚗',
    items: [
      'Đi xem phim', 'Đi Mall shopping', 'Đi cafe sống ảo', 'Về quê thăm bố mẹ',
      'Đi Ecopark picnic', 'Ở nhà cày phim', 'Đi massage gội đầu dưỡng sinh',
      'Đi làm gốm'
    ]
  }
];
