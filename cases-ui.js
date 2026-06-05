
const CasesUI={
init(){
document.getElementById('createCaseBtn').onclick=()=>{
Cases.create()
CasesUI.render()
}
CasesUI.render()
},
render(){
let c=Storage.get('cases')
document.getElementById('casesTable').innerHTML=c.map(x=>`
<div>${x.id}</div>
`).join('')
}
}
