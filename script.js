let currentUser = localStorage.getItem("currentUser");

let data = JSON.parse(localStorage.getItem(currentUser+"_budget")) || {
totalBudget:0,totalExpenses:0,budgetLeft:0,expenses:[]
};

function save(){
localStorage.setItem(currentUser+"_budget",JSON.stringify(data));
}

function update(){
totalBudget.textContent=data.totalBudget;
totalExpenses.textContent=data.totalExpenses;
budgetLeft.textContent=data.budgetLeft;

let tbody=document.querySelector("tbody");
tbody.innerHTML="";

data.expenses.forEach(e=>{
tbody.innerHTML+=`
<tr>
<td>${e.title}</td>
<td>${e.amount}</td>
<td>${e.category}</td>
<td>${e.date}</td>
<td><button onclick="del(${e.id})">X</button></td>
</tr>`;
});
}

function del(id){
let e=data.expenses.find(x=>x.id==id);
data.totalExpenses-=e.amount;
data.budgetLeft+=e.amount;
data.expenses=data.expenses.filter(x=>x.id!=id);
save();update();
}

budgetForm.onsubmit=e=>{
e.preventDefault();
let v=+budget.value;
data.totalBudget+=v;
data.budgetLeft+=v;
save();update();budgetForm.reset();
};

expenseForm.onsubmit=e=>{
e.preventDefault();
let t=expense.value;
let a=+amount.value;

if(a>data.budgetLeft)return alert("Not enough");

data.expenses.push({id:Date.now(),title:t,amount:a,category:category.value,date:new Date().toLocaleDateString()});
data.totalExpenses+=a;
data.budgetLeft-=a;
save();update();expenseForm.reset();
};

update();
