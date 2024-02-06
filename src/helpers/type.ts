export interface PairDataChildType {
  address: string;
  reserve: number;
  symbol: string;
  reserveEthers: string;
}

export interface PairDataType {
  address: string,
  balancePair: number,
  totalSupplyOfPair: number,
  percent: string,
  tokens: PairDataChildType[]
}

export interface StakingItemDataType {
  name: string,
  shortName: string,
  image: string,
  address: string,
  basePrice: number,
  data_input: {
    image_input: string,
    name_input: string,
  }[]
}

export interface StakingItemType {
  data: StakingItemDataType
}

export interface BalanceType {
  tokenAddress: `0x${string}`;
  onSyncBalance?: (balance: number) => void;
}

export interface BalancePairType {
  pair: string
}

export interface ButtonCustomType {
  isDisabled?: boolean;
  content: string | JSX.Element;
  onClick?: () => void;
  isLoading?: boolean;
  background?: string;
  padding?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface HeaderMenuType {
  data: Array<{
    name: string;
    link: string;
    type: string;
  }>;
}

export interface InputCommonType {
  data: StakingItemDataType,
  value: number,
  onChangeInput: (value: number) => void,
  image?: string,
}

export interface InputSwapType {
  list: any[];
  data: any;
  asyncData?: (data: any) => void;
}

export interface SearchResultPropsType {
  list: any[];
  search: string;
  onChange?: (item: any) => void;
}

export interface SearchResult {
  key?: string;
  value?: string;
  link?: string;
}

export interface SelectTokenModalType {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  list?: any[];
  data: {
    address: string;
    amount: number;
    name: string;
  };
  onChange: (item: any) => void;
}

export interface SettingModalType {
  isOpenModal: boolean;
  setIsOpenModal: (isOpenModal: boolean) => void;
  asyncField?: (data: any) => void;
}

export interface SettingModalFormType {
  slippageTolerance: any;
  transactionDeadline: number;
  autoRouterAPI: boolean;
  expertMode: boolean;
}

export interface CryptoWrapperType {
  children: React.ReactNode;
}