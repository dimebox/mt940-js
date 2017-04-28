import { Tag, BalanceInfo } from './../typings';
export interface BalanceInfoTag extends Tag {
    info?: BalanceInfo;
    init?: () => any;
}
declare const openingBalanceTag: BalanceInfoTag;
export default openingBalanceTag;
