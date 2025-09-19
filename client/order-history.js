// Demo user ID (replace with actual logged-in user ID)
const userId = 'demo-user-id';
const orderHistoryDiv = document.getElementById('orderHistory');

function renderOrders(orders) {
    if (!orders.length) {
        orderHistoryDiv.innerHTML = '<p>No orders found.</p>';
        return;
    }
    orderHistoryDiv.innerHTML = orders.map(order => `
        <div class="order-card mb-3 p-3 border rounded">
            <h5>Order ID: ${order.orderId}</h5>
            <p>Status: <strong>${order.status}</strong></p>
            <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Amount: ₦${order.amount}</p>
            <div>Products:
                <ul>
                    ${order.products.map(p => `<li>${p.name} (${p.quantity || 1})</li>`).join('')}
                </ul>
            </div>
            <button class="btn btn-outline-primary btn-sm reorder-btn" data-id="${order.orderId}">Reorder</button>
        </div>
    `).join('');
    document.querySelectorAll('.reorder-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Reorder functionality coming soon!');
        });
    });
}

fetch(`http://localhost:5000/api/orders?userId=${userId}`)
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            renderOrders(data.orders);
        } else {
            orderHistoryDiv.innerHTML = '<p>Error loading orders.</p>';
        }
    });
