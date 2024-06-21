import { request } from '../request';

const api_url = {
  group_gifts_list: '/gifts/group/page',
  group_save: '/gifts/group/save',
  // group_update: '/gifts/group/update',
  process_task_list: '/process//task/page',
  process_current_run_task_count: 'process/task/current/run-count',
  receiving_hospitality_list: '/hospitality/receiving/page',
  giving_hospitality_list: '/hospitality/giving/page',
  giving_hospitaltiy_save: '/hospitality/giving/save',
  giving_hospitality_cancel: '/hospitality/giving/cancel',
  giving_gifts_list: '/gifts/giving/page',
  giving_gifts_save: '/gifts/giving/save',
  giving_gifts_cancel: '/gifts/giving/cancel',
  receiving_gifts_list: '/gifts/receiving/page',
  receiving_gifts_save: '/gifts/receiving/save',
  receiving_gifts_cancel: 'gifts/receiving/cancel',
  // receiving_gifts_getById: '',
  fuzzy_search_gift_company: 'gifts/company/search',
  // fuzzy_search_gift_company_person: 'gifts/company/person/search',
  fuzzy_search_user_list: '/sys/user/search',
  user_list: '/sys/user/page'
};

export function uploadFile(formData: any) {
  return request({
    url: `sys/upload/module/file`,
    method: 'post',
    data: formData
  });
}

export function exportFile(fileId: any) {
  return request({
    url: `sys/download/file/${fileId}`,
    method: 'post'
  });
}

export function getReceivingHospitalityHistoryByApplicationId(id: any) {
  return request<Api.Gifts.ReceivingHospitality>({
    url: `hospitality/receiving/get/history/${id}`,
    method: 'get'
  });
}

export function getGivingHospitalityByApplicationId(id: any) {
  return request<Api.Gifts.GivingHospitality>({
    url: `hospitality/giving/get/${id}`,
    method: 'get'
  });
}

export function getGivingHospitalityHistoryByApplicationId(id: any) {
  return request<Api.Gifts.GivingHospitality>({
    url: `hospitality/giving/get/history/${id}`,
    method: 'get'
  });
}

export function getGivingGiftsByApplicationId(id: any) {
  return request<Api.Gifts.GivingGifts>({
    url: `gifts/giving/get/${id}`,
    method: 'get'
  });
}

export function getGivingGiftsHistoryByApplicationId(id: any) {
  return request<Api.Gifts.GivingGifts>({
    url: `gifts/giving/get/history/${id}`,
    method: 'get'
  });
}

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

export function feachDeptHeadGroupUsers(companyCode: string, division: string) {
  return request<Api.Gifts.GiftsUserToGroup>({
    url: `gifts/group/search-dept-head/${companyCode}?division=${division}`,
    method: 'get'
  });
}

export function feachCountryHeadGroupUsers(companyCode: string) {
  return request<Api.Gifts.GiftsUserToGroup>({
    url: `gifts/group/search-country-head/${companyCode}`,
    method: 'get'
  });
}

export function saveGivingHospitality(param: any) {
  return request({
    url: api_url.giving_hospitaltiy_save,
    method: 'post',
    data: param
  });
}

export function updateGivingHospitality(param: any) {
  return request({
    url: `hospitality/giving/update/${param.applicationId}`,
    method: 'post',
    data: param
  });
}

export function deleteDraftGivingHospitality(applicationId: string) {
  return request({
    url: `hospitality/giving/draft/delete/${applicationId}`,
    method: 'delete'
  });
}

export function cancelGivingHospitality(param: any) {
  return request({
    url: api_url.giving_hospitality_cancel,
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

export function updateGivingGifts(param: any) {
  return request({
    url: `gifts/giving/update/${param.applicationId}`,
    method: 'post',
    data: param
  });
}

export function deleteDraftGivingGifts(applicationId: string) {
  return request({
    url: `gifts/giving/draft/delete/${applicationId}`,
    method: 'delete'
  });
}

export function cancelGivingGifts(param: any) {
  return request({
    url: api_url.giving_gifts_cancel,
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

export function saveReceivingUseCase(param: any) {
  return request({
    url: `gifts/receiving/save/user-case/${param.applicationId}`,
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

export function handleTask(param: any) {
  return request({
    url: `process/task/handle/${param.taskId}`,
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

export function fuzzySearchUserList(queryParam?: any) {
  return request<Array<Api.Auth.UserInfo>>({
    url: `${api_url.fuzzy_search_user_list}?keyword=${queryParam.keyword}&baseOnCompany=${queryParam.baseOnCompany}&division=${queryParam.division}`,
    method: 'get'
  });
}

export function fetchUserList(queryParam?: any) {
  return request<Api.Gifts.TableListResponse>({
    url: api_url.user_list,
    method: 'post',
    data: queryParam
  });
}

export function fetchGroupList(queryParam?: any) {
  return request<Api.Gifts.TableListResponse>({
    url: api_url.group_gifts_list,
    method: 'post',
    data: queryParam
  });
}

export function fetchTaskList(queryParam: any) {
  return request<Api.Gifts.TableListResponse>({
    url: api_url.process_task_list,
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

export function fetchReceivingHospitalityList(queryParam: any) {
  return request<Api.Gifts.TableListResponse>({
    url: api_url.receiving_hospitality_list,
    method: 'post',
    data: queryParam
  });
}

export function fetchGivingHospitalityList(queryParam: any) {
  return request<Api.Gifts.TableListResponse>({
    url: api_url.giving_hospitality_list,
    method: 'post',
    data: queryParam
  });
}

export function copyGivingGifts(applicationId: string) {
  return request({
    url: `gifts/giving/copy/${applicationId}`,
    method: 'post'
  });
}

export function copyReceivingGifts(applicationId: string) {
  return request({
    url: `gifts/receiving/copy/${applicationId}`,
    method: 'post'
  });
}

export function copyGivingHospitality(applicationId: string) {
  return request({
    url: `hospitality/giving/copy/${applicationId}`,
    method: 'post'
  });
}

export function getcurrRunTaskCount(queryParam: any) {
  return request({
    url: api_url.process_current_run_task_count,
    method: 'post',
    data: queryParam
  });
}
