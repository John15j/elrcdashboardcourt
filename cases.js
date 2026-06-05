
const Cases={
create(){
let c=Storage.get('cases')
c.push({id:'CASE-'+Date.now(),title:'New Case'})
Storage.set('cases',c)
}
}
