export const product = {
  name: "HelioPure Air",
  tagline: "Tram cham soc khong khi thong minh cho khong gian song hien dai.",
  description:
    "HelioPure Air theo doi chat luong khong khi, do am, nhiet do va thoi quen sinh hoat de tu dong goi y che do loc phu hop cho gia dinh.",
  price: 3490000,
  specs: [
    ["CADR", "420 m3/h"],
    ["Coverage", "65 m2"],
    ["Sensors", "PM2.5, VOC, CO2, humidity"],
    ["Noise", "18-48 dB"],
    ["Connectivity", "Wi-Fi 2.4GHz, Bluetooth LE"],
    ["Filter", "HEPA H13 + Carbon"],
    ["Power", "38W eco mode"],
    ["Warranty", "24 months"]
  ],
  features: [
    {
      title: "AI Auto Balance",
      text: "Tu dong dieu chinh cong suat loc theo PM2.5, VOC va mat do nguoi trong phong."
    },
    {
      title: "Wellness Dashboard",
      text: "Hien thi diem suc khoe khong khi theo thoi gian thuc, de doc tren mobile va desktop."
    },
    {
      title: "Quiet Night Flow",
      text: "Giam on ban dem, tat den hien thi va van giu luong gio on dinh khi ngu."
    },
    {
      title: "Smart Filter Care",
      text: "Du bao tuoi tho mang loc dua tren muc dung thuc te, khong chi dem ngay co dinh."
    }
  ]
};

export const formatVnd = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value);
