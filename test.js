fetch('http://localhost:3000/api/admin/stats').then(res => res.text()).then(t => console.log(t)).catch(console.error);
