/**
 * [Validate email format]
 * */
export function checkingInputEmail(email:string){
    if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/igm.test(email)){
        return true;
    }
    else{
        return false;
    }
}