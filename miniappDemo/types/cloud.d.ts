interface topApiParams{
	api:string,
	data:any,
}
interface topApiResponse{
	data:any,
	requestId:string,
}
interface qimenApiParams{
	data:any,
	api:string,
}
interface qimenApiResponse{
	data:any,
	requestId:string,
}
interface topApi {
	invoke:(x:topApiParams)=>Promise<topApiResponse>;
}
interface qimenApi{
	invoke:(x:qimenApiParams)=>Promise<qimenApiResponse>
}
declare var cloud:{
	topApi:topApi,
	qimenApi:qimenApi
}