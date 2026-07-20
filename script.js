function build(){let c=+count.value,t=tbl;while(t.rows.length>1)t.deleteRow(1);for(let i=0;i<c;i++){let r=t.insertRow();r.insertCell().innerHTML='<input placeholder="Player">';r.insertCell().innerHTML='<input placeholder="01:30">';}}
build();
function sec(v){let p=v.split(':');return (+p[0])*60+(+p[1]);}
function calc(){let arr=[];for(let i=1;i<tbl.rows.length;i++){let n=tbl.rows[i].cells[0].children[0].value||('Player '+i);let s=sec(tbl.rows[i].cells[1].children[0].value||'0:00');arr.push({n,s});}
arr.sort((a,b)=>b.s-a.s);let o='Rally Order / 集結順序\n\n';let base=arr[0].s;arr.forEach((x,i)=>{o+=`${i+1}. ${x.n} - ${i==0?'NOW / 立即':'+'+(base-x.s)+' sec'}\n`;});out.textContent=o;}