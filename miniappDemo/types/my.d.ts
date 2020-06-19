interface connectSocketParams {
	url: string,
	data?: any,
	header?: any,
	success?: () => any,
	fail: () => any,
	complete: () => any,
}

interface sendSocketMessageParams {
	data: string
}

declare var my: {
	connectSocket: (x: connectSocketParams) => any,
	onSocketMessage: (x: (msg: string) => any) => any,
	sendSocketMessage: (x: sendSocketMessageParams) => any,
	onSocketOpen: (x: () => any) => any,
	onSocketClose:(x:()=>any)=>any,
	offSocketMessage:(x:()=>any)=>any,
	offSocketClose:(x:()=>any)=>any,
	offSocketError:(x:()=>any)=>any,
	offSocketOpen:(x:()=>any)=>any,
	onSocketError:(x:()=>any)=>any,
    closeSocket:()=>any,
    authorize:(x:any)=>any,
    getAuthUserInfo:(x:any)=>any,
    isIDE:boolean,
}
