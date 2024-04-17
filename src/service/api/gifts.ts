import { request } from '../request';

const api_url = {
  giving_gifts_list: '/gifts/giving/page',
  receiving_gifts_list: '/gifts/receiving/page',
  receiving_gifts_save: 'gifts/receiving/save',
  // receiving_gifts_getById: '',
  fuzzy_search_gift_company: 'gifts/company/search',
  // fuzzy_search_gift_company_person: 'gifts/company/person/search',
  fuzzy_search_user_list: '/sys/user/search'
};

export function getReceivingGiftsByApplicationId(id: any) {
  return request<Api.Gifts.ReceivingGifts>({
    url: `gifts/receiving/get/${id}`,
    method: 'get'
  });
}

export function saveReceivingGifts(param: any) {
  return request({
    url: api_url.receiving_gifts_save,
    method: 'post',
    data: param
  });
}

export function fuzzySearchGiftPersonList(companyId: number, keyword: string) {
  return request<Array<Api.Gifts.GiftCompany>>({
    url: `gifts/company/person/${companyId}/search?keyword=${keyword}`,
    method: 'get'
  });
}

export function fuzzySearchGiftCompanyList(keyword: string) {
  return request<Array<Api.Gifts.GiftCompany>>({
    url: `${api_url.fuzzy_search_gift_company}?keyword=${keyword}`,
    method: 'get'
  });
}

export function fuzzySearchUserList(keyword: string) {
  return request<Array<Api.Auth.UserInfo>>({
    url: `${api_url.fuzzy_search_user_list}?keyword=${keyword}`,
    method: 'get'
  });
}

export function fetchReceivingGiftsList(queryParam: any) {
  return request<Api.Gifts.ReceivingGifts>({
    url: api_url.receiving_gifts_list,
    method: 'post',
    data: queryParam
  });
}

export function fetchGivingGiftsList(queryParam: any) {
  return request<Api.Gifts.TableListResponse>({
    url: api_url.giving_gifts_list,
    method: 'post',
    data: queryParam
  });
}
