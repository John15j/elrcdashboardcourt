
const Router={
init(){
document.querySelectorAll('.nav-btn').forEach(b=>{
b.onclick=()=>{
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'))
document.getElementById(b.dataset.page+'Page').classList.add('active')
}
})
}
}
