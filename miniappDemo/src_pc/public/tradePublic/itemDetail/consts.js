
//会员打折配置
export const DETAIL_MEMBER_DISCOUNT = {
    item:['参与会员打折','不参与会员打折'],
    toastContent:'会员打折修改',
}
//库存计数配置
export const DETAIL_INVENTORY_COUNT = {
    item:['拍下减库存','付款减库存'],
    toastContent:'库存计数修改',
}
//发票配置
export const DETAIL_INVOICE = {
    item:['有','无'],
    toastContent:'发票服务修改',
}
//保修配置
export const DETAIL_GUARANTEE = {
    item:['有','无'],
    toastContent:'保修服务修改',
}

//layout的初始化数据
export const DETAIL_LAYOUT_INIT_INFO = {
    label:'',
    isOpened:false,
    value:'',
    placeholder:'',
    txtMaxLength:0,
    selectArr:[],
    selectItem:{},
    toastContent:'',
}

//更新商品信息必须要有的参数
export const UPDATE_ITEM_MUST_PARAM = ['numIid','sellerType'];