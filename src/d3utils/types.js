import * as Svg from "../icons/nodeIcons";
import * as CountrySvg from "../icons/nodeIcons/countries";

const CountryEAES = {
  "112": CountrySvg.Belarus,
  "643": CountrySvg.Russia
};
const CountryDT = {
  "156": CountrySvg.China,
  "392": CountrySvg.Japan,
  "276": CountrySvg.Germany
};

export default {
  "10": Svg.Industry,
  "9": Svg.Recycling,
  "11": Svg.Firewall,
  "15": Svg.Shop,
  "20": Svg.Custom,
  "21": Svg.Suitcase,
  "22": Svg.Bankrupt,
  "23": Svg.Gavel,
  "24": Svg.WalletPlus,
  "12": Svg.WalletDown,
  "13": Svg.Bank,
  "25": Svg.ShopBack,
  "26": Svg.Back,
  "8": Svg.Reserved,
  "27": Svg.Download,

  "7": CountryEAES,
  "19": CountryEAES,
  "18": CountryDT
};

// PS "27" в тз человек в синей форме, но в фигме его нет,
// синяя коробка на замене
