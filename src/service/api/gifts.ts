import { request } from '../request';

const api_url = {
  group_gifts_list: '/gifts/group/page',
  group_save: '/gifts/group/save',
  // group_update: '/gifts/group/update',
  giving_gifts_list: '/gifts/giving/page',
  giving_gifts_save: '/gifts/giving/save',
  giving_gifts_cancel: '',
  receiving_gifts_list: '/gifts/receiving/page',
  receiving_gifts_save: '/gifts/receiving/save',
  receiving_gifts_cancel: 'gifts/receiving/cancel',
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

export function getGroupById(id: any) {
  return request<Api.Gifts.GiftGroup>({
    url: `gifts/group/get/${id}`,
    method: 'get'
  });
}

export function updateGroup(param: any) {
  return request({
    url: `gifts/group/update/${param.id}`,
    method: 'post',
    data: param
  });
}

export function saveGroup(param: any) {
  return request({
    url: api_url.group_save,
    method: 'post',
    data: param
  });
}

export function saveGivingGifts(param: any) {
  return request({
    url: api_url.giving_gifts_save,
    method: 'post',
    data: param
  });
}

export function cancelReceivingGifts(param: any) {
  return request({
    url: api_url.receiving_gifts_cancel,
    method: 'post',
    data: param
  });
}

export function saveReceivingGifts(param: any) {
  return request({
    url: api_url.receiving_gifts_save,
    method: 'post',
    data: param
  });
}

export function updateReceivingGifts(param: any) {
  return request({
    url: `gifts/receiving/update/${param.applicationId}`,
    method: 'post',
    data: param
  });
}

export function deleteDraftReceivingGifts(applicationId: string) {
  return request({
    url: `gifts/receiving/draft/delete/${applicationId}`,
    method: 'delete'
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

export function fetchGroupList(queryParam?: any) {
  return request<Api.Gifts.TableListResponse>({
    url: api_url.group_gifts_list,
    method: 'post',
    data: queryParam
  });
}

export function fetchReceivingGiftsList(queryParam: any) {
  return request<Api.Gifts.TableListResponse>({
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
