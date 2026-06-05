
const Courtroom={
load(){
let c=Storage.get('cases')[0]
if(!c)return
document.getElementById('courtCaseInfo').innerText=c.id
},
pause(){log('paused')},
resume(){log('resumed')},
verdict(){log('verdict entered')},
runAI(){
document.getElementById('aiOutput').innerText=JSON.stringify(AI.analyze())
}
}
