import { request } from '../request';

const api_url = {
  giving_gifts_list: '/gifts/giving/page',
  receiving_gifts_list: '/gifts/receiving/page',
  fuzzy_search_gift_company: 'gifts/company/search',
  // fuzzy_search_gift_company_person: 'gifts/company/person/search',
  fuzzy_search_user_list: '/sys/user/search'
};

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
  return request<Api.Gifts.GivingGifts>({
    url: api_url.giving_gifts_list,
    method: 'post',
    data: queryParam
  });
}
