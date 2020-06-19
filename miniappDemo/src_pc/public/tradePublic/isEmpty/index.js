var IsEmpty = function(keys){
    if (typeof(keys) === "string") {
        if (keys != undefined) {
            keys = keys.replace(/(^\s*)|(\s*$)/g, "");
        }else{
            keys == "";
        }
        if (keys == "" || keys == null || keys == 'null' || keys == undefined || keys == 'undefined') {
            return true
        } else {
            return false
        }
    } else if (typeof(keys) === 'undefined') {
        return true;
    } else {
        if (typeof(keys) == "object") {
            let has_true = false;
            for(let i in keys){
                return false;
            }
            return true;
        }
    }
};
export {IsEmpty};