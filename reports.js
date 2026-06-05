
function generateReport(){
const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"});
const url=URL.createObjectURL(blob);
const a=document.createElement("a");
a.href=url;
a.download="court_report.json";
a.click();
}
