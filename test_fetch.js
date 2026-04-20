fetch('http://localhost:3000/api/admin/groups')
    .then(res => res.text())
    .then(text => console.log('Response:', text))
    .catch(err => console.error('Error fetching:', err));
