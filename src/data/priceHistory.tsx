type PriceData = {
  date: string;
  price: number;
  minorPrice: number;
};

const data: PriceData[] = [
  { date: "12 fev", price: 320, minorPrice: 324 },
  { date: "14 fev", price: 325, minorPrice: 234 },
  { date: "16 fev", price: 335, minorPrice: 312 },
  { date: "18 fev", price: 345, minorPrice: 231 },
  { date: "20 fev", price: 330, minorPrice: 299 },
  { date: "22 fev", price: 315, minorPrice: 284 },
  { date: "24 fev", price: 310, minorPrice: 275 },
  { date: "26 fev", price: 318, minorPrice: 266 },
  { date: "28 fev", price: 325, minorPrice: 305 },
  { date: "02 mar", price: 335, minorPrice: 321 },
  { date: "04 mar", price: 345, minorPrice: 310 },
  { date: "06 mar", price: 350, minorPrice: 333 },
];

export default data;
