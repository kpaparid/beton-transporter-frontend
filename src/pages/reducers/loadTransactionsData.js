export async function loadTransactionsData() {
    
    
    const res = await window.fetch('http://127.0.0.1:8887/transactions.json');
    if (!res.ok) {
      throw new Error('API failed');
    }
    else{
        console.log("success")
    }
  
    const data = await res.json();
    return data;
  }