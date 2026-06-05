
const DB={
init(){
if(!Storage.get('cases').length){
Storage.set('cases',[])
}
}
}
